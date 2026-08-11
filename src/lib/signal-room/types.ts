export const ACCOUNT_STATUSES = [
  "watchlist",
  "researching",
  "ready",
  "contacted",
  "replied",
  "discovery",
  "proposal",
  "won",
  "lost",
  "archived",
] as const;

export const MUTUAL_FIT_VALUES = ["unknown", "good", "tolerable", "no"] as const;

export const CALL_OUTCOMES = [
  "held",
  "proposal_sent",
  "won",
  "lost",
  "disqualified",
] as const;

export const REPLY_INTENTS = [
  "corrected_you",
  "curious",
  "asked_a_question",
  "wants_call",
  "dismissive",
  "not_interested",
] as const;

export const OFFER_NAMES = [
  "AI Direction Sprint",
  "AI Architecture Sprint",
  "AI Team Enablement",
  "Fractional AI Architect",
] as const;

export const STARTUP_STAGES = [
  "Seed",
  "Series A",
  "Series B",
  "Unknown",
] as const;

export const POST_STATUSES = ["idea", "draft", "ready", "published"] as const;

export const POST_PILLARS = [
  "Technical field note",
  "Startup strategy",
  "Operator story",
] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];
export type StartupStage = (typeof STARTUP_STAGES)[number];
export type PostStatus = (typeof POST_STATUSES)[number];
export type PostPillar = (typeof POST_PILLARS)[number];
export type MutualFit = (typeof MUTUAL_FIT_VALUES)[number];
export type CallOutcome = (typeof CALL_OUTCOMES)[number];
export type ReplyIntent = (typeof REPLY_INTENTS)[number];
export type OfferName = (typeof OFFER_NAMES)[number];

export interface EvidenceItem {
  claim: string;
  sourceUrl: string;
  sourceTitle: string;
  observedAt: string;
}

export interface ResearchSource {
  id: string;
  accountId: string;
  url: string;
  title: string;
  sourceType: string;
  excerpt: string;
  content: string;
  publishedAt: string | null;
  capturedAt: string;
}

export interface ArchitectureHypothesis {
  hypothesis: string;
  evidence: string;
  questionToValidate: string;
  observationRef?: string;
}

/** Keyword banks that drive four of the five fit-score dimensions. */
export interface IcpKeywordBanks {
  ai: string[];
  b2b: string[];
  production: string[];
  architecture: string[];
  urgency: string[];
}

export interface IcpProfile {
  id: string;
  version: number;
  label: string;
  statement: string;
  isActive: boolean;
  stages: StartupStage[];
  regions: string[];
  buyerRoles: string[];
  disqualifiers: string[];
  keywordBanks: IcpKeywordBanks;
  measurableWeakness: string;
  lockedAt: string | null;
  createdAt: string;
}

/** A measurement taken by personally using the prospect's product. */
export interface HandsOnObservation {
  id: string;
  accountId: string;
  flow: string;
  metric: string;
  value: number | null;
  unit: string;
  tier: string;
  costUsd: number;
  rawNote: string;
  isWeakness: boolean;
  observedAt: string;
}

export interface TestPlanStep {
  whatToDo: string;
  whatToMeasure: string;
  whyItMatters: string;
  expectedRange: string;
}

export interface TestPlan {
  signupPath: string;
  tierNote: string;
  tests: TestPlanStep[];
  doNotDo: string[];
}

export interface CorrectionOpener {
  greeting: string;
  strengths: string[];
  weakness: string;
  hypothesis: string;
  scalingQuestion: string;
  fullMessage: string;
  selfCheck: {
    hasStrengths: boolean;
    singleWeakness: boolean;
    hypothesisHedged: boolean;
    usesOnlyFieldTestNumbers: boolean;
    notes: string[];
  };
}

export interface HypothesisVerdict {
  hypothesis: string;
  verdict: "confirmed" | "refuted" | "open";
  evidenceQuote: string;
}

export interface ExtractedNumber {
  label: string;
  value: string;
  quote: string;
}

