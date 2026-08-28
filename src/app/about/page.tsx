import type { Metadata } from "next";
import {
  approach,
  careerSignals,
  credibility,
  faqs,
  presencia,
  principles,
} from "@/lib/consulting-data";
import {
  ConsultingFooter,
  ConsultingHeader,
} from "@/components/consulting/site-chrome";

export const metadata: Metadata = {
  title: "About",
  description:
    "How Yenson Umaña works: the approach behind each engagement, the boundary between independent advisory and Presencia Studio, and answers to the questions that come before a first call.",
};

/**
 * Biography, method, the Presencia boundary, and the FAQ stack — all moved off
 * the homepage. The Yenson/Presencia distinction in particular has to stay
 * published somewhere legible: it is a real commercial boundary, not marketing
 * copy, and removing it entirely would be a substantive change rather than a
 * simplification.
 */
export default function AboutPage() {
  return (
    <div className="consulting-shell min-h-screen bg-background text-foreground">
      <ConsultingHeader />
      <main>
        <section className="border-b border-border bg-signal py-14 text-white md:py-20">
          <div className="consulting-container grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="consulting-kicker text-white/65">
                Your startup architecture partner
              </p>
              <h1 className="consulting-display mt-5 text-4xl leading-[1.08] md:text-5xl">
                I help early teams find the path before the playbook exists.
              </h1>
              <p className="mt-7 text-lg leading-8 text-white/80">
                My strongest body of work is with founders and lean engineering
                teams making product, model, cloud, evaluation, and cost
                decisions while the product itself is still moving.
              </p>
              <p className="mt-5 text-sm leading-6 text-white/65">
                Through Microsoft for Startups, I see the patterns between a
                promising demo and a production system across many teams. That
                pattern recognition is the leverage I bring to your table. You
                work directly with me, with no sales layer or junior handoff.
              </p>
            </div>

            <div className="border-t border-white/30">
              {careerSignals.map((signal) => (
                <article
                  key={signal.title}
                  className="grid gap-4 border-b border-white/25 py-7 sm:grid-cols-[90px_1fr]"
                >
                  <p className="font-mono text-xs text-white/55">{signal.year}</p>
                  <div>
                    <h2 className="consulting-display text-2xl">{signal.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-white/70">
                      {signal.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="consulting-section bg-background">
          <div className="consulting-container">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="consulting-kicker text-signal">How I work</p>
                <h2 className="consulting-display mt-5 max-w-3xl text-balance text-4xl leading-[1.08] md:text-5xl">
                  Founder context, architecture, and execution stay in the same room.
                </h2>
                <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground">
                  Every engagement produces decisions the technical team can
                  execute without losing the founder&apos;s product context.
                  Tools and models are selected after the operating problem is
                  clear.
                </p>
              </div>

              <ol className="border-t border-foreground">
                {approach.map((item) => (
                  <li
                    key={item.number}
                    className="grid gap-5 border-b border-border py-7 sm:grid-cols-[56px_0.7fr_1.3fr] sm:items-start"
                  >
                    <span className="font-mono text-xs text-signal">{item.number}</span>
                    <h3 className="consulting-display text-xl leading-7">{item.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-20 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
              {principles.map((principle) => (
                <div key={principle} className="flex min-h-32 items-end bg-card p-6">
                  <p className="text-sm font-semibold leading-6">{principle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="consulting-section bg-card">
          <div className="consulting-container">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <div>
                <p className="consulting-kicker text-signal">{presencia.eyebrow}</p>
                <h2 className="consulting-display mt-5 max-w-3xl text-balance text-4xl leading-[1.08] md:text-5xl">
                  {presencia.title}
                </h2>
              </div>
              <div>
                <p className="text-lg leading-8 text-foreground/85">{presencia.body}</p>
                <p className="mt-5 text-sm leading-6 text-muted-foreground">
                  {presencia.note}
                </p>
              </div>
            </div>

            <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-2">
              {presencia.split.map((item) => (
                <article key={item.label} className="bg-card p-6 md:p-8">
                  <p className="consulting-kicker text-signal">{item.role}</p>
                  <h3 className="consulting-display mt-5 text-2xl">{item.label}</h3>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {item.question}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="consulting-section bg-background">
          <div className="consulting-container grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="consulting-kicker text-signal">Before we talk</p>
              <h2 className="consulting-display mt-5 max-w-3xl text-balance text-4xl leading-[1.08] md:text-5xl">
                Useful answers, without the sales call.
              </h2>
            </div>
            <div>
              <div className="border-t border-foreground">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group border-b border-border">
                    <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-6 rounded-sm py-6 text-left font-semibold">
                      <span>{faq.question}</span>
                      <span
                        aria-hidden="true"
                        className="grid h-7 w-7 shrink-0 place-items-center border border-border text-lg font-light transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="max-w-2xl pb-7 pr-10 text-sm leading-6 text-muted-foreground">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>

              <p className="mt-10 border-l-2 border-signal pl-5 text-sm leading-6 text-muted-foreground">
                {credibility.firewall}
              </p>
              <p className="mt-5 text-xs leading-5 text-muted-foreground">
                {credibility.conflictReview}
              </p>
            </div>
          </div>
        </section>
      </main>
      <ConsultingFooter />
    </div>
  );
}
