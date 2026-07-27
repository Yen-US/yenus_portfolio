import "server-only";

import OpenAI from "openai";
import { z } from "zod";
import type {
  Account,
  DiscoveredCompany,
  PostDraft,
  PostPillar,
  ResearchBrief,
  ResearchSource,
} from "@/lib/signal-room/types";

const model = process.env.OPENAI_RESEARCH_MODEL ?? "gpt-5-mini";
const searchModel = process.env.OPENAI_SEARCH_MODEL ?? "gpt-4o-mini-search-preview";
const structureModel = process.env.OPENAI_STRUCTURE_MODEL ?? "gpt-4o-mini";

const discoveredCompanySchema = z.object({
  companies: z.array(
    z.object({
      name: z.string(),
      website: z.string().url(),
      stage: z.enum(["Seed", "Series A", "Series B", "Unknown"]),
      location: z.string(),
      oneLiner: z.string(),
      whyItFits: z.string(),
      trigger: z.string(),
      sourceUrls: z.array(z.string().url()),
    })
  ),
});

const researchBriefSchema = z.object({
  summary: z.string(),
  whyNow: z.string(),
  productMotion: z.string(),
  aiMaturity: z.string(),
  likelyPriorities: z.array(z.string()),
  evidence: z.array(
    z.object({
      claim: z.string(),
      sourceUrl: z.string().url(),
      sourceTitle: z.string(),
      observedAt: z.string(),
    })
  ),
  architectureHypotheses: z.array(
    z.object({
      hypothesis: z.string(),
      evidence: z.string(),
      questionToValidate: z.string(),
    })
  ),
  uncertainties: z.array(z.string()),
  outreach: z.object({
    openingLines: z.array(z.string()),
    shortMessage: z.string(),
    loomOutline: z.array(z.string()),
    discoveryQuestions: z.array(z.string()),
  }),
});

const postDraftSchema = z.object({
  title: z.string(),
  hook: z.string(),
  draft: z.string(),
  takeaway: z.string(),
  evidence: z.array(
    z.object({ claim: z.string(), sourceUrl: z.string().url(), sourceTitle: z.string() })
  ),
  quality: z.object({
    specificity: z.number().int().min(0).max(100),
    practicalValue: z.number().int().min(0).max(100),
    credibility: z.number().int().min(0).max(100),
    readability: z.number().int().min(0).max(100),
    notes: z.array(z.string()),
  }),
});

export async function discoverCompanies(input: {
  query: string;
  region: string;
  stages: string[];
  count: number;
}): Promise<DiscoveredCompany[]> {
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create(
    {
      model: searchModel,
      web_search_options: { search_context_size: "medium" },
      messages: [
        {
          role: "system",
          content:
            "You are a rigorous B2B startup researcher. Find real companies, not directories or generic lists. Write a concise research report with one heading per company and cite every funding, product, launch, hiring, or customer claim using web search citations. Include the official website when you can verify it. Never invent a funding stage or trigger. Prefer company pages, founder announcements, reputable funding reports, public job listings, and technical blogs. If a stage cannot be verified, say Unknown.",
        },
        {
          role: "user",
          content: `Find up to ${input.count} global B2B AI-native or AI-central startups matching this research angle: ${input.query}\nPreferred stages: ${input.stages.join(", ")}\nRegion: ${input.region}.\nPrioritize visible prototype-to-production, platform, evaluation, reliability, enterprise-readiness, or AI-team scaling signals. Exclude agencies, consultancies, consumer-only apps, and companies without a working public website. Today is 2026-07-27.`,
        },
      ],
    },
    { timeout: 45_000, maxRetries: 1 }
  );

  const message = completion.choices[0]?.message;
  if (!message?.content) throw new Error("Search returned no candidate data.");
  const citations = Array.from(
    new Map(
      (message.annotations ?? []).map((annotation) => [
        annotation.url_citation.url,
        {
          title: annotation.url_citation.title,
          url: annotation.url_citation.url,
        },
      ])
    ).values()
  );
  if (citations.length === 0) throw new Error("Web search returned no citable sources.");

  const sourceLedger = citations
    .map((citation, index) => `[SRC${index + 1}] ${citation.title} | ${citation.url}`)
    .join("\n");
  const structured = await openai.chat.completions.create(
    {
      model: structureModel,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "startup_discovery",
          strict: true,
          schema: startupDiscoveryJsonSchema(input.count),
        },
      },
      messages: [
        {
          role: "system",
          content:
            "Convert a cited startup research report into the requested JSON. Use only facts in the report. sourceUrls may contain only exact URLs from the supplied citation ledger. Use Unknown when funding stage is not explicitly supported. Exclude any company that has no relevant cited source.",
        },
        {
          role: "user",
          content: `SEARCH REPORT\n${message.content}\n\nCITATION LEDGER\n${sourceLedger}`,
        },
      ],
    },
    { timeout: 30_000, maxRetries: 1 }
  );

  const structuredContent = structured.choices[0]?.message.content;
  if (!structuredContent) throw new Error("Search results could not be structured.");
  const parsed = discoveredCompanySchema.parse(JSON.parse(structuredContent));
  const citedUrls = new Set(citations.map((citation) => citation.url));
  return parsed.companies
    .map((company) => ({
      ...company,
      sourceUrls: company.sourceUrls.filter((url) => hasMatchingCitation(url, citedUrls)),
    }))
    .filter(
      (company) =>
        company.sourceUrls.length > 0 && input.stages.includes(company.stage)
    );
}

