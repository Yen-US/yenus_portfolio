import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Layers3, ShieldCheck, Users } from "lucide-react";
import {
  caseFields,
  operatorProof,
  proof,
  proofCaveat,
} from "@/lib/consulting-data";
import {
  ConsultingFooter,
  ConsultingHeader,
} from "@/components/consulting/site-chrome";

export const metadata: Metadata = {
  alternates: { canonical: "/work" },
  title: "Startup Work",
  description:
    "Two engagements written as the decisions they actually were: a seven-day production migration with zero customer-visible downtime, and a guardrailed live-event AI system.",
};

/**
 * The expanded case studies, moved off the homepage. The homepage shows the
 * headline and the tradeoff; this page shows the full seven-field structure and
 * the architecture diagrams.
 *
 * The caveat renders here too. It should appear anywhere the case studies are
 * presented as proof for the Review, since neither of them is one.
 */
export default function WorkPage() {
  return (
    <div className="consulting-shell min-h-screen bg-background text-foreground">
      <ConsultingHeader />
      <main>
        <section className="border-b border-border bg-foreground py-14 text-background md:py-20">
          <div className="consulting-container">
            <p className="consulting-kicker text-brass-soft">Startup work</p>
            <h1 className="consulting-display mt-6 max-w-4xl text-balance text-5xl leading-[1.02] md:text-6xl">
              I know what the room feels like before the path is obvious.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-background/65">
              Startup architecture means making consequential decisions with an
              incomplete map. Each case below is written as the decision it
              actually was, not the outcome it became.
            </p>
            <p className="mt-6 max-w-2xl border-l-2 border-brass-soft pl-5 text-sm leading-6 text-background/55">
              {proofCaveat}
            </p>
          </div>
        </section>

        <section className="consulting-section bg-card">
          <div className="consulting-container space-y-20">
            {proof.map((item) => (
              <article key={item.id} className="border-t border-foreground pt-8">
                <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
                  <div>
                    <p className="consulting-kicker text-signal">{item.eyebrow}</p>
                    <h2 className="consulting-display mt-5 text-balance text-3xl leading-10 md:text-4xl md:leading-[1.15]">
                      {item.title}
                    </h2>
                    <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-5">
                      {item.metrics.map((metric) => (
                        <div key={metric.label}>
                          <dt className="text-[11px] leading-4 text-muted-foreground">
                            {metric.label}
                          </dt>
                          <dd className="consulting-display mt-2 text-xl md:text-2xl">
                            {metric.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  {item.id === "yc-migration" ? <StartupPathMap /> : <ArchitectureMap />}
                </div>

                <dl className="mt-10 grid gap-x-10 gap-y-8 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4">
                  {caseFields.map((field) => (
                    <div key={field.key}>
                      <dt className="consulting-kicker text-signal">{field.label}</dt>
                      <dd className="mt-3 text-sm leading-6 text-muted-foreground">
                        {item[field.key]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          <div className="consulting-container mt-20 border-t border-border pt-10">
            <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="consulting-kicker">Founder / operator proof</p>
                <h2 className="consulting-display mt-4 text-3xl leading-10">
                  I also live with the decisions after launch.
                </h2>
              </div>
              <div className="grid gap-px bg-border md:grid-cols-2">
                {operatorProof.map((item) => (
                  <article key={item.title} className="bg-card p-6 md:p-8">
                    <p className="consulting-kicker text-signal">{item.label}</p>
                    <h3 className="consulting-display mt-5 text-2xl">{item.title}</h3>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            <p className="mt-8 text-sm leading-6 text-muted-foreground">
              Client systems built through Presencia Studio, with screens and public links:{" "}
              <Link href="/work/customer-acquisition" className="underline underline-offset-4 hover:text-signal">
                Customer-acquisition work
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <ConsultingFooter />
    </div>
  );
}

function StartupPathMap() {
  const nodes = [
    "Urgent founder objective",
    "Target architecture",
    "Agent-assisted execution",
    "Acceptance gates",
  ];

  return (
    <div
      className="border border-border bg-background p-5 md:p-7"
      aria-label="Startup migration production path"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Startup migration · Production path
        </p>
        <span className="inline-flex items-center gap-2 text-[11px] text-signal">
          <span aria-hidden="true" className="h-2 w-2 bg-signal" />
          7 days
        </span>
      </div>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2">
        {nodes.map((node, index) => (
          <li key={node} className="relative border border-border bg-card p-4">
            <span className="font-mono text-[9px] text-signal">0{index + 1}</span>
            <p className="mt-8 text-xs font-semibold leading-5">{node}</p>
          </li>
        ))}
      </ol>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3 border border-signal/40 bg-signal/5 p-4">
        <p className="text-xs font-semibold">Ambiguous migration</p>
        <ArrowRight aria-hidden="true" className="h-4 w-4 text-signal" />
        <p className="text-right text-xs font-semibold">Team-owned system</p>
      </div>
    </div>
  );
}

function ArchitectureMap() {
  const nodes = [
    { icon: Compass, label: "Phase objective" },
    { icon: ShieldCheck, label: "Guardrail policy" },
    { icon: Layers3, label: "Few-shot + fallback" },
    { icon: Users, label: "Private client render" },
  ];

  return (
    <div
      className="border border-border bg-background p-5 md:p-7"
      aria-label="AOP Beacon architecture summary"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          AOP Beacon · Decision flow
        </p>
        <span className="inline-flex items-center gap-2 text-[11px] text-signal">
          <span aria-hidden="true" className="h-2 w-2 bg-signal" />
          Guardrailed
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {nodes.map((node, index) => (
          <div key={node.label} className="relative border border-border bg-card p-4">
            <node.icon aria-hidden="true" className="h-5 w-5 text-signal" />
            <p className="mt-6 text-xs font-semibold leading-5">{node.label}</p>
            <span className="absolute right-3 top-3 font-mono text-[9px] text-muted-foreground">
              0{index + 1}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3 border border-signal/40 bg-signal/5 p-4">
        <p className="text-xs font-semibold">Attendee selections</p>
        <ArrowRight aria-hidden="true" className="h-4 w-4 text-signal" />
        <p className="text-right text-xs font-semibold">Safe conversation prompt</p>
      </div>
    </div>
  );
}
