create extension if not exists pgcrypto;

create table if not exists public.signal_accounts (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	website text not null default '',
	stage text not null default 'Unknown'
		check (stage in ('Seed', 'Series A', 'Series B', 'Unknown')),
	location text not null default '',
	one_liner text not null default '',
	status text not null default 'watchlist'
		check (status in ('watchlist', 'researching', 'ready', 'contacted', 'replied', 'discovery', 'archived')),
	fit_score integer not null default 0
		check (fit_score between 0 and 100),
	priority text not null default 'medium'
		check (priority in ('high', 'medium', 'low')),
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
	pillar text not null
		check (pillar in ('Technical field note', 'Startup strategy', 'Operator story')),
	status text not null default 'idea'
		check (status in ('idea', 'draft', 'ready', 'published')),
	hook text not null default '',
	draft text not null default '',
	takeaway text not null default '',
	account_ids jsonb not null default '[]'::jsonb,
	evidence jsonb not null default '[]'::jsonb,
	quality jsonb,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists signal_accounts_status_idx
	on public.signal_accounts(status);

create index if not exists signal_accounts_fit_score_idx
	on public.signal_accounts(fit_score desc);

create index if not exists signal_sources_account_id_idx
	on public.signal_sources(account_id);

create index if not exists signal_posts_status_idx
	on public.signal_posts(status);

alter table public.signal_accounts enable row level security;
alter table public.signal_sources enable row level security;
alter table public.signal_posts enable row level security;

comment on table public.signal_accounts is
	'Signal Room startup research accounts. Server-only service-role access.';

comment on table public.signal_sources is
	'Public source material captured for Signal Room account research.';

comment on table public.signal_posts is
	'LinkedIn post drafts and quality checks created in Signal Room.';
