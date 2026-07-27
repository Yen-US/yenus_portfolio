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

const discoveredCompaniesEnvelopeSchema = z.object({
  companies: z.array(z.unknown()),
});

const discoveredCompanyCandidateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  website: z.string().nullish().transform((value) => value?.trim() ?? ""),
  stage: z.enum(["Seed", "Series A", "Series B", "Unknown"]).catch("Unknown"),
  location: z.string().nullish().transform((value) => value?.trim() ?? ""),
  oneLiner: z.string().nullish().transform((value) => value?.trim() ?? ""),
  whyItFits: z.string().nullish().transform((value) => value?.trim() ?? ""),
  trigger: z.string().nullish().transform((value) => value?.trim() ?? ""),
  sourceUrls: z.array(z.string()).catch([]),
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
      web_search_options: { search_context_size: "low" },
      max_completion_tokens: 1_300,
      messages: [
        {
          role: "system",
          content:
            `Use web search to find real B2B AI startups. Every company must have at least one recent funding, product launch, enterprise pilot, customer, or engineering-hiring claim with an inline web citation. Cite the funding stage as well. If you cannot cite a company and its requested stage, omit it. Never infer an official website.

Write no more than the requested number of compact Markdown sections in this exact shape:
## Company name
- Website: full official URL or Unknown
- Stage: Seed, Series A, or Series B
- Location: location or Unknown
- Product: one sentence
- Why fit: one sentence
- Trigger: one recent claim ending with its inline web citation

No introduction, conclusion, directories, generic startup lists, agencies, consultancies, or consumer-only apps. Prefer official company pages, founder announcements, reputable funding reports, public job listings, and technical blogs.`,
        },
        {
          role: "user",
          content: `Find up to ${input.count} global B2B AI-native or AI-central startups matching this research angle: ${input.query}\nPreferred stages: ${input.stages.join(", ")}\nRegion: ${input.region}.\nPrioritize visible prototype-to-production, platform, evaluation, reliability, enterprise-readiness, or AI-team scaling signals. Exclude agencies, consultancies, consumer-only apps, and companies without a working public website. Today is 2026-07-27.`,
        },
      ],
    },
    { timeout: 10_500, maxRetries: 0 }
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
          startIndex: annotation.url_citation.start_index,
          endIndex: annotation.url_citation.end_index,
        },
      ])
    ).values()
  );
  const companies = parseDiscoveryBlocks(message.content, citations)
    .filter(
      (company) =>
        company.sourceUrls.length > 0 && input.stages.includes(company.stage)
    )
    .slice(0, input.count);

  if (companies.length === 0) {
    throw new Error("Search returned no source-backed candidates. Try a narrower query.");
  }

  return companies;
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

function normalizeCompanyWebsite(
  value: string,
  companyName: string,
  sourceUrls: string[]
) {
  const explicit = toHttpUrl(value);
  if (explicit) {
    const explicitUrl = new URL(explicit);
    const explicitHostname = explicitUrl.hostname
      .replace(/^www\./, "")
      .toLowerCase();
    if (
      !isPublisherHostname(explicitHostname) &&
      hostnameMatchesCompany(explicitHostname, companyName)
    ) {
      return explicitUrl.origin;
    }
  }

  const companyKey = normalizeCompanyKey(companyName);
  if (companyKey.length < 4) return "";

  for (const sourceUrl of sourceUrls) {
    const source = new URL(sourceUrl);
    const hostname = source.hostname.replace(/^www\./, "").toLowerCase();
    if (isPublisherHostname(hostname)) continue;

    if (hostnameMatchesCompany(hostname, companyName)) {
      return source.origin;
    }
  }

  return "";
}

interface SearchCitation {
  title: string;
  url: string;
  startIndex: number;
  endIndex: number;
}

function parseDiscoveryBlocks(
  content: string,
  citations: SearchCitation[]
): DiscoveredCompany[] {
  const candidates: DiscoveredCompany[] = [];

  for (const block of extractDiscoveryBlocks(content)) {
    const { body, start: blockStart, end: blockEnd } = block;
    const name = readDiscoveryField(body, "NAME");
    if (!name) continue;

    const sourceUrls = findBlockCitations(
      body,
      name,
      blockStart,
      blockEnd,
      citations
    );
    if (sourceUrls.length === 0) continue;

    const candidate = discoveredCompanyCandidateSchema.safeParse({
      name,
      website: readDiscoveryField(body, "WEBSITE"),
      stage: normalizeStartupStage(readDiscoveryField(body, "STAGE")),
      location: readDiscoveryField(body, "LOCATION"),
      oneLiner:
        readDiscoveryField(body, "ONE_LINE") ||
        readDiscoveryField(body, "PRODUCT"),
      whyItFits:
        readDiscoveryField(body, "WHY_FIT") ||
        readDiscoveryField(body, "WHY FIT"),
      trigger: readDiscoveryField(body, "TRIGGER"),
      sourceUrls,
    });
    if (!candidate.success) continue;

    candidates.push({
      ...candidate.data,
      website: normalizeCompanyWebsite(
        candidate.data.website,
        candidate.data.name,
        sourceUrls
      ),
      sourceUrls,
    });
  }

  return candidates;
}

