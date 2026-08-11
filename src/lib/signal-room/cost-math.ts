/**
 * Discovery-call cost math.
 *
 * Deliberately model-free. Every figure the operator says on a call comes from
 * this file so it can be defended when challenged, and every figure carries a
 * `basis` describing whether the prospect stated it or the operator estimated
 * it. That distinction is what stops a number being corrected mid-call.
 */

import type { CallRecord } from "@/lib/signal-room/types";

export interface CostFigure {
  label: string;
  value: number | null;
  display: string;
  basis: string;
  confidence: "stated" | "estimated" | "unknown";
}

export interface CostMathResult {
  figures: CostFigure[];
  monthlyReclaim: number | null;
  annualReclaim: number | null;
  revenueDelta: number | null;
  costOfDelayPerMonth: number | null;
  paybackMonths: number | null;
  roiMultiple: number | null;
  /** Blocking questions still unanswered before a price can be quoted. */
  missing: string[];
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatUsd(value: number | null) {
  return value === null || Number.isNaN(value) ? "—" : usd.format(value);
}

function figure(
  label: string,
  value: number | null,
  basis: string,
  confidence: CostFigure["confidence"],
  display?: string
): CostFigure {
  return {
    label,
    value,
    display: display ?? formatUsd(value),
    basis: basis.trim() || "No basis recorded.",
    confidence,
  };
}

export function computeCostMath(
  call: Partial<CallRecord>,
  options: { mutualFitJudged?: boolean } = {}
): CostMathResult {
  const spend = numberOrNull(call.monthlySpendUsd);
  const wastePct = numberOrNull(call.wastePct);
  const revenueNow = numberOrNull(call.revenueNowUsd);
  const revenueTarget = numberOrNull(call.revenueTargetUsd);
  const price = numberOrNull(call.priceUsd);

  const monthlyReclaim =
    spend !== null && wastePct !== null ? (spend * wastePct) / 100 : null;
  const annualReclaim = monthlyReclaim === null ? null : monthlyReclaim * 12;
  const revenueDelta =
    revenueNow !== null && revenueTarget !== null ? revenueTarget - revenueNow : null;

  // The urgency number: what one more month of not fixing it costs.
  const costOfDelayPerMonth = monthlyReclaim;

  const paybackMonths =
    price !== null && monthlyReclaim !== null && monthlyReclaim > 0
      ? price / monthlyReclaim
      : null;
  const roiMultiple =
    price !== null && price > 0 && annualReclaim !== null ? annualReclaim / price : null;

  const spendBasisConfidence = confidenceOf(call.spendBasis, spend);
  const wasteBasisConfidence = confidenceOf(call.wasteBasis, wastePct);

  const figures: CostFigure[] = [
    figure("Monthly resource spend", spend, call.spendBasis ?? "", spendBasisConfidence),
    figure(
      "Avoidable share",
      wastePct,
      call.wasteBasis ?? "",
      wasteBasisConfidence,
      wastePct === null ? "—" : `${wastePct}%`
    ),
    figure(
      "Reclaimed per month",
      monthlyReclaim,
      "Derived: monthly spend x avoidable share.",
      weakest(spendBasisConfidence, wasteBasisConfidence)
    ),
    figure(
      "Reclaimed per year",
      annualReclaim,
      "Derived: reclaimed per month x 12.",
      weakest(spendBasisConfidence, wasteBasisConfidence)
    ),
    figure(
      "Cost of leaving it",
      costOfDelayPerMonth,
      call.costOfDelay?.trim()
        ? `Their words: ${call.costOfDelay.trim()}`
        : "Derived: one month of unreclaimed spend.",
      weakest(spendBasisConfidence, wasteBasisConfidence)
    ),
    figure(
      "Revenue delta discussed",
      revenueDelta,
      revenueNow !== null && revenueTarget !== null
        ? `From ${formatUsd(revenueNow)} to ${formatUsd(revenueTarget)}, as discussed on the call.`
        : "",
      revenueDelta === null ? "unknown" : "stated"
    ),
  ];

  if (price !== null) {
    figures.push(
      figure(
        "Payback period",
        paybackMonths,
        "Derived: price divided by monthly reclaim.",
        weakest(spendBasisConfidence, wasteBasisConfidence),
        paybackMonths === null ? "—" : `${paybackMonths.toFixed(1)} months`
      ),
      figure(
        "First-year return",
        roiMultiple,
        "Derived: annual reclaim divided by price.",
        weakest(spendBasisConfidence, wasteBasisConfidence),
        roiMultiple === null ? "—" : `${roiMultiple.toFixed(1)}x`
      )
    );
  }

  const missing: string[] = [];
  if (spend === null) missing.push("Monthly resource spend is unknown — ask what the process costs.");
  if (wastePct === null) missing.push("Avoidable share is unknown — ask how much is rework or waste.");
  if (!call.reclaimIntent?.trim()) {
    missing.push('No answer to "if you had that back, what would you do with it?"');
  }
  if (!call.costOfDelay?.trim()) {
    missing.push('No answer to "how long are you going to leave it like that?"');
  }
  if (options.mutualFitJudged === false) {
    missing.push("Mutual fit has not been judged yet.");
  }

  return {
    figures,
    monthlyReclaim,
    annualReclaim,
    revenueDelta,
    costOfDelayPerMonth,
    paybackMonths,
    roiMultiple,
    missing,
  };
}

function numberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** A figure is only "stated" when the operator recorded where it came from. */
function confidenceOf(basis: string | undefined, value: number | null): CostFigure["confidence"] {
  if (value === null) return "unknown";
  return basis?.trim() ? "stated" : "estimated";
}

function weakest(...values: CostFigure["confidence"][]): CostFigure["confidence"] {
  if (values.includes("unknown")) return "unknown";
  if (values.includes("estimated")) return "estimated";
  return "stated";
}
