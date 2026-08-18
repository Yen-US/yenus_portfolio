import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { demoWorkspace } from "@/lib/signal-room/demo-data";
import type {
  Account,
  CallRecord,
  ConversationMessage,
  HandsOnObservation,
  IcpProfile,
  PostDraft,
  ResearchSource,
  WorkspaceData,
} from "@/lib/signal-room/types";

type JsonRecord = Record<string, unknown>;

interface AccountRow {
  id: string;
  name: string;
  website: string;
  stage: Account["stage"];
  location: string;
  one_liner: string;
  status: Account["status"];
  fit_score: number;
  priority: Account["priority"];
  founder_names: string[];
  linkedin_url: string;
  notes: string;
  brief: Account["brief"];
  icp_profile_id: string | null;
  disqualified_reason: string | null;
  target_role: string | null;
  target_name: string | null;
  approx_users: string | null;
  mutual_fit: Account["mutualFit"] | null;
  ask_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

interface IcpRow {
  id: string;
  version: number;
  label: string;
  statement: string;
  is_active: boolean;
  stages: IcpProfile["stages"];
  regions: string[];
  buyer_roles: string[];
  disqualifiers: string[];
  keyword_banks: Partial<IcpProfile["keywordBanks"]>;
  measurable_weakness: string;
  locked_at: string | null;
  created_at: string;
}

interface ObservationRow {
  id: string;
  account_id: string;
  flow: string;
  metric: string;
  value: number | null;
  unit: string;
  tier: string;
  cost_usd: number;
  raw_note: string;
  is_weakness: boolean;
  observed_at: string;
}

interface MessageRow {
  id: string;
  account_id: string;
  direction: ConversationMessage["direction"];
  channel: string;
  body: string;
  analysis: ConversationMessage["analysis"];
  contained_ask: boolean;
  occurred_at: string;
}

interface CallRow {
  id: string;
  account_id: string;
  held_at: string | null;
  monthly_spend_usd: number | null;
  spend_basis: string;
  waste_pct: number | null;
  waste_basis: string;
  reclaim_intent: string;
  revenue_now_usd: number | null;
  revenue_target_usd: number | null;
  cost_of_delay: string;
  notes: string;
  offer: string;
  price_usd: number | null;
  upfront_usd: number | null;
  plan: CallRecord["plan"];
  outcome: CallRecord["outcome"];
  created_at: string;
  updated_at: string;
}

interface SourceRow {
  id: string;
  account_id: string;
  url: string;
  title: string;
  source_type: string;
  excerpt: string;
  content: string;
  published_at: string | null;
  captured_at: string;
}

interface PostRow {
  id: string;
  title: string;
  pillar: PostDraft["pillar"];
  status: PostDraft["status"];
  hook: string;
  draft: string;
  takeaway: string;
  account_ids: string[];
  evidence: PostDraft["evidence"];
  quality: PostDraft["quality"];
  format: PostDraft["format"] | null;
  outline: string[] | null;
  artifacts: PostDraft["artifacts"];
  critique: PostDraft["critique"];
  created_at: string;
  updated_at: string;
}

let supabaseAdmin: SupabaseClient | null | undefined;

export function isSignalRoomConfigured() {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function getSupabaseAdmin() {
  if (supabaseAdmin !== undefined) {
    return supabaseAdmin;
  }

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    supabaseAdmin = null;
    return null;
  }

  supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return supabaseAdmin;
}

export async function getWorkspaceData(): Promise<WorkspaceData> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return demoWorkspace;
  }

  const [
    accountsResult,
    sourcesResult,
    postsResult,
    icpResult,
    observationsResult,
    messagesResult,
    callsResult,
  ] = await Promise.all([
    supabase.from("signal_accounts").select("*").order("updated_at", { ascending: false }),
    supabase.from("signal_sources").select("*").order("captured_at", { ascending: false }),
    supabase.from("signal_posts").select("*").order("updated_at", { ascending: false }),
    supabase.from("signal_icp_profiles").select("*").eq("is_active", true).maybeSingle(),
    supabase.from("signal_observations").select("*").order("observed_at", { ascending: false }),
    supabase.from("signal_messages").select("*").order("occurred_at", { ascending: true }),
    supabase.from("signal_calls").select("*").order("updated_at", { ascending: false }),
  ]);

  const failure =
    accountsResult.error ??
    sourcesResult.error ??
    postsResult.error ??
    icpResult.error ??
    observationsResult.error ??
    messagesResult.error ??
    callsResult.error;
  if (failure) {
    throw new Error(failure.message);
  }

  const sourcesByAccount = groupBy(
    (sourcesResult.data as SourceRow[]).map(mapSourceRow),
    (source) => source.accountId
  );
  const observationsByAccount = groupBy(
    (observationsResult.data as ObservationRow[]).map(mapObservationRow),
    (observation) => observation.accountId
  );
  const messagesByAccount = groupBy(
    (messagesResult.data as MessageRow[]).map(mapMessageRow),
    (message) => message.accountId
  );
  const callByAccount = new Map(
    (callsResult.data as CallRow[]).map((row) => [row.account_id, mapCallRow(row)])
  );

  return {
    mode: "supabase",
    icp: icpResult.data ? mapIcpRow(icpResult.data as IcpRow) : null,
    accounts: (accountsResult.data as AccountRow[]).map((row) =>
      mapAccountRow(row, {
        sources: sourcesByAccount.get(row.id) ?? [],
        observations: observationsByAccount.get(row.id) ?? [],
        messages: messagesByAccount.get(row.id) ?? [],
        call: callByAccount.get(row.id) ?? null,
      })
    ),
    posts: (postsResult.data as PostRow[]).map(mapPostRow),
  };
}

