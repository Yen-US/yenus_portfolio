import "server-only";

import OpenAI from "openai";
import { z } from "zod";
import type {
  Account,
  CallRecord,
  ConversationMessage,
  CorrectionOpener,
  CostMathQuestion,
  HandsOnObservation,
  IcpProfile,
  NinetyDayPlan,
  ReplyAnalysis,
  ResearchBrief,
  TestPlan,
} from "@/lib/signal-room/types";
import { REPLY_INTENTS } from "@/lib/signal-room/types";
import { getOffer } from "@/lib/signal-room/offers";

const model = process.env.OPENAI_RESEARCH_MODEL ?? "gpt-5-mini";

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/** Every structured call in this module shares the same shape. */
async function structuredCall<T>(options: {
  schemaName: string;
  jsonSchema: Record<string, unknown>;
  instructions: string;
  input: string;
  parser: z.ZodType<T>;
}): Promise<T> {
  const openai = getOpenAI();
  const response = await openai.responses.create(
    {
      model,
      store: false,
      text: {
        verbosity: "high",
        format: {
          type: "json_schema",
          name: options.schemaName,
          strict: true,
          schema: options.jsonSchema,
        },
      },
      instructions: options.instructions,
      input: options.input,
    },
    { timeout: 55_000, maxRetries: 1 }
  );
  return options.parser.parse(JSON.parse(response.output_text));
}

function describeObservations(observations: HandsOnObservation[]) {
  if (observations.length === 0) {
    return "No first-hand product usage recorded. Do not claim any measured weakness.";
  }
  return observations
    .map(
      (observation, index) =>
        `[O${index + 1}] flow: ${observation.flow}\n  metric: ${observation.metric}\n  value: ${
          observation.value ?? "not recorded"
        } ${observation.unit}\n  tier: ${observation.tier} (cost $${observation.costUsd})\n  weakness: ${
          observation.isWeakness ? "yes" : "no"
        }\n  note: ${observation.rawNote}`
    )
    .join("\n");
}

function describeHypotheses(brief: ResearchBrief | null) {
  if (!brief || brief.architectureHypotheses.length === 0) {
    return "No architecture hypotheses recorded.";
  }
  return brief.architectureHypotheses
    .map(
      (item, index) =>
        `[H${index + 1}] ${item.hypothesis}\n  signal: ${item.evidence}\n  validating question: ${item.questionToValidate}`
    )
    .join("\n");
}

// --- 1. ICP sharpening ----------------------------------------------------

const icpDraftSchema = z.object({
  label: z.string(),
  statement: z.string(),
  stages: z.array(z.enum(["Seed", "Series A", "Series B", "Unknown"])),
  regions: z.array(z.string()),
  buyerRoles: z.array(z.string()),
  disqualifiers: z.array(z.string()),
  keywordBanks: z.object({
    ai: z.array(z.string()),
    b2b: z.array(z.string()),
    production: z.array(z.string()),
    architecture: z.array(z.string()),
    urgency: z.array(z.string()),
  }),
  measurableWeakness: z.string(),
  ambiguities: z.array(z.string()),
});

export type IcpDraft = z.infer<typeof icpDraftSchema>;

export async function sharpenIcp(input: {
  statement: string;
  currentIcp: IcpProfile | null;
}): Promise<IcpDraft> {
  return structuredCall({
    schemaName: "icp_profile_draft",
    jsonSchema: icpDraftJsonSchema,
    parser: icpDraftSchema,
    instructions:
      "You refine an ideal-customer-profile definition for one person doing manual, message-based outreach. Given a loose targeting statement, return a narrowed profile with mutually exclusive stage, region, and buyer-role constraints, an explicit disqualifier list, and keyword banks for five scoring dimensions: ai, b2b, production, architecture, urgency. Keyword banks are matched as whole words against short company descriptions, so prefer single words and common two-word phrases, lowercase, 6 to 12 entries each. Also name one product weakness the operator could personally measure by signing up for the product's free or lowest paid tier - it must be observable in a single session by one person, such as latency, failure rate, or step count. Narrowing is the goal: never broaden the definition to increase market size. If the statement is too vague to score against, list what is ambiguous rather than guessing.",
    input: `LOOSE TARGETING STATEMENT\n${input.statement}\n\nCURRENT LOCKED ICP\n${
      input.currentIcp
        ? `v${input.currentIcp.version}: ${input.currentIcp.statement}\nStages: ${input.currentIcp.stages.join(", ")}\nDisqualifiers: ${input.currentIcp.disqualifiers.join("; ")}`
        : "None locked yet."
    }`,
  });
}

