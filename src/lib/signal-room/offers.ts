/**
 * The offer ladder as data.
 *
 * Sourced from docs/plans/2026-07-27-ai-consulting-site-strategy.md, which
 * deliberately does not publish pricing. Price bands here are INTERNAL
 * planning defaults for the proposal step, never rendered on the public site.
 *
 * Treat every band as a starting point the operator overrides per engagement.
 * A model must never select the number — it drafts the plan around a price
 * that has already been typed in, exactly as the fit score is never
 * model-chosen.
 */

import type { OfferName } from "@/lib/signal-room/types";

export interface OfferDefinition {
  name: OfferName;
  durationLabel: string;
  /** Working days, used to sanity-check a 90-day plan against scope. */
  typicalDays: number;
  bestWhen: string;
  produces: string[];
  /** Internal planning band in USD. Override per engagement. */
  priceBand: { low: number; high: number };
  /** Default upfront share of the agreed price. */
  upfrontShare: number;
}

export const OFFERS: OfferDefinition[] = [
  {
    name: "AI Direction Sprint",
    durationLabel: "1 to 2 weeks",
    typicalDays: 10,
    bestWhen:
      "Leadership knows AI matters but has not chosen the right first investment.",
    produces: [
      "Use-case prioritization",
      "Readiness and risk assessment",
      "A 90-day roadmap",
    ],
    priceBand: { low: 3_500, high: 6_000 },
    upfrontShare: 0.25,
  },
  {
    name: "AI Architecture Sprint",
    durationLabel: "2 to 4 weeks",
    typicalDays: 20,
    bestWhen:
      "One consequential initiative must move from prototype toward production.",
    produces: [
      "Target architecture",
      "Decision records",
      "Human-AI boundaries",
      "Evaluation and operational plans",
      "A phased handoff",
    ],
    priceBand: { low: 8_000, high: 16_000 },
    upfrontShare: 0.25,
  },
  {
    name: "AI Team Enablement",
    durationLabel: "3 to 6 weeks",
    typicalDays: 30,
    bestWhen:
      "A growing team is outgrowing decisions and context held by one founder.",
    produces: [
      "Founder alignment",
      "Right-sized governance",
      "Team workflows and office hours",
      "Adoption measures",
    ],
    priceBand: { low: 12_000, high: 24_000 },
    upfrontShare: 0.25,
  },
  {
    name: "Fractional AI Architect",
    durationLabel: "Ongoing, after an initial sprint",
    typicalDays: 0,
    bestWhen:
      "Architecture review, vendor decisions, and technical oversight are needed continuously.",
    produces: [
      "Ongoing architecture review",
      "Vendor and model decisions",
      "Technical oversight and leadership support",
    ],
    priceBand: { low: 4_000, high: 9_000 },
    upfrontShare: 0.5,
  },
];

export function getOffer(name: string): OfferDefinition | null {
  return OFFERS.find((offer) => offer.name === name) ?? null;
}

export function suggestUpfront(name: string, price: number | null) {
  if (price === null || Number.isNaN(price)) return null;
  const offer = getOffer(name);
  if (!offer) return null;
  return Math.round(price * offer.upfrontShare);
}
