export const ACCOUNT_STATUSES = [
  "watchlist",
  "researching",
  "ready",
  "contacted",
  "replied",
  "discovery",
  "archived",
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