// --- 2. Hands-on test plan ------------------------------------------------

const testPlanSchema = z.object({
  signupPath: z.string(),
  tierNote: z.string(),
  tests: z.array(
    z.object({
      whatToDo: z.string(),
      whatToMeasure: z.string(),
      whyItMatters: z.string(),
      expectedRange: z.string(),
    })
  ),
  doNotDo: z.array(z.string()),
});

export async function buildTestPlan(input: {
  account: Pick<Account, "name" | "website" | "oneLiner" | "stage">;
  brief: ResearchBrief | null;
}): Promise<TestPlan> {
  return structuredCall({
    schemaName: "hands_on_test_plan",
    jsonSchema: testPlanJsonSchema,
    parser: testPlanSchema,
    instructions:
      "You plan a legitimate, first-hand evaluation of a startup's public product, performed manually by one person acting as an ordinary prospective user. Using only the supplied brief and account details, propose three to five concrete things to try on the free or lowest paid tier. For each, name the single number to measure - wall-clock duration, step count, retries, or failure mode - and why that number would matter to a CTO trying to scale. Prefer the one flow the product is actually sold on. State the cheapest tier that permits the test and its expected cost; if no pricing information was supplied, say the tier is unverified. Always include a doNotDo list covering anything requiring scripted or automated access, load generation, credential sharing, scraping, or exceeding published rate limits. Never fabricate measurements, pricing, or feature availability.",
    input: `ACCOUNT\nName: ${input.account.name}\nWebsite: ${input.account.website || "unknown"}\nStage: ${input.account.stage}\nOne-liner: ${input.account.oneLiner}\n\nRESEARCH BRIEF\n${
      input.brief
        ? `${input.brief.summary}\n\nProduct motion: ${input.brief.productMotion}\nAI maturity: ${input.brief.aiMaturity}\n\nHYPOTHESES\n${describeHypotheses(input.brief)}`
        : "No research brief yet."
    }`,
  });
}

// --- 3. Correction-bait opener -------------------------------------------

const correctionOpenerSchema = z.object({
  greeting: z.string(),
  strengths: z.array(z.string()),
  weakness: z.string(),
  hypothesis: z.string(),
  scalingQuestion: z.string(),
  fullMessage: z.string(),
  selfCheck: z.object({
    hasStrengths: z.boolean(),
    singleWeakness: z.boolean(),
    hypothesisHedged: z.boolean(),
    usesOnlyFieldTestNumbers: z.boolean(),
    notes: z.array(z.string()),
  }),
});

export async function buildCorrectionOpener(input: {
  account: Pick<Account, "name" | "oneLiner" | "approxUsers" | "targetName" | "targetRole">;
  brief: ResearchBrief | null;
  observations: HandsOnObservation[];
}): Promise<CorrectionOpener> {
  if (input.observations.length === 0) {
    // Guarded at the route too; this keeps the function honest on its own.
    throw new Error(
      "A correction opener requires at least one first-hand observation."
    );
  }

  return structuredCall({
    schemaName: "correction_bait_message",
    jsonSchema: correctionOpenerJsonSchema,
    parser: correctionOpenerSchema,
    instructions:
      "Draft one short outbound LinkedIn message from Yenson Umana to a named technical leader. Structure it in this order: a plain human greeting; a sentence saying he has been using their product; two or three genuine strengths, drawn only from the first-hand observations or cited evidence supplied - specific and earned, never generic praise; then exactly ONE weakness, the measured one, quoted with its number; then one sentence giving his technical hypothesis for the cause, stated explicitly as a guess using wording such as 'my guess is' or 'I'd assume', and phrased so that a CTO who knows the real reason will want to correct it; then the scaling question, anchored to the user-count estimate when one is supplied, asking what happens to that process at a materially larger scale. Hard rules: never more than one weakness. Never state the hypothesis as fact. Never use a number that is not in the first-hand observations. No flattery, no fake familiarity, no pressure, no links, and no request for a call - the ask comes only after they reply. Keep the full message under 900 characters and write it in plain sentences a person would actually type. Fill selfCheck honestly, including notes for anything you could not satisfy.",
    input: `RECIPIENT\nName: ${input.account.targetName || "unknown"}\nRole: ${input.account.targetRole || "technical leader"}\n\nCOMPANY\n${input.account.name} - ${input.account.oneLiner}\nApproximate users: ${input.account.approxUsers || "unknown, do not invent one"}\n\nFIRST-HAND OBSERVATIONS (the only numbers you may use)\n${describeObservations(input.observations)}\n\nARCHITECTURE HYPOTHESES FROM RESEARCH\n${describeHypotheses(input.brief)}\n\nCITED EVIDENCE\n${
      input.brief?.evidence.map((item) => `- ${item.claim} (${item.sourceTitle})`).join("\n") ||
      "None."
    }`,
  });
}

