import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type DiscoveryBookingStatus =
  | "pending_email"
  | "confirmed"
  | "delivery_failed"
  | "cancelled";

export interface DiscoveryBooking {
  id: string;
  bookingKey: string;
  slotStart: string;
  slotEnd: string;
  status: DiscoveryBookingStatus;
  attendeeName: string;
  attendeeEmail: string;
  company: string;
  attendeeRole: string;
  companyStage: string;
  initiativeStage: string;
  investmentRange: string;
  initiative: string;
  visitorTimezone: string;
  meetingUrl: string;
  ownerEmailId: string | null;
  visitorEmailId: string | null;
  deliveryError: string | null;
  confirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DiscoveryBookingInput {
  bookingKey: string;
  slotStart: Date;
  slotEnd: Date;
  attendeeName: string;
  attendeeEmail: string;
  company: string;
  attendeeRole: string;
  companyStage: string;
  initiativeStage: string;
  investmentRange: string;
  initiative: string;
  visitorTimezone: string;
  meetingUrl: string;
}

interface DiscoveryBookingRow {
  id: string;
  booking_key: string;
  slot_start: string;
  slot_end: string;
  status: DiscoveryBookingStatus;
  attendee_name: string;
  attendee_email: string;
  company: string;
  attendee_role: string;
  company_stage: string;
  initiative_stage: string;
  investment_range: string;
  initiative: string;
  visitor_timezone: string;
  meeting_url: string;
  owner_email_id: string | null;
  visitor_email_id: string | null;
  delivery_error: string | null;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
}

let supabaseAdmin: SupabaseClient | null | undefined;

export function isDiscoveryBookingStoreConfigured() {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function getBookedDiscoveryStarts(
  rangeStart: Date,
  rangeEnd: Date
) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("discovery_bookings")
    .select("slot_start")
    .neq("status", "cancelled")
    .gte("slot_start", rangeStart.toISOString())
    .lte("slot_start", rangeEnd.toISOString())
    .order("slot_start", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as { slot_start: string }[]).map((row) => row.slot_start);
}

export async function claimDiscoveryBooking(input: DiscoveryBookingInput) {
  const supabase = requireSupabase();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("discovery_bookings")
    .insert({
      booking_key: input.bookingKey,
      slot_start: input.slotStart.toISOString(),
      slot_end: input.slotEnd.toISOString(),
      status: "pending_email",
      attendee_name: input.attendeeName,
      attendee_email: input.attendeeEmail.toLowerCase(),
      company: input.company,
      attendee_role: input.attendeeRole,
      company_stage: input.companyStage,
      initiative_stage: input.initiativeStage,
      investment_range: input.investmentRange,
      initiative: input.initiative,
      visitor_timezone: input.visitorTimezone,
      meeting_url: input.meetingUrl,
      updated_at: now,
    })
    .select("*")
    .single();

  if (!error) {
    return {
      outcome: "claimed" as const,
      booking: mapBookingRow(data as DiscoveryBookingRow),
    };
  }

  if (error.code !== "23505") throw new Error(error.message);

  const { data: existing, error: existingError } = await supabase
    .from("discovery_bookings")
    .select("*")
    .eq("slot_start", input.slotStart.toISOString())
    .neq("status", "cancelled")
    .maybeSingle();

  if (existingError) throw new Error(existingError.message);
  if (!existing) {
    throw new Error("The booking conflict could not be resolved.");
  }

  const booking = mapBookingRow(existing as DiscoveryBookingRow);
  return booking.bookingKey === input.bookingKey
    ? { outcome: "existing" as const, booking }
    : { outcome: "unavailable" as const, booking };
}

export async function markDiscoveryBookingConfirmed(
  id: string,
  bookingKey: string,
  delivery: { ownerEmailId: string | null; visitorEmailId: string | null }
) {
  return updateBooking(id, bookingKey, {
    status: "confirmed",
    owner_email_id: delivery.ownerEmailId,
    visitor_email_id: delivery.visitorEmailId,
    delivery_error: null,
    confirmed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

export async function markDiscoveryBookingDeliveryFailed(
  id: string,
  bookingKey: string,
  errorMessage: string,
  delivery: { ownerEmailId: string | null; visitorEmailId: string | null }
) {
  return updateBooking(id, bookingKey, {
    status: "delivery_failed",
    owner_email_id: delivery.ownerEmailId,
    visitor_email_id: delivery.visitorEmailId,
    delivery_error: errorMessage.slice(0, 2_000),
    updated_at: new Date().toISOString(),
  });
}

async function updateBooking(
  id: string,
  bookingKey: string,
  values: Record<string, unknown>
) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("discovery_bookings")
    .update(values)
    .eq("id", id)
    .eq("booking_key", bookingKey)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapBookingRow(data as DiscoveryBookingRow);
}

function requireSupabase() {
  if (supabaseAdmin !== undefined) {
    if (!supabaseAdmin) throw new Error("Discovery booking storage is not configured.");
    return supabaseAdmin;
  }

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    supabaseAdmin = null;
    throw new Error("Discovery booking storage is not configured.");
  }

  supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return supabaseAdmin;
}

function mapBookingRow(row: DiscoveryBookingRow): DiscoveryBooking {
  return {
    id: row.id,
    bookingKey: row.booking_key,
    slotStart: row.slot_start,
    slotEnd: row.slot_end,
    status: row.status,
    attendeeName: row.attendee_name,
    attendeeEmail: row.attendee_email,
    company: row.company,
    attendeeRole: row.attendee_role,
    companyStage: row.company_stage,
    initiativeStage: row.initiative_stage,
    investmentRange: row.investment_range,
    initiative: row.initiative,
    visitorTimezone: row.visitor_timezone,
    meetingUrl: row.meeting_url,
    ownerEmailId: row.owner_email_id,
    visitorEmailId: row.visitor_email_id,
    deliveryError: row.delivery_error,
    confirmedAt: row.confirmed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}