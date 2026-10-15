import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
  consultant,
  engagements,
  fitCriteria,
  workingSession,
} from "@/lib/consulting-data";
import {
  ConsultingFooter,
  ConsultingHeader,
} from "@/components/consulting/site-chrome";

export const metadata: Metadata = {
  alternates: { canonical: "/services" },
  title: "Ways to Work Together",
  description:
    "The full set of engagement formats — from a 90-minute inference working session to the Inference Readiness Review, architecture and direction sprints, and fractional architecture support.",
};

/**
 * The full offer ladder, moved off the homepage so that page can feature one
 * door. Nothing here is new: this is the five-service grid and fit criteria the
 * homepage used to render, kept reachable rather than deleted.
 *
 * Prices stay off this page too. The bands in signal-room/offers.ts are
 * internal planning defaults derived from reasoning, not validated market data.
 */
export default function ServicesPage() {
  return (
    <div className="consulting-shell min-h-screen bg-background text-foreground">
      <ConsultingHeader />
      <main>
        <section className="border-b border-border bg-foreground py-14 text-background md:py-20">
          <div className="consulting-container">
            <p className="consulting-kicker text-brass-soft">Ways to work together</p>
            <h1 className="consulting-display mt-6 max-w-4xl text-balance text-5xl leading-[1.02] md:text-6xl">
              Structured ways to get senior judgment into a decision that is
              already moving.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-background/65">
              These are formats, not packages. The work is the same underneath:
              frame the decision, make the tradeoffs explicit, and leave the team
              with a path they can execute. Scope follows a discovery call.
            </p>
          </div>
        </section>

        <section className="consulting-section bg-background">
          <div className="consulting-container">
            <article className="border border-border bg-card p-6 md:p-9">
              <p className="consulting-kicker text-signal">
                Lowest commitment · 90 minutes · Paid
              </p>
              <h2 className="consulting-display mt-5 text-3xl">
                Inference working session
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                {workingSession.body}
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {workingSession.outputs.map((output) => (
                  <li key={output} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-signal" />
                    <span>{output}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={workingSession.ctaHref}
                className="focus-ring mt-7 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-signal transition-colors hover:text-foreground"
              >
                {workingSession.ctaLabel}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </article>

            <div className="mt-16">
              {engagements.map((engagement) => (
                <article
                  key={engagement.name}
                  className="grid gap-8 border-b border-border py-10 md:grid-cols-[80px_0.75fr_1.25fr] md:py-14"
                >
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {engagement.number}
                    </p>
                    {engagement.featured ? (
                      <p className="consulting-kicker mt-4 text-signal">Signature</p>
                    ) : null}
                  </div>
                  <div>
                    <p className="consulting-kicker text-signal">
                      {engagement.duration}
                    </p>
                    <h2 className="consulting-display mt-4 text-3xl md:text-4xl">
                      {engagement.name}
                    </h2>
                    <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
                      {engagement.summary}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      <span className="font-semibold text-foreground">Best for: </span>
                      {engagement.bestFor}
                    </p>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {engagement.deliverables.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                          <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-signal" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 grid gap-10 border border-border p-6 md:grid-cols-2 md:p-9">
              <div>
                <p className="consulting-kicker text-signal">A good fit when</p>
                <ul className="mt-6 space-y-3">
                  {fitCriteria.good.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                      <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-signal" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="consulting-kicker">Probably not me</p>
                <ul className="mt-6 space-y-3">
                  {fitCriteria.poor.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                      <span aria-hidden="true" className="mt-3 h-px w-4 shrink-0 bg-border" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-6 text-muted-foreground">
                  {consultant.availability}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ConsultingFooter />
    </div>
  );
}