export interface ReplyAnalysis {
  intent: ReplyIntent;
  correctionQuote: string;
  hypothesisUpdates: HypothesisVerdict[];
  extractedNumbers: ExtractedNumber[];
  egoRisk: "none" | "mild" | "high";
  suggestedNextQuestion: string;
  askReadiness: "not_yet" | "soon" | "ask_now";
  askRationale: string;
  draftResponse: string;
}

export interface ConversationMessage {
  id: string;
  accountId: string;
  direction: "sent" | "received";
  channel: string;
  body: string;
  analysis: ReplyAnalysis | null;
  containedAsk: boolean;
  occurredAt: string;
}

export interface CostMathQuestion {
  question: string;
  fills:
    | "monthlySpend"
    | "wastePct"
    | "reclaimIntent"
    | "revenueDelta"
    | "costOfDelay";
  anchoredTo: string;
}

export interface PlanMilestone {
  day: 30 | 60 | 90;
  outcome: string;
  evidence: string;
}

export interface NinetyDayPlan {
  milestones: PlanMilestone[];
  assumptions: string[];
  outOfScope: string[];
}

export interface CallRecord {
  id: string;
  accountId: string;
  heldAt: string | null;
  monthlySpendUsd: number | null;
  spendBasis: string;
  wastePct: number | null;
  wasteBasis: string;
  reclaimIntent: string;
  revenueNowUsd: number | null;
  revenueTargetUsd: number | null;
  costOfDelay: string;
  notes: string;
  offer: string;
  priceUsd: number | null;
  upfrontUsd: number | null;
  plan: NinetyDayPlan | null;
  outcome: CallOutcome;
  createdAt: string;
  updatedAt: string;
}

export interface OutreachPack {
  openingLines: string[];
  shortMessage: string;
  loomOutline: string[];
  discoveryQuestions: string[];
}

export interface ResearchBrief {
  summary: string;
  whyNow: string;
  productMotion: string;
  aiMaturity: string;
  likelyPriorities: string[];
  evidence: EvidenceItem[];
  architectureHypotheses: ArchitectureHypothesis[];
  uncertainties: string[];
  outreach: OutreachPack;
}

export interface Account {
  id: string;
  name: string;
  website: string;
  stage: StartupStage;
  location: string;
  oneLiner: string;
  status: AccountStatus;
  fitScore: number;
  priority: "high" | "medium" | "low";
  founderNames: string[];
  linkedinUrl: string;
  notes: string;
  brief: ResearchBrief | null;
  sources: ResearchSource[];
  icpProfileId: string | null;
  disqualifiedReason: string;
  targetRole: string;
  targetName: string;
  approxUsers: string;
  mutualFit: MutualFit;
  askSentAt: string | null;
  observations: HandsOnObservation[];
  messages: ConversationMessage[];
  call: CallRecord | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostEvidence {
  claim: string;
  sourceUrl: string;
  sourceTitle: string;
}

export interface PostQuality {
  specificity: number;
  practicalValue: number;
  credibility: number;
  readability: number;
  notes: string[];
}

export interface PostDraft {
  id: string;
  title: string;
  pillar: PostPillar;
  status: PostStatus;
  hook: string;
  draft: string;
  takeaway: string;
  accountIds: string[];
  evidence: PostEvidence[];
  quality: PostQuality | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceData {
  mode: "supabase" | "demo";
  accounts: Account[];
  posts: PostDraft[];
  icp: IcpProfile | null;
}

export interface FitScoreDimension {
  id: "stage" | "centrality" | "production" | "architecture" | "urgency";
  label: string;
  score: number;
  maxScore: number;
  reason: string;
}

export interface DiscoveryFitAssessment {
  fitScore: number;
  fitConfidence: "low" | "medium" | "high";
  fitBreakdown: FitScoreDimension[];
}

export interface DiscoveredCompany extends DiscoveryFitAssessment {
  name: string;
  website: string;
  stage: StartupStage;
  location: string;
  oneLiner: string;
  whyItFits: string;
  trigger: string;
  sourceUrls: string[];
}