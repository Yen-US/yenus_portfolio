"use client";

import { education, certifications } from "@/lib/resume-data";

export function EducationCard() {
  const azureCerts = certifications.filter((c) => c.issuer === "Microsoft");
  const otherCerts = certifications.filter((c) => !c.issuer);

  return (
    <div className="flex h-full flex-col gap-6">
      <SectionLabel kicker="06" title="Credentials" />

      <div className="space-y-5">
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
            Microsoft certifications
          </p>
          <ul className="space-y-1.5">
            {azureCerts.map((cert) => (
              <li
                key={cert.name}
                className="flex items-baseline gap-2 text-sm text-foreground/90"
              >
                <span className="font-mono text-[10px] text-brass">▸</span>
                <span>{cert.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {otherCerts.length > 0 && (
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Also
            </p>
            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {otherCerts.map((cert, i) => (
                <li key={cert.name} className="flex items-baseline gap-3">
                  <span>{cert.name}</span>
                  {i < otherCerts.length - 1 && (
                    <span aria-hidden="true" className="text-muted-foreground/40">·</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2 border-t border-border/50 pt-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Education
          </p>
          {education.map((edu, i) => (
            <div key={i}>
              <p className="text-sm text-foreground">{edu.degree}</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {edu.institution}
                {edu.status && (
                  <span className="text-muted-foreground/70"> · {edu.status}</span>
                )}
              </p>
            </div>
          ))}
        </div>
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