function extractDiscoveryBlocks(content: string) {
  const tagged = Array.from(
    content.matchAll(/<COMPANY>([\s\S]*?)<\/COMPANY>/gi)
  ).map((match) => ({
    body: match[1],
    start: match.index ?? 0,
    end: (match.index ?? 0) + match[0].length,
  }));
  if (tagged.length > 0) return tagged;

  const markdownHeadings = Array.from(
    content.matchAll(/^##\s+([^\n]+)$/gim)
  );
  if (markdownHeadings.length > 0) {
    return markdownHeadings.map((heading, index) => {
      const start = heading.index ?? 0;
      const end = markdownHeadings[index + 1]?.index ?? content.length;
      return {
        body: `NAME: ${stripSearchMarkup(heading[1])}\n${content.slice(
          start + heading[0].length,
          end
        )}`,
        start,
        end,
      };
    });
  }

  const nameMarkers = Array.from(
    content.matchAll(/(?:^|\n)\s*(?:\*\*)?NAME(?:\*\*)?\s*:/gi)
  );
  return nameMarkers.map((marker, index) => {
    const start = marker.index ?? 0;
    const end = nameMarkers[index + 1]?.index ?? content.length;
    return { body: content.slice(start, end), start, end };
  });
}

function readDiscoveryField(body: string, label: string) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = body.match(
    new RegExp(`(?:^|\\n)\\s*(?:[-*]\\s*)?(?:\\*\\*)?${escapedLabel}(?:\\*\\*)?\\s*:\\s*([^\\n]+)`, "i")
  );
  return stripSearchMarkup(match?.[1] ?? "");
}

function stripSearchMarkup(value: string) {
  return value
    .replace(/\[([^\]]+)]\(https?:\/\/[^)]+\)/g, "$1")
    .replace(/\(\s*https?:\/\/[^)]+\)/g, "")
    .replace(/\*\*/g, "")
    .trim();
}

function normalizeStartupStage(value: string) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (normalized === "seed") return "Seed";
  if (normalized === "seriesa") return "Series A";
  if (normalized === "seriesb") return "Series B";
  return "Unknown";
}

function findBlockCitations(
  body: string,
  companyName: string,
  blockStart: number,
  blockEnd: number,
  citations: SearchCitation[]
) {
  const overlapping = citations.filter(
    (citation) =>
      citation.startIndex < blockEnd && citation.endIndex > blockStart
  );
  if (overlapping.length > 0) {
    return Array.from(new Set(overlapping.map((citation) => citation.url)));
  }

  const inlineUrls = extractHttpUrls(body);
  const inlineMatches = citations.filter((citation) =>
    inlineUrls.some(
      (url) => normalizeUrl(url) === normalizeUrl(citation.url)
    )
  );
  if (inlineMatches.length > 0) {
    return Array.from(new Set(inlineMatches.map((citation) => citation.url)));
  }

  const validInlineUrls = inlineUrls.flatMap((url) => {
    const normalized = toHttpUrl(url);
    return normalized ? [normalized] : [];
  });
  if (validInlineUrls.length > 0) {
    return Array.from(new Set(validInlineUrls));
  }

  const companyKey = normalizeCompanyKey(companyName);
  const titleMatches = citations.filter((citation) =>
    normalizeCompanyKey(citation.title).includes(companyKey)
  );
  return Array.from(new Set(titleMatches.map((citation) => citation.url)));
}

function hostnameMatchesCompany(hostname: string, companyName: string) {
  const companyKey = normalizeCompanyKey(companyName);
  const hostnameKey = normalizeCompanyKey(
    hostname.replace(/^www\./, "").split(".")[0]
  );
  return (
    companyKey.length >= 4 &&
    hostnameKey.length >= 4 &&
    (companyKey.includes(hostnameKey) || hostnameKey.includes(companyKey))
  );
}

function toHttpUrl(value: string) {
  const trimmed = value.trim();
  if (
    !trimmed ||
    /^(unknown|none|null|n\/?a|not available|not found|-)$/i.test(trimmed)
  ) {
    return "";
  }

  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : /^(?:www\.)?[a-z0-9.-]+\.[a-z]{2,}(?:\/.*)?$/i.test(trimmed)
      ? `https://${trimmed}`
      : "";
  if (!candidate) return "";

  try {
    const url = new URL(candidate);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

function normalizeCompanyKey(value: string) {
  return value
    .toLowerCase()
    .replace(/\b(inc|corp|corporation|company|technologies|technology|labs|ai)\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function isPublisherHostname(hostname: string) {
  return [
    "businesswire.com",
    "crunchbase.com",
    "forbes.com",
    "globenewswire.com",
    "linkedin.com",
    "medium.com",
    "prnewswire.com",
    "reuters.com",
    "techcrunch.com",
    "venturebeat.com",
  ].some((publisher) => hostname === publisher || hostname.endsWith(`.${publisher}`));
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