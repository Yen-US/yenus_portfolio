import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { buildDedupeKey } from "@/lib/signal-room/funnel";
import type {
  AttributionEvent,
  Contact,
  ContentMetricSnapshot,
  ContentPost,
  OutreachVariant,
  ProfileVersion,
  ProviderCapability,
  SalesEvent,
} from "@/lib/signal-room/types";

/**
 * Persistence for the sales and content ledger.
 *
 * Separate from `store.ts` deliberately: that module loads the whole workspace
 * on every Signal Room render, and the ledger is queried by different views on
 * different cadences. Bolting it on would make the main page pay for data it
 * does not show.
 *
 * The tables this reads may not exist yet — the migration is applied by hand.
 * Every list function therefore degrades to an empty array rather than
 * throwing, so an un-migrated deployment renders an empty queue instead of a
 * crashed workspace.
 */

let client: SupabaseClient | null | undefined;

function getClient() {
  if (client !== undefined) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client = url && key
    ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;
  return client;
}

function requireClient() {
  const supabase = getClient();
  if (!supabase) throw new Error("Supabase is not configured for Signal Room.");
  return supabase;
}

/**
 * Detect the un-migrated case.
 *
 * PostgREST does not surface Postgres' 42P01 here — it answers from its own
 * schema cache with PGRST205 and a "Could not find the table" message, so
 * matching only on the Postgres code silently misses the exact situation this
 * guard exists for: a deploy that has shipped ahead of its migration.
 */
const MISSING_TABLE_CODES = new Set(["42P01", "PGRST205", "PGRST202"]);

function isMissingTable(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  if (error.code && MISSING_TABLE_CODES.has(error.code)) return true;
  return /could not find the table|does not exist/i.test(error.message ?? "");
}

/* ---------------------------------------------------------------- *
 * Row mappers
 * ---------------------------------------------------------------- */

type Row = Record<string, unknown>;

const str = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;
const nullableStr = (value: unknown) => (typeof value === "string" ? value : null);
/**
 * The load-bearing mapper. `null` survives as `null` rather than becoming 0,
 * because a metric LinkedIn refused to give us is not a measurement of zero.
 */
const nullableNum = (value: unknown) => (typeof value === "number" ? value : null);

function mapSalesEvent(row: Row): SalesEvent {
  return {
    id: str(row.id),
    accountId: str(row.account_id),
    contactId: nullableStr(row.contact_id),
    type: row.type as SalesEvent["type"],
    occurredAt: str(row.occurred_at),
    observedAt: nullableStr(row.observed_at),
    occurredAtPrecision: (row.occurred_at_precision ??
      "exact") as SalesEvent["occurredAtPrecision"],
    source: row.source as SalesEvent["source"],
    actor: row.actor as SalesEvent["actor"],
    variantId: nullableStr(row.variant_id),
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    createdAt: str(row.created_at),
  };
}

function mapContact(row: Row): Contact {
  return {
    id: str(row.id),
    accountId: str(row.account_id),
    name: str(row.name),
    role: str(row.role),
    linkedinUrl: str(row.linkedin_url),
    linkedinMemberId: str(row.linkedin_member_id),
    relationship: (row.relationship ?? "cold") as Contact["relationship"],
    createdAt: str(row.created_at),
    updatedAt: str(row.updated_at),
  };
}

function mapVariant(row: Row): OutreachVariant {
  return {
    id: str(row.id),
    name: str(row.name),
    channel: str(row.channel),
    structure: str(row.structure),
    hypothesis: str(row.hypothesis),
    activeFrom: nullableStr(row.active_from),
    activeTo: nullableStr(row.active_to),
  };
}

function mapContentPost(row: Row): ContentPost {
  return {
    id: str(row.id),
    draftId: nullableStr(row.draft_id),
    platform: str(row.platform, "linkedin"),
    url: str(row.url),
    platformUrn: str(row.platform_urn),
    status: (row.status ?? "draft") as ContentPost["status"],
    publishedAt: nullableStr(row.published_at),
    hook: str(row.hook),
    topic: str(row.topic),
    format: str(row.format),
    contentType: (row.content_type ?? "measured_test") as ContentPost["contentType"],
    ctaType: (row.cta_type ?? "none") as ContentPost["ctaType"],
    offerMentioned: Boolean(row.offer_mentioned),
    sourceAccountIds: (row.source_account_ids as string[]) ?? [],
    claimLedger: (row.claim_ledger as ContentPost["claimLedger"]) ?? [],
    critique: (row.critique as ContentPost["critique"]) ?? null,
    approvedContentHash: nullableStr(row.approved_content_hash),
    approvedAt: nullableStr(row.approved_at),
    createdAt: str(row.created_at),
    updatedAt: str(row.updated_at),
  };
}

