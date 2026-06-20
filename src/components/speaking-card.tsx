"use client";

import { speaking } from "@/lib/resume-data";
import { Mic } from "lucide-react";

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
