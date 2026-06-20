"use client";

import { speaking, conferences } from "@/lib/resume-data";
import { Mic, MapPin } from "lucide-react";

export function SpeakingCard() {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-baseline justify-between gap-3">
        <SectionLabel kicker="08" title="Speaking & training" />
        <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:flex">
          <Mic className="h-3 w-3 text-brass" />
          For Microsoft for Startups & founders
        </span>
      </div>

      <ol className="space-y-0">
        {speaking.map((s, i) => (
          <li
            key={s.title}
            className="grid grid-cols-[auto_1fr] items-start gap-6 border-t border-border/50 py-5 first:border-t-0"
          >
            <span className="font-mono text-xs tabular text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display text-lg leading-tight text-foreground">
                {s.title}
                <span className="text-muted-foreground/40">.</span>
              </h3>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {s.format}
                {s.cadence && (
                  <span className="text-muted-foreground/70"> · {s.cadence}</span>
                )}
              </p>
              <p className="mt-2 text-sm text-foreground/85">{s.audience}</p>
              <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {s.topics.map((t, idx) => (
                  <li key={t} className="flex items-baseline gap-3">
                    <span>{t}</span>
                    {idx < s.topics.length - 1 && (
                      <span aria-hidden="true" className="text-muted-foreground/40">·</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      {/* Continuously learning rail */}
      <div className="mt-auto rounded-2xl border border-border/60 bg-secondary/20 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Also attending
            </span>
            <p className="font-display text-sm leading-none text-foreground/85">
              Conferences I attend to stay on the cutting edge
              <span className="text-muted-foreground/40">.</span>
            </p>
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 md:block">
            Attended, not spoken
          </span>
        </div>

        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {conferences.map((c) => (
            <li
              key={c.name}
              className="rounded-xl border border-border/50 bg-background/40 p-3"
            >
              <p className="font-display text-sm leading-tight text-foreground/85">
                {c.name}
              </p>
              <p className="mt-1 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <MapPin className="h-3 w-3 text-muted-foreground/70" />
                {c.location}
              </p>
              <p className="mt-2 flex flex-wrap items-baseline gap-1.5 font-mono text-[11px] tabular text-muted-foreground">
                {c.years.map((y, idx) => (
                  <span key={y} className="flex items-baseline gap-1.5">
                    {y}
                    {idx < c.years.length - 1 && (
                      <span aria-hidden="true" className="text-muted-foreground/40">·</span>
                    )}
                  </span>
                ))}
              </p>
              {c.note && (
                <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground/80">
                  {c.note}
                </p>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground/80">
          I travel to where the field is moving — agents, runtimes, and product
          craft — and bring back what's worth shipping.
        </p>
      </div>
    </div>
  );
}

function SectionLabel({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass">
        {kicker}
      </span>
      <h2 className="font-display text-2xl leading-none tracking-tight">
        {title}
      </h2>
    </div>
  );
}
