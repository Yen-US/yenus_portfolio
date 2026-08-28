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
  "Inference Readiness Review",
  "Inference Risk Snapshot",
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

export const POST_FORMATS_LIST = [
  "Recognition patterns",
  "Single argument",
  "Field note",
  "Contrarian correction",
] as const;

export const POST_PILLARS = [
  "Technical field note",
  "Startup strategy",
  "Operator story",
] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];
export type StartupStage = (typeof STARTUP_STAGES)[number];
export type PostStatus = (typeof POST_STATUSES)[number];
export type PostPillar = (typeof POST_PILLARS)[number];
export type PostFormat = (typeof POST_FORMATS_LIST)[number];
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
  /** Which hook the message is built on. Pattern mode has no measured number. */
  hookType?: "measured" | "pattern";
  selfCheck: {
    hasStrengths: boolean;
    singleWeakness: boolean;
    hypothesisHedged: boolean;
    usesOnlyFieldTestNumbers: boolean;
    notes: string[];
  };
}

/** A LinkedIn connection request note. Hard-capped by the platform at 300. */
export interface ConnectionNote {
  note: string;
  charCount: number;
  /** The specific public signal the note opens on, quoted for verification. */
  signalUsed: string;
  /** What the note deliberately leaves out so the reply has somewhere to go. */
  withheld: string;
}

/**
 * The first direct message after a connection request is accepted.
 *
 * Its only job is to earn a reply. Acceptance is permission to advance one
 * step, not to restart the pitch — so this must never re-explain the research
 * already in the connection note, and must ask for the reader's perspective
 * rather than their stack.
 */