function groupBy<T>(items: T[], keyOf: (item: T) => string) {
  const grouped = new Map<string, T[]>();
  for (const item of items) {
    const key = keyOf(item);
    const bucket = grouped.get(key);
    if (bucket) bucket.push(item);
    else grouped.set(key, [item]);
  }
  return grouped;
}

export async function createAccount(
  input: Omit<
    Account,
    | "id"
    | "sources"
    | "observations"
    | "messages"
    | "call"
    | "createdAt"
    | "updatedAt"
  >
) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("signal_accounts")
    .insert(toAccountRow(input))
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapAccountRow(data as AccountRow, {
    sources: [],
    observations: [],
    messages: [],
    call: null,
  });
}

export async function updateAccount(id: string, input: Partial<Account>) {
  const supabase = requireSupabase();
  const row: JsonRecord = { updated_at: new Date().toISOString() };

  if (input.name !== undefined) row.name = input.name;
  if (input.website !== undefined) row.website = input.website;
  if (input.stage !== undefined) row.stage = input.stage;
  if (input.location !== undefined) row.location = input.location;
  if (input.oneLiner !== undefined) row.one_liner = input.oneLiner;
  if (input.status !== undefined) row.status = input.status;
  if (input.fitScore !== undefined) row.fit_score = input.fitScore;
  if (input.priority !== undefined) row.priority = input.priority;
  if (input.founderNames !== undefined) row.founder_names = input.founderNames;
  if (input.linkedinUrl !== undefined) row.linkedin_url = input.linkedinUrl;
  if (input.notes !== undefined) row.notes = input.notes;
  if (input.brief !== undefined) row.brief = input.brief;
  if (input.icpProfileId !== undefined) row.icp_profile_id = input.icpProfileId;
  if (input.disqualifiedReason !== undefined) row.disqualified_reason = input.disqualifiedReason;
  if (input.targetRole !== undefined) row.target_role = input.targetRole;
  if (input.targetName !== undefined) row.target_name = input.targetName;
  if (input.approxUsers !== undefined) row.approx_users = input.approxUsers;
  if (input.mutualFit !== undefined) row.mutual_fit = input.mutualFit;
  if (input.askSentAt !== undefined) row.ask_sent_at = input.askSentAt;

  const { data, error } = await supabase
    .from("signal_accounts")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapAccountRow(data as AccountRow, {
    sources: input.sources ?? [],
    observations: input.observations ?? [],
    messages: input.messages ?? [],
    call: input.call ?? null,
  });
}

