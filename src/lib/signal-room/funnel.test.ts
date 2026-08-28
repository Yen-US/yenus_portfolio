import { describe, expect, it } from "vitest";
import {
  addBusinessDays,
  buildDedupeKey,
  buildFunnelRates,
  buildRate,
  deriveAccountState,
  isBusinessDay,
  medianDaysBetween,
  rateConfidence,
} from "@/lib/signal-room/funnel";
import type { SalesEvent, SalesEventType } from "@/lib/signal-room/types";

/** Terse event builder — these tests are about sequence, not payloads. */
function event(
  type: SalesEventType,
  occurredAt: string,
  accountId = "acct-1"
): SalesEvent {
  return {
    id: `${type}-${occurredAt}`,
    accountId,
    contactId: null,
    type,
    occurredAt,
    observedAt: null,
    occurredAtPrecision: "exact",
    source: "manual",
    actor: "yenson",
    variantId: null,
    metadata: {},
    createdAt: occurredAt,
  };
}

describe("addBusinessDays", () => {
  it("skips the weekend", () => {
    // Mon 2026-08-03 + 6 business days = Tue 2026-08-11.
    expect(addBusinessDays("2026-08-03T15:00:00Z", 6).slice(0, 10)).toBe("2026-08-11");
  });

  it("crosses two weekends when the span requires it", () => {
    // Thu 2026-08-06 + 6 business days = Fri 2026-08-14.
    expect(addBusinessDays("2026-08-06T15:00:00Z", 6).slice(0, 10)).toBe("2026-08-14");
  });

  it("never lands on a Saturday or Sunday", () => {
    for (let day = 1; day <= 28; day += 1) {
      const iso = `2026-08-${String(day).padStart(2, "0")}T15:00:00Z`;
      expect(isBusinessDay(addBusinessDays(iso, 6))).toBe(true);
    }
  });

  it("uses the Costa Rica calendar day, not the UTC one", () => {
    // 2026-08-08T02:00Z is Friday 20:00 in Costa Rica (UTC-6), not Saturday.
    // Counting from Friday gives Monday 2026-08-10; counting from the UTC
    // Saturday would give Tuesday.
    expect(addBusinessDays("2026-08-08T02:00:00Z", 1).slice(0, 10)).toBe("2026-08-10");
  });

  it("returns the same calendar day for zero days", () => {
    expect(addBusinessDays("2026-08-05T15:00:00Z", 0).slice(0, 10)).toBe("2026-08-05");
  });
});

describe("deriveAccountState", () => {
  it("defaults to researched with no events", () => {
    const state = deriveAccountState("acct-1", []);
    expect(state.stage).toBe("researched");
    expect(state.nextActionDueAt).toBeNull();
  });

  it("walks the normal progression", () => {
    const state = deriveAccountState("acct-1", [
      event("prospect_researched", "2026-08-01T10:00:00Z"),
      event("field_test_logged", "2026-08-02T10:00:00Z"),
      event("connection_requested", "2026-08-03T10:00:00Z"),
      event("connection_accepted", "2026-08-04T10:00:00Z"),
    ]);
    expect(state.stage).toBe("connected");
    expect(state.nextAction).toBe("Send the first message");
    expect(state.lastInboundAt).toBe("2026-08-04T10:00:00Z");
  });

  it("accepts a warm prospect entering late", () => {
    const state = deriveAccountState("acct-1", [
      event("reply_received", "2026-08-10T10:00:00Z"),
    ]);
    expect(state.stage).toBe("replied");
    expect(state.nextAction).toBe("Classify the reply");
  });

  it("schedules one follow-up six business days after the first message", () => {
    const state = deriveAccountState(
      "acct-1",
      [event("first_message_sent", "2026-08-03T15:00:00Z")],
      new Date("2026-08-05T12:00:00Z")
    );
    expect(state.nextAction).toBe("Send the one follow-up");
    expect(state.nextActionDueAt?.slice(0, 10)).toBe("2026-08-11");
    expect(state.isOverdue).toBe(false);
  });

  it("marks the follow-up overdue once the due date passes", () => {
    const state = deriveAccountState(
      "acct-1",
      [event("first_message_sent", "2026-08-03T15:00:00Z")],
      new Date("2026-08-20T12:00:00Z")
    );
    expect(state.isOverdue).toBe(true);
    expect(state.stage).toBe("follow_up_due");
  });

  it.each<SalesEventType>([
    "reply_received",
    "disqualified",
    "call_booked",
    "opportunity_won",
    "opportunity_lost",
    "moved_to_nurture",
  ])("cancels the follow-up after %s", (cancelling) => {
    const state = deriveAccountState(
      "acct-1",
      [
        event("first_message_sent", "2026-08-03T15:00:00Z"),
        event(cancelling, "2026-08-05T15:00:00Z"),
      ],
      new Date("2026-08-20T12:00:00Z")
    );
    expect(state.nextAction).not.toBe("Send the one follow-up");
    expect(state.isOverdue).toBe(false);
  });

  it("enforces one follow-up only", () => {
    const state = deriveAccountState(
      "acct-1",
      [
        event("first_message_sent", "2026-08-03T15:00:00Z"),
        event("follow_up_sent", "2026-08-11T15:00:00Z"),
      ],
      new Date("2026-08-30T12:00:00Z")
    );
    expect(state.nextAction).toBe("No further reminder — move to nurture or drop");
    expect(state.nextActionDueAt).toBeNull();
  });

  it("does not move backwards when a note is logged after a reply", () => {
    const state = deriveAccountState("acct-1", [
      event("reply_received", "2026-08-10T10:00:00Z"),
      event("manual_note", "2026-08-12T10:00:00Z"),
    ]);
    expect(state.stage).toBe("replied");
  });

  it("stops at a terminal disposition", () => {
    const state = deriveAccountState("acct-1", [
      event("first_message_sent", "2026-08-03T15:00:00Z"),
      event("opportunity_won", "2026-08-20T10:00:00Z"),
    ]);
    expect(state.terminal).toBe("won");
    expect(state.nextAction).toBeNull();
  });

  it("ignores events belonging to other accounts", () => {
    const state = deriveAccountState("acct-1", [
      event("prospect_researched", "2026-08-01T10:00:00Z", "acct-1"),
      event("opportunity_won", "2026-08-02T10:00:00Z", "acct-2"),
    ]);
    expect(state.terminal).toBeNull();
    expect(state.stage).toBe("researched");
  });
});

