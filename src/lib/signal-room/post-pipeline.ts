import "server-only";

import OpenAI from "openai";
import { z } from "zod";
import type {
  PostArtifacts,
  PostCritique,
  PostDraft,
  PostFormat,
  PostPillar,
} from "@/lib/signal-room/types";
import {
  getFormatSpec,
  getRubricChecks,
  summariseRubric,
} from "@/lib/signal-room/post-craft";

/**
 * Four passes, one click:
 *
 *   1. angle    — choose the sharpest claim and lay out the beats
 *   2. draft    — write the post against the format spec
 *   3. critic   — adversarial read, told to find the weakest section
 *   4. revise   — apply the critique and the deterministic rubric failures
 *
 * The rubric lint runs between 3 and 4, so the reviser is fixing measured
 * failures rather than only the model's opinion of itself.
 */

// gpt-5.6 ships as three variants (luna / sol / terra). All three were verified
// against the Responses API with strict json_schema, which is what these four
// passes need. Which one writes best has NOT been compared — swap the default
// via OPENAI_POST_MODEL once you have run the same brief through more than one.
//
// Note the research fallback was removed deliberately: OPENAI_RESEARCH_MODEL is
// set to a cheaper model for briefs, and inheriting it here would silently
// downgrade the critique pass, which is where the draft quality comes from.
const model = process.env.OPENAI_POST_MODEL ?? "gpt-5.6-sol";
const PASS_TIMEOUT = 100_000;

const VOICE = `You are drafting for Yenson Umana, an independent consultant who runs Inference Readiness Reviews for startups with a production AI path. He writes to founders and CTOs.

Voice rules, absolute:
- Direct and calm. Declarative sentences. Assert rather than ask.
- Technically precise. Every abstraction cashes out in something operable.
- Commas and full stops over em dashes. Heavy em dash use is the clearest tell of machine drafting.
- No emojis, no one-line engagement bait, no rhetorical question stacks, no "let that sink in".
- No content-marketing register of any kind. If a sentence could open an agency blog post, it is wrong.
- Patterns, not advice. Advice invites disagreement. Patterns invite recognition, and a reader who recognises themselves has already qualified himself.
- Never name, describe, or numerically fingerprint any specific company, employer, or client. The value is the shape, never the source.
- Never invent a figure. If you do not have a number from the source material, describe the shape instead. One wrong public number costs more than the post earns.`;

const outlineSchema = z.object({
  title: z.string(),
  claim: z.string(),
  hook: z.string(),
  outline: z.array(z.string()).min(3).max(12),
  riskiestClaim: z.string(),
  rejectedAngles: z.array(z.string()).max(4),
});

const draftSchema = z.object({
  title: z.string(),
  hook: z.string(),
  draft: z.string(),
  takeaway: z.string(),
  evidence: z
    .array(z.object({ claim: z.string(), sourceUrl: z.string(), sourceTitle: z.string() }))
    .default([]),
});

const critiqueSchema = z.object({
  weakestSection: z.string(),
  cutCandidates: z.array(z.string()).max(6),
  unsupportedClaims: z.array(z.string()).max(6),
  toneViolations: z.array(z.string()).max(6),
  revisionInstructions: z.array(z.string()).min(1).max(8),
});

const revisionSchema = draftSchema.extend({
  revisionsApplied: z.array(z.string()).max(10),
  quality: z.object({
    specificity: z.number().int().min(0).max(100),
    practicalValue: z.number().int().min(0).max(100),
    credibility: z.number().int().min(0).max(100),
    readability: z.number().int().min(0).max(100),
    notes: z.array(z.string()),
  }),
  artifacts: z.object({
    rationale: z.array(z.string()).max(8),
    shipChecklist: z.array(z.string()).max(10),
    ctaVariants: z.array(z.string()).max(4),
    defenceNotes: z.array(z.string()).max(6),
    image: z.object({
      concept: z.string(),
      whyThisOne: z.string(),
      prompt: z.string(),
      alternate: z.string(),
    }),
  }),
});

export type GeneratedPost = Omit<
  PostDraft,
  "id" | "pillar" | "status" | "accountIds" | "createdAt" | "updatedAt"
>;