// --- 4. Reply analysis ----------------------------------------------------

const replyAnalysisSchema = z.object({
  intent: z.enum(REPLY_INTENTS),
  correctionQuote: z.string(),
  hypothesisUpdates: z.array(
    z.object({
      hypothesis: z.string(),
      verdict: z.enum(["confirmed", "refuted", "open"]),
      evidenceQuote: z.string(),
    })
  ),
  extractedNumbers: z.array(
    z.object({ label: z.string(), value: z.string(), quote: z.string() })
  ),
  egoRisk: z.enum(["none", "mild", "high"]),
  suggestedNextQuestion: z.string(),
  askReadiness: z.enum(["not_yet", "soon", "ask_now"]),
  askRationale: z.string(),
  draftResponse: z.string(),
});

export async function analyzeReply(input: {
  account: Pick<Account, "name" | "oneLiner" | "targetName" | "targetRole">;
  brief: ResearchBrief | null;
  observations: HandsOnObservation[];
  thread: ConversationMessage[];
  reply: string;
}): Promise<ReplyAnalysis> {
  return structuredCall({
    schemaName: "reply_analysis",
    jsonSchema: replyAnalysisJsonSchema,
    parser: replyAnalysisSchema,
    instructions:
      "You analyse a prospect's reply to manual outreach. Classify the intent. If the reply corrects a technical claim, quote the correcting sentence verbatim in correctionQuote - that correction is the most valuable thing in the exchange, so preserve their exact wording. For each supplied architecture hypothesis, state whether this reply confirms it, refutes it, or leaves it open, and never mark it confirmed on inference alone; quote the words that justify the verdict. Extract any stated numbers about scale, users, cost, latency, or team size verbatim - never estimate, and return an empty list if none were stated. Flag defensiveness or wounded ego if present. Propose exactly one next question that deepens the conversation and invites another correction. Finally, state plainly whether the reply justifies asking for a thirty-minute call yet: the default answer is not_yet, and ask_now requires clear engagement such as a substantive technical reply or an explicit expression of interest. Write draftResponse as a short, human, question-led reply that never pressures, never lists more than one problem, and thanks them for the correction when they gave one.",
    input: `COMPANY\n${input.account.name} - ${input.account.oneLiner}\nContact: ${input.account.targetName || "unknown"} (${input.account.targetRole || "unknown role"})\n\nMY FIRST-HAND OBSERVATIONS\n${describeObservations(input.observations)}\n\nMY ARCHITECTURE HYPOTHESES\n${describeHypotheses(input.brief)}\n\nCONVERSATION SO FAR\n${
      input.thread.length > 0
        ? input.thread
            .map((message) => `[${message.direction === "sent" ? "ME" : "THEM"}] ${message.body}`)
            .join("\n\n")
        : "No prior messages recorded."
    }\n\nTHEIR NEW REPLY\n${input.reply}`,
  });
}

// --- 5. Call preparation --------------------------------------------------

const callPrepSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      fills: z.enum([
        "monthlySpend",
        "wastePct",
        "reclaimIntent",
        "revenueDelta",
        "costOfDelay",
      ]),
      anchoredTo: z.string(),
    })
  ),
  openingFrame: z.string(),
  disqualifySignals: z.array(z.string()),
});

