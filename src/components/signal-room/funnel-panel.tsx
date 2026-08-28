"use client";

import { useMemo } from "react";
import type {
  Account,
  ContentMetricSnapshot,
  ContentPost,
  FunnelRate,
  SalesEvent,
} from "@/lib/signal-room/types";
import {
  buildFunnelRates,
  countAccountsWithEvent,
  medianDaysBetween,
} from "@/lib/signal-room/funnel";
import { contentMix } from "@/lib/signal-room/content-rules";
import { PanelHeading, StatusBadge } from "@/components/signal-room/ui";

/**
 * The funnel, with its denominators showing.
 *
 * Every rate renders as `n / d` beside the percentage, and a rate with no
 * eligible population renders as "no data" rather than 0%. At the current
 * sample size the honest reading is that almost nothing here is conclusive —
 * the display is built to keep saying so rather than to look impressive.
 */
export function FunnelPanel({
  accounts,
  events,
  posts,
  metrics,
}: {
  accounts: Account[];
  events: SalesEvent[];
  posts: ContentPost[];
  metrics: ContentMetricSnapshot[];
}) {
  const rates = useMemo(() => buildFunnelRates(events), [events]);
  const mix = useMemo(() => contentMix(posts), [posts]);

  const medianToAccept = medianDaysBetween(
    events,
    "connection_requested",
    "connection_accepted"
  );
  const medianToReply = medianDaysBetween(events, "first_message_sent", "reply_received");

  const counts = [
    { label: "Researched", value: countAccountsWithEvent(events, "prospect_researched") },
    { label: "Field tested", value: countAccountsWithEvent(events, "field_test_logged") },
    { label: "Requested", value: countAccountsWithEvent(events, "connection_requested") },
    { label: "Accepted", value: countAccountsWithEvent(events, "connection_accepted") },
    { label: "Replied", value: countAccountsWithEvent(events, "reply_received") },
    { label: "Calls booked", value: countAccountsWithEvent(events, "call_booked") },
  ];

  return (
    <div>
      <PanelHeading
        eyebrow="Funnel"
        title="Rates, with the denominators attached."
      />

      <p className="mt-5 max-w-2xl text-xs leading-5 text-muted-foreground">
        {accounts.length} accounts tracked, {events.length} ledger events. Rates
        below 20 eligible events are labelled directional — at that size the
        interval is wider than any conclusion you would draw from it.
      </p>

      <dl className="mt-7 grid border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
        {counts.map((entry) => (
          <div key={entry.label} className="bg-card p-4">
            <dt className="text-[11px] leading-4 text-muted-foreground">{entry.label}</dt>
            <dd className="consulting-display mt-2 text-2xl">{entry.value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10">
        <h2 className="text-sm font-semibold">Conversion</h2>
        <ul className="mt-3 border border-border">
          {rates.map((rate) => (
            <RateRow key={rate.label} rate={rate} />
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold">Time between stages</h2>
        <dl className="mt-3 grid gap-px border border-border bg-border sm:grid-cols-2">
          <div className="bg-card p-4">
            <dt className="text-[11px] text-muted-foreground">
              Median days, request → acceptance
            </dt>
            <dd className="consulting-display mt-2 text-2xl">
              {medianToAccept === null ? (
                <span className="text-base text-muted-foreground">No completed spans</span>
              ) : (
                medianToAccept.toFixed(1)
              )}
            </dd>
          </div>
          <div className="bg-card p-4">
            <dt className="text-[11px] text-muted-foreground">
              Median days, first message → reply
            </dt>
            <dd className="consulting-display mt-2 text-2xl">
              {medianToReply === null ? (
                <span className="text-base text-muted-foreground">No completed spans</span>
              ) : (
                medianToReply.toFixed(1)
              )}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold">Content mix</h2>
        <ul className="mt-3 border border-border">
          {mix.map((row) => (
            <li
              key={row.type}
              className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0"
            >
              <span className="text-sm">{row.type.replace(/_/g, " ")}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {row.share === null
                  ? "no posts yet"
                  : `${Math.round(row.share * 100)}% of ${posts.length} · target ${Math.round(row.target * 100)}%`}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold">Content metrics recorded</h2>
        {metrics.length === 0 ? (
          <p className="mt-3 border border-border bg-secondary/40 p-4 text-xs leading-5 text-muted-foreground">
            No snapshots captured. LinkedIn does not expose post analytics for
            personal accounts through the API — these are entered by hand from
            the post view, and a blank field stays unavailable rather than
            becoming a zero.
          </p>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            {metrics.length} snapshot(s) across {new Set(metrics.map((m) => m.postId)).size}{" "}
            post(s).
          </p>
        )}
      </section>
    </div>
  );
}

function RateRow({ rate }: { rate: FunnelRate }) {
  const tone =
    rate.confidence === "reportable"
      ? "good"
      : rate.confidence === "insufficient"
        ? "neutral"
        : "warn";

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <span className="text-sm">{rate.label}</span>
      <span className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          {rate.numerator} / {rate.denominator}
        </span>
        <span className="consulting-display text-lg">
          {rate.rate === null ? (
            <span className="text-sm text-muted-foreground">no data</span>
          ) : (
            `${Math.round(rate.rate * 100)}%`
          )}
        </span>
        <StatusBadge tone={tone}>
          {rate.confidence === "insufficient"
            ? "no sample"
            : rate.confidence === "directional"
              ? "directional"
              : rate.confidence === "early"
                ? "early signal"
                : "reportable"}
        </StatusBadge>
      </span>
    </li>
  );
}
