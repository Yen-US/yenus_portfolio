import { describe, expect, it } from "vitest";
import {
  checkDraft,
  contentMix,
  hasBlockers,
} from "@/lib/signal-room/content-rules";

const base = {
  contentType: "measured_test" as const,
  offerMentioned: false,
  claimLedger: [] as { claim: string; evidence: string; kind: string }[],
};

describe("evidence blockers", () => {
  it("blocks a [VERIFY] marker", () => {
    const checks = checkDraft({ ...base, body: "Latency rose [VERIFY] last quarter." });
    expect(hasBlockers(checks)).toBe(true);
    expect(checks.some((c) => c.id === "verify-marker")).toBe(true);
  });

  it("blocks a precise figure with no ledger entry", () => {
    const checks = checkDraft({ ...base, body: "We measured 340ms at the p95." });
    expect(checks.some((c) => c.id === "unsourced-figures")).toBe(true);
  });

  it("allows the same figure once the ledger carries it", () => {
    const checks = checkDraft({
      ...base,
      body: "We measured 340ms at the p95.",
      claimLedger: [{ claim: "340ms", evidence: "own measurement", kind: "personal" }],
    });
    expect(checks.some((c) => c.id === "unsourced-figures")).toBe(false);
  });

  it("blocks direct Microsoft employment phrasing", () => {
    expect(
      checkDraft({ ...base, body: "As an architect @ Microsoft, I see this weekly." }).some(
        (c) => c.id === "employer-attribution"
      )
    ).toBe(true);
  });

  it("permits the accurate Microsoft for Startups phrasing", () => {
    expect(
      checkDraft({
        ...base,
        body: "Supporting Microsoft for Startups via Accenture, I see this weekly.",
      }).some((c) => c.id === "employer-attribution")
    ).toBe(false);
  });

  it("blocks a measured visual with no methodology", () => {
    const checks = checkDraft({
      ...base,
      body: "The chart shows the latency split.",
      visualEvidenceState: "measured",
      visualHasMethodology: false,
    });
    expect(checks.some((c) => c.id === "visual-without-methodology")).toBe(true);
  });

  it("does not block an illustrative visual", () => {
    const checks = checkDraft({
      ...base,
      body: "The chart shows the shape, not real numbers.",
      visualEvidenceState: "illustrative",
      visualHasMethodology: false,
    });
    expect(hasBlockers(checks)).toBe(false);
  });
});

describe("structure warnings", () => {
  it("warns but never blocks on length", () => {
    const checks = checkDraft({ ...base, body: "x".repeat(2000) });
    expect(checks.some((c) => c.id === "too-long")).toBe(true);
    expect(hasBlockers(checks)).toBe(false);
  });

  it("flags a thesis that lands below the fold", () => {
    const body = `${"a word ".repeat(60)}. Then the point arrives.`;
    expect(checkDraft({ ...base, body }).some((c) => c.id === "late-thesis")).toBe(true);
  });

  it("flags universal claims", () => {
    expect(
      checkDraft({ ...base, body: "Every team gets this wrong. Do they?" }).some(
        (c) => c.id === "universal-claim"
      )
    ).toBe(true);
  });

  it("flags a second offer mention", () => {
    const body =
      "Book a call if this is live for you. Seriously, book a call — the Inference Readiness Review covers it?";
    expect(checkDraft({ ...base, body }).some((c) => c.id === "repeated-offer")).toBe(true);
  });

  it("warns when the recent mix is mostly selling", () => {
    const recent = [
      { contentType: "offer" as const, ctaType: "offer" as const, offerMentioned: true },
      { contentType: "offer" as const, ctaType: "offer" as const, offerMentioned: true },
      { contentType: "measured_test" as const, ctaType: "question" as const, offerMentioned: false },
    ];
    const checks = checkDraft({ ...base, body: "A short note?", offerMentioned: true, recentPosts: recent });
    expect(checks.some((c) => c.id === "mix-too-salesy")).toBe(true);
  });
});

describe("contentMix", () => {
  it("returns null shares rather than zeroes for an empty history", () => {
    expect(contentMix([]).every((row) => row.share === null)).toBe(true);
  });

  it("computes observed share against target", () => {
    const mix = contentMix([
      { contentType: "measured_test" },
      { contentType: "offer" },
    ]);
    expect(mix.find((m) => m.type === "measured_test")?.share).toBe(0.5);
  });
});