export async function buildCallPrep(input: {
  account: Pick<Account, "name" | "oneLiner" | "stage" | "approxUsers">;
  brief: ResearchBrief | null;
  observations: HandsOnObservation[];
}): Promise<{
  questions: CostMathQuestion[];
  openingFrame: string;
  disqualifySignals: string[];
}> {
  return structuredCall({
    schemaName: "call_cost_questions",
    jsonSchema: callPrepJsonSchema,
    parser: callPrepSchema,
    instructions:
      "You prepare Yenson Umana for a thirty-minute discovery call with a B2B AI startup. From the supplied research and first-hand observations only, produce questions that convert each architecture hypothesis into a number the prospect can state out loud: what the current process costs each month in engineer time, inference spend, or delay; what fraction of that is avoidable; what they would do with the reclaimed capacity; what revenue change that enables; and what leaving it unfixed costs per month. Every question must name a specific system or measurement from the research - never a generic 'what are your challenges'. Phrase each as a hypothesis they can correct rather than an accusation. Label each question with the cost-math field it fills. Produce at most eight questions. Never invent figures for them and never propose a price. Also give a one-sentence opening frame for the call, and list signals that would mean Yenson should disqualify rather than pitch.",
    input: `COMPANY\n${input.account.name} - ${input.account.oneLiner}\nStage: ${input.account.stage}\nApproximate users: ${input.account.approxUsers || "unknown"}\n\nARCHITECTURE HYPOTHESES\n${describeHypotheses(input.brief)}\n\nFIRST-HAND OBSERVATIONS\n${describeObservations(input.observations)}\n\nLIKELY PRIORITIES\n${input.brief?.likelyPriorities.join("\n") || "Unknown."}`,
  });
}

// --- 6. Ninety-day plan ---------------------------------------------------

const planSchema = z.object({
  milestones: z.array(
    z.object({
      day: z.union([z.literal(30), z.literal(60), z.literal(90)]),
      outcome: z.string(),
      evidence: z.string(),
    })
  ),
  assumptions: z.array(z.string()),
  outOfScope: z.array(z.string()),
});

export async function buildNinetyDayPlan(input: {
  account: Pick<Account, "name" | "oneLiner" | "stage">;
  brief: ResearchBrief | null;
  call: Partial<CallRecord>;
  offerName: string;
}): Promise<NinetyDayPlan> {
  const offer = getOffer(input.offerName);
  return structuredCall({
    schemaName: "ninety_day_plan",
    jsonSchema: planJsonSchema,
    parser: planSchema,
    instructions:
      "Draft a ninety-day plan for a named consulting engagement. Produce day-30, day-60, and day-90 milestones. Each milestone must state one concrete outcome and the evidence that proves it was reached - a measurement, an artifact, or a decision record - never an activity or an effort. Ground every milestone in the client's stated cost problem and in the validated architecture hypotheses; where a hypothesis is still unvalidated, make validating it an explicit day-30 milestone rather than assuming it holds. Scope must be achievable within the named engagement's documented duration. Never promise implementation beyond resolving a material unknown or supporting team transfer. Never state or imply a price. Never reference confidential employers, programs, or clients. List the assumptions the plan depends on and what is explicitly out of scope.",
    input: `CLIENT\n${input.account.name} - ${input.account.oneLiner}\nStage: ${input.account.stage}\n\nENGAGEMENT\n${input.offerName}${
      offer
        ? ` (${offer.durationLabel})\nProduces: ${offer.produces.join(", ")}\nBest when: ${offer.bestWhen}`
        : ""
    }\n\nWHAT THEY TOLD ME ON THE CALL\nMonthly spend: ${input.call.monthlySpendUsd ?? "not stated"}\nSpend basis: ${input.call.spendBasis || "not recorded"}\nAvoidable share: ${input.call.wastePct ?? "not stated"}%\nWaste basis: ${input.call.wasteBasis || "not recorded"}\nWhat they would do with the reclaim: ${input.call.reclaimIntent || "not recorded"}\nCost of delay in their words: ${input.call.costOfDelay || "not recorded"}\nCall notes: ${input.call.notes || "none"}\n\nARCHITECTURE HYPOTHESES\n${describeHypotheses(input.brief)}`,
  });
}

// --- JSON schemas ---------------------------------------------------------

const icpDraftJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "label",
    "statement",
    "stages",
    "regions",
    "buyerRoles",
    "disqualifiers",
    "keywordBanks",
    "measurableWeakness",
    "ambiguities",
  ],
  properties: {
    label: { type: "string" },
    statement: { type: "string" },
    stages: {
      type: "array",
      items: { type: "string", enum: ["Seed", "Series A", "Series B", "Unknown"] },
    },
    regions: { type: "array", items: { type: "string" } },
    buyerRoles: { type: "array", items: { type: "string" } },
    disqualifiers: { type: "array", items: { type: "string" } },
    keywordBanks: {
      type: "object",
      additionalProperties: false,
      required: ["ai", "b2b", "production", "architecture", "urgency"],
      properties: {
        ai: { type: "array", items: { type: "string" } },
        b2b: { type: "array", items: { type: "string" } },
        production: { type: "array", items: { type: "string" } },
        architecture: { type: "array", items: { type: "string" } },
        urgency: { type: "array", items: { type: "string" } },
      },
    },
    measurableWeakness: { type: "string" },
    ambiguities: { type: "array", items: { type: "string" } },
  },
} as const;

const testPlanJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["signupPath", "tierNote", "tests", "doNotDo"],
  properties: {
    signupPath: { type: "string" },
    tierNote: { type: "string" },
    tests: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["whatToDo", "whatToMeasure", "whyItMatters", "expectedRange"],
        properties: {
          whatToDo: { type: "string" },
          whatToMeasure: { type: "string" },
          whyItMatters: { type: "string" },
          expectedRange: { type: "string" },
        },
      },
    },
    doNotDo: { type: "array", items: { type: "string" } },
  },
} as const;

const correctionOpenerJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "greeting",
    "strengths",
    "weakness",
    "hypothesis",
    "scalingQuestion",
    "fullMessage",
    "selfCheck",
  ],
  properties: {
    greeting: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    weakness: { type: "string" },
    hypothesis: { type: "string" },
    scalingQuestion: { type: "string" },
    fullMessage: { type: "string" },
    selfCheck: {
      type: "object",
      additionalProperties: false,
      required: [
        "hasStrengths",
        "singleWeakness",
        "hypothesisHedged",
        "usesOnlyFieldTestNumbers",
        "notes",
      ],
      properties: {
        hasStrengths: { type: "boolean" },
        singleWeakness: { type: "boolean" },
        hypothesisHedged: { type: "boolean" },
        usesOnlyFieldTestNumbers: { type: "boolean" },
        notes: { type: "array", items: { type: "string" } },
      },
    },
  },
} as const;

const replyAnalysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "intent",
    "correctionQuote",
    "hypothesisUpdates",
    "extractedNumbers",
    "egoRisk",
    "suggestedNextQuestion",
    "askReadiness",
    "askRationale",
    "draftResponse",
  ],
  properties: {
    intent: { type: "string", enum: [...REPLY_INTENTS] },
    correctionQuote: { type: "string" },
    hypothesisUpdates: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["hypothesis", "verdict", "evidenceQuote"],
        properties: {
          hypothesis: { type: "string" },
          verdict: { type: "string", enum: ["confirmed", "refuted", "open"] },
          evidenceQuote: { type: "string" },
        },
      },
    },
    extractedNumbers: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "value", "quote"],
        properties: {
          label: { type: "string" },
          value: { type: "string" },
          quote: { type: "string" },
        },
      },
    },
    egoRisk: { type: "string", enum: ["none", "mild", "high"] },
    suggestedNextQuestion: { type: "string" },
    askReadiness: { type: "string", enum: ["not_yet", "soon", "ask_now"] },
    askRationale: { type: "string" },
    draftResponse: { type: "string" },
  },
} as const;

const callPrepJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["questions", "openingFrame", "disqualifySignals"],
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "fills", "anchoredTo"],
        properties: {
          question: { type: "string" },
          fills: {
            type: "string",
            enum: [
              "monthlySpend",
              "wastePct",
              "reclaimIntent",
              "revenueDelta",
              "costOfDelay",
            ],
          },
          anchoredTo: { type: "string" },
        },
      },
    },
    openingFrame: { type: "string" },
    disqualifySignals: { type: "array", items: { type: "string" } },
  },
} as const;

const planJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["milestones", "assumptions", "outOfScope"],
  properties: {
    milestones: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["day", "outcome", "evidence"],
        properties: {
          day: { type: "integer", enum: [30, 60, 90] },
          outcome: { type: "string" },
          evidence: { type: "string" },
        },
      },
    },
    assumptions: { type: "array", items: { type: "string" } },
    outOfScope: { type: "array", items: { type: "string" } },
  },
} as const;
