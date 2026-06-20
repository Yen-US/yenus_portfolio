"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { experiences } from "@/lib/resume-data";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export function ExperienceCard() {
  const featured = experiences.slice(0, 4);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button
          type="button"
          className="group/exp h-full w-full text-left focus-ring"
          whileTap={{ scale: 0.995 }}
          aria-label="View full experience"
        >
          <div className="flex h-full flex-col gap-5">
            <SectionLabel kicker="01" title="Experience" />

            <ol className="-mt-1 flex-1 space-y-0">
              {featured.map((exp, i) => (
                <li
                  key={i}
                  className="group/row relative grid grid-cols-[auto_1fr_auto] items-baseline gap-3 border-t border-border/50 py-3 first:border-t-0"
                >
                  <span className="font-mono text-[10px] tabular text-muted-foreground">
                    {periodShort(exp.period)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {exp.role}
                    </p>
                    <p className="truncate font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {exp.company}
                      {exp.companyNote && (
                        <span className="text-muted-foreground/60">
                          {" "}· {exp.companyNote}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {exp.current && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brass" title="Current" />
                    )}
                    {exp.founder && (
                      <span className="font-mono text-[9px] uppercase tracking-wider text-brass">
                        Founder
                      </span>
                    )}
                    {exp.promoted && !exp.founder && (
                      <span className="font-mono text-[9px] uppercase tracking-wider text-signal">
                        ↑ Promoted
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span>{experiences.length} total roles</span>
              <span className="flex items-center gap-1 text-foreground/70 transition-colors group-hover/exp:text-brass">
                View all
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </motion.button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl border-border/60 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-tight">
            Full experience
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] space-y-0 overflow-y-auto pr-2">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="border-t border-border/50 py-5 first:border-t-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg leading-tight text-foreground">
                  {exp.role}
                </h3>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground tabular">
                  {exp.period}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {exp.company}
                {exp.companyNote && (
                  <span className="text-muted-foreground/70"> · {exp.companyNote}</span>
                )}
                <span className="text-muted-foreground/70"> · {exp.location}</span>
              </p>

              {exp.description && (
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                  {exp.description}
                </p>
              )}

              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  {exp.highlights.map((h) => (
                    <li key={h} className="flex gap-2 leading-relaxed">
                      <span className="mt-2 h-px w-3 shrink-0 bg-brass/60" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {exp.techBadges.map((badge) => (
                  <Badge
                    key={badge}
                    variant="secondary"
                    className="rounded-full border-border/60 bg-secondary/60 font-mono text-[10px] font-normal uppercase tracking-wider"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
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

function periodShort(period: string) {
  // Pull the trailing year(s) like "May 2024 – Present" → "'24→"
  const match = period.match(/(\d{4})/g);
  if (!match) return period;
  const start = match[0].slice(2);
  const end = period.toLowerCase().includes("present") ? "→" : match[1] ? match[1].slice(2) : "";
  return `’${start}${end ? `–’${end}` : ""}`;
}