function mapMetricSnapshot(row: Row): ContentMetricSnapshot {
  return {
    id: str(row.id),
    postId: str(row.post_id),
    observedAt: str(row.observed_at),
    window: row.window as ContentMetricSnapshot["window"],
    source: row.source as ContentMetricSnapshot["source"],
    impressions: nullableNum(row.impressions),
    uniqueViews: nullableNum(row.unique_views),
    reactions: nullableNum(row.reactions),
    comments: nullableNum(row.comments),
    reposts: nullableNum(row.reposts),
    clicks: nullableNum(row.clicks),
    profileViews: nullableNum(row.profile_views),
    follows: nullableNum(row.follows),
    inboundMessages: nullableNum(row.inbound_messages),
    callsAttributed: nullableNum(row.calls_attributed),
    notes: str(row.notes),
    createdAt: str(row.created_at),
    updatedAt: str(row.updated_at),
  };
}

function mapProfileVersion(row: Row): ProfileVersion {
  return {
    id: str(row.id),
    headline: str(row.headline),
    about: str(row.about),
    featured: (row.featured as string[]) ?? [],
    hypothesis: str(row.hypothesis),
    notes: str(row.notes),
    activatedAt: nullableStr(row.activated_at),
    deactivatedAt: nullableStr(row.deactivated_at),
    isActive: Boolean(row.is_active),
    createdAt: str(row.created_at),
    updatedAt: str(row.updated_at),
  };
}

/* ---------------------------------------------------------------- *
 * Sales events
 * ---------------------------------------------------------------- */

export async function listSalesEvents(): Promise<SalesEvent[]> {
  const supabase = getClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("signal_sales_events")
    .select("*")
    .order("occurred_at", { ascending: true });
  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(error.message);
  }
  return (data as Row[]).map(mapSalesEvent);
}

export interface RecordEventInput {
  accountId: string;
  contactId?: string | null;
  type: SalesEvent["type"];
  occurredAt?: string;
  observedAt?: string | null;
  occurredAtPrecision?: SalesEvent["occurredAtPrecision"];
  source?: SalesEvent["source"];
  actor?: SalesEvent["actor"];
  variantId?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Append one event.
 *
 * Idempotent by `dedupe_key`: clicking "mark accepted" twice returns the
 * existing row rather than deepening the funnel. A duplicate is a normal
 * outcome of a retried request, not an error worth surfacing.
 */
export async function recordSalesEvent(input: RecordEventInput): Promise<SalesEvent> {
  const supabase = requireClient();
  const occurredAt = input.occurredAt ?? new Date().toISOString();
  const dedupeKey = buildDedupeKey(input.accountId, input.type, occurredAt);

  const { data, error } = await supabase
    .from("signal_sales_events")
    .insert({
      account_id: input.accountId,
      contact_id: input.contactId ?? null,
      type: input.type,
      occurred_at: occurredAt,
      observed_at: input.observedAt ?? null,
      occurred_at_precision: input.occurredAtPrecision ?? "exact",
      source: input.source ?? "manual",
      actor: input.actor ?? "yenson",
      variant_id: input.variantId ?? null,
      metadata: input.metadata ?? {},
      dedupe_key: dedupeKey,
    })
    .select("*")
    .single();

  if (!error) return mapSalesEvent(data as Row);

  // 23505 = unique violation on dedupe_key: the event is already recorded.
  if (error.code === "23505") {
    const { data: existing, error: lookupError } = await supabase
      .from("signal_sales_events")
      .select("*")
      .eq("dedupe_key", dedupeKey)
      .single();
    if (lookupError) throw new Error(lookupError.message);
    return mapSalesEvent(existing as Row);
  }

  throw new Error(error.message);
}

export async function deleteSalesEvent(id: string) {
  const supabase = requireClient();
  const { error } = await supabase.from("signal_sales_events").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ---------------------------------------------------------------- *
 * Contacts and variants
 * ---------------------------------------------------------------- */

export async function listContacts(): Promise<Contact[]> {
  const supabase = getClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("signal_contacts").select("*");
  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(error.message);
  }
  return (data as Row[]).map(mapContact);
}

export async function createContact(
  input: Omit<Contact, "id" | "createdAt" | "updatedAt">
): Promise<Contact> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("signal_contacts")
    .insert({
      account_id: input.accountId,
      name: input.name,
      role: input.role,
      linkedin_url: input.linkedinUrl,
      linkedin_member_id: input.linkedinMemberId,
      relationship: input.relationship,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapContact(data as Row);
}

export async function listVariants(): Promise<OutreachVariant[]> {
  const supabase = getClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("signal_outreach_variants")
    .select("*")
    .order("name");
  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(error.message);
  }
  return (data as Row[]).map(mapVariant);
}

/* ---------------------------------------------------------------- *
 * Content posts and metrics
 * ---------------------------------------------------------------- */

export async function listContentPosts(): Promise<ContentPost[]> {
  const supabase = getClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("signal_content_posts")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(error.message);
  }
  return (data as Row[]).map(mapContentPost);
}

