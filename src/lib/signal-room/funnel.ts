/**
 * Funnel derivation and follow-up policy.
 *
 * Pure functions only — no I/O, no dates read from the ambient clock except
 * where a caller passes `now` explicitly. That constraint is what makes the
 * business-day arithmetic testable, and this is logic where being quietly
 * wrong means a warm lead dies without anyone noticing.
 *
 * Stage is DERIVED here and stored nowhere. `Account.status` remains for the
 * existing UI, but it is a label the operator sets, not the funnel's opinion.
 */

import type {
  AccountFunnelState,
  FunnelRate,
  FunnelStage,
  SalesEvent,
  SalesEventType,
} from "@/lib/signal-room/types";

/**
 * Follow-up policy. Configurable rather than hardcoded into a component,
 * because the correct number here is a hypothesis and will change once there
 * is enough data to test it.
 */
export interface FollowUpPolicy {
  businessDaysUntilDue: number;
  maxFollowUps: number;
  timeZone: string;
}

export const DEFAULT_FOLLOW_UP_POLICY: FollowUpPolicy = {
  businessDaysUntilDue: 6,
  maxFollowUps: 1,
  timeZone: "America/Costa_Rica",
};

/** Events that mean the conversation moved on and no reminder should fire. */
const CANCELS_FOLLOW_UP: ReadonlySet<SalesEventType> = new Set([
  "reply_received",
  "disqualified",
  "call_booked",
  "call_completed",
  "proposal_sent",
  "opportunity_won",
  "opportunity_lost",
  "moved_to_nurture",
]);

/** Rank by funnel depth. The furthest-reached stage wins, not the latest event. */
const STAGE_RANK: Record<FunnelStage, number> = {
  researched: 0,
  field_tested: 1,
  connection_requested: 2,
  connected: 3,
  first_message_sent: 4,
  follow_up_due: 5,
  follow_up_sent: 6,
  replied: 7,
  qualified: 8,
  call_booked: 9,
  call_completed: 10,
  proposal_sent: 11,
  // Terminal states sit above the ladder: reaching one ends the progression
  // regardless of how far along it happened.
  won: 100,
  lost: 100,
  disqualified: 100,
  nurture: 100,
};

const EVENT_TO_STAGE: Partial<Record<SalesEventType, FunnelStage>> = {
  prospect_researched: "researched",
  field_test_logged: "field_tested",
  connection_requested: "connection_requested",
  connection_accepted: "connected",
  first_message_sent: "first_message_sent",
  follow_up_sent: "follow_up_sent",
  reply_received: "replied",
  qualified: "qualified",
  disqualified: "disqualified",
  call_booked: "call_booked",
  call_completed: "call_completed",
  proposal_sent: "proposal_sent",
  opportunity_won: "won",
  opportunity_lost: "lost",
  moved_to_nurture: "nurture",
};

const OUTBOUND: ReadonlySet<SalesEventType> = new Set([
  "connection_requested",
  "first_message_sent",
  "follow_up_sent",
  "proposal_sent",
]);

const INBOUND: ReadonlySet<SalesEventType> = new Set([
  "connection_accepted",
  "reply_received",
]);

/**
 * Calendar day in a given IANA zone, as a y/m/d triple.
 *
 * Uses Intl rather than date arithmetic so that Costa Rica's offset is applied
 * by the platform. A message sent at 21:00 CR on Friday is still Friday, which
 * naive UTC handling would silently roll into Saturday.
 */
function zonedParts(iso: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return { year: get("year"), month: get("month"), day: get("day") };
}

/**
 * Day of week for a zoned calendar date, 0 = Sunday.
 *
 * Built from a UTC date constructed out of the zoned y/m/d, so the weekday
 * reflects the local calendar rather than the instant's UTC weekday.
 */
function zonedWeekday(iso: string, timeZone: string) {
  const { year, month, day } = zonedParts(iso, timeZone);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/**
 * Add N business days to a timestamp, counting Monday–Friday only.
 *
 * Deliberately no holiday calendar: a holiday-aware version needs a data source
 * and a maintenance commitment, and being one day off on a follow-up is far
 * cheaper than being wrong about which days are holidays in two countries.
 *
 * Returns midday UTC on the resulting date. Midday rather than midnight so that
 * neither a UTC-4 nor a UTC+2 reader sees the due date land on the wrong day.
 */
export function addBusinessDays(
  iso: string,
  days: number,
  timeZone: string = DEFAULT_FOLLOW_UP_POLICY.timeZone
): string {
  const { year, month, day } = zonedParts(iso, timeZone);
  const cursor = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  let remaining = Math.max(0, days);

  while (remaining > 0) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const weekday = cursor.getUTCDay();
    if (weekday !== 0 && weekday !== 6) remaining -= 1;
  }

  return cursor.toISOString();
}

