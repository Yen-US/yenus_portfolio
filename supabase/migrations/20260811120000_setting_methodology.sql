-- Signal Room: setting methodology support
-- Adds ICP locking, first-hand product observations, LinkedIn conversation
-- capture, and discovery-call cost math.

-- 1. ICP profiles -----------------------------------------------------------

create table if not exists public.signal_icp_profiles (
  id uuid primary key default gen_random_uuid(),
  version integer not null,
  label text not null,
  statement text not null default '',
  is_active boolean not null default false,
  stages jsonb not null default '["Seed","Series A","Series B"]'::jsonb,
  regions jsonb not null default '[]'::jsonb,
  buyer_roles jsonb not null default '["CTO"]'::jsonb,
  disqualifiers jsonb not null default '[]'::jsonb,
  keyword_banks jsonb not null default '{}'::jsonb,
  measurable_weakness text not null default '',
  locked_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists signal_icp_one_active
  on public.signal_icp_profiles (is_active)
  where is_active;

create unique index if not exists signal_icp_version_idx
  on public.signal_icp_profiles (version);

alter table public.signal_icp_profiles enable row level security;

-- 2. Account columns --------------------------------------------------------

alter table public.signal_accounts
  add column if not exists icp_profile_id uuid references public.signal_icp_profiles(id),
  add column if not exists disqualified_reason text not null default '',
  add column if not exists target_role text not null default '',
  add column if not exists target_name text not null default '',
  add column if not exists approx_users text not null default '',
  add column if not exists mutual_fit text not null default 'unknown',
  add column if not exists ask_sent_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'signal_accounts_mutual_fit_check'
  ) then
    alter table public.signal_accounts
      add constraint signal_accounts_mutual_fit_check
      check (mutual_fit in ('unknown', 'good', 'tolerable', 'no'));
  end if;
end $$;

-- Widen the status enum for the close stages.
alter table public.signal_accounts drop constraint if exists signal_accounts_status_check;
alter table public.signal_accounts
  add constraint signal_accounts_status_check
  check (status in (
    'watchlist', 'researching', 'ready', 'contacted', 'replied',
    'discovery', 'proposal', 'won', 'lost', 'archived'
  ));

-- 3. First-hand product observations ---------------------------------------

create table if not exists public.signal_observations (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.signal_accounts(id) on delete cascade,
  flow text not null default '',
  metric text not null default '',
  value numeric,
  unit text not null default '',
  tier text not null default 'free',
  cost_usd numeric not null default 0,
  raw_note text not null default '',
  is_weakness boolean not null default false,
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists signal_observations_account_idx
  on public.signal_observations(account_id);

alter table public.signal_observations enable row level security;

-- 4. Conversation capture ---------------------------------------------------

create table if not exists public.signal_messages (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.signal_accounts(id) on delete cascade,
  direction text not null check (direction in ('sent', 'received')),
  channel text not null default 'linkedin',
  body text not null default '',
  analysis jsonb,
  contained_ask boolean not null default false,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists signal_messages_account_idx
  on public.signal_messages(account_id, occurred_at);

alter table public.signal_messages enable row level security;

-- 5. Discovery calls and proposals -----------------------------------------

create table if not exists public.signal_calls (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.signal_accounts(id) on delete cascade,
  held_at timestamptz,
  monthly_spend_usd numeric,
  spend_basis text not null default '',
  waste_pct integer check (waste_pct between 0 and 100),
  waste_basis text not null default '',
  reclaim_intent text not null default '',
  revenue_now_usd numeric,
  revenue_target_usd numeric,
  cost_of_delay text not null default '',
  notes text not null default '',
  offer text not null default '',
  price_usd numeric,
  upfront_usd numeric,
  plan jsonb,
  outcome text not null default 'held'
    check (outcome in ('held', 'proposal_sent', 'won', 'lost', 'disqualified')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists signal_calls_account_idx
  on public.signal_calls(account_id);

alter table public.signal_calls enable row level security;

-- Link a booked discovery call back to the researched account.
alter table public.discovery_bookings
  add column if not exists account_id uuid references public.signal_accounts(id);

-- Intentionally no public policies on any table above.
-- Server routes reach these only through the service role.

-- 6. Seed ICP v1 -----------------------------------------------------------
-- Reproduces the previously hardcoded fit-score keyword banks exactly, so
-- scores computed before ICP versioning stay comparable with v1.

insert into public.signal_icp_profiles (
  version, label, statement, is_active, stages, regions, buyer_roles,
  disqualifiers, keyword_banks, measurable_weakness, locked_at
)
select
  1,
  'Seed-Series B B2B AI, prototype to production',
  'Seed to Series B B2B AI-native startups where a founder or CTO owns the architecture and one consequential AI decision is blocking the move from prototype to production.',
  true,
  '["Seed","Series A","Series B"]'::jsonb,
  '["Global, English-speaking markets"]'::jsonb,
  '["CTO","Founding engineer","VP Engineering","Head of AI"]'::jsonb,
  '["Agencies and consultancies","Consumer-only products","No technical owner close to the work","Lowest-price no-code automation buyers"]'::jsonb,
  '{
    "ai": ["ai","artificial intelligence","agent","agentic","llm","language model","rag","inference","machine learning"],
    "b2b": ["b2b","business","companies","enterprise","operations","platform","saas","teams","workflow"],
    "production": ["beta","customer","deploy","enterprise pilot","go live","integration","launch","production","rollout","scale"],
    "architecture": ["agent","audit","data","evaluation","governance","infrastructure","integration","latency","platform","rag","reliability","security","scale"],
    "urgency": ["announced","funding","hiring","launch","pilot","raised","recent","series","seed"]
  }'::jsonb,
  'End-to-end latency or reliability of the product''s core AI workflow, measured on the free tier.',
  now()
where not exists (select 1 from public.signal_icp_profiles);

-- Backfill existing accounts onto v1 so historical scores remain interpretable.
update public.signal_accounts
set icp_profile_id = (select id from public.signal_icp_profiles where version = 1)
where icp_profile_id is null;
