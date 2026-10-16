import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ActionBar } from "@/components/sheet/action-bar";
import { CareerChain } from "@/components/sheet/career-chain";
import {
  DownloadCvButton,
  EmailButton,
  GitHubButton,
  LinkedInButton,
  SheetFooter,
  SheetHeader,
  ViewCvButton,
} from "@/components/sheet/sheet-chrome";
import {
  certifications,
  chainOrigin,
  contact,
  details,
  education,
  experienceNote,
  experienceTitle,
  hero,
  person,
  revision,
  rules,
  sheetIndex,
  skillGroups,
  type Detail,
} from "@/lib/sheet-data";

export const metadata: Metadata = {
  title: { absolute: "Yenson Umaña · Senior AI Solution Architect" },
  description:
    "Senior AI Solution Architect. Production AI since 2022, AI advisory for Microsoft for Startups (2024 to 2026), a one-week Vercel + GCP to Azure migration, and guardrailed AI for live events. Work, decisions, experience, CV.",
  alternates: { canonical: "/" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.fullName,
  alternateName: person.name,
  jobTitle: person.role,
  url: person.site,
  email: `mailto:${person.email}`,
  address: { "@type": "PostalAddress", addressCountry: "CR" },
  sameAs: [person.linkedin, person.github],
};

export default function PortfolioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <a
        href="#main"
        className="sh-focus sr-only z-50 bg-[var(--sh-ink)] px-4 py-3 font-semibold text-[var(--sh-paper)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SheetHeader />
      <main id="main" className="pb-24 lg:pb-0">
        <Hero />
        <Work />
        <Rules />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <SheetFooter />
      <ActionBar watch="title-actions">
        <DownloadCvButton />
        <EmailButton />
      </ActionBar>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="border-b border-[var(--sh-ink)]">
      <div className="sh-wrap grid lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(0,1fr)_26rem]">
        {/* The drawing area */}
        <div className="relative flex flex-col pt-10 lg:border-r lg:border-[var(--sh-ink)] lg:pb-10 lg:pr-12 lg:pt-14">
          <h1 id="hero-title" className="sh-display text-[clamp(2.25rem,11.5vw,8.25rem)]">
            {hero.title}
          </h1>
          <p className="mt-7 max-w-[32em] text-[1.125rem] leading-[1.6] md:mt-9 md:text-[1.375rem] lg:max-w-[26em]">
            {hero.lede}
          </p>

          {/* Portrait: a real photograph, standing on the dimension line like a figure. */}
          <div className="relative mt-8 flex-1 lg:mt-0 lg:min-h-[8rem]">
            <div className="relative ml-auto h-[15rem] w-[15rem] sm:h-[19rem] sm:w-[19rem] lg:absolute lg:bottom-0 lg:right-0 lg:h-[30rem] lg:w-[22rem]">
              <Image
                src="/YenUSPP2.webp"
                alt="Portrait of Yenson Umaña"
                fill
                priority
                sizes="(min-width: 1024px) 22rem, (min-width: 640px) 19rem, 15rem"
                className="object-contain object-bottom"
              />
            </div>
          </div>

          <div className="sh-dim sh-inkin hidden lg:block" aria-hidden="true">
            <span>
              {chainOrigin} to {revision}
            </span>
          </div>
        </div>

        {/* The title block: identity, the sheet index, and every action, one glance away. */}
        <TitleBlock />
      </div>
    </section>
  );
}

