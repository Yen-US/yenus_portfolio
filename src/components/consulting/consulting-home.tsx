import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleCheck,
  Compass,
  Layers3,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  advisory,
  approach,
  careerSignals,
  consultant,
  decisionAreas,
  engagements,
  faqs,
  operatorProof,
  proof,
} from "@/lib/consulting-data";
import {
  ConsultingFooter,
  ConsultingHeader,
} from "@/components/consulting/site-chrome";

export function ConsultingHome() {
  return (
    <div className="consulting-shell min-h-screen bg-background text-foreground">
      <ConsultingHeader />
      <main>
        <Hero />
        <DecisionSection />
        <StartupWorkSection />
        <ServicesSection />
        <ProofSection />
        <ApproachSection />
        <AboutSection />
        <FaqSection />
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

      <div className="consulting-container relative z-10 flex min-h-[620px] flex-col justify-between py-14 md:min-h-[720px] md:py-20 lg:min-h-[760px] lg:pr-[42%]">
        <div className="consulting-reveal max-w-4xl">
          <p className="consulting-kicker flex items-center gap-3">
            <span className="h-px w-10 bg-signal" />
            {consultant.name} · AI architecture partner for startups
          </p>

          <h1 className="consulting-display mt-8 max-w-4xl text-5xl leading-[0.98] md:text-7xl lg:text-[88px]">
            AI architecture
            {" "}
            <span className="block italic text-signal">for startups.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-8 text-foreground/80 md:text-2xl md:leading-9">
            From AI ambition to production clarity.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            Startups are where the new AI world reaches users first. I help
            founders and CTOs turn that speed into clear decisions,
            production-ready architecture, and a path their team can execute.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/discovery"
              className="focus-ring group inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-signal px-6 text-sm font-semibold text-white transition-colors hover:bg-foreground"
            >
              Find the path to production
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#work"
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-border bg-background/70 px-6 text-sm font-semibold transition-colors hover:border-foreground"
            >
              See startup work
              <ArrowDown className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="consulting-reveal consulting-delay-2 mt-14 hidden max-w-4xl gap-6 border-t border-border pt-6 sm:grid sm:grid-cols-3">
          <HeroSignal value="Since 2022" label="Building production AI" />
          <HeroSignal value="Global" label="Startup architecture advisory" />
          <HeroSignal value="60+" label="Engineer founding teams advised" />
        </div>
      </div>

      <div className="relative z-20 border-t border-border bg-card">
        <div className="consulting-container flex min-h-16 items-center gap-4 py-4 text-sm leading-6 text-muted-foreground">
          <CircleCheck className="h-5 w-5 shrink-0 text-signal" />
          <p>{consultant.credential}</p>
        </div>
      </div>
    </section>
  );
}

function HeroSignal({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="consulting-display text-2xl text-foreground">{value}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{label}</p>
    </div>
  );
}

