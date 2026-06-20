"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail, FileText } from "lucide-react";
import { profile, skills } from "@/lib/resume-data";
import { Button } from "@/components/ui/button";

const PRIMARY_AGENT_STACK = [
  "Claude Code",
  "Codex",
  "OpenCode",
  "MCP",
  "Azure Agent Dev Kit",
  "Microsoft Agent Framework",
  "LangGraph",
  "Harness CI agents",
  "Hermes",
  "GitHub Copilot",
];

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-name"
      className="relative isolate overflow-hidden pt-10 pb-16 md:pt-20 md:pb-24"
    >
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-10">
        {/* Left: editorial type column */}
        <div className="md:col-span-8">
          {/* Status row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brass/30 bg-brass/5 px-3 py-1 text-brass">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brass opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brass" />
              </span>
              {profile.status}
            </span>
            <span aria-hidden="true" className="text-muted-foreground/40">/</span>
            <span>Costa Rica · LATAM</span>
          </motion.div>

          {/* Name */}
          <motion.h1
            id="hero-name"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display mt-8 text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] tracking-tight"
          >
            Yenson <span className="italic text-brass">Umaña</span>
            <span className="text-muted-foreground/40">.</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-foreground/90 md:text-xl"
          >
            Senior <span className="text-brass">AI Solution Architect</span> at Microsoft.
            Founder of <Link href={profile.links.presencia} className="underline decoration-brass/40 decoration-2 underline-offset-4 transition hover:decoration-brass" target="_blank" rel="noopener">Presencia Studio</Link>.
            <span className="mt-2 block text-foreground/75">
              Shipping production AI since <span className="text-brass">October 2022</span> —
              one month before ChatGPT launched. Early enough to be an expert
              before the rest of the field caught up.
            </span>
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button
              asChild
              className="group h-11 rounded-full bg-brass px-5 text-background hover:bg-brass/90"
            >
              <Link href={profile.links.booking} target="_blank" rel="noopener">
                Book an advisory session
                <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="h-11 rounded-full border border-border/60 px-5 font-medium text-foreground hover:bg-foreground/5"
            >
              <Link href={profile.links.cv} target="_blank" rel="noopener">
                <FileText className="mr-2 h-4 w-4" />
                Resume
              </Link>
            </Button>

            <div className="ml-1 flex items-center gap-1">
              <SocialIcon href={profile.links.linkedin} label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href={profile.links.github} label="GitHub">
                <Github className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href={`mailto:${profile.email}`} label="Email">
                <Mail className="h-4 w-4" />
              </SocialIcon>
            </div>
          </motion.div>

          {/* Signal strip */}
          <motion.dl
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-12 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4"
          >
            <Stat label="Building AI since" value="Oct 2022" sub="One month before ChatGPT" />
            <Stat label="Promotions in 2 yrs" value="3" />
            <Stat label="Azure certs" value="AI-102 · AZ-204" />
            <Stat label="Migration record" value="1 week" sub="Vercel+GCP → Azure" />
          </motion.dl>
        </div>

        {/* Right: portrait + identity card */}
        <div className="md:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative mx-auto max-w-[20rem] md:ml-auto md:mr-0"
          >
            {/* Portrait */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/60 bg-secondary/40">
              <Image
                src={profile.avatar}
                alt={profile.name}
                fill
                priority
                sizes="(min-width: 768px) 22vw, 80vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.08]"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
              />

              {/* Caption rail */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Currently
                </p>
                <p className="mt-1 text-sm leading-snug text-foreground">
                  Senior AI Solution Architect
                  <br />
                  <span className="text-brass">Microsoft</span>
                  <span className="text-muted-foreground"> · via Accenture</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Agent stack rail */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.45 }}
        className="mt-16 border-y border-border/50 py-5"
        aria-label="Agent toolkit"
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Agent stack
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {PRIMARY_AGENT_STACK.map((tool) => (
              <li
                key={tool}
                className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-display text-2xl leading-none tabular text-foreground">
        {value}
      </dd>
      {sub && (
        <p className="mt-1 font-mono text-[10px] text-muted-foreground/70">
          {sub}
        </p>
      )}
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-full text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
    >
      <Link
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener" : undefined}
        aria-label={label}
      >
        {children}
      </Link>
    </Button>
  );
}

// Keep legacy export name so other imports continue to work during the transition.
export { HeroSection as WelcomeCard };
