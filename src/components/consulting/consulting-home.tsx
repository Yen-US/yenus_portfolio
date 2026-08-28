import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, CircleCheck } from "lucide-react";
import {
  credibility,
  featuredOffer,
  finalCta,
  fitSymptoms,
  homeHero,
  proof,
  proofCaveat,
  reviewWeek,
  workingSession,
} from "@/lib/consulting-data";
import {
  ConsultingFooter,
  ConsultingHeader,
} from "@/components/consulting/site-chrome";

/**
 * The homepage is one buyer, one featured offer, one primary CTA, one lower
 * rung, and directly relevant proof — nothing else.
 *
 * The rest of the practice is real and still published: the full offer ladder
 * on /services, the expanded case studies on /work, and the biography,
 * Presencia boundary, and FAQs on /about. Adding any of it back here is the
 * change that returns the page to a catalog.
 *
 * There are exactly three discovery CTAs below (hero, working session, final).
 * The header carries a fourth as persistent chrome. Adding a fifth is how the
 * "book a call" instruction stops reading as an invitation and starts reading
 * as pressure.
 */
export function ConsultingHome() {
  return (
    <div className="consulting-shell min-h-screen bg-background text-foreground">
      <ConsultingHeader />
      <main>
        <Hero />
        <FitSymptomsSection />
        <FeaturedOfferSection />
        <ProofSection />
        <ReviewWeekSection />
        <WorkingSessionSection />
        <CredibilitySection />
        <FinalCta />
      </main>
      <ConsultingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="consulting-hero relative isolate overflow-hidden border-b border-border bg-background">
      <div aria-hidden="true" className="consulting-grid absolute inset-0 opacity-60" />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-[44%] border-l border-border bg-foreground lg:block"
      />
      <Image
        src="/YenUSPP2.webp"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 46vw, 100vw"
        className="pointer-events-none z-0 object-contain object-bottom opacity-[0.12] lg:object-right-bottom lg:opacity-100"
      />

      <div className="consulting-container relative z-10 flex min-h-[560px] flex-col justify-between py-14 md:min-h-[640px] md:py-20 lg:min-h-[680px] lg:pr-[42%]">
        <div className="consulting-reveal max-w-4xl">
          <p className="consulting-kicker flex items-center gap-3">
            <span className="h-px w-10 shrink-0 bg-signal" />
            {homeHero.eyebrow}
          </p>

          <h1 className="consulting-display mt-8 max-w-4xl text-balance text-5xl leading-[0.98] md:text-7xl lg:text-[80px]">
            {homeHero.headline}
            <span className="mt-2 block italic text-signal">
              {homeHero.headlineAccent}
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-foreground/80 md:text-xl md:leading-9">
            {homeHero.supporting}
          </p>

          <div className="mt-9">
            <Link
              href={homeHero.ctaHref}
              className="focus-ring group inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-signal px-6 text-sm font-semibold text-white transition-colors hover:bg-foreground"
            >
              {homeHero.ctaLabel}
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-20 border-t border-border bg-card">
        <div className="consulting-container flex min-h-16 items-start gap-4 py-4 text-sm leading-6 text-muted-foreground sm:items-center">
          <CircleCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-signal sm:mt-0" />
          <p>{homeHero.trustLine}</p>
        </div>
      </div>
    </section>
  );
}

