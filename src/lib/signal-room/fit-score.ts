import type {
  DiscoveredCompany,
  DiscoveryFitAssessment,
  FitScoreDimension,
  IcpProfile,
  StartupStage,
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

/**
 * Fallback banks, used only when no ICP is locked. These reproduce the original
 * hardcoded behaviour so scores stay comparable with rows saved before ICP v1.
 */
const DEFAULT_BANKS = {
  ai: [
    "ai",
    "artificial intelligence",
    "agent",
    "agentic",
    "llm",
    "language model",
    "rag",
    "inference",
    "machine learning",
  ],
  b2b: [
    "b2b",
    "business",
    "companies",
    "enterprise",
    "operations",
    "platform",
    "saas",
    "teams",
    "workflow",
  ],
  production: [
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
  ],
  architecture: [
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
  ],
  urgency: [
    "announced",
    "funding",
    "hiring",
    "launch",
    "pilot",
    "raised",
    "recent",
    "series",
    "seed",
  ],
} as const;

const DEFAULT_STAGES: StartupStage[] = ["Seed", "Series A", "Series B"];

/**
 * Scores a candidate against the locked ICP. Passing no ICP falls back to the
 * original constants, so an unconfigured workspace behaves exactly as before.
 */
export function calculateDiscoveryFit(
  input: FitInput,
  icp?: IcpProfile | null
): DiscoveryFitAssessment {
  const banks = {
    ai: pickBank(icp?.keywordBanks.ai, DEFAULT_BANKS.ai),
    b2b: pickBank(icp?.keywordBanks.b2b, DEFAULT_BANKS.b2b),
    production: pickBank(icp?.keywordBanks.production, DEFAULT_BANKS.production),
    architecture: pickBank(icp?.keywordBanks.architecture, DEFAULT_BANKS.architecture),
    urgency: pickBank(icp?.keywordBanks.urgency, DEFAULT_BANKS.urgency),
  };
  const targetStages =
    icp?.stages && icp.stages.length > 0 ? icp.stages : DEFAULT_STAGES;

  const productText = `${input.oneLiner} ${input.whyItFits}`.toLowerCase();
  const signalText = `${productText} ${input.trigger}`.toLowerCase();

  const aiMatches = matchSignals(productText, banks.ai);
  const b2bMatches = matchSignals(productText, banks.b2b);
  const productionMatches = matchSignals(signalText, banks.production);
  const architectureMatches = matchSignals(signalText, banks.architecture);
  const urgencyMatches = matchSignals(input.trigger.toLowerCase(), banks.urgency);

  const stageScore = targetStages.includes(input.stage) ? 20 : 0;
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
          ? `${input.stage} is inside the ${targetStages.join(", ")} target.`
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

function pickBank(candidate: string[] | undefined, fallback: readonly string[]) {
  return candidate && candidate.length > 0 ? candidate : [...fallback];
}

function tieredScore(count: number, scores: [number, number, number, number]) {
  if (count >= 3) return scores[3];
  return scores[count];
}

/**
 * Detects ICP drift: accounts scored under a superseded ICP version are no
 * longer score-comparable with the active one.
 */
export function findIcpDrift<T extends { icpProfileId: string | null; stage: StartupStage }>(
  accounts: T[],
  icp: IcpProfile | null
) {
  if (!icp) return [] as { account: T; reason: string }[];
  return accounts.flatMap((account) => {
    if (account.icpProfileId !== icp.id) {
      return [
        {
          account,
          reason: account.icpProfileId
            ? `Sourced under an earlier ICP version, not v${icp.version}.`
            : `Sourced before ICP versioning; not comparable with v${icp.version}.`,
        },
      ];
    }
    if (icp.stages.length > 0 && !icp.stages.includes(account.stage)) {
      return [
        {
          account,
          reason: `Stage ${account.stage} is outside the locked ICP (${icp.stages.join(", ")}).`,
        },
      ];
    }
    return [];
  });
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