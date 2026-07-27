import type {
  DiscoveredCompany,
  DiscoveryFitAssessment,
  FitScoreDimension,
} from "@/lib/signal-room/types";

type FitInput = Pick<
  DiscoveredCompany,
  | "stage"
  | "oneLiner"
  | "whyItFits"
  | "trigger"
  | "website"
  | "sourceUrls"
>;

const AI_SIGNALS = [
  "ai",
  "artificial intelligence",
  "agent",
  "agentic",
  "llm",
  "language model",
  "rag",
  "inference",
  "machine learning",
];

const B2B_SIGNALS = [
  "b2b",
  "business",
  "companies",
  "enterprise",
  "operations",
  "platform",
  "saas",
  "teams",
  "workflow",
];

const PRODUCTION_SIGNALS = [
  "beta",
  "customer",
  "deploy",
  "enterprise pilot",
  "go live",
  "integration",
  "launch",
  "production",
  "rollout",
  "scale",
];

const ARCHITECTURE_SIGNALS = [
  "agent",
  "audit",
  "data",
  "evaluation",
  "governance",
  "infrastructure",
  "integration",
  "latency",
  "platform",
  "rag",
  "reliability",
  "security",
  "scale",
];

const URGENCY_SIGNALS = [
  "announced",
  "funding",
  "hiring",
  "launch",
  "pilot",
  "raised",
  "recent",
  "series",
  "seed",
];

export function calculateDiscoveryFit(input: FitInput): DiscoveryFitAssessment {
  const productText = `${input.oneLiner} ${input.whyItFits}`.toLowerCase();
  const signalText = `${productText} ${input.trigger}`.toLowerCase();

  const aiMatches = matchSignals(productText, AI_SIGNALS);
  const b2bMatches = matchSignals(productText, B2B_SIGNALS);
  const productionMatches = matchSignals(signalText, PRODUCTION_SIGNALS);
  const architectureMatches = matchSignals(signalText, ARCHITECTURE_SIGNALS);
  const urgencyMatches = matchSignals(input.trigger.toLowerCase(), URGENCY_SIGNALS);

  const stageScore = ["Seed", "Series A", "Series B"].includes(input.stage)
    ? 20
    : 0;
  const centralityScore =
    aiMatches.length > 0 && b2bMatches.length > 0
      ? 20
      : aiMatches.length > 0
        ? 12
        : b2bMatches.length > 0
          ? 6
          : 0;
  const productionScore = tieredScore(productionMatches.length, [0, 12, 20, 25]);
  const architectureScore = tieredScore(architectureMatches.length, [0, 10, 16, 20]);
  const urgencyScore = tieredScore(urgencyMatches.length, [0, 10, 15, 15]);

  const fitBreakdown: FitScoreDimension[] = [
    {
      id: "stage",
      label: "ICP stage",
      score: stageScore,
      maxScore: 20,
      reason:
        stageScore > 0
          ? `${input.stage} is inside the Seed-Series B target.`
          : "Funding stage is outside the target or unverified.",
    },
    {
      id: "centrality",
      label: "B2B AI centrality",
      score: centralityScore,
      maxScore: 20,
      reason: describeMatches(aiMatches, b2bMatches),
    },
    {
      id: "production",
      label: "Production transition",
      score: productionScore,
      maxScore: 25,
      reason: describeSignalSet(productionMatches, "No clear production-transition signal."),
    },
    {
      id: "architecture",
      label: "Architecture alignment",
      score: architectureScore,
      maxScore: 20,
      reason: describeSignalSet(architectureMatches, "No explicit architecture-need signal."),
    },
    {
      id: "urgency",
      label: "Urgency trigger",
      score: urgencyScore,
      maxScore: 15,
      reason: describeSignalSet(urgencyMatches, "No recent urgency signal identified."),
    },
  ];

  const fitScore = fitBreakdown.reduce(
    (total, dimension) => total + dimension.score,
    0
  );

  return {
    fitScore,
    fitConfidence: getEvidenceConfidence(input),
    fitBreakdown,
  };
}

function tieredScore(count: number, scores: [number, number, number, number]) {
  if (count >= 3) return scores[3];
  return scores[count];
}

function matchSignals(text: string, signals: string[]) {
  return signals.filter((signal) =>
    new RegExp(`\\b${escapeRegExp(signal).replace(/\\ /g, "\\s+")}\\b`, "i").test(
      text
    )
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function describeMatches(aiMatches: string[], b2bMatches: string[]) {
  if (aiMatches.length === 0 && b2bMatches.length === 0) {
    return "Neither AI centrality nor an organizational buyer is explicit.";
  }
  if (aiMatches.length === 0) {
    return `Organizational buyer signals: ${b2bMatches.slice(0, 3).join(", ")}; AI centrality is unclear.`;
  }
  if (b2bMatches.length === 0) {
    return `AI signals: ${aiMatches.slice(0, 3).join(", ")}; B2B buyer fit is unclear.`;
  }
  return `AI: ${aiMatches.slice(0, 2).join(", ")}; B2B: ${b2bMatches.slice(0, 2).join(", ")}.`;
}

function describeSignalSet(matches: string[], fallback: string) {
  return matches.length > 0
    ? `Matched: ${matches.slice(0, 4).join(", ")}.`
    : fallback;
}

function getEvidenceConfidence(input: FitInput) {
  if (input.website && input.sourceUrls.length >= 2) return "high" as const;
  if (input.website || input.sourceUrls.length >= 2) return "medium" as const;
  return "low" as const;
}