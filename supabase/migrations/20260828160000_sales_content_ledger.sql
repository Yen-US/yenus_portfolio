-- Sales and content evidence ledger.
--
-- The workspace already knows who a target is and what was drafted for them.
-- It does not know what actually happened: whether a request was sent, whether
-- it was accepted, when a follow-up is due, or whether a post did anything.
-- This migration adds that record.
--
-- Two rules shape every table below.
--
-- 1. Events are immutable and append-only. Current stage is DERIVED from them
--    (see lib/signal-room/funnel.ts), never stored. Destructively overwriting a
--    status is how a funnel silently loses its own history.
--
-- 2. Null is not zero. A metric column left null means "LinkedIn did not give us
--    this number" — a 403, an unsupported endpoint, a screenshot that cropped it.
--    A recorded 0 means "we looked and it was zero." Collapsing the two produces
--    a dashboard that reports failure as fact.
--
-- Additive throughout: no existing column is altered or dropped, so the
-- deployed app keeps working whether or not this has been applied yet.

create extension if not exists pgcrypto;

-- People, as distinct from companies. A LinkedIn request goes to a person, and
-- the same account can involve several.
create table if not exists public.signal_contacts (
	id uuid primary key default gen_random_uuid(),
	account_id uuid not null references public.signal_accounts (id) on delete cascade,
	name text not null,
	role text not null default '',
	linkedin_url text not null default '',
	linkedin_member_id text not null default '',
	relationship text not null default 'cold'
		check (relationship in ('cold', 'warm', 'inbound', 'referral')),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists signal_contacts_account_idx
	on public.signal_contacts (account_id);

-- The ledger itself.
--
-- `source` records how we learned the event happened and `actor` records who
-- asserted it. A model may write 'system-derived' reminders; it may never claim
-- a human action occurred. That constraint is enforced below, not by convention.
create table if not exists public.signal_sales_events (
	id uuid primary key default gen_random_uuid(),
	account_id uuid not null references public.signal_accounts (id) on delete cascade,
	contact_id uuid references public.signal_contacts (id) on delete set null,
	type text not null check (type in (
		'prospect_researched',
		'field_test_logged',
		'connection_requested',
		'connection_accepted',
		'first_message_sent',
		'follow_up_sent',
		'reply_received',
		'reply_classified',
		'qualified',
		'disqualified',
		'call_booked',
		'call_completed',
		'proposal_sent',
		'opportunity_won',
		'opportunity_lost',
		'moved_to_nurture',
		'manual_note'
	)),
	occurred_at timestamptz not null,
	-- When we FOUND OUT, which for a LinkedIn acceptance is usually not when it
	-- happened. Keeping them apart is what stops reconciliation from inventing
	-- precise timestamps for events observed days later.
	observed_at timestamptz,
	occurred_at_precision text not null default 'exact'
		check (occurred_at_precision in ('exact', 'approximate', 'unknown')),
	source text not null check (source in ('manual', 'import', 'composio', 'system-derived')),
	actor text not null check (actor in ('yenson', 'system')),
	-- A model-written event may never assert that a human or an external party
	-- did something. Only notes and derived reminders are open to it.
	constraint signal_sales_events_system_actor_limits check (
		actor = 'yenson' or type in ('manual_note', 'prospect_researched', 'field_test_logged')
	),
	variant_id uuid,
	metadata jsonb not null default '{}'::jsonb,
	-- Idempotency: replaying "mark accepted" must not deepen the funnel.
	dedupe_key text unique,
	created_at timestamptz not null default now()
);

create index if not exists signal_sales_events_account_idx
	on public.signal_sales_events (account_id, occurred_at desc);
create index if not exists signal_sales_events_type_idx
	on public.signal_sales_events (type, occurred_at desc);
create index if not exists signal_sales_events_contact_idx
	on public.signal_sales_events (contact_id);

-- What was tried, so acceptance and reply rates can be attributed to an
-- approach rather than to luck.
create table if not exists public.signal_outreach_variants (
	id uuid primary key default gen_random_uuid(),
	name text not null unique,
	channel text not null default 'linkedin',
	structure text not null default '',
	hypothesis text not null default '',
	active_from date,
	active_to date,
	created_at timestamptz not null default now()
);

-- Drafted vs actually sent. `sent_at` is never inferred from generation time:
-- a draft that was never sent must not appear in a denominator.
create table if not exists public.signal_outreach_messages (
	id uuid primary key default gen_random_uuid(),
	account_id uuid not null references public.signal_accounts (id) on delete cascade,
	contact_id uuid references public.signal_contacts (id) on delete set null,
	variant_id uuid references public.signal_outreach_variants (id) on delete set null,
	kind text not null check (kind in ('connection_note', 'first_message', 'follow_up')),
	draft_text text not null default '',
	approved_text text not null default '',
	sent_at timestamptz,
	sent_confirmed_by text not null default '',
	observation_id uuid references public.signal_observations (id) on delete set null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists signal_outreach_messages_account_idx
	on public.signal_outreach_messages (account_id);

-- Published content as an operational record. `signal_posts` holds drafts and
-- the generation pipeline; this holds what went out and where it lives.
create table if not exists public.signal_content_posts (
	id uuid primary key default gen_random_uuid(),
	draft_id uuid references public.signal_posts (id) on delete set null,
	platform text not null default 'linkedin',
	url text not null default '',
	platform_urn text not null default '',
	status text not null default 'draft'
		check (status in ('draft', 'approved', 'published', 'failed', 'archived')),
	published_at timestamptz,
	hook text not null default '',
	topic text not null default '',
	format text not null default '',
	content_type text not null default 'measured_test'
		check (content_type in ('measured_test', 'decision_framework', 'operator_story', 'offer')),
	cta_type text not null default 'none'
		check (cta_type in ('question', 'save', 'discussion', 'offer', 'none')),
	offer_mentioned boolean not null default false,
	source_account_ids jsonb not null default '[]'::jsonb,
	claim_ledger jsonb not null default '[]'::jsonb,
	critique jsonb,
	-- Binds an approval to exact bytes. Editing after approval changes the hash,
	-- which invalidates the approval rather than silently publishing new text.
	approved_content_hash text,
	approved_at timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create unique index if not exists signal_content_posts_urn_idx
	on public.signal_content_posts (platform_urn)
	where platform_urn <> '';

-- Every metric column is nullable ON PURPOSE. See the header note.
create table if not exists public.signal_content_metrics (
	id uuid primary key default gen_random_uuid(),
	post_id uuid not null references public.signal_content_posts (id) on delete cascade,
	observed_at timestamptz not null default now(),
	-- Quoted: `window` is a reserved word in Postgres (window functions), and
	-- unquoted it is a syntax error rather than a warning.
	"window" text not null check ("window" in ('24h', '7d', '30d', 'custom')),
	source text not null default 'manual'
		check (source in ('manual', 'linkedin_export', 'composio', 'public_page')),
	impressions integer check (impressions >= 0),
	unique_views integer check (unique_views >= 0),
	reactions integer check (reactions >= 0),
	comments integer check (comments >= 0),
	reposts integer check (reposts >= 0),
	clicks integer check (clicks >= 0),
	profile_views integer check (profile_views >= 0),
	follows integer check (follows >= 0),
	inbound_messages integer check (inbound_messages >= 0),
	calls_attributed integer check (calls_attributed >= 0),
	notes text not null default '',
	-- One canonical reading per post/window/source; revisions replace it rather
	-- than accumulating into a double-counted total.
	unique (post_id, "window", source),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

-- Content → pipeline, only where a human can point at the evidence.
create table if not exists public.signal_attribution_events (
	id uuid primary key default gen_random_uuid(),
	post_id uuid references public.signal_content_posts (id) on delete cascade,
	account_id uuid references public.signal_accounts (id) on delete cascade,
	contact_id uuid references public.signal_contacts (id) on delete set null,
	type text not null check (type in ('profile_view', 'follow', 'dm', 'call', 'opportunity')),
	-- Only 'explicit' and 'self_reported' count in primary reporting. 'inferred'
	-- is displayed separately so a hunch never hardens into a conversion.
	confidence text not null check (confidence in ('explicit', 'self_reported', 'inferred')),
	evidence_note text not null default '',
	occurred_at timestamptz not null default now(),
	created_at timestamptz not null default now()
);

-- Profile versions, so acceptance rate can be read against the headline that
-- was live at the time. Never mutates LinkedIn — activation is confirmed by hand.
create table if not exists public.signal_profile_versions (
	id uuid primary key default gen_random_uuid(),
	headline text not null default '',
	about text not null default '',
	featured jsonb not null default '[]'::jsonb,
	hypothesis text not null default '',
	notes text not null default '',
	activated_at timestamptz,
	deactivated_at timestamptz,
	is_active boolean not null default false,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

-- Capability observations for the LinkedIn provider. A 403 is recorded as
-- 'forbidden', which is a different fact from "zero engagement".
create table if not exists public.signal_provider_capabilities (
	id uuid primary key default gen_random_uuid(),
	provider text not null default 'composio',
	capability text not null,
	state text not null check (state in ('available', 'forbidden', 'unsupported', 'unknown')),
	detail text not null default '',
	observed_at timestamptz not null default now(),
	unique (provider, capability)
);

alter table public.signal_contacts enable row level security;
alter table public.signal_sales_events enable row level security;
alter table public.signal_outreach_variants enable row level security;
alter table public.signal_outreach_messages enable row level security;
alter table public.signal_content_posts enable row level security;
alter table public.signal_content_metrics enable row level security;
alter table public.signal_attribution_events enable row level security;
alter table public.signal_profile_versions enable row level security;
alter table public.signal_provider_capabilities enable row level security;

-- Seed the variants the first experiments compare. Named, so a rate can be
-- attributed to an approach rather than to an anonymous batch.
insert into public.signal_outreach_variants (name, channel, structure, hypothesis)
values
	('No-note connection request', 'linkedin', 'Request with no message attached.',
	 'Lower friction lifts acceptance, at the cost of context.'),
	('Signal-specific request note', 'linkedin', 'Request plus one line naming the observed signal.',
	 'A specific observation earns acceptance from the right people and repels the wrong ones.'),
	('Warm-engagement-first', 'linkedin', 'Engage with their content, then request days later.',
	 'Recognition before the request raises acceptance enough to justify the delay.'),
	('Correction-bait opener', 'linkedin', 'Strengths, one measured weakness, a stated-as-guess cause.',
	 'A wrong-but-plausible hypothesis earns a correction, and the correction is the conversation.'),
	('Direct-fit opener', 'linkedin', 'Name the fit and the offer without the measurement hook.',
	 'Directness converts better with people who already know their problem.')
on conflict (name) do nothing;