function DecisionSection() {
  return (
    <section className="consulting-section consulting-first-section bg-background">
      <div className="consulting-container">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="The startup reality"
              title="Innovation moves fast. Architecture decisions compound faster."
            />
          </div>
          <div className="border-l-2 border-signal pl-6 md:pl-8">
            <p className="text-xl leading-8 text-foreground/85 md:text-2xl md:leading-9">
              Early AI companies rarely lack ideas. They lack time, certainty,
              and spare engineering capacity. Models change, product assumptions
              move, and every shortcut can become tomorrow&apos;s platform.
            </p>
            <p className="mt-6 text-base leading-7 text-muted-foreground">
              My biggest lever is pattern recognition from working with startup
              teams at this exact stage: I help the team see what matters now,
              what can wait, and what must be true before production.
            </p>
          </div>
        </div>

        <div className="mt-16 grid border-y border-border md:grid-cols-3">
          {decisionAreas.map((item, index) => (
            <article
              key={item.title}
              className={`py-8 md:px-8 md:py-10 ${
                index > 0 ? "border-t border-border md:border-l md:border-t-0" : ""
              }`}
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

function StartupWorkSection() {
  const transitions = [
    ["Many promising ideas", "One prioritized AI bet"],
    ["A prototype that works once", "An evaluated production path"],
    ["Model and platform noise", "Explicit architecture decisions"],
    ["Context held by the founder", "A roadmap the team can execute"],
  ];

  return (
    <section className="bg-signal py-16 text-white md:py-24">
      <div className="consulting-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="consulting-kicker text-white/65">What startup advisory actually entails</p>
          <h2 className="consulting-display mt-5 text-4xl leading-[1.08] md:text-5xl">
            I join when the team has momentum, but no map.
          </h2>
          <p className="mt-7 text-base leading-7 text-white/75">
            Early companies rarely arrive with clean requirements. They arrive
            with customer signals, investor pressure, a changing product, a
            working demo, and a dozen decisions nobody has time to untangle.
          </p>
          <p className="mt-5 text-sm leading-6 text-white/60">
            I work alongside the founder and engineers until the next production
            decision is clear, documented, and owned by the team.
          </p>
        </div>

        <dl className="border-t border-white/30">
          {transitions.map(([from, to], index) => (
            <div
              key={from}
              className="grid gap-3 border-b border-white/25 py-6 sm:grid-cols-[32px_1fr_auto_1fr] sm:items-center"
            >
              <dt className="font-mono text-[10px] text-white/45">0{index + 1}</dt>
              <dd className="text-sm text-white/60">{from}</dd>
              <ArrowRight className="hidden h-4 w-4 text-brass-soft sm:block" />
              <dd className="text-sm font-semibold text-white">{to}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="consulting-section scroll-mt-20 bg-foreground text-background">
      <div className="consulting-container">
        <div className="grid items-end gap-8 border-b border-background/20 pb-10 md:grid-cols-[1fr_auto]">
          <SectionHeading
            inverse
            eyebrow="Built for startup speed"
            title="A clear path from idea to production, without a six-month consulting layer."
          />
          <p className="max-w-md text-sm leading-6 text-background/65 md:text-right">
            Focused engagements that meet the company where it is: choosing the
            bet, designing the system, or helping a growing team operate AI well.
            Scope follows a free discovery call.
          </p>
        </div>

        <div>
          {engagements.map((engagement) => (
            <article
              key={engagement.name}
              className={`grid gap-8 border-b border-background/20 py-10 md:grid-cols-[80px_0.75fr_1.25fr] md:py-14 ${
                engagement.featured ? "bg-signal/10" : ""
              }`}
            >
              <p className="font-mono text-xs text-background/45">
                {engagement.number}
              </p>
              <div>
                <p className="consulting-kicker text-brass-soft">
                  {engagement.duration}
                </p>
                <h3 className="consulting-display mt-4 text-3xl md:text-4xl">
                  {engagement.name}
                </h3>
                <p className="mt-4 max-w-md text-base leading-7 text-background/75">
                  {engagement.summary}
                </p>
              </div>
              <div>
                <p className="text-sm leading-6 text-background/60">
                  <span className="font-semibold text-background">Best for: </span>
                  {engagement.bestFor}
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {engagement.deliverables.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-background/80">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-brass-soft" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/discovery"
                  className="focus-ring mt-7 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-brass-soft hover:text-background"
                >
                  Explore fit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-8 border border-background/20 p-6 md:grid-cols-[0.8fr_1.2fr] md:p-9">
          <div>
            <p className="consulting-kicker text-brass-soft">After the sprint</p>
            <h3 className="consulting-display mt-4 text-3xl">{advisory.name}</h3>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-background/45">
              {advisory.duration}
            </p>
          </div>
          <div>
            <p className="max-w-2xl text-base leading-7 text-background/75">
              {advisory.summary}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {advisory.items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-background/80">
                  <span className="h-1.5 w-1.5 bg-brass-soft" />
                  {item}
                </li>
              ))}
            </ul>
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
            eyebrow="Startup work"
            title="I know what the room feels like before the path is obvious."
          />
          <p className="max-w-xl text-base leading-7 text-muted-foreground md:justify-self-end">
            Startup architecture means making consequential decisions with an
            incomplete map. The work below shows how I turn urgency and
            constraints into a production path the team can own.
          </p>
        </div>

        <div className="mt-14 space-y-16">
          {proof.map((item) => (
            <article key={item.id} className="border-t border-foreground pt-8">
              <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
                <div>
                  <p className="consulting-kicker text-signal">{item.eyebrow}</p>
                  <h3 className="consulting-display mt-5 text-3xl leading-10 md:text-4xl md:leading-[1.15]">
                    {item.title}
                  </h3>
                  <dl className="mt-8 grid grid-cols-3 border-y border-border py-5">
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

              <div className="mt-10 grid gap-6 border-t border-border pt-8 md:grid-cols-3">
                <CaseLine label="Constraint" body={item.challenge} />
                <CaseLine label="Intervention" body={item.intervention} />
                <CaseLine
                  label={item.id === "aop-beacon" ? "Designed result" : "Outcome"}
                  body={item.result}
                />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 border-t border-border pt-10">
          <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="consulting-kicker">Founder / operator proof</p>
              <h3 className="consulting-display mt-4 text-3xl leading-10">
                I also live with the decisions after launch.
              </h3>
            </div>
            <div className="grid gap-px bg-border md:grid-cols-2">
              {operatorProof.map((item) => (
                <article key={item.title} className="bg-card p-6 md:p-8">
                  <p className="consulting-kicker text-signal">{item.label}</p>
                  <h4 className="consulting-display mt-5 text-2xl">{item.title}</h4>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
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
    <div className="border border-border bg-background p-5 md:p-7" aria-label="Startup migration production path">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Startup migration · Production path
        </p>
        <span className="inline-flex items-center gap-2 text-[11px] text-signal">
          <span className="h-2 w-2 bg-signal" />
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
        <ArrowRight className="h-4 w-4 text-signal" />
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
    <div className="border border-border bg-background p-5 md:p-7" aria-label="AOP Beacon architecture summary">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          AOP Beacon · Decision flow
        </p>
        <span className="inline-flex items-center gap-2 text-[11px] text-signal">
          <span className="h-2 w-2 bg-signal" />
          Guardrailed
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {nodes.map((node, index) => (
          <div key={node.label} className="relative border border-border bg-card p-4">
            <node.icon className="h-5 w-5 text-signal" />
            <p className="mt-6 text-xs font-semibold leading-5">{node.label}</p>
            <span className="absolute right-3 top-3 font-mono text-[9px] text-muted-foreground">
              0{index + 1}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3 border border-signal/40 bg-signal/5 p-4">
        <p className="text-xs font-semibold">Attendee selections</p>
        <ArrowRight className="h-4 w-4 text-signal" />
        <p className="text-right text-xs font-semibold">Safe conversation prompt</p>
      </div>
    </div>
  );
}

function CaseLine({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="consulting-kicker text-signal">{label}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  );
}

function ApproachSection() {
  return (
    <section id="approach" className="consulting-section scroll-mt-20 bg-background">
      <div className="consulting-container">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="How I work"
              title="Founder context, architecture, and execution stay in the same room."
            />
            <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground">
              Every engagement produces decisions the technical team can execute
              without losing the founder&apos;s product context. Tools and models
              are selected after the operating problem is clear.
            </p>
          </div>

          <ol className="border-t border-foreground">
            {approach.map((item) => (
              <li key={item.number} className="grid gap-5 border-b border-border py-7 sm:grid-cols-[56px_0.7fr_1.3fr] sm:items-start">
                <span className="font-mono text-xs text-signal">{item.number}</span>
                <h3 className="consulting-display text-xl leading-7">{item.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-20 grid gap-px bg-border border border-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Model and vendor independence",
            "Human review where consequences demand it",
            "Evaluation before automation confidence",
            "Ownership transferred to your team",
          ].map((principle) => (
            <div key={principle} className="flex min-h-32 items-end bg-card p-6">
              <p className="text-sm font-semibold leading-6">{principle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="consulting-section scroll-mt-20 bg-signal text-white">
      <div className="consulting-container">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="consulting-kicker text-white/65">Your startup architecture partner</p>
            <h2 className="consulting-display mt-5 text-4xl leading-[1.08] md:text-5xl">
              I help early teams find the path before the playbook exists.
            </h2>
            <p className="mt-7 text-lg leading-8 text-white/80">
              My strongest body of work is with founders and lean engineering
              teams making product, model, cloud, evaluation, and cost decisions
              while the product itself is still moving.
            </p>
            <p className="mt-5 text-sm leading-6 text-white/65">
              Through Microsoft for Startups, I see the patterns between a
              promising demo and a production system across different teams. That
              pattern recognition is the leverage I bring to your table. You work
              directly with me, with no sales layer or junior handoff.
            </p>
          </div>

          <div className="border-t border-white/30">
            {careerSignals.map((signal) => (
              <article key={signal.title} className="grid gap-4 border-b border-white/25 py-7 sm:grid-cols-[90px_1fr]">
                <p className="font-mono text-xs text-white/55">{signal.year}</p>
                <div>
                  <h3 className="consulting-display text-2xl">{signal.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">{signal.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/30 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-white/70">
            Current independent work is limited to non-conflicting engagements
            and does not imply endorsement by Microsoft, Accenture, or any current
            or former employer.
          </p>
          <Link
            href="/discovery"
            className="focus-ring group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-sm bg-white px-6 text-sm font-semibold text-signal transition-colors hover:bg-foreground hover:text-background"
          >
            Start a conversation
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="consulting-section bg-card">
      <div className="consulting-container grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
        <SectionHeading eyebrow="Before we talk" title="Useful answers, without the sales call." />
        <div className="border-t border-foreground">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-border">
              <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-6 rounded-sm py-6 text-left font-semibold">
                <span>{faq.question}</span>
                <span className="grid h-7 w-7 shrink-0 place-items-center border border-border text-lg font-light transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-7 pr-10 text-sm leading-6 text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
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
          <p className="consulting-kicker text-brass-soft">Free 30-minute discovery</p>
          <h2 className="consulting-display mt-5 max-w-4xl text-4xl leading-[1.08] md:text-6xl">
            Bring the AI problem your startup cannot yet turn into a path.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-background/65">
            We will clarify the real constraint, the next production decision,
            and whether working together would move the team forward fast enough
            to justify the investment.
          </p>
        </div>
        <Link
          href="/discovery"
          className="focus-ring group inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-brass-soft px-6 text-sm font-semibold text-foreground transition-colors hover:bg-background"
        >
          Book a discovery call
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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
      <h2 className={`consulting-display mt-5 max-w-3xl text-4xl leading-[1.08] md:text-5xl ${inverse ? "text-background" : "text-foreground"}`}>
        {title}
      </h2>
    </div>
  );
}