export async function generatePostPackage(input: {
  topic: string;
  pillar: PostPillar;
  format: PostFormat;
  pointOfView: string;
  sourceMaterial: string;
  exemplar?: string;
}): Promise<GeneratedPost> {
  const openai = getOpenAI();
  const spec = getFormatSpec(input.format);

  const source =
    input.sourceMaterial.trim() ||
    "No external source material. Write as an experience-based framework. Attach no factual claims and leave the evidence array empty.";

  const brief = [
    `PILLAR: ${input.pillar}`,
    `FORMAT: ${spec.label} — ${spec.summary}`,
    `TOPIC: ${input.topic}`,
    `POINT OF VIEW TO DEFEND: ${input.pointOfView}`,
    `TARGET LENGTH: ${spec.minChars}-${spec.maxChars} characters.`,
    `REQUIRED STRUCTURAL BEATS:\n${spec.beats.map((beat, i) => `${i + 1}. ${beat}`).join("\n")}`,
    `FORMAT DIRECTIVE: ${spec.directive}`,
    `SOURCE MATERIAL AND FIELD NOTES:\n${source}`,
  ].join("\n\n");

  // Pass 1 — angle
  const outline = await call(openai, {
    instructions: `${VOICE}\n\nYou are choosing the angle before any prose is written. Generate the sharpest defensible version of this post's claim, then lay out the beats. A claim nobody competent could disagree with is a platitude — pick a sharper one. Name the riskiest claim you are making, because it is the one that will be challenged in the comments.`,
    input: brief,
    schemaName: "post_angle",
    schema: outlineJsonSchema,
    parser: outlineSchema,
  });

  // Pass 2 — draft
  const drafted = await call(openai, {
    instructions: `${VOICE}\n\nWrite the full post now, following the agreed outline and the required structural beats exactly. Plain text only, no markdown headers, no bold markers. Numbered sections are written as "1." on their own line followed by a short title. This is going straight into a LinkedIn composer.`,
    input: `${brief}\n\nAGREED ANGLE:\nTitle: ${outline.title}\nCentral claim: ${outline.claim}\nHook: ${outline.hook}\nRiskiest claim: ${outline.riskiestClaim}\nOutline:\n${outline.outline.map((beat, i) => `${i + 1}. ${beat}`).join("\n")}${input.exemplar ? `\n\nSTRUCTURAL EXEMPLAR (match the register and architecture, never the subject matter):\n${input.exemplar.slice(0, 6000)}` : ""}`,
    schemaName: "post_draft",
    schema: draftJsonSchema,
    parser: draftSchema,
  });

  // Rubric lint on the raw draft — measured failures, not opinions.
  const rubric = getRubricChecks(
    drafted.draft,
    { evidence: [], format: input.format, pillar: input.pillar },
    input.sourceMaterial
  );
  const rubricFailures = rubric
    .filter((check) => !check.passed)
    .map((check) => `[${check.severity}] ${check.label}: ${check.detail}`);

  // Pass 3 — adversarial critic
  const critique = await call(openai, {
    instructions: `${VOICE}\n\nYou are reading this draft as a hostile senior engineer who thinks the author is a consultant selling something. Your job is to find what is weak, what is unearned, and what sounds like marketing. Be specific and quote the text. Do not be encouraging. If a section is generic enough that any consultant could have written it, say so and say which one to cut.`,
    input: `POST DRAFT:\n${drafted.draft}\n\nSOURCE MATERIAL THAT MAY BE CITED:\n${source}\n\nDETERMINISTIC LINT FAILURES ALREADY MEASURED:\n${rubricFailures.length ? rubricFailures.join("\n") : "None."}`,
    schemaName: "post_critique",
    schema: critiqueJsonSchema,
    parser: critiqueSchema,
  });

  // Pass 4 — revise and produce the publishing package
  const revised = await call(openai, {
    instructions: `${VOICE}\n\nApply the critique and every lint failure, then produce the full publishing package. Rules for the package:\n- rationale: why the post is built this way, argued for the author's own review, not flattery.\n- shipChecklist: checks specific to THIS draft, never generic publishing advice.\n- ctaVariants: two or three closing lines, each conditional so it qualifies inbound rather than inviting everyone.\n- defenceNotes: how to answer the riskiest claim if challenged on a call.\n- image: one diagram concept that makes ONE idea from the post concrete and leaves the rest unexplained, so it pulls the reader down rather than satisfying them. Never a photo, never a full infographic summarising every section. The prompt must specify flat vector, editorial, generous white space, no people, no photorealism, no 3D, no gradients, no glow, no circuit-board or brain imagery, and a single accent colour placed where the surprise is.`,
    input: `CURRENT DRAFT:\n${drafted.draft}\n\nCRITIQUE:\nWeakest section: ${critique.weakestSection}\nCut candidates: ${critique.cutCandidates.join(" | ") || "none"}\nUnsupported claims: ${critique.unsupportedClaims.join(" | ") || "none"}\nTone violations: ${critique.toneViolations.join(" | ") || "none"}\nRevision instructions:\n${critique.revisionInstructions.map((item, i) => `${i + 1}. ${item}`).join("\n")}\n\nDETERMINISTIC LINT FAILURES THAT MUST BE FIXED:\n${rubricFailures.length ? rubricFailures.join("\n") : "None."}\n\nRIskiest claim to defend: ${outline.riskiestClaim}\n\n${brief}`,
    schemaName: "post_revision",
    schema: revisionJsonSchema,
    parser: revisionSchema,
  });

  const allowedUrls = new Set(
    extractHttpUrls(input.sourceMaterial).map(normalizeUrl).filter(Boolean)
  );

  const artifacts: PostArtifacts = {
    rationale: revised.artifacts.rationale,
    shipChecklist: revised.artifacts.shipChecklist,
    ctaVariants: revised.artifacts.ctaVariants,
    defenceNotes: revised.artifacts.defenceNotes,
    image: revised.artifacts.image,
  };

  const postCritique: PostCritique = {
    weakestSection: critique.weakestSection,
    cutCandidates: critique.cutCandidates,
    unsupportedClaims: critique.unsupportedClaims,
    revisionsApplied: revised.revisionsApplied,
  };

  return {
    title: revised.title || outline.title,
    hook: revised.hook,
    draft: revised.draft,
    takeaway: revised.takeaway,
    format: input.format,
    outline: outline.outline,
    evidence: revised.evidence.filter((item) =>
      allowedUrls.has(normalizeUrl(item.sourceUrl))
    ),
    quality: revised.quality,
    artifacts,
    critique: postCritique,
  };
}

