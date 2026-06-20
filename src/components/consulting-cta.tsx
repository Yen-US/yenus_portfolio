"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { profile, serviceOfferings, consultingFaqs } from "@/lib/resume-data";

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
            Open for engagements · {profile.status}
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
            Productized engagements for Microsoft for Startups founders — agentic
            systems, Azure migrations, and AI productionization. Pick a scope, get a
            1-page plan, ship.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:col-span-4 md:items-end">
          <Link
            href={profile.links.booking}
            target="_blank"
            rel="noopener"
            className="group/cta inline-flex items-center gap-2 rounded-full bg-brass px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-brass/90 focus-ring"
          >
            Book a 30-min architecture review
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Or email ·{" "}
            <Link
              href={`mailto:${profile.email}`}
              className="text-foreground/80 transition-colors hover:text-brass"
            >
              {profile.email}
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Productized offers */}
      <div className="relative mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {serviceOfferings.map((offer, i) => (
          <motion.article
            key={offer.name}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`flex flex-col gap-4 rounded-2xl border p-6 ${
              offer.featured
                ? "border-brass/40 bg-brass/[0.06]"
                : "border-border/60 bg-secondary/30"
            }`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl leading-tight text-foreground">
                {offer.name}
              </h3>
              {offer.featured && (
                <span className="rounded-full border border-brass/50 bg-background/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-brass">
                  Most booked
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>{offer.duration}</span>
              <span aria-hidden="true" className="text-muted-foreground/40">·</span>
              <span className="text-brass">{offer.price}</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/85">
              {offer.scope}
            </p>
            <ul className="space-y-1.5">
              {offer.deliverables.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                >
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-brass" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
            <p className="mt-auto border-t border-border/60 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
              Best for: <span className="normal-case tracking-normal text-foreground/75">{offer.bestFor}</span>
            </p>
          </motion.article>
        ))}
      </div>

      {/* FAQ */}
      <div className="relative mt-12 grid grid-cols-1 gap-x-10 gap-y-6 border-t border-border/50 pt-8 md:grid-cols-2">
        <div className="md:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass">
            Common questions
          </p>
        </div>
        {consultingFaqs.map((f) => (
          <div key={f.question}>
            <p className="font-display text-base leading-snug text-foreground">
              {f.question}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/75">
              {f.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
