"use client";

import { skills } from "@/lib/resume-data";

const groups = [
  { key: "agentsAndAI", label: "Agents & AI tooling", items: skills.agentsAndAI },
  { key: "aiFoundations", label: "AI foundations", items: skills.aiFoundations },
  { key: "productionPatterns", label: "Production AI patterns", items: skills.productionPatterns },
  { key: "cloud", label: "Cloud & architecture", items: skills.cloud },
  { key: "languages", label: "Languages", items: skills.languages },
  { key: "frameworks", label: "Frameworks", items: skills.frameworks },
  { key: "infrastructure", label: "Infrastructure", items: skills.infrastructure },
] as const;

export function SkillsCard() {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-baseline justify-between gap-3">
        <SectionLabel kicker="04" title="Stack" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Ranked by use, not novelty
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.key} className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
              {g.label}
            </p>
            <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm leading-snug text-foreground/90">
              {g.items.map((item, i) => (
                <li key={item} className="flex items-baseline gap-3">
                  <span>{item}</span>
                  {i < g.items.length - 1 && (
                    <span aria-hidden="true" className="text-muted-foreground/40">·</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
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