export async function buildResearchBrief(input: {
  account: Pick<Account, "name" | "website" | "stage" | "location" | "oneLiner" | "notes">;
  sources: ResearchSource[];
  manualContext: string;
}): Promise<ResearchBrief> {
  const openai = getOpenAI();
  const sourcePacket = input.sources
    .map(
      (source, index) =>
        `[S${index + 1}] ${source.title}\nURL: ${source.url}\nCaptured: ${source.capturedAt}\nContent: ${source.content}`
    )
    .join("\n\n");

  const response = await openai.responses.create({
    model,
    store: false,
    text: {
      verbosity: "high",
      format: {
        type: "json_schema",
        name: "account_research_brief",
        strict: true,
        schema: researchBriefJsonSchema,
      },
    },
    instructions:
      "You are Yenson Umana's research analyst for manual, respectful outreach to Seed-Series B B2B AI startups. Use only supplied sources and manual context. Every factual evidence item must cite an exact supplied source URL and title. Never turn an inference into a fact. Architecture observations must be labeled hypotheses and include a question that would validate them. Outreach must be specific, brief, useful, and free of flattery, fake familiarity, or pressure. The Loom outline should teach something before asking for a call.",
    input: `ACCOUNT\nName: ${input.account.name}\nWebsite: ${input.account.website}\nStage: ${input.account.stage}\nLocation: ${input.account.location}\nOne-liner: ${input.account.oneLiner}\nExisting notes: ${input.account.notes}\n\nMANUAL CONTEXT\n${input.manualContext || "None supplied."}\n\nPUBLIC SOURCES\n${sourcePacket || "No extractable public pages supplied. Treat all unsupported claims as uncertainty."}`,
  }, { timeout: 55_000, maxRetries: 1 });

  const parsed = researchBriefSchema.parse(JSON.parse(response.output_text));
  const sourcesByUrl = new Map(
    input.sources.map((source) => [normalizeUrl(source.url), source])
  );
  return {
    ...parsed,
    evidence: parsed.evidence.flatMap((item) => {
      const source = sourcesByUrl.get(normalizeUrl(item.sourceUrl));
      return source
        ? [
            {
              claim: item.claim,
              sourceUrl: source.url,
              sourceTitle: source.title,
              observedAt: source.capturedAt,
            },
          ]
        : [];
    }),
  };
}