function FitSymptomsSection() {
  return (
    <section className="consulting-section consulting-first-section bg-background">
      <div className="consulting-container">
        <SectionHeading eyebrow="Fit" title="This review is useful when…" />

        <div className="mt-12 grid border-y border-border md:grid-cols-3">
          {fitSymptoms.map((item, index) => (
            <article
              key={item.number}
              className={`py-8 md:px-8 md:py-10 ${
                index > 0 ? "border-t border-border md:border-l md:border-t-0" : ""
              } ${index === 0 ? "md:pl-0" : ""}`}
            >
              <p className="consulting-kicker text-signal">{item.number}</p>
              <h3 className="consulting-display mt-8 text-2xl leading-8">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedOfferSection() {
  return (
    <section
      id="review"
      className="consulting-section scroll-mt-20 bg-foreground text-background"
    >
      <div className="consulting-container">
        <div className="grid gap-10 border-b border-background/20 pb-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="consulting-kicker text-brass-soft">
              {featuredOffer.duration}
            </p>
            <h2 className="consulting-display mt-5 max-w-2xl text-balance text-4xl leading-[1.08] md:text-5xl">
              {featuredOffer.name}
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-background/75">
            {featuredOffer.subheading}
          </p>
        </div>

        <div className="grid gap-10 py-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <p className="consulting-kicker text-brass-soft">What you receive</p>
            <ul className="mt-6 grid gap-3">
              {featuredOffer.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-6 text-background/80"
                >
                  <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-brass-soft" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:pt-10">
            <p className="border-l-2 border-brass-soft pl-5 text-sm leading-6 text-background/60">
              <span className="font-semibold text-background">Boundary. </span>
              {featuredOffer.boundary}
            </p>
            <Link
              href="/services"
              className="focus-ring mt-7 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-brass-soft transition-colors hover:text-background"
            >
              See all ways to work together
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofSection() {
  return (
    <section id="work" className="consulting-section scroll-mt-20 bg-card">
      <div className="consulting-container">
        <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end">
          <SectionHeading
            eyebrow="Proof of the operating method"
            title="Decisions made with an incomplete map."
          />
          <p className="max-w-xl text-sm leading-6 text-muted-foreground md:justify-self-end">
            {proofCaveat}
          </p>
        </div>

        <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-2">
          {proof.map((item) => (
            <article key={item.id} className="flex flex-col bg-card p-6 md:p-8">
              <p className="consulting-kicker text-signal">{item.eyebrow}</p>
              <h3 className="consulting-display mt-5 text-balance text-2xl leading-9">
                {item.title}
              </h3>
              <dl className="mt-7 grid grid-cols-3 gap-4 border-y border-border py-5">
                {item.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt className="text-[11px] leading-4 text-muted-foreground">
                      {metric.label}
                    </dt>
                    <dd className="consulting-display mt-2 text-xl">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                {item.tradeoffs}
              </p>
            </article>
          ))}
        </div>

        <Link
          href="/work"
          className="focus-ring mt-10 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-signal transition-colors hover:text-foreground"
        >
          Read both engagements in full
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function ReviewWeekSection() {
  return (
    <section className="bg-signal py-16 text-white md:py-24">
      <div className="consulting-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="consulting-kicker text-white/65">The week</p>
          <h2 className="consulting-display mt-5 text-4xl leading-[1.08] md:text-5xl">
            What happens in one week.
          </h2>
          <p className="mt-7 text-sm leading-6 text-white/65">
            Access requirements are scoped during discovery. Nothing here
            assumes production credentials by default.
          </p>
        </div>

        <ol className="border-t border-white/30">
          {reviewWeek.map((step) => (
            <li
              key={step.number}
              className="grid gap-4 border-b border-white/25 py-6 sm:grid-cols-[48px_0.8fr_1.2fr] sm:items-start"
            >
              <span className="font-mono text-xs text-white/55">{step.number}</span>
              <h3 className="consulting-display text-xl leading-7">{step.title}</h3>
              <p className="text-sm leading-6 text-white/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function WorkingSessionSection() {
  return (
    <section className="consulting-section bg-background">
      <div className="consulting-container">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow={workingSession.eyebrow}
              title={workingSession.title}
            />
            <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground">
              {workingSession.body}
            </p>
            <Link
              href={workingSession.ctaHref}
              className="focus-ring group mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-foreground bg-background px-6 text-sm font-semibold transition-colors hover:bg-foreground hover:text-background"
            >
              {workingSession.ctaLabel}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
            {workingSession.outputs.map((output) => (
              <div key={output} className="flex min-h-32 items-end bg-card p-6">
                <p className="text-sm font-semibold leading-6">{output}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CredibilitySection() {
  return (
    <section id="about" className="consulting-section scroll-mt-20 bg-card">
      <div className="consulting-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading eyebrow={credibility.eyebrow} title={credibility.title} />

        <div>
          <ul className="border-t border-foreground">
            {credibility.facts.map((fact) => (
              <li
                key={fact}
                className="border-b border-border py-4 text-sm leading-6 text-muted-foreground"
              >
                {fact}
              </li>
            ))}
          </ul>

          <p className="mt-8 border-l-2 border-signal pl-5 text-sm leading-6 text-muted-foreground">
            {credibility.firewall}
          </p>
          <p className="mt-5 text-xs leading-5 text-muted-foreground">
            {credibility.conflictReview}
          </p>

          <Link
            href="/about"
            className="focus-ring mt-7 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-signal transition-colors hover:text-foreground"
          >
            More about how I work
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="border-t border-border bg-foreground py-16 text-background md:py-24">
      <div className="consulting-container grid items-end gap-10 md:grid-cols-[1fr_auto]">
        <div>
          <p className="consulting-kicker text-brass-soft">{finalCta.eyebrow}</p>
          <h2 className="consulting-display mt-5 max-w-4xl text-balance text-4xl leading-[1.08] md:text-6xl">
            {finalCta.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-background/65">
            {finalCta.body}
          </p>
        </div>
        <Link
          href="/discovery"
          className="focus-ring group inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-brass-soft px-6 text-sm font-semibold text-foreground transition-colors hover:bg-background"
        >
          {finalCta.ctaLabel}
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  inverse = false,
}: {
  eyebrow: string;
  title: string;
  inverse?: boolean;
}) {
  return (
    <div>
      <p className={`consulting-kicker ${inverse ? "text-brass-soft" : "text-signal"}`}>
        {eyebrow}
      </p>
      <h2
        className={`consulting-display mt-5 max-w-3xl text-balance text-4xl leading-[1.08] md:text-5xl ${
          inverse ? "text-background" : "text-foreground"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