export function isBusinessDay(
  iso: string,
  timeZone: string = DEFAULT_FOLLOW_UP_POLICY.timeZone
): boolean {
  const weekday = zonedWeekday(iso, timeZone);
  return weekday !== 0 && weekday !== 6;
}

/**
 * The one place that decides where an account stands.
 *
 * Deliberately not distributed across UI components: two components disagreeing
 * about whether a prospect has replied is a bug you cannot see, only feel.
 */
export function deriveAccountState(
  accountId: string,
  events: SalesEvent[],
  now: Date = new Date(),
  policy: FollowUpPolicy = DEFAULT_FOLLOW_UP_POLICY
): AccountFunnelState {
  const relevant = events
    .filter((event) => event.accountId === accountId)
    .toSorted((a, b) => a.occurredAt.localeCompare(b.occurredAt));

  if (relevant.length === 0) {
    return {
      accountId,
      stage: "researched",
      lastOutboundAt: null,
      lastInboundAt: null,
      nextAction: "Research this account",
      nextActionDueAt: null,
      isOverdue: false,
      terminal: null,
    };
  }

  // Deepest stage reached, not most recent event: a manual note logged after a
  // reply must not drag the account backwards.
  let stage: FunnelStage = "researched";
  for (const event of relevant) {
    const candidate = EVENT_TO_STAGE[event.type];
    if (candidate && STAGE_RANK[candidate] >= STAGE_RANK[stage]) stage = candidate;
  }

  const lastOutbound = relevant.filter((e) => OUTBOUND.has(e.type)).at(-1) ?? null;
  const lastInbound = relevant.filter((e) => INBOUND.has(e.type)).at(-1) ?? null;

  const terminal =
    stage === "won"
      ? ("won" as const)
      : stage === "lost"
        ? ("lost" as const)
        : stage === "disqualified"
          ? ("disqualified" as const)
          : stage === "nurture"
            ? ("nurture" as const)
            : null;

  if (terminal) {
    return {
      accountId,
      stage,
      lastOutboundAt: lastOutbound?.occurredAt ?? null,
      lastInboundAt: lastInbound?.occurredAt ?? null,
      nextAction: null,
      nextActionDueAt: null,
      isOverdue: false,
      terminal,
    };
  }

  const { nextAction, nextActionDueAt } = deriveNextAction(relevant, stage, policy);
  const isOverdue = nextActionDueAt !== null && new Date(nextActionDueAt) <= now;

  return {
    accountId,
    stage: isOverdue && stage === "first_message_sent" ? "follow_up_due" : stage,
    lastOutboundAt: lastOutbound?.occurredAt ?? null,
    lastInboundAt: lastInbound?.occurredAt ?? null,
    nextAction,
    nextActionDueAt,
    isOverdue,
    terminal: null,
  };
}

function deriveNextAction(
  events: SalesEvent[],
  stage: FunnelStage,
  policy: FollowUpPolicy
): { nextAction: string | null; nextActionDueAt: string | null } {
  const firstMessage = events.find((e) => e.type === "first_message_sent");
  const followUps = events.filter((e) => e.type === "follow_up_sent");

  // Anything that means they are now in the conversation cancels the reminder,
  // even if it arrived before the follow-up came due.
  const cancelled = events.some((e) => CANCELS_FOLLOW_UP.has(e.type));

  if (firstMessage && !cancelled && followUps.length < policy.maxFollowUps) {
    return {
      nextAction: "Send the one follow-up",
      nextActionDueAt: addBusinessDays(
        firstMessage.occurredAt,
        policy.businessDaysUntilDue,
        policy.timeZone
      ),
    };
  }

  switch (stage) {
    case "researched":
      return { nextAction: "Field-test their product and log one number", nextActionDueAt: null };
    case "field_tested":
      return { nextAction: "Write the opener from the observation", nextActionDueAt: null };
    case "connection_requested":
      return { nextAction: "Check LinkedIn for acceptance", nextActionDueAt: null };
    case "connected":
      return { nextAction: "Send the first message", nextActionDueAt: null };
    case "follow_up_sent":
      return { nextAction: "No further reminder — move to nurture or drop", nextActionDueAt: null };
    case "replied":
      return { nextAction: "Classify the reply", nextActionDueAt: null };
    case "qualified":
      return { nextAction: "Book the call", nextActionDueAt: null };
    case "call_booked":
      return { nextAction: "Prepare the call", nextActionDueAt: null };
    case "call_completed":
      return { nextAction: "Send the proposal with a held start date", nextActionDueAt: null };
    case "proposal_sent":
      return { nextAction: "Follow the proposal to a decision", nextActionDueAt: null };
    default:
      return { nextAction: null, nextActionDueAt: null };
  }
}

