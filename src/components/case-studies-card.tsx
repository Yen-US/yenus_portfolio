"use client";

import { caseStudies } from "@/lib/resume-data";

export function CaseStudiesCard() {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-baseline justify-between gap-3">
        <SectionLabel kicker="05" title="Signature case study" />
        <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:block">
          A taste of recent work
        </p>
      </div>

      {caseStudies.map((cs) => (
        <article key={cs.title} className="flex flex-1 flex-col gap-6">
          {/* Metrics rail */}
          <dl className="grid grid-cols-3 gap-4 rounded-xl border border-brass/20 bg-brass/[0.04] p-4">
            {cs.metrics.map((m) => (
              <div key={m.label}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass/80">
                  {m.label}
                </dt>
                <dd className="mt-1 font-display text-xl leading-none tabular text-foreground">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <h3 className="font-display text-2xl leading-tight text-foreground md:text-3xl">
                {cs.title}
                <span className="text-muted-foreground/40">.</span>
              </h3>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {cs.client}
                {cs.clientNote && (
                  <span className="text-muted-foreground/70"> · {cs.clientNote}</span>
                )}
                <span className="text-muted-foreground/70"> · {cs.period}</span>
              </p>
            </div>

            <div className="space-y-3 md:col-span-5">
              <PhaseLine label="Problem" body={cs.problem} />
              <PhaseLine label="Approach" body={cs.approach} />
              <PhaseLine label="Outcome" body={cs.outcome} />
            </div>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/50 pt-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Stack
            </span>
            {cs.stack.map((s, i) => (
              <span key={s} className="flex items-baseline gap-3 font-mono text-[11px] text-foreground/80">
                {s}
                {i < cs.stack.length - 1 && (
                  <span aria-hidden="true" className="text-muted-foreground/40">·</span>
                )}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function PhaseLine({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
        {label}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-foreground/85">{body}</p>
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