export async function createContentPost(
  input: Partial<ContentPost> & { url: string }
): Promise<ContentPost> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("signal_content_posts")
    .insert({
      draft_id: input.draftId ?? null,
      platform: input.platform ?? "linkedin",
      url: input.url,
      platform_urn: input.platformUrn ?? "",
      status: input.status ?? "published",
      published_at: input.publishedAt ?? null,
      hook: input.hook ?? "",
      topic: input.topic ?? "",
      format: input.format ?? "",
      content_type: input.contentType ?? "measured_test",
      cta_type: input.ctaType ?? "none",
      offer_mentioned: input.offerMentioned ?? false,
      source_account_ids: input.sourceAccountIds ?? [],
      claim_ledger: input.claimLedger ?? [],
      critique: input.critique ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapContentPost(data as Row);
}

export async function updateContentPost(
  id: string,
  input: Partial<ContentPost>
): Promise<ContentPost> {
  const supabase = requireClient();
  const row: Row = { updated_at: new Date().toISOString() };
  if (input.url !== undefined) row.url = input.url;
  if (input.platformUrn !== undefined) row.platform_urn = input.platformUrn;
  if (input.status !== undefined) row.status = input.status;
  if (input.publishedAt !== undefined) row.published_at = input.publishedAt;
  if (input.contentType !== undefined) row.content_type = input.contentType;
  if (input.ctaType !== undefined) row.cta_type = input.ctaType;
  if (input.offerMentioned !== undefined) row.offer_mentioned = input.offerMentioned;
  if (input.topic !== undefined) row.topic = input.topic;
  if (input.hook !== undefined) row.hook = input.hook;
  if (input.critique !== undefined) row.critique = input.critique;

  const { data, error } = await supabase
    .from("signal_content_posts")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapContentPost(data as Row);
}

export async function listMetricSnapshots(): Promise<ContentMetricSnapshot[]> {
  const supabase = getClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("signal_content_metrics")
    .select("*")
    .order("observed_at", { ascending: false });
  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(error.message);
  }
  return (data as Row[]).map(mapMetricSnapshot);
}

/**
 * Upsert one reading.
 *
 * `undefined` in the input means "not supplied, leave it unknown" and is stored
 * as null. The caller must pass an explicit 0 to record a measured zero — the
 * distinction the whole content-metrics feature rests on.
 */
export async function upsertMetricSnapshot(
  input: Partial<ContentMetricSnapshot> & {
    postId: string;
    window: ContentMetricSnapshot["window"];
    source: ContentMetricSnapshot["source"];
  }
): Promise<ContentMetricSnapshot> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("signal_content_metrics")
    .upsert(
      {
        post_id: input.postId,
        window: input.window,
        source: input.source,
        observed_at: input.observedAt ?? new Date().toISOString(),
        impressions: input.impressions ?? null,
        unique_views: input.uniqueViews ?? null,
        reactions: input.reactions ?? null,
        comments: input.comments ?? null,
        reposts: input.reposts ?? null,
        clicks: input.clicks ?? null,
        profile_views: input.profileViews ?? null,
        follows: input.follows ?? null,
        inbound_messages: input.inboundMessages ?? null,
        calls_attributed: input.callsAttributed ?? null,
        notes: input.notes ?? "",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "post_id,window,source" }
    )
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapMetricSnapshot(data as Row);
}

