"use client";

import { profile } from "@/lib/resume-data";
import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import Link from "next/link";

const links = [
  { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: Linkedin, label: "LinkedIn", value: "yenus", href: profile.links.linkedin },
  { icon: Github, label: "GitHub", value: "Yen-US", href: profile.links.github },
];

export function ContactCard() {
  return (
    <div className="flex h-full flex-col gap-6">
      <SectionLabel kicker="07" title="Contact" />

      <div className="space-y-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Based in
        </p>
        <p className="flex items-center gap-2 text-sm text-foreground">
          <MapPin className="h-3.5 w-3.5 text-brass" />
          {profile.location}
        </p>
      </div>

      <ul className="space-y-0 border-t border-border/50">
        {links.map((link) => (
          <li key={link.label} className="border-b border-border/50">
            <Link
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener" : undefined}
              className="group/link flex items-center justify-between gap-3 py-3 transition-colors focus-ring"
            >
              <span className="flex items-center gap-3">
                <link.icon className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover/link:text-brass" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {link.label}
                </span>
              </span>
              <span className="flex items-center gap-1 text-sm text-foreground/90 transition-colors group-hover/link:text-brass">
                {link.value}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={profile.links.presencia}
        target="_blank"
        rel="noopener"
        className="group/booking mt-auto flex items-center justify-between rounded-xl border border-brass/30 bg-brass/5 px-4 py-3 transition-colors hover:bg-brass/10 focus-ring"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
            Booking
          </p>
          <p className="mt-0.5 text-sm font-medium text-foreground">
            presencia.studio
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-brass transition-transform group-hover/booking:-translate-y-0.5 group-hover/booking:translate-x-0.5" />
      </Link>
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