describe("rates", () => {
  it("returns null rather than 0% when nothing was eligible", () => {
    const rate = buildRate("Connection acceptance", 0, 0);
    expect(rate.rate).toBeNull();
    expect(rate.confidence).toBe("insufficient");
  });

  it("distinguishes a measured zero from an absent denominator", () => {
    expect(buildRate("Reply rate", 0, 5).rate).toBe(0);
    expect(buildRate("Reply rate", 0, 0).rate).toBeNull();
  });

  it("warns on small samples at the documented thresholds", () => {
    expect(rateConfidence(0)).toBe("insufficient");
    expect(rateConfidence(19)).toBe("directional");
    expect(rateConfidence(20)).toBe("early");
    expect(rateConfidence(49)).toBe("early");
    expect(rateConfidence(50)).toBe("reportable");
  });

  it("counts accounts once even when an event repeats", () => {
    const rates = buildFunnelRates([
      event("connection_requested", "2026-08-01T10:00:00Z", "a"),
      event("connection_requested", "2026-08-02T10:00:00Z", "a"),
      event("connection_requested", "2026-08-01T10:00:00Z", "b"),
      event("connection_accepted", "2026-08-03T10:00:00Z", "a"),
    ]);
    const acceptance = rates.find((r) => r.label === "Connection acceptance")!;
    expect(acceptance.denominator).toBe(2);
    expect(acceptance.numerator).toBe(1);
  });

  it("reproduces the real observed funnel: 5 requested, 1 accepted, 0 replies", () => {
    const events = ["a", "b", "c", "d", "e"].map((id) =>
      event("connection_requested", "2026-08-20T10:00:00Z", id)
    );
    events.push(event("connection_accepted", "2026-08-22T10:00:00Z", "a"));
    events.push(event("first_message_sent", "2026-08-22T12:00:00Z", "a"));

    const rates = buildFunnelRates(events);
    const acceptance = rates.find((r) => r.label === "Connection acceptance")!;
    const reply = rates.find((r) => r.label === "First message → reply")!;

    expect(acceptance.numerator).toBe(1);
    expect(acceptance.denominator).toBe(5);
    expect(acceptance.confidence).toBe("directional");
    // Zero replies out of one message is a real 0, not missing data.
    expect(reply.rate).toBe(0);
    expect(reply.denominator).toBe(1);
  });
});

describe("medianDaysBetween", () => {
  it("returns null when no account completed the span", () => {
    expect(
      medianDaysBetween([event("connection_requested", "2026-08-01T10:00:00Z")], "connection_requested", "connection_accepted")
    ).toBeNull();
  });

  it("takes the median, not the mean", () => {
    const events = [
      event("connection_requested", "2026-08-01T00:00:00Z", "a"),
      event("connection_accepted", "2026-08-02T00:00:00Z", "a"),
      event("connection_requested", "2026-08-01T00:00:00Z", "b"),
      event("connection_accepted", "2026-08-03T00:00:00Z", "b"),
      event("connection_requested", "2026-08-01T00:00:00Z", "c"),
      event("connection_accepted", "2026-09-01T00:00:00Z", "c"),
    ];
    expect(medianDaysBetween(events, "connection_requested", "connection_accepted")).toBe(2);
  });
});

describe("buildDedupeKey", () => {
  it("collapses a same-day retry", () => {
    expect(buildDedupeKey("a", "connection_accepted", "2026-08-20T10:00:00Z")).toBe(
      buildDedupeKey("a", "connection_accepted", "2026-08-20T23:59:00Z")
    );
  });

  it("keeps a genuine later follow-up distinct", () => {
    expect(buildDedupeKey("a", "follow_up_sent", "2026-08-20T10:00:00Z")).not.toBe(
      buildDedupeKey("a", "follow_up_sent", "2026-08-27T10:00:00Z")
    );
  });
});