/* ---------------------------------------------------------------- *
 * Attribution, profile versions, capabilities
 * ---------------------------------------------------------------- */

export async function listAttributionEvents(): Promise<AttributionEvent[]> {
  const supabase = getClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("signal_attribution_events").select("*");
  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(error.message);
  }
  return (data as Row[]).map((row) => ({
    id: str(row.id),
    postId: nullableStr(row.post_id),
    accountId: nullableStr(row.account_id),
    contactId: nullableStr(row.contact_id),
    type: row.type as AttributionEvent["type"],
    confidence: row.confidence as AttributionEvent["confidence"],
    evidenceNote: str(row.evidence_note),
    occurredAt: str(row.occurred_at),
  }));
}

export async function createAttributionEvent(
  input: Omit<AttributionEvent, "id">
): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase.from("signal_attribution_events").insert({
    post_id: input.postId,
    account_id: input.accountId,
    contact_id: input.contactId,
    type: input.type,
    confidence: input.confidence,
    evidence_note: input.evidenceNote,
    occurred_at: input.occurredAt,
  });
  if (error) throw new Error(error.message);
}

export async function listProfileVersions(): Promise<ProfileVersion[]> {
  const supabase = getClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("signal_profile_versions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(error.message);
  }
  return (data as Row[]).map(mapProfileVersion);
}

export async function createProfileVersion(
  input: Partial<ProfileVersion> & { headline: string }
): Promise<ProfileVersion> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("signal_profile_versions")
    .insert({
      headline: input.headline,
      about: input.about ?? "",
      featured: input.featured ?? [],
      hypothesis: input.hypothesis ?? "",
      notes: input.notes ?? "",
      is_active: input.isActive ?? false,
      activated_at: input.activatedAt ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapProfileVersion(data as Row);
}

/**
 * Mark one version live and stand the others down.
 *
 * Two versions cannot both be active: acceptance rate is read against the
 * headline that was live at the time, and an ambiguous active period makes
 * that attribution meaningless.
 */
export async function activateProfileVersion(id: string): Promise<void> {
  const supabase = requireClient();
  const now = new Date().toISOString();
  const { error: standDown } = await supabase
    .from("signal_profile_versions")
    .update({ is_active: false, deactivated_at: now, updated_at: now })
    .eq("is_active", true);
  if (standDown) throw new Error(standDown.message);

  const { error } = await supabase
    .from("signal_profile_versions")
    .update({ is_active: true, activated_at: now, deactivated_at: null, updated_at: now })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function listCapabilities(): Promise<ProviderCapability[]> {
  const supabase = getClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("signal_provider_capabilities").select("*");
  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(error.message);
  }
  return (data as Row[]).map((row) => ({
    id: str(row.id),
    provider: str(row.provider),
    capability: str(row.capability),
    state: row.state as ProviderCapability["state"],
    detail: str(row.detail),
    observedAt: str(row.observed_at),
  }));
}

/**
 * Record what a provider did or did not let us do.
 *
 * A 403 is stored as `forbidden`, never as a zero metric. The difference
 * between "LinkedIn refused" and "nobody engaged" is the difference between a
 * broken integration and a bad post.
 */
export async function recordCapability(
  capability: string,
  state: ProviderCapability["state"],
  detail = "",
  provider = "composio"
): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase.from("signal_provider_capabilities").upsert(
    {
      provider,
      capability,
      state,
      detail,
      observed_at: new Date().toISOString(),
    },
    { onConflict: "provider,capability" }
  );
  if (error) throw new Error(error.message);
}

/** Everything the ledger views need, in one round trip. */
export async function getLedgerData() {
  const [events, contacts, variants, posts, metrics, attribution, profiles, capabilities] =
    await Promise.all([
      listSalesEvents(),
      listContacts(),
      listVariants(),
      listContentPosts(),
      listMetricSnapshots(),
      listAttributionEvents(),
      listProfileVersions(),
      listCapabilities(),
    ]);
  return { events, contacts, variants, posts, metrics, attribution, profiles, capabilities };
}

export type LedgerData = Awaited<ReturnType<typeof getLedgerData>>;