/** Exposed so the route can log how far short a package landed without a second model call. */
export function scorePackage(
  post: GeneratedPost,
  pillar: PostPillar,
  sourceMaterial: string
) {
  return summariseRubric(
    getRubricChecks(post.draft, { ...post, pillar }, sourceMaterial)
  );
}

async function call<T>(
  openai: OpenAI,
  args: {
    instructions: string;
    input: string;
    schemaName: string;
    schema: object;
    parser: z.ZodType<T>;
  }
): Promise<T> {
  const response = await openai.responses.create(
    {
      model,
      store: false,
      text: {
        verbosity: "high",
        format: {
          type: "json_schema",
          name: args.schemaName,
          strict: true,
          schema: args.schema as Record<string, unknown>,
        },
      },
      instructions: args.instructions,
      input: args.input,
    },
    { timeout: PASS_TIMEOUT, maxRetries: 1 }
  );
  return args.parser.parse(JSON.parse(response.output_text));
}

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured.");
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function normalizeUrl(value: string) {
  try {
    const url = new URL(value);
    url.hash = "";
    for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
      url.searchParams.delete(key);
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

function extractHttpUrls(value: string) {
  return value.match(/https?:\/\/[^\s|)\]}>,]+/g) ?? [];
}

/* ---------------------------- JSON schemas ---------------------------- */

const stringArray = { type: "array", items: { type: "string" } } as const;

const outlineJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "claim", "hook", "outline", "riskiestClaim", "rejectedAngles"],
  properties: {
    title: { type: "string" },
    claim: { type: "string" },
    hook: { type: "string" },
    outline: stringArray,
    riskiestClaim: { type: "string" },
    rejectedAngles: stringArray,
  },
} as const;

const evidenceJsonSchema = {
  type: "array",
  items: {
    type: "object",
    additionalProperties: false,
    required: ["claim", "sourceUrl", "sourceTitle"],
    properties: {
      claim: { type: "string" },
      sourceUrl: { type: "string" },
      sourceTitle: { type: "string" },
    },
  },
} as const;

const draftJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "hook", "draft", "takeaway", "evidence"],
  properties: {
    title: { type: "string" },
    hook: { type: "string" },
    draft: { type: "string" },
    takeaway: { type: "string" },
    evidence: evidenceJsonSchema,
  },
} as const;

const critiqueJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "weakestSection",
    "cutCandidates",
    "unsupportedClaims",
    "toneViolations",
    "revisionInstructions",
  ],
  properties: {
    weakestSection: { type: "string" },
    cutCandidates: stringArray,
    unsupportedClaims: stringArray,
    toneViolations: stringArray,
    revisionInstructions: stringArray,
  },
} as const;

const revisionJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "hook",
    "draft",
    "takeaway",
    "evidence",
    "revisionsApplied",
    "quality",
    "artifacts",
  ],
  properties: {
    title: { type: "string" },
    hook: { type: "string" },
    draft: { type: "string" },
    takeaway: { type: "string" },
    evidence: evidenceJsonSchema,
    revisionsApplied: stringArray,
    quality: {
      type: "object",
      additionalProperties: false,
      required: ["specificity", "practicalValue", "credibility", "readability", "notes"],
      properties: {
        specificity: { type: "integer", minimum: 0, maximum: 100 },
        practicalValue: { type: "integer", minimum: 0, maximum: 100 },
        credibility: { type: "integer", minimum: 0, maximum: 100 },
        readability: { type: "integer", minimum: 0, maximum: 100 },
        notes: stringArray,
      },
    },
    artifacts: {
      type: "object",
      additionalProperties: false,
      required: ["rationale", "shipChecklist", "ctaVariants", "defenceNotes", "image"],
      properties: {
        rationale: stringArray,
        shipChecklist: stringArray,
        ctaVariants: stringArray,
        defenceNotes: stringArray,
        image: {
          type: "object",
          additionalProperties: false,
          required: ["concept", "whyThisOne", "prompt", "alternate"],
          properties: {
            concept: { type: "string" },
            whyThisOne: { type: "string" },
            prompt: { type: "string" },
            alternate: { type: "string" },
          },
        },
      },
    },
  },
} as const;