export async function generateLinkedInPost(input: {
  topic: string;
  pillar: PostPillar;
  pointOfView: string;
  sourceMaterial: string;
  accountIds: string[];
}): Promise<Omit<PostDraft, "id" | "pillar" | "status" | "accountIds" | "createdAt" | "updatedAt">> {
  const openai = getOpenAI();
  const response = await openai.responses.create({
    model,
    store: false,
    text: {
      verbosity: "high",
      format: {
        type: "json_schema",
        name: "linkedin_post_draft",
        strict: true,
        schema: postDraftJsonSchema,
      },
    },
    instructions:
      "Write in Yenson Umana's voice: direct, implementation-grounded, calm, technically precise, and useful to startup founders and CTOs. The post must have one non-obvious central claim, a concrete startup scenario, 3-5 detailed decisions or a reusable framework, and a decisive takeaway. Aim for 1,400-2,400 characters. Use short paragraphs but do not write empty one-line engagement bait. No emojis, fake dialogue, invented metrics, vague inspiration, excessive rhetorical questions, or generic 'AI is changing everything' claims. Do not mention confidential employers or clients. Include only evidence present in the source material; otherwise mark the idea as experience-based and leave the evidence array empty. Score the draft honestly and add revision notes for any score below 80.",
    input: `PILLAR: ${input.pillar}\nTOPIC: ${input.topic}\nPOINT OF VIEW TO DEFEND: ${input.pointOfView}\nSOURCE MATERIAL AND FIELD NOTES:\n${input.sourceMaterial || "No external source material. Write as an experience-based framework without factual client claims."}`,
  }, { timeout: 55_000, maxRetries: 1 });

  const parsed = postDraftSchema.parse(JSON.parse(response.output_text));
  const allowedUrls = new Set(
    extractHttpUrls(input.sourceMaterial).map(normalizeUrl).filter(Boolean)
  );
  return {
    ...parsed,
    evidence: parsed.evidence.filter((item) =>
      allowedUrls.has(normalizeUrl(item.sourceUrl))
    ),
  };
}

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured.");
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function normalizeUrl(value: string) {
  try {
    const url = new URL(value);
    url.hash = "";
    url.searchParams.delete("utm_source");
    url.searchParams.delete("utm_medium");
    url.searchParams.delete("utm_campaign");
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

function extractHttpUrls(value: string) {
  return value.match(/https?:\/\/[^\s|)\]}>,]+/g) ?? [];
}

function hasMatchingCitation(value: string, citations: Set<string>) {
  const normalized = normalizeUrl(value);
  if (!normalized) return false;
  return [...citations].some((citation) => {
    const normalizedCitation = normalizeUrl(citation);
    return normalizedCitation === normalized || normalizedCitation.startsWith(`${normalized}?`);
  });
}

function startupDiscoveryJsonSchema(maxItems: number) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["companies"],
    properties: {
      companies: {
        type: "array",
        maxItems,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "name",
            "website",
            "stage",
            "location",
            "oneLiner",
            "whyItFits",
            "trigger",
            "sourceUrls",
          ],
          properties: {
            name: { type: "string" },
            website: { type: "string" },
            stage: { type: "string", enum: ["Seed", "Series A", "Series B", "Unknown"] },
            location: { type: "string" },
            oneLiner: { type: "string" },
            whyItFits: { type: "string" },
            trigger: { type: "string" },
            sourceUrls: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
  } as const;
}

const researchBriefJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "whyNow",
    "productMotion",
    "aiMaturity",
    "likelyPriorities",
    "evidence",
    "architectureHypotheses",
    "uncertainties",
    "outreach",
  ],
  properties: {
    summary: { type: "string" },
    whyNow: { type: "string" },
    productMotion: { type: "string" },
    aiMaturity: { type: "string" },
    likelyPriorities: { type: "array", items: { type: "string" } },
    evidence: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["claim", "sourceUrl", "sourceTitle", "observedAt"],
        properties: {
          claim: { type: "string" },
          sourceUrl: { type: "string" },
          sourceTitle: { type: "string" },
          observedAt: { type: "string" },
        },
      },
    },
    architectureHypotheses: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["hypothesis", "evidence", "questionToValidate"],
        properties: {
          hypothesis: { type: "string" },
          evidence: { type: "string" },
          questionToValidate: { type: "string" },
        },
      },
    },
    uncertainties: { type: "array", items: { type: "string" } },
    outreach: {
      type: "object",
      additionalProperties: false,
      required: ["openingLines", "shortMessage", "loomOutline", "discoveryQuestions"],
      properties: {
        openingLines: { type: "array", items: { type: "string" } },
        shortMessage: { type: "string" },
        loomOutline: { type: "array", items: { type: "string" } },
        discoveryQuestions: { type: "array", items: { type: "string" } },
      },
    },
  },
} as const;

const postDraftJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "hook", "draft", "takeaway", "evidence", "quality"],
  properties: {
    title: { type: "string" },
    hook: { type: "string" },
    draft: { type: "string" },
    takeaway: { type: "string" },
    evidence: {
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
    },
    quality: {
      type: "object",
      additionalProperties: false,
      required: ["specificity", "practicalValue", "credibility", "readability", "notes"],
      properties: {
        specificity: { type: "integer", minimum: 0, maximum: 100 },
        practicalValue: { type: "integer", minimum: 0, maximum: 100 },
        credibility: { type: "integer", minimum: 0, maximum: 100 },
        readability: { type: "integer", minimum: 0, maximum: 100 },
        notes: { type: "array", items: { type: "string" } },
      },
    },
  },
} as const;