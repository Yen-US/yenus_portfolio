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

comment on table public.discovery_bookings is
	'Server-only discovery call reservations. Active slot uniqueness prevents double booking.';