function TitleBlock() {
  const rows: [string, React.ReactNode][] = [
    ["Based in", hero.basedIn],
    [
      "Certified",
      <>
        {certifications.filter((c) => c.code).map((c) => c.code).join(", ")}{" "}
        <span className="text-[var(--sh-graphite)]">(Microsoft Azure)</span>
      </>,
    ],
    ["Education", `${education.degree}, ${education.school} (${education.status.toLowerCase()})`],
    ["Revision", revision],
  ];
  return (
    <aside
      id="title-block"
      aria-label="Title block"
      className="mt-10 flex flex-col border-[1.5px] border-[var(--sh-ink)] lg:mt-0 lg:border-0"
    >
      <div className="border-b border-[var(--sh-ink)] p-5 lg:p-8">
        <p translate="no" className="sh-display text-[clamp(2rem,7vw,2.75rem)] uppercase">
          {person.fullName.replace(" Solano", "")}
        </p>
        <p className="mt-3 text-[1.25rem] font-semibold leading-tight lg:text-[1.375rem]">{person.role}</p>
        <dl className="mt-6 grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] text-[0.95rem] leading-6">
          {rows.map(([label, value], i) => (
            <div key={label} className="contents">
              <dt
                className="sh-inkin border-t border-[var(--sh-rule)] py-2 text-[var(--sh-graphite)]"
                style={{ "--inkin-delay": `${80 + i * 60}ms` } as React.CSSProperties}
              >
                {label}
              </dt>
              <dd className="border-t border-[var(--sh-rule)] py-2">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Sheet index: what is on this page, with real counts, as in-page links. */}
      <nav aria-label="On this page" className="hidden border-b border-[var(--sh-ink)] p-8 lg:block lg:flex-1">
        <ol className="grid gap-0 text-[0.95rem]">
          {sheetIndex.map((item) => (
            <li key={item.href} className="border-t border-[var(--sh-rule)] first:border-t-0">
              <a
                href={item.href}
                className="sh-focus grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-2 font-semibold hover:text-[var(--sh-graphite)]"
              >
                <span>{item.label}</span>
                <span className="font-normal text-[var(--sh-graphite)]">{item.count}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div id="title-actions" className="grid gap-2.5 p-5 lg:p-8">
        <DownloadCvButton />
        <div className="grid grid-cols-2 gap-2.5">
          <ViewCvButton />
          <EmailButton />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <LinkedInButton />
          <GitHubButton />
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */

function SectionTitle({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <h2 id={id} className={`sh-display text-[clamp(2.25rem,6vw,5rem)] ${className}`}>
      {children}
    </h2>
  );
}

function StackLine({ items }: { items: string[] }) {
  return (
    <p className="text-[0.95rem] font-semibold text-[var(--sh-graphite)]">
      <span className="sr-only">Stack: </span>
      {items.join(" / ")}
    </p>
  );
}

function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-20 py-16 md:py-24">
      <div className="sh-wrap">
        <SectionTitle id="work-title" className="max-w-[14em]">
          The decisions inside three systems.
        </SectionTitle>
        <div className="mt-12 md:mt-16">
          {details.map((detail, index) => (
            <DetailArticle key={detail.id} detail={detail} lead={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailArticle({ detail, lead }: { detail: Detail; lead: boolean }) {
  const titleId = `${detail.id}-title`;
  return (
    <article
      aria-labelledby={titleId}
      className="sh-detail grid gap-8 border-t-2 border-[var(--sh-ink)] py-10 md:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14"
    >
      <div>
        <h3
          id={titleId}
          className={`sh-title ${lead ? "text-[clamp(1.875rem,4.2vw,3.5rem)]" : "text-[clamp(1.625rem,3.2vw,2.75rem)]"}`}
        >
          {detail.title}
        </h3>
        <p className="mt-5 max-w-[36em] text-[1.125rem] leading-[1.6]">{detail.context}</p>
        {detail.decisions.length > 0 && (
          <ul className="mt-7 grid max-w-[36em] gap-3.5">
            {detail.decisions.map((point) => (
              <li key={point} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3 text-[1.0625rem] leading-7">
                <span aria-hidden="true" className="mt-[0.85rem] h-px bg-[var(--sh-ink)]" />
                {point}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
          <StackLine items={detail.stack} />
          {detail.link && (
            <a
              href={detail.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="sh-focus sh-link inline-flex min-h-11 items-center gap-1 font-semibold"
            >
              {detail.link.label}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <div className="lg:pt-2">
        {detail.cut && (
          <figure className="m-0">
            <div className="sh-cut" aria-hidden="true">
              {detail.cut.bands.map((band) => (
                <div key={band.label} className="sh-band" data-tone={band.tone ?? "ink"}>
                  <span>{band.label}</span>
                  {band.note && <small>{band.note}</small>}
                </div>
              ))}
            </div>
            <div className="sh-dim mt-6" aria-hidden="true">
              <span>{detail.cut.dimension}</span>
            </div>
            <figcaption className="sr-only">
              Section cut: {detail.cut.bands.map((b) => (b.note ? `${b.label} (${b.note})` : b.label)).join(", then ")}. Dimension: {detail.cut.dimension}.
            </figcaption>
          </figure>
        )}
        {detail.image && (
          <figure className="m-0 border-[1.5px] border-[var(--sh-ink)]">
            <div className="relative aspect-[16/10]">
              <Image
                src={detail.image.src}
                alt={detail.image.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-top"
              />
            </div>
          </figure>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */

function Rules() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="scroll-mt-20 border-t border-[var(--sh-ink)] py-16 md:py-24">
      <div className="sh-wrap">
        <SectionTitle id="approach-title" className="max-w-[13em]">
          Four rules, each with the project it came from.
        </SectionTitle>
        <ol className="mt-12 border-t-2 border-[var(--sh-ink)] md:mt-16">
          {rules.map((rule) => (
            <li
              key={rule.title}
              className="grid gap-3 border-b border-[var(--sh-rule)] py-7 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-start md:gap-12 md:py-9"
            >
              <h3 className="sh-title text-[clamp(1.5rem,2.8vw,2.375rem)]">{rule.title}</h3>
              <div>
                <p className="max-w-[34em] text-[1.0625rem] leading-7">{rule.body}</p>
                <p className="mt-2 text-[0.95rem] text-[var(--sh-graphite)]">From {rule.source}.</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-20 border-t border-[var(--sh-ink)] py-16 md:py-24">
      <div className="sh-wrap">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
          <SectionTitle id="experience-title">{experienceTitle}</SectionTitle>
          <p className="max-w-[30em] text-[1.0625rem] leading-7 text-[var(--sh-graphite)]">
            {experienceNote}{" "}
            <Link href="/cv" className="sh-focus sh-link text-[var(--sh-ink)]">
              Read the full CV
            </Link>
            .
          </p>
        </div>
        <div className="mt-12 md:mt-16">
          <CareerChain />
        </div>
        <p className="mt-6 text-[1.0625rem] leading-7">
          <span className="font-semibold">Education.</span> {education.degree}, {education.school} (
          {education.status.toLowerCase()}).
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Skills() {
  const [primaryCerts, otherCerts] = [
    certifications.filter((c) => c.code),
    certifications.filter((c) => !c.code),
  ];
  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-20 border-t border-[var(--sh-ink)] py-16 md:py-24">
      <div className="sh-wrap">
        <SectionTitle id="skills-title">Skills and certifications.</SectionTitle>
        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
          <dl className="border-t-2 border-[var(--sh-ink)]">
            {skillGroups.map((group) => (
              <div
                key={group.name}
                className="grid gap-2 border-b border-[var(--sh-rule)] py-6 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:gap-8"
              >
                <dt className="text-[1.0625rem] font-bold leading-7">{group.name}</dt>
                <dd className="m-0">
                  <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[1.0625rem] leading-7">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>

          <div className="border-t-2 border-[var(--sh-ink)] pt-6">
            <h3 className="text-[1.0625rem] font-bold leading-7">Certifications</h3>
            <ul className="mt-4 grid gap-3">
              {primaryCerts.map((cert) => (
                <li key={cert.name} className="text-[1.125rem] leading-7">
                  <span className="font-bold">{cert.code}</span> {cert.name}
                </li>
              ))}
            </ul>
            <ul className="mt-4 grid gap-1 text-[1.0625rem] leading-7 text-[var(--sh-graphite)]">
              {otherCerts.map((cert) => (
                <li key={cert.name}>{cert.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Contact() {
  return (
    <section aria-labelledby="contact-title" className="sh-on-ink border-t border-[var(--sh-ink)] bg-[var(--sh-ink)] py-16 text-[var(--sh-paper)] md:py-24">
      <div className="sh-wrap grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <div>
          <h2 id="contact-title" className="sh-display text-[clamp(2.5rem,7vw,6.5rem)]">
            {contact.title}
          </h2>
          <p className="mt-7 max-w-[32em] text-[1.125rem] leading-[1.6] text-[var(--sh-on-ink-muted)]">
            {contact.body}
          </p>
          <a
            href={`mailto:${person.email}`}
            className="sh-focus sh-link mt-5 inline-block text-[clamp(1.25rem,2.6vw,1.75rem)] font-semibold"
          >
            {person.email}
          </a>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <DownloadCvButton className="sm:col-span-2" />
          <ViewCvButton />
          <EmailButton />
          <LinkedInButton />
          <GitHubButton />
          <p className="pt-3 text-[0.95rem] leading-6 text-[var(--sh-on-ink-muted)] sm:col-span-2">
            {contact.consulting}{" "}
            <Link href="/consulting" className="sh-focus sh-link text-[var(--sh-paper)]">
              See consulting
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
