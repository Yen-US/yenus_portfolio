"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/resume-data";

export function ConsultingCta() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="cta-heading"
      className="relative isolate mt-8 overflow-hidden rounded-3xl border border-brass/25 bg-gradient-to-br from-brass/[0.08] via-background to-background p-8 md:p-12"
    >
      {/* Decorative type */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-12 select-none font-display text-[8rem] leading-none text-brass/[0.06] md:text-[12rem]"
      >
        09
      </div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative grid grid-cols-1 items-end gap-8 md:grid-cols-12"
      >
        <div className="md:col-span-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass">
            Open for engagements
          </p>
          <h2
            id="cta-heading"
            className="mt-3 font-display text-3xl leading-[1.05] tracking-tight md:text-5xl"
          >
            Architect with me, or
            <br />
            <span className="italic text-brass">let agents do the heavy lifting</span>.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/85">
            I take on a short list of advisory + architecture engagements each
            quarter — agentic systems, Azure migrations, and AI productionization
            for teams who want depth without a six-month consulting wrapper.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:col-span-4 md:items-end">
          <Link
            href={profile.links.presencia}
            target="_blank"
            rel="noopener"
            className="group/cta inline-flex items-center gap-2 rounded-full bg-brass px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-brass/90 focus-ring"
          >
            Book at presencia.studio
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Or email · <Link href={`mailto:${profile.email}`} className="text-foreground/80 transition-colors hover:text-brass">{profile.email}</Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