export interface ConversationStarter {
  message: string;
  charCount: number;
  /** The single question being asked, isolated so it can be judged alone. */
  theQuestion: string;
  /** What the note already said, which this message must not repeat. */
  avoidedRepeating: string;
  /** The natural deeper probe to send only after they reply. */
  nextProbe: string;
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

export interface PostImagePrompt {
  concept: string;
  whyThisOne: string;
  prompt: string;
  alternate: string;
}

export interface PostArtifacts {
  /** Why the post is built the way it is — the argument for your own review. */
  rationale: string[];
  /** Pre-publish checks specific to this draft, not generic advice. */
  shipChecklist: string[];
  /** Two or three closing lines to choose between. */
  ctaVariants: string[];
  /** The single riskiest claim and how to defend it if challenged. */
  defenceNotes: string[];
  image: PostImagePrompt | null;
}

export interface PostCritique {
  /** Verdict from the adversarial pass, before revision. */
  weakestSection: string;
  cutCandidates: string[];
  unsupportedClaims: string[];
  revisionsApplied: string[];
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
  format: PostFormat;
  outline: string[];
  artifacts: PostArtifacts | null;
  critique: PostCritique | null;
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
  /**
   * How the website was determined:
   * - `cited`: the domain appeared in a search citation (strongest)
   * - `resolved`: guessed from the name, fetched, and the page named the company
   * - `none`: not determined
   */
  websiteConfidence?: "cited" | "resolved" | "none";
  /** Which search angles surfaced this company. More angles = stronger signal. */
  matchedAngles?: string[];
}
/* ------------------------------------------------------------------ *
 * Sales and content evidence ledger
 *
 * The workspace above knows who a target is and what was drafted. The
 * types below record what actually happened — and, just as importantly,
 * what we still do not know.
 * ------------------------------------------------------------------ */

export const SALES_EVENT_TYPES = [
  "prospect_researched",
  "field_test_logged",
  "connection_requested",
  "connection_accepted",
  "first_message_sent",
  "follow_up_sent",
  "reply_received",
  "reply_classified",
  "qualified",
  "disqualified",
  "call_booked",
  "call_completed",
  "proposal_sent",
  "opportunity_won",
  "opportunity_lost",
  "moved_to_nurture",
  "manual_note",
] as const;

/**
 * The canonical progression. Not a strict state machine: a warm introduction
 * can enter at `replied`, and inbound content can enter at `call_booked`.
 * Stage is derived from events rather than stored, so entering late is a
 * normal case rather than an inconsistency to repair.
 */
export const FUNNEL_STAGES = [
  "researched",
  "field_tested",
  "connection_requested",
  "connected",
  "first_message_sent",
  "follow_up_due",
  "follow_up_sent",
  "replied",
  "qualified",
  "disqualified",
  "call_booked",
  "call_completed",
  "proposal_sent",
  "won",
  "lost",
  "nurture",
] as const;

export const EVENT_SOURCES = ["manual", "import", "composio", "system-derived"] as const;
export const EVENT_ACTORS = ["yenson", "system"] as const;
export const TIME_PRECISIONS = ["exact", "approximate", "unknown"] as const;
export const CONTENT_TYPES = [
  "measured_test",
  "decision_framework",
  "operator_story",
  "offer",
] as const;
export const CTA_TYPES = ["question", "save", "discussion", "offer", "none"] as const;
export const METRIC_WINDOWS = ["24h", "7d", "30d", "custom"] as const;
export const METRIC_SOURCES = [
  "manual",
  "linkedin_export",
  "composio",
  "public_page",
] as const;
export const ATTRIBUTION_CONFIDENCE = ["explicit", "self_reported", "inferred"] as const;
export const CAPABILITY_STATES = [
  "available",
  "forbidden",
  "unsupported",
  "unknown",
] as const;
export const CONTENT_POST_STATUSES = [
  "draft",
  "approved",
  "published",
  "failed",
  "archived",
] as const;

export type SalesEventType = (typeof SALES_EVENT_TYPES)[number];
export type FunnelStage = (typeof FUNNEL_STAGES)[number];
export type EventSource = (typeof EVENT_SOURCES)[number];
export type EventActor = (typeof EVENT_ACTORS)[number];
export type TimePrecision = (typeof TIME_PRECISIONS)[number];
export type ContentType = (typeof CONTENT_TYPES)[number];
export type CtaType = (typeof CTA_TYPES)[number];
export type MetricWindow = (typeof METRIC_WINDOWS)[number];
export type MetricSource = (typeof METRIC_SOURCES)[number];
export type AttributionConfidence = (typeof ATTRIBUTION_CONFIDENCE)[number];
export type CapabilityState = (typeof CAPABILITY_STATES)[number];
export type ContentPostStatus = (typeof CONTENT_POST_STATUSES)[number];

export interface Contact {
  id: string;
  accountId: string;
  name: string;
  role: string;
  linkedinUrl: string;
  linkedinMemberId: string;
  relationship: "cold" | "warm" | "inbound" | "referral";
  createdAt: string;
  updatedAt: string;
}

export interface SalesEvent {
  id: string;
  accountId: string;
  contactId: string | null;
  type: SalesEventType;
  /** When it happened, to the best of our knowledge. */
  occurredAt: string;
  /**
   * When we found out. For a LinkedIn acceptance this is usually days later,
   * and conflating the two is how a reconciliation pass invents precision it
   * never had.
   */
  observedAt: string | null;
  occurredAtPrecision: TimePrecision;
  source: EventSource;
  actor: EventActor;
  variantId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface OutreachVariant {
  id: string;
  name: string;
  channel: string;
  structure: string;
  hypothesis: string;
  activeFrom: string | null;
  activeTo: string | null;
}

/**
 * What the funnel derivation concludes about one account. Every field here is
 * computed from events; nothing is read from a stored status column.
 */
export interface AccountFunnelState {
  accountId: string;
  stage: FunnelStage;
  lastOutboundAt: string | null;
  lastInboundAt: string | null;
  nextAction: string | null;
  nextActionDueAt: string | null;
  isOverdue: boolean;
  terminal: "won" | "lost" | "disqualified" | "nurture" | null;
}

export interface ContentPost {
  id: string;
  draftId: string | null;
  platform: string;
  url: string;
  platformUrn: string;
  status: ContentPostStatus;
  publishedAt: string | null;
  hook: string;
  topic: string;
  format: string;
  contentType: ContentType;
  ctaType: CtaType;
  offerMentioned: boolean;
  sourceAccountIds: string[];
  claimLedger: { claim: string; evidence: string; kind: string }[];
  critique: { assessment: string; strengths: string[]; weaknesses: string[] } | null;
  approvedContentHash: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * A reading of one post at one moment.
 *
 * Every metric is `number | null`. Null means the platform did not give us the
 * number — a 403, an endpoint that does not exist for personal accounts, a
 * screenshot that cut it off. Zero means we looked and it was zero. A UI that
 * renders null as 0 is reporting a failure as a fact.
 */
export interface ContentMetricSnapshot {
  id: string;
  postId: string;
  observedAt: string;
  window: MetricWindow;
  source: MetricSource;
  impressions: number | null;
  uniqueViews: number | null;
  reactions: number | null;
  comments: number | null;
  reposts: number | null;
  clicks: number | null;
  profileViews: number | null;
  follows: number | null;
  inboundMessages: number | null;
  callsAttributed: number | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttributionEvent {
  id: string;
  postId: string | null;
  accountId: string | null;
  contactId: string | null;
  type: "profile_view" | "follow" | "dm" | "call" | "opportunity";
  confidence: AttributionConfidence;
  evidenceNote: string;
  occurredAt: string;
}

export interface ProfileVersion {
  id: string;
  headline: string;
  about: string;
  featured: string[];
  hypothesis: string;
  notes: string;
  activatedAt: string | null;
  deactivatedAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderCapability {
  id: string;
  provider: string;
  capability: string;
  state: CapabilityState;
  detail: string;
  observedAt: string;
}

/** A rate that carries its own denominator, because a bare percentage lies. */
export interface FunnelRate {
  label: string;
  numerator: number;
  denominator: number;
  /** Null when the denominator is zero — not 0%, which would imply we measured. */
  rate: number | null;
  confidence: "insufficient" | "directional" | "early" | "reportable";
}
