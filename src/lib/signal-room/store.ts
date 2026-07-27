import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { demoWorkspace } from "@/lib/signal-room/demo-data";
import type {
  Account,
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

  const [accountsResult, sourcesResult, postsResult] = await Promise.all([
    supabase.from("signal_accounts").select("*").order("updated_at", { ascending: false }),
    supabase.from("signal_sources").select("*").order("captured_at", { ascending: false }),
    supabase.from("signal_posts").select("*").order("updated_at", { ascending: false }),
  ]);

  if (accountsResult.error || sourcesResult.error || postsResult.error) {
    throw new Error(
      accountsResult.error?.message ??
        sourcesResult.error?.message ??
        postsResult.error?.message ??
        "Signal Room data could not be loaded."
    );
  }

  const sources = (sourcesResult.data as SourceRow[]).map(mapSourceRow);
  const sourcesByAccount = new Map<string, ResearchSource[]>();
  for (const source of sources) {
    const accountSources = sourcesByAccount.get(source.accountId) ?? [];
    accountSources.push(source);
    sourcesByAccount.set(source.accountId, accountSources);
  }

  return {
    mode: "supabase",
    accounts: (accountsResult.data as AccountRow[]).map((row) =>
      mapAccountRow(row, sourcesByAccount.get(row.id) ?? [])
    ),
    posts: (postsResult.data as PostRow[]).map(mapPostRow),
  };
}

export async function createAccount(
  input: Omit<Account, "id" | "sources" | "createdAt" | "updatedAt">
) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("signal_accounts")
    .insert(toAccountRow(input))
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapAccountRow(data as AccountRow, []);
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

  const { data, error } = await supabase
    .from("signal_accounts")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapAccountRow(data as AccountRow, input.sources ?? []);
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
  input: Omit<Account, "id" | "sources" | "createdAt" | "updatedAt">
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
  };
}

function mapAccountRow(row: AccountRow, sources: ResearchSource[]): Account {
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
    sources,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
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
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}