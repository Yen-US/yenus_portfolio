/**
 * Suggested ICP presets, derived from the offer ladder in
 * `docs/plans/2026-07-27-ai-consulting-site-strategy.md` and
 * `src/lib/consulting-data.ts`.
 *
 * Each preset answers: which startups have a problem that one of Yenson's
 * engagements actually solves, and what weakness could he measure himself on
 * their free tier before writing to them?
 *
 * These are starting points, not commitments. Picking one fills the discovery
 * angles and the ICP draft; the operator still decides what to lock.
 */

import type { IcpKeywordBanks, StartupStage } from "@/lib/signal-room/types";

export interface IcpPreset {
  id: string;
  label: string;
  /** Which engagement this profile most often converts into. */
  offer: string;
  summary: string;
  statement: string;
  stages: StartupStage[];
  regions: string[];
  buyerRoles: string[];
  disqualifiers: string[];
  keywordBanks: IcpKeywordBanks;
  measurableWeakness: string;
  /** Search angles to run in parallel. Each hits a different signal surface. */
  angles: string[];
}

const COMMON_DISQUALIFIERS = [
  "Agencies and consultancies",
  "Consumer-only products",
  "No technical owner close to the work",
  "Lowest-price no-code automation buyers",
];

export const ICP_PRESETS: IcpPreset[] = [
  {
    id: "inference-readiness",
    label: "Inference readiness (quota, cost, latency)",
    offer: "Inference Readiness Review",
    summary:
      "Series B AI-native teams with a live production inference path, facing a quota, provider-concentration, cost, or latency decision in the next 90 days.",
    statement:
      "Series A to Series B AI-native startups running production inference at real volume, where GPU quota limits, single-provider concentration, inference cost per request, or tail latency is forcing a model, vendor, or architecture decision, and a CTO or Head of AI owns that decision.",
    stages: ["Series A", "Series B"],
    regions: ["Global, English-speaking markets"],
    buyerRoles: ["CTO", "Head of AI", "VP Engineering", "Head of Platform"],
    disqualifiers: [
      ...COMMON_DISQUALIFIERS,
      "Pre-PMF with no live production workload",
      "Still choosing a first model",
      "Inference fully abstracted by a vendor with no own infrastructure decisions",
    ],
    keywordBanks: {
      ai: ["inference", "gpu", "llm", "model", "serving", "vllm", "tokens", "throughput"],
      b2b: ["b2b", "enterprise", "platform", "api", "saas", "usage", "customers"],
      production: ["production", "scale", "volume", "traffic", "uptime", "sla", "rollout", "ga"],
      architecture: ["latency", "ttft", "cost", "quota", "fallback", "caching", "routing", "capacity"],
      urgency: ["series b", "series a", "raised", "funding", "scaling", "hiring", "growth", "announced"],
    },
    measurableWeakness:
      "Time to first token and end-to-end latency on the core AI action, measured across several runs on the free tier, plus whether repeated identical requests get faster.",
    angles: [
      "Series B AI startups publicly discussing GPU quota, inference cost, or model serving infrastructure",
      "AI startups hiring inference, model serving, vLLM, or GPU infrastructure engineers",
      "AI companies that published engineering posts or talks about latency, TTFT, or model routing in the last 90 days",
    ],
  },
  {
    id: "prototype-to-production",
    label: "Prototype stuck before production",
    offer: "AI Architecture Sprint",
    summary:
      "A working AI demo that customers want, blocked by evaluation, reliability, or latency before it can carry real load.",
    statement:
      "Seed to Series B B2B AI startups with a working AI feature in pilot or beta that must reach production reliability, where a founder or CTO owns the architecture and the next decision on evaluation, guardrails, latency, or cost is blocking rollout.",
    stages: ["Seed", "Series A", "Series B"],
    regions: ["Global, English-speaking markets"],
    buyerRoles: ["CTO", "Founding engineer", "VP Engineering", "Head of AI"],
    disqualifiers: COMMON_DISQUALIFIERS,
    keywordBanks: {
      ai: ["ai", "llm", "agent", "agentic", "rag", "inference", "model", "copilot"],
      b2b: ["b2b", "enterprise", "platform", "saas", "teams", "workflow", "api"],
      production: ["beta", "pilot", "production", "rollout", "scale", "ga", "launch", "customers"],
      architecture: ["evaluation", "eval", "reliability", "latency", "guardrails", "observability", "infrastructure", "accuracy"],
      urgency: ["raised", "funding", "seed", "series", "launch", "pilot", "hiring", "announced"],
    },
    measurableWeakness:
      "End-to-end latency, failure rate, or inconsistency of the core AI workflow, timed on the free tier.",
    angles: [
      "B2B AI startups that recently moved a product from beta to general availability",
      "AI startups publicly hiring evaluation, inference, or reliability engineers",
      "B2B AI companies announcing enterprise pilots or first enterprise customers",
    ],
  },
  {
    id: "agent-reliability",
    label: "Agents that break at scale",
    offer: "AI Architecture Sprint",
    summary:
      "Agent or multi-step AI products where correctness, tool use, and error recovery become the bottleneck as usage grows.",
    statement:
      "Seed to Series B startups shipping agentic or multi-step AI products to business customers, where tool-calling reliability, error recovery, evaluation coverage, or run cost is limiting how many customers they can serve.",
    stages: ["Seed", "Series A", "Series B"],
    regions: ["Global, English-speaking markets"],
    buyerRoles: ["CTO", "Head of AI", "Founding engineer", "VP Engineering"],
    disqualifiers: [...COMMON_DISQUALIFIERS, "Single-prompt wrappers with no workflow depth"],
    keywordBanks: {
      ai: ["agent", "agentic", "autonomous", "workflow", "orchestration", "llm", "tool use", "multi-step"],
      b2b: ["b2b", "enterprise", "platform", "teams", "operations", "saas", "api"],
      production: ["production", "scale", "reliability", "uptime", "customers", "rollout", "throughput"],
      architecture: ["evaluation", "observability", "tracing", "guardrails", "retries", "determinism", "infrastructure", "latency"],
      urgency: ["raised", "series", "seed", "launch", "hiring", "announced", "funding"],
    },
    measurableWeakness:
      "Agent run success rate, retry behaviour, or time to complete a multi-step task, observed over a few real runs.",
    angles: [
      "AI agent startups that raised funding and serve business customers",
      "startups building agent orchestration or workflow automation for enterprises",
      "AI companies hiring for agent evaluation, tracing, or observability",
    ],
  },
  {
    id: "rag-vertical",
    label: "Vertical AI in regulated buyers",
    offer: "AI Architecture Sprint",
    summary:
      "Industry-specific AI selling into finance, health, legal, or insurance, where auditability and accuracy gate the deal.",
    statement:
      "Seed to Series B vertical AI startups selling into regulated industries, where retrieval accuracy, auditability, data boundaries, or human review design is blocking larger contracts.",
    stages: ["Seed", "Series A", "Series B"],
    regions: ["Global, English-speaking markets"],
    buyerRoles: ["CTO", "Head of AI", "VP Engineering", "Founding engineer"],
    disqualifiers: [...COMMON_DISQUALIFIERS, "Horizontal chat products with no domain depth"],
    keywordBanks: {
      ai: ["rag", "retrieval", "llm", "ai", "document", "extraction", "copilot", "model"],
      b2b: ["enterprise", "b2b", "compliance", "healthcare", "legal", "financial", "insurance", "platform"],
      production: ["pilot", "production", "deployment", "customers", "rollout", "certification", "launch"],
      architecture: ["accuracy", "audit", "citation", "governance", "security", "evaluation", "privacy", "hallucination"],
      urgency: ["raised", "funding", "series", "seed", "pilot", "partnership", "announced", "hiring"],
    },
    measurableWeakness:
      "Answer accuracy, citation quality, or hallucination rate on a handful of domain questions you can check yourself.",
    angles: [
      "vertical AI startups selling to healthcare, legal, or financial services that raised recently",
      "B2B RAG or document AI startups announcing enterprise pilots in regulated industries",
      "AI startups hiring for compliance, security, or accuracy in regulated markets",
    ],
  },
  {
    id: "post-raise-scaling",
    label: "Just raised, team outgrowing founder context",
    offer: "AI Engineering Enablement",
    summary:
      "Fresh funding, engineers joining fast, and architecture decisions still living in one founder's head.",
    statement:
      "Seed to Series B AI startups that raised in the last few months and are hiring engineers quickly, where architecture standards, review practices, and AI decisions are still concentrated in one or two founders.",
    stages: ["Seed", "Series A", "Series B"],
    regions: ["Global, English-speaking markets"],
    buyerRoles: ["CTO", "Co-founder", "VP Engineering", "Head of Engineering"],
    disqualifiers: COMMON_DISQUALIFIERS,
    keywordBanks: {
      ai: ["ai", "llm", "agent", "model", "ml", "inference", "rag"],
      b2b: ["b2b", "enterprise", "platform", "saas", "teams", "api", "workflow"],
      production: ["scale", "growth", "customers", "production", "expand", "launch", "rollout"],
      architecture: ["architecture", "platform", "infrastructure", "standards", "governance", "observability", "evaluation"],
      urgency: ["raised", "funding", "series", "seed", "hiring", "team", "growing", "announced"],
    },
    measurableWeakness:
      "Onboarding friction or inconsistency across the product surface, observed while using it as a new user.",
    angles: [
      "AI startups that announced a seed or Series A round in the last three months and are hiring engineers",
      "B2B AI companies posting multiple senior or staff engineering roles",
      "AI startups that recently hired their first platform or infrastructure engineer",
    ],
  },
  {
    id: "cost-latency-pressure",
    label: "Inference cost or latency pressure",
    offer: "AI Direction Sprint",
    summary:
      "Products where model spend or response time is visibly hurting margin, UX, or the ability to add customers.",
    statement:
      "Seed to Series B B2B AI startups whose unit economics or user experience are constrained by inference cost, model latency, or inefficient pipelines, where a founder or CTO is weighing model, vendor, and architecture tradeoffs.",
    stages: ["Seed", "Series A", "Series B"],
    regions: ["Global, English-speaking markets"],
    buyerRoles: ["CTO", "Head of AI", "Founding engineer", "VP Engineering"],
    disqualifiers: COMMON_DISQUALIFIERS,
    keywordBanks: {
      ai: ["inference", "llm", "model", "ai", "gpu", "embedding", "fine-tuning", "agent"],
      b2b: ["b2b", "enterprise", "platform", "saas", "api", "teams", "usage"],
      production: ["scale", "production", "throughput", "customers", "volume", "rollout", "launch"],
      architecture: ["latency", "cost", "optimization", "caching", "infrastructure", "efficiency", "performance", "margin"],
      urgency: ["raised", "funding", "series", "seed", "growth", "scaling", "hiring", "announced"],
    },
    measurableWeakness:
      "Response time on the core AI action, and whether repeated identical requests get faster (cache) or not.",
    angles: [
      "B2B AI startups publicly discussing inference cost, GPU spend, or model efficiency",
      "AI startups whose product involves heavy document, video, or batch processing",
      "AI companies hiring inference, performance, or platform optimization engineers",
    ],
  },
];

export function getIcpPreset(id: string) {
  return ICP_PRESETS.find((preset) => preset.id === id) ?? null;
}