/**
 * Sample-size honesty.
 *
 * Thresholds are conventions, not statistics — deliberately so. Real intervals
 * on n=5 would be so wide as to be useless, and rendering them would suggest a
 * rigor the sample cannot support.
 */
export function rateConfidence(denominator: number): FunnelRate["confidence"] {
  if (denominator === 0) return "insufficient";
  if (denominator < 20) return "directional";
  if (denominator < 50) return "early";
  return "reportable";
}

/**
 * Build a rate that carries its own denominator.
 *
 * `rate` is null when nothing was eligible. Returning 0 there would render as
 * "0%", which reads as a measured failure rather than an absence of data.
 */
export function buildRate(
  label: string,
  numerator: number,
  denominator: number
): FunnelRate {
  return {
    label,
    numerator,
    denominator,
    rate: denominator === 0 ? null : numerator / denominator,
    confidence: rateConfidence(denominator),
  };
}

/** Count accounts that ever reached a given event type. */
export function countAccountsWithEvent(
  events: SalesEvent[],
  type: SalesEventType
): number {
  return new Set(
    events.filter((event) => event.type === type).map((event) => event.accountId)
  ).size;
}

/**
 * The funnel as a list of rates.
 *
 * Each denominator is the population that was ELIGIBLE to convert, not the
 * total pipeline: a reply rate over every account ever researched would flatter
 * or damn the messaging depending on how much discovery ran that week.
 */
export function buildFunnelRates(events: SalesEvent[]): FunnelRate[] {
  const researched = countAccountsWithEvent(events, "prospect_researched");
  const tested = countAccountsWithEvent(events, "field_test_logged");
  const requested = countAccountsWithEvent(events, "connection_requested");
  const accepted = countAccountsWithEvent(events, "connection_accepted");
  const messaged = countAccountsWithEvent(events, "first_message_sent");
  const replied = countAccountsWithEvent(events, "reply_received");
  const qualified = countAccountsWithEvent(events, "qualified");
  const booked = countAccountsWithEvent(events, "call_booked");
  const completed = countAccountsWithEvent(events, "call_completed");
  const proposed = countAccountsWithEvent(events, "proposal_sent");
  const won = countAccountsWithEvent(events, "opportunity_won");

  return [
    buildRate("Researched → field tested", tested, researched),
    buildRate("Connection acceptance", accepted, requested),
    buildRate("First message → reply", replied, messaged),
    buildRate("Reply → qualified", qualified, replied),
    buildRate("Qualified → call booked", booked, qualified),
    buildRate("Call → proposal", proposed, completed),
    buildRate("Proposal → won", won, proposed),
  ];
}

/**
 * Median days between the first occurrence of two event types, per account.
 * Median rather than mean: one stalled prospect should not move the number.
 */
export function medianDaysBetween(
  events: SalesEvent[],
  from: SalesEventType,
  to: SalesEventType
): number | null {
  const byAccount = new Map<string, { from?: string; to?: string }>();

  for (const event of events.toSorted((a, b) => a.occurredAt.localeCompare(b.occurredAt))) {
    const entry = byAccount.get(event.accountId) ?? {};
    if (event.type === from && !entry.from) entry.from = event.occurredAt;
    if (event.type === to && !entry.to) entry.to = event.occurredAt;
    byAccount.set(event.accountId, entry);
  }

  const spans = [...byAccount.values()]
    .filter((entry) => entry.from && entry.to)
    .map(
      (entry) =>
        (new Date(entry.to!).getTime() - new Date(entry.from!).getTime()) / 86_400_000
    )
    .filter((days) => days >= 0)
    .toSorted((a, b) => a - b);

  if (spans.length === 0) return null;
  const mid = Math.floor(spans.length / 2);
  return spans.length % 2 === 0 ? (spans[mid - 1] + spans[mid]) / 2 : spans[mid];
}

/**
 * Idempotency key for an event.
 *
 * "Mark accepted" clicked twice, or a double-submitted form, must not deepen
 * the funnel. Keyed to the day rather than the instant so a retry seconds later
 * collapses, while a genuine second follow-up next week does not.
 */
export function buildDedupeKey(
  accountId: string,
  type: SalesEventType,
  occurredAt: string
): string {
  return `${accountId}:${type}:${occurredAt.slice(0, 10)}`;
}
