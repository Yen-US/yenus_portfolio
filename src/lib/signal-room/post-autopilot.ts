import "server-only";

import OpenAI from "openai";
import { z } from "zod";
import { OFFERS } from "@/lib/signal-room/offers";
import { POST_FORMATS } from "@/lib/signal-room/post-craft";
import type {
  Account,
  IcpProfile,
  PostDraft,
  PostFormat,
  PostPillar,
} from "@/lib/signal-room/types";

/**
 * Autopilot: choose what to write about, with no operator input.
 *
 * The brief is not invented. It is assembled from the workspace the operator
 * already maintains, in this order of authority:
 *
 *   1. Account briefs   — the only source of citable evidence.
 *   2. Existing posts    — read as a NEGATIVE constraint. Whatever has already
 *                          been argued must not be argued again.
 *   3. ICP + offer       — who the post is for and what it should qualify toward.
 *   4. Pillar rotation   — the least-used pillar wins, same rule the UI shows.
 *
 * A model picks the angle. It never picks the evidence: source material is
 * assembled deterministically below, so the generator downstream still cannot
 * turn an unsourced idea into a factual claim.
 */

const model = process.env.OPENAI_POST_MODEL ?? "gpt-5.6-sol";

export interface AutopilotBrief {
  topic: string;
  pillar: PostPillar;
  format: PostFormat;
  pointOfView: string;
  sourceMaterial: string;
  accountIds: string[];
  /** Shown in the UI so the operator can see why this subject was chosen. */
  reasoning: string;
  rejected: string[];
}

const briefSchema = z.object({
  topic: z.string().min(10),
  pointOfView: z.string().min(20),
  format: z.enum([
    "Recognition patterns",
    "Single argument",
    "Field note",
    "Contrarian correction",
  ]),
  reasoning: z.string(),
  rejected: z.array(z.string()).max(4),
});

export async function planPost(input: {
  accounts: Account[];
  posts: PostDraft[];
  icp: IcpProfile | null;
}): Promise<AutopilotBrief> {
  const pillar = nextPillar(input.posts);
  const accountsWithBriefs = input.accounts.filter((account) => account.brief);

  // Evidence is assembled deterministically, never chosen by the model.
  const { sourceMaterial, accountIds } = assembleEvidence(accountsWithBriefs);

  const alreadyArgued = input.posts
    .slice(0, 12)
    .map((post) => `- ${post.title} :: ${post.takeaway || post.hook}`)
    .join("\n");

  const offer = OFFERS[0];
  const formatMenu = POST_FORMATS.map(
    (spec) => `- ${spec.id}: ${spec.summary}`
  ).join("\n");

  const openai = getOpenAI();
  const response = await openai.responses.create(
    {
      model,
      store: false,
      text: {
        verbosity: "high",
        format: {
          type: "json_schema",
          name: "autopilot_brief",
          strict: true,
          schema: briefJsonSchema as Record<string, unknown>,
        },
      },
      instructions: `You are choosing this week's post subject for Yenson Umana, an independent consultant who runs Inference Readiness Reviews for startups with a production AI path.

Choose the subject that a founder or CTO would recognise in their own team this week. Hard rules:
- The topic must NOT repeat any argument in the already-argued list. Adjacent is fine, restating is not.
- The point of view must be falsifiable and one a competent engineer could disagree with. If nobody could disagree, it is a platitude — choose again.
- Prefer a subject the supplied evidence can support. Where there is no evidence, choose a subject that stands as an experience-based shape and needs no figures.
- Never propose naming a company, and never propose a subject that requires inventing a number.
- Pick the format whose structure genuinely fits the subject. Do not default to the list format because it is the most common.
- The pillar is already decided by rotation. Work within it.

Explain your choice in one short paragraph, and name the stronger angles you rejected so the operator can overrule you.`,
      input: [
        `PILLAR (decided by rotation, not yours to change): ${pillar}`,
        `AUDIENCE (ICP): ${input.icp?.statement ?? "Seed to Series B B2B AI startups with a production inference path."}`,
        `THE POST SHOULD QUALIFY TOWARD: ${offer.name} — ${offer.bestWhen}`,
        `FORMATS AVAILABLE:\n${formatMenu}`,
        `ALREADY ARGUED, DO NOT REPEAT:\n${alreadyArgued || "Nothing published yet."}`,
        `EVIDENCE AVAILABLE THIS WEEK:\n${sourceMaterial || "No account evidence. Choose an experience-based subject."}`,
      ].join("\n\n"),
    },
    { timeout: 90_000, maxRetries: 1 }
  );

  const parsed = briefSchema.parse(JSON.parse(response.output_text));

  return {
    topic: parsed.topic,
    pillar,
    format: parsed.format,
    pointOfView: parsed.pointOfView,
    sourceMaterial,
    accountIds,
    reasoning: parsed.reasoning,
    rejected: parsed.rejected,
  };
}

/**
 * Pillar rotation, matching the rule the Post Lab sidebar displays: least-used
 * pillar wins, ties broken by declaration order so the choice is stable.
 */
export function nextPillar(posts: PostDraft[]): PostPillar {
  const pillars: PostPillar[] = [
    "Technical field note",
    "Startup strategy",
    "Operator story",
  ];
  return pillars.toSorted(
    (a, b) =>
      posts.filter((post) => post.pillar === a).length -
      posts.filter((post) => post.pillar === b).length
  )[0];
}

/**
 * Deterministic evidence assembly. Caps the payload so a large workspace cannot
 * push the downstream draft prompt past a usable size, and keeps hypotheses
 * clearly separated from verified claims so the generator cannot promote one.
 */
function assembleEvidence(accounts: Account[]) {
  const chosen = accounts.slice(0, 3);
  const accountIds = chosen.map((account) => account.id);

  const sourceMaterial = chosen
    .map((account) => {
      const brief = account.brief;
      if (!brief) return "";
      return [
        `Account: ${account.name}`,
        `Summary: ${brief.summary}`,
        "Verified evidence:",
        ...brief.evidence
          .slice(0, 6)
          .map((item) => `- ${item.claim} | ${item.sourceTitle} | ${item.sourceUrl}`),
        "Architecture hypotheses (never present as facts):",
        ...brief.architectureHypotheses
          .slice(0, 4)
          .map((item) => `- ${item.hypothesis} | Signal: ${item.evidence}`),
        "Uncertainties:",
        ...brief.uncertainties.slice(0, 4).map((item) => `- ${item}`),
      ].join("\n");
    })
    .filter(Boolean)
    .join("\n\n");

  return { sourceMaterial, accountIds };
}

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const briefJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["topic", "pointOfView", "format", "reasoning", "rejected"],
  properties: {
    topic: { type: "string" },
    pointOfView: { type: "string" },
    format: {
      type: "string",
      enum: [
        "Recognition patterns",
        "Single argument",
        "Field note",
        "Contrarian correction",
      ],
    },
    reasoning: { type: "string" },
    rejected: { type: "array", items: { type: "string" } },
  },
} as const;