export async function deleteAccount(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("signal_accounts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function replaceAccountSources(
  accountId: string,
  sources: Omit<ResearchSource, "id" | "accountId">[]
) {
  const supabase = requireSupabase();
  const { error: deleteError } = await supabase
    .from("signal_sources")
    .delete()
    .eq("account_id", accountId);
  if (deleteError) throw new Error(deleteError.message);

  if (sources.length === 0) return [];

  const { data, error } = await supabase
    .from("signal_sources")
    .insert(
      sources.map((source) => ({
        account_id: accountId,
        url: source.url,
        title: source.title,
        source_type: source.sourceType,
        excerpt: source.excerpt,
        content: source.content,
        published_at: source.publishedAt,
        captured_at: source.capturedAt,
      }))
    )
    .select("*");

  if (error) throw new Error(error.message);
  return (data as SourceRow[]).map(mapSourceRow);
}

export async function createPost(
  input: Omit<PostDraft, "id" | "createdAt" | "updatedAt">
) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("signal_posts")
    .insert(toPostRow(input))
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapPostRow(data as PostRow);
}

export async function updatePost(id: string, input: Partial<PostDraft>) {
  const supabase = requireSupabase();
  const row: JsonRecord = { updated_at: new Date().toISOString() };
  if (input.title !== undefined) row.title = input.title;
  if (input.pillar !== undefined) row.pillar = input.pillar;
  if (input.status !== undefined) row.status = input.status;
  if (input.hook !== undefined) row.hook = input.hook;
  if (input.draft !== undefined) row.draft = input.draft;
  if (input.takeaway !== undefined) row.takeaway = input.takeaway;
  if (input.accountIds !== undefined) row.account_ids = input.accountIds;
  if (input.evidence !== undefined) row.evidence = input.evidence;
  if (input.quality !== undefined) row.quality = input.quality;
  if (input.format !== undefined) row.format = input.format;
  if (input.outline !== undefined) row.outline = input.outline;
  if (input.artifacts !== undefined) row.artifacts = input.artifacts;
  if (input.critique !== undefined) row.critique = input.critique;

  const { data, error } = await supabase
    .from("signal_posts")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapPostRow(data as PostRow);
}

export async function deletePost(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("signal_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

function requireSupabase() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase is not configured for Signal Room.");
  }
  return supabase;
}

function toAccountRow(
  input: Omit<
    Account,
    | "id"
    | "sources"
    | "observations"
    | "messages"
    | "call"
    | "createdAt"
    | "updatedAt"
  >
) {
  return {
    name: input.name,
    website: input.website,
    stage: input.stage,
    location: input.location,
    one_liner: input.oneLiner,
    status: input.status,
    fit_score: input.fitScore,
    priority: input.priority,
    founder_names: input.founderNames,
    linkedin_url: input.linkedinUrl,
    notes: input.notes,
    brief: input.brief,
    icp_profile_id: input.icpProfileId,
    disqualified_reason: input.disqualifiedReason,
    target_role: input.targetRole,
    target_name: input.targetName,
    approx_users: input.approxUsers,
    mutual_fit: input.mutualFit,
  };
}

function toPostRow(
  input: Omit<PostDraft, "id" | "createdAt" | "updatedAt">
) {
  return {
    title: input.title,
    pillar: input.pillar,
    status: input.status,
    hook: input.hook,
    draft: input.draft,
    takeaway: input.takeaway,
    account_ids: input.accountIds,
    evidence: input.evidence,
    quality: input.quality,
    format: input.format,
    outline: input.outline,
    artifacts: input.artifacts,
    critique: input.critique,
  };
}

