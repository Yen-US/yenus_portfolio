import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DownloadCvButton, EmailButton, HomeFooter, HomeHeader } from "@/components/home/home-chrome";
import { Screens } from "@/components/home/screens";
import { cases, closing, intro, system, type ClientCase } from "@/lib/client-work-data";
import { person } from "@/lib/home-data";

export const metadata: Metadata = {
  title: "Customer-acquisition work",
  description:
    "Client systems Yenson Umaña designed, built and operates through Presencia Studio: Guanacaste Earthmoving (bilingual site, two-tap WhatsApp quoting) and JR Rodríguez (commission page, inquiry inbox, Facebook channel). Real screens and public links.",
  alternates: { canonical: "/work/customer-acquisition" },
  openGraph: {
    title: "Customer-acquisition work · Yenson Umaña",
    description:
      "Guanacaste Earthmoving and JR Rodríguez: the pages, the paths to a conversation, and the tooling behind them, built through Presencia Studio.",
    url: "https://yenus.dev/work/customer-acquisition",
    siteName: "Yenson Umaña",
    type: "website",
    locale: "en_US",
  },
};

export default function CustomerAcquisitionPage() {
  return (
    <>
      <a
        href="#main"
        className="hm-focus sr-only z-50 rounded-lg bg-[var(--hm-ink)] px-4 py-3 font-semibold text-[var(--hm-bg)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <HomeHeader />
      <main id="main">
        <section aria-labelledby="cw-title" className="pb-5 pt-5 md:pb-10 md:pt-10">
          <div className="hm-wrap">
            <p className="text-[0.95rem] font-semibold text-[var(--hm-muted)]">
              <Link href="/work" className="hm-focus hm-link">
                Work
              </Link>{" "}
              / Client work
            </p>
            <h1 id="cw-title" className="hm-h mt-2 max-w-[22em] text-[clamp(1.375rem,3.2vw,2.75rem)]">
              {intro.title}
            </h1>
            <p className="mt-3 max-w-[38em] text-[1rem] leading-6 text-[var(--hm-muted)] md:text-[1.0625rem] md:leading-7">{intro.line}</p>
          </div>
        </section>

        {cases.map((c, i) => (
          <CaseSection key={c.id} c={c} priority={i === 0} />
        ))}

        <section aria-labelledby="cw-system" className="border-t border-[var(--hm-line)] py-10 md:py-14">
          <div className="hm-wrap grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14">
            <h2 id="cw-system" className="hm-h text-[clamp(1.5rem,3vw,2.25rem)]">
              {system.title}
            </h2>
            <div className="grid max-w-[44em] gap-3 text-[1.0625rem] leading-7">
              <p className="text-[var(--hm-ink)]">{system.body[0]}</p>
              <p className="text-[var(--hm-muted)]">{system.body[1]}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="cw-closing" className="border-t border-[var(--hm-line)] bg-[var(--hm-panel)] py-14 md:py-20">
          <div className="hm-wrap grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end lg:gap-14">
            <div>
              <h2 id="cw-closing" className="hm-display text-[clamp(2rem,5vw,4rem)]">
                {closing.title}
              </h2>
              <p className="mt-5 max-w-[34em] text-[1.0625rem] leading-7 text-[var(--hm-muted)]">
                {intro.ownProducts} {closing.body}
              </p>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <Link href="/#work" className="hm-btn hm-focus">
                Products I founded
              </Link>
              <Link href="/work" className="hm-btn hm-focus">
                Startup work
              </Link>
              <DownloadCvButton />
              <EmailButton />
              <p className="pt-1 text-[0.95rem] leading-6 text-[var(--hm-muted)] sm:col-span-2">
                <a href={`mailto:${person.email}`} className="hm-focus hm-link text-[var(--hm-ink)]">
                  {person.email}
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}

function CaseSection({ c, priority }: { c: ClientCase; priority: boolean }) {
  const vars = { "--tint-field": c.tint.field, "--tint-ink": c.tint.ink } as React.CSSProperties;
  return (
    <section id={c.id} aria-labelledby={`${c.id}-name`} className="scroll-mt-20 border-t border-[var(--hm-line)] py-10 md:py-16">
      <div className="hm-wrap grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        {/* The client's page, as a phone in the client's own colour. */}
        <article className="hm-card" data-product={c.id} style={vars}>
          <Screens
            name={c.name}
            screens={c.screens}
            priority={priority}
            deferRest
            copy={
              <div className="hm-card-copy">
                <p className="cw-logo">
                  <Image src={c.logo.src} alt={c.logo.alt} width={c.logo.width} height={c.logo.height} />
                </p>
                <h2 id={`${c.id}-name`} className="hm-display mt-3 text-[clamp(2rem,4.5vw,3.25rem)]">
                  {c.name}
                </h2>
                <p className="mt-2 max-w-[24em] text-[1rem] leading-6 sm:mt-3 sm:text-[1.125rem] sm:leading-7">{c.line}</p>
              </div>
            }
          >
            <a href={c.url} target="_blank" rel="noopener noreferrer" className="hm-btn hm-focus">
              Open {c.domain}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </a>
          </Screens>
        </article>

        {/* The case: context, what was built, how a customer arrives, where it stands. */}
        <div className="grid content-start gap-7">
          <p className="text-[1.0625rem] leading-7 text-[var(--hm-ink)]">{c.role}</p>

          <div>
            <h3 className="text-[1.0625rem] font-bold leading-7">Context</h3>
            <p className="mt-1 max-w-[40em] text-[1.0625rem] leading-7 text-[var(--hm-muted)]">{c.story.context}</p>
          </div>

          <div>
            <h3 className="text-[1.0625rem] font-bold leading-7">What I built</h3>
            <ul className="mt-2 grid max-w-[40em] gap-2 text-[1.0625rem] leading-7 text-[var(--hm-muted)]">
              {c.story.built.map((b) => (
                <li key={b} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3">
                  <span aria-hidden="true" className="mt-[0.85rem] h-px bg-[var(--hm-ink)]" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[1.0625rem] font-bold leading-7">How a customer arrives</h3>
            <ol className="cw-flow mt-2" aria-label={`Acquisition flow for ${c.name}`}>
              {c.story.flow.map((step, i) => (
                <li key={step} data-end={i === c.story.flow.length - 1 ? "" : undefined}>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="text-[1.0625rem] font-bold leading-7">Where it stands</h3>
            <p className="mt-1 max-w-[40em] text-[1.0625rem] leading-7 text-[var(--hm-muted)]">{c.story.state}</p>
          </div>

          <div className="cw-gallery">
            {c.gallery.map((g) => (
              <figure key={g.src}>
                <Image src={g.src} alt={g.alt} width={g.width} height={g.height} sizes="(min-width: 1024px) 15vw, 45vw" fetchPriority="low" />
              </figure>
            ))}
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {c.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="hm-focus hm-link inline-flex min-h-11 items-center gap-1 font-semibold">
                  {l.label}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
