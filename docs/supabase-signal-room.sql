create extension if not exists pgcrypto;

create table if not exists public.signal_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text not null default '',
  stage text not null default 'Unknown' check (stage in ('Seed', 'Series A', 'Series B', 'Unknown')),
  location text not null default '',
  one_liner text not null default '',
  status text not null default 'watchlist' check (status in ('watchlist', 'researching', 'ready', 'contacted', 'replied', 'discovery', 'archived')),
  fit_score integer not null default 0 check (fit_score between 0 and 100),
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  founder_names jsonb not null default '[]'::jsonb,
  linkedin_url text not null default '',
  notes text not null default '',
  brief jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.signal_sources (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.signal_accounts(id) on delete cascade,
  url text not null,
  title text not null default '',
  source_type text not null default 'web',
  excerpt text not null default '',
  content text not null default '',
  published_at timestamptz,
  captured_at timestamptz not null default now(),
  unique (account_id, url)
);

create table if not exists public.signal_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  pillar text not null check (pillar in ('Technical field note', 'Startup strategy', 'Operator story')),
  status text not null default 'idea' check (status in ('idea', 'draft', 'ready', 'published')),
  hook text not null default '',
  draft text not null default '',
  takeaway text not null default '',
  account_ids jsonb not null default '[]'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  quality jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists signal_accounts_status_idx on public.signal_accounts(status);
create index if not exists signal_accounts_fit_score_idx on public.signal_accounts(fit_score desc);
create index if not exists signal_sources_account_id_idx on public.signal_sources(account_id);
create index if not exists signal_posts_status_idx on public.signal_posts(status);

alter table public.signal_accounts enable row level security;
alter table public.signal_sources enable row level security;
alter table public.signal_posts enable row level security;

create table if not exists public.discovery_bookings (
  id uuid primary key default gen_random_uuid(),
  booking_key text not null,
  slot_start timestamptz not null,
  slot_end timestamptz not null,
  status text not null default 'pending_email'
    check (status in ('pending_email', 'confirmed', 'delivery_failed', 'cancelled')),
  attendee_name text not null,
  attendee_email text not null,
  company text not null,
  attendee_role text not null,
  company_stage text not null,
  initiative_stage text not null,
  investment_range text not null,
  initiative text not null,
  visitor_timezone text not null,
  meeting_url text not null,
  owner_email_id text,
  visitor_email_id text,
  delivery_error text,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (slot_end > slot_start)
);

create unique index if not exists discovery_bookings_active_slot_idx
  on public.discovery_bookings(slot_start)
  where status <> 'cancelled';

create unique index if not exists discovery_bookings_active_key_idx
  on public.discovery_bookings(booking_key)
  where status <> 'cancelled';

create index if not exists discovery_bookings_window_idx
  on public.discovery_bookings(slot_start, status);

create index if not exists discovery_bookings_attendee_idx
  on public.discovery_bookings(lower(attendee_email), slot_start desc);

alter table public.discovery_bookings enable row level security;
revoke all on table public.discovery_bookings from anon, authenticated;
grant select, insert, update, delete on table public.discovery_bookings to service_role;

-- Intentionally no public policies. The app accesses these tables only through
-- server routes using SUPABASE_SERVICE_ROLE_KEY. Never expose that key to the browser.