function mapAccountRow(
  row: AccountRow,
  related: {
    sources: ResearchSource[];
    observations: HandsOnObservation[];
    messages: ConversationMessage[];
    call: CallRecord | null;
  }
): Account {
  return {
    id: row.id,
    name: row.name,
    website: row.website,
    stage: row.stage,
    location: row.location,
    oneLiner: row.one_liner,
    status: row.status,
    fitScore: row.fit_score,
    priority: row.priority,
    founderNames: row.founder_names ?? [],
    linkedinUrl: row.linkedin_url,
    notes: row.notes,
    brief: row.brief,
    sources: related.sources,
    icpProfileId: row.icp_profile_id ?? null,
    disqualifiedReason: row.disqualified_reason ?? "",
    targetRole: row.target_role ?? "",
    targetName: row.target_name ?? "",
    approxUsers: row.approx_users ?? "",
    mutualFit: row.mutual_fit ?? "unknown",
    askSentAt: row.ask_sent_at ?? null,
    observations: related.observations,
    messages: related.messages,
    call: related.call,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapIcpRow(row: IcpRow): IcpProfile {
  const banks = row.keyword_banks ?? {};
  return {
    id: row.id,
    version: row.version,
    label: row.label,
    statement: row.statement,
    isActive: row.is_active,
    stages: row.stages ?? [],
    regions: row.regions ?? [],
    buyerRoles: row.buyer_roles ?? [],
    disqualifiers: row.disqualifiers ?? [],
    keywordBanks: {
      ai: banks.ai ?? [],
      b2b: banks.b2b ?? [],
      production: banks.production ?? [],
      architecture: banks.architecture ?? [],
      urgency: banks.urgency ?? [],
    },
    measurableWeakness: row.measurable_weakness ?? "",
    lockedAt: row.locked_at,
    createdAt: row.created_at,
  };
}

function mapObservationRow(row: ObservationRow): HandsOnObservation {
  return {
    id: row.id,
    accountId: row.account_id,
    flow: row.flow,
    metric: row.metric,
    value: row.value === null ? null : Number(row.value),
    unit: row.unit,
    tier: row.tier,
    costUsd: Number(row.cost_usd ?? 0),
    rawNote: row.raw_note,
    isWeakness: row.is_weakness,
    observedAt: row.observed_at,
  };
}

function mapMessageRow(row: MessageRow): ConversationMessage {
  return {
    id: row.id,
    accountId: row.account_id,
    direction: row.direction,
    channel: row.channel,
    body: row.body,
    analysis: row.analysis,
    containedAsk: row.contained_ask,
    occurredAt: row.occurred_at,
  };
}

function mapCallRow(row: CallRow): CallRecord {
  return {
    id: row.id,
    accountId: row.account_id,
    heldAt: row.held_at,
    monthlySpendUsd: row.monthly_spend_usd === null ? null : Number(row.monthly_spend_usd),
    spendBasis: row.spend_basis,
    wastePct: row.waste_pct,
    wasteBasis: row.waste_basis,
    reclaimIntent: row.reclaim_intent,
    revenueNowUsd: row.revenue_now_usd === null ? null : Number(row.revenue_now_usd),
    revenueTargetUsd: row.revenue_target_usd === null ? null : Number(row.revenue_target_usd),
    costOfDelay: row.cost_of_delay,
    notes: row.notes,
    offer: row.offer,
    priceUsd: row.price_usd === null ? null : Number(row.price_usd),
    upfrontUsd: row.upfront_usd === null ? null : Number(row.upfront_usd),
    plan: row.plan,
    outcome: row.outcome,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// --- ICP ------------------------------------------------------------------

export async function getActiveIcp(): Promise<IcpProfile | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return demoWorkspace.icp;
  const { data, error } = await supabase
    .from("signal_icp_profiles")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapIcpRow(data as IcpRow) : null;
}

export async function listIcpProfiles(): Promise<IcpProfile[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("signal_icp_profiles")
    .select("*")
    .order("version", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as IcpRow[]).map(mapIcpRow);
}

export async function createIcpProfile(
  input: Omit<IcpProfile, "id" | "version" | "isActive" | "lockedAt" | "createdAt">
): Promise<IcpProfile> {
  const supabase = requireSupabase();
  const { data: latest } = await supabase
    .from("signal_icp_profiles")
    .select("version")
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = ((latest as { version: number } | null)?.version ?? 0) + 1;
  const { data, error } = await supabase
    .from("signal_icp_profiles")
    .insert({
      version: nextVersion,
      label: input.label,
      statement: input.statement,
      stages: input.stages,
      regions: input.regions,
      buyer_roles: input.buyerRoles,
      disqualifiers: input.disqualifiers,
      keyword_banks: input.keywordBanks,
      measurable_weakness: input.measurableWeakness,
      is_active: false,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapIcpRow(data as IcpRow);
}

/** Locking is exclusive: the previous active profile is deactivated first. */
export async function lockIcpProfile(id: string): Promise<IcpProfile> {
  const supabase = requireSupabase();
  const { error: clearError } = await supabase
    .from("signal_icp_profiles")
    .update({ is_active: false })
    .eq("is_active", true);
  if (clearError) throw new Error(clearError.message);

  const { data, error } = await supabase
    .from("signal_icp_profiles")
    .update({ is_active: true, locked_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapIcpRow(data as IcpRow);
}

// --- Observations ---------------------------------------------------------

export async function createObservation(
  input: Omit<HandsOnObservation, "id">
): Promise<HandsOnObservation> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("signal_observations")
    .insert({
      account_id: input.accountId,
      flow: input.flow,
      metric: input.metric,
      value: input.value,
      unit: input.unit,
      tier: input.tier,
      cost_usd: input.costUsd,
      raw_note: input.rawNote,
      is_weakness: input.isWeakness,
      observed_at: input.observedAt,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapObservationRow(data as ObservationRow);
}

export async function deleteObservation(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("signal_observations").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// --- Messages -------------------------------------------------------------

export async function createMessage(
  input: Omit<ConversationMessage, "id">
): Promise<ConversationMessage> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("signal_messages")
    .insert({
      account_id: input.accountId,
      direction: input.direction,
      channel: input.channel,
      body: input.body,
      analysis: input.analysis,
      contained_ask: input.containedAsk,
      occurred_at: input.occurredAt,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapMessageRow(data as MessageRow);
}

export async function deleteMessage(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("signal_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// --- Calls ----------------------------------------------------------------

export async function upsertCall(
  accountId: string,
  input: Partial<CallRecord>
): Promise<CallRecord> {
  const supabase = requireSupabase();
  const row: JsonRecord = { account_id: accountId, updated_at: new Date().toISOString() };
  if (input.heldAt !== undefined) row.held_at = input.heldAt;
  if (input.monthlySpendUsd !== undefined) row.monthly_spend_usd = input.monthlySpendUsd;
  if (input.spendBasis !== undefined) row.spend_basis = input.spendBasis;
  if (input.wastePct !== undefined) row.waste_pct = input.wastePct;
  if (input.wasteBasis !== undefined) row.waste_basis = input.wasteBasis;
  if (input.reclaimIntent !== undefined) row.reclaim_intent = input.reclaimIntent;
  if (input.revenueNowUsd !== undefined) row.revenue_now_usd = input.revenueNowUsd;
  if (input.revenueTargetUsd !== undefined) row.revenue_target_usd = input.revenueTargetUsd;
  if (input.costOfDelay !== undefined) row.cost_of_delay = input.costOfDelay;
  if (input.notes !== undefined) row.notes = input.notes;
  if (input.offer !== undefined) row.offer = input.offer;
  if (input.priceUsd !== undefined) row.price_usd = input.priceUsd;
  if (input.upfrontUsd !== undefined) row.upfront_usd = input.upfrontUsd;
  if (input.plan !== undefined) row.plan = input.plan;
  if (input.outcome !== undefined) row.outcome = input.outcome;

  const existing = await supabase
    .from("signal_calls")
    .select("id")
    .eq("account_id", accountId)
    .maybeSingle();

  const query = existing.data
    ? supabase.from("signal_calls").update(row).eq("id", (existing.data as { id: string }).id)
    : supabase.from("signal_calls").insert(row);

  const { data, error } = await query.select("*").single();
  if (error) throw new Error(error.message);
  return mapCallRow(data as CallRow);
}

function mapSourceRow(row: SourceRow): ResearchSource {
  return {
    id: row.id,
    accountId: row.account_id,
    url: row.url,
    title: row.title,
    sourceType: row.source_type,
    excerpt: row.excerpt,
    content: row.content,
    publishedAt: row.published_at,
    capturedAt: row.captured_at,
  };
}

function mapPostRow(row: PostRow): PostDraft {
  return {
    id: row.id,
    title: row.title,
    pillar: row.pillar,
    status: row.status,
    hook: row.hook,
    draft: row.draft,
    takeaway: row.takeaway,
    accountIds: row.account_ids ?? [],
    evidence: row.evidence ?? [],
    quality: row.quality,
    format: row.format ?? "Recognition patterns",
    outline: row.outline ?? [],
    artifacts: row.artifacts ?? null,
    critique: row.critique ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}