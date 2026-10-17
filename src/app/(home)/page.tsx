import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  DownloadCvButton,
  EmailButton,
  GitHubButton,
  HomeFooter,
  HomeHeader,
  LinkedInButton,
} from "@/components/home/home-chrome";
import { Screens } from "@/components/home/screens";
import { alsoBuilt, contact, intro, person, products, roles, type Product } from "@/lib/home-data";

export const metadata: Metadata = {
  title: { absolute: "Yenson Umaña · Senior AI Solution Architect" },
  description:
    "Senior AI Solution Architect who builds products from scratch: Presencia Studio and Listo, both live in Costa Rica. Former AI advisor for Microsoft for Startups. CV and contact.",
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
  sameAs: [person.linkedin, person.github, ...products.map((p) => p.url)],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <a
        href="#main"
        className="hm-focus sr-only z-50 rounded-lg bg-[var(--hm-ink)] px-4 py-3 font-semibold text-[var(--hm-bg)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <HomeHeader />
      <main id="main">
        <Showroom />
        <Chapters />
        <AlsoBuilt />
        <Experience />
        <Contact />
      </main>
      <HomeFooter />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Showroom() {
  return (
    <section id="work" aria-labelledby="hero-title" className="scroll-mt-20 pb-10 pt-6 md:pb-16 md:pt-10">
      <div className="hm-wrap">
        <h1 id="hero-title" className="hm-h max-w-[26em] text-[clamp(1.25rem,2.4vw,2rem)] text-[var(--hm-ink)]">
          <span className="sr-only">{person.name}. </span>
          {intro.title}
        </h1>

        <div className="hm-stage mt-5 md:mt-8">
          <div className="mb-2 flex items-baseline justify-between gap-4 md:mb-3">
            <h2 className="text-[0.9rem] font-semibold text-[var(--hm-muted)] md:text-[0.95rem]">{intro.stageLabel}</h2>
          </div>
          <fieldset className="hm-switch mb-3 border-0 lg:hidden">
            <legend className="sr-only">Choose a product to look at</legend>
            {products.map((p, i) => (
              <span key={p.id} className="contents">
                <input type="radio" name="product" id={`switch-${p.id}`} defaultChecked={i === 0} />
                <label htmlFor={`switch-${p.id}`}>{p.name}</label>
              </span>
            ))}
          </fieldset>

          <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, priority }: { product: Product; priority: boolean }) {
  const vars = {
    "--tint-field": product.tint.field,
    "--tint-ink": product.tint.ink,
    "--tint-accent": product.tint.accent,
  } as React.CSSProperties;
  return (
    <article className="hm-card" data-product={product.id} style={vars} aria-labelledby={`${product.id}-name`}>
      <Screens
        name={product.name}
        screens={product.screens}
        priority={priority}
        copy={
          <div className="hm-card-copy">
            <h3 id={`${product.id}-name`} className="hm-display text-[clamp(2rem,5vw,3.75rem)]">
              {product.name}
            </h3>
            <p className="mt-2 max-w-[24em] text-[1rem] leading-6 sm:mt-3 sm:text-[1.125rem] sm:leading-7">{product.line}</p>
          </div>
        }
      >
        <a href={product.url} target="_blank" rel="noopener noreferrer" className="hm-btn hm-focus">
          Open {product.domain}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
        </a>
      </Screens>
    </article>
  );
}

/* ------------------------------------------------------------------ */

function Chapters() {
  return (
    <section aria-label="What I built in each product" className="border-t border-[var(--hm-line)]">
      {products.map((p, i) => (
        <article
          key={p.id}
          id={`${p.id}-detail`}
          aria-labelledby={`${p.id}-detail-title`}
          className={`hm-wrap grid gap-8 py-14 md:py-20 lg:grid-cols-2 lg:items-center lg:gap-14 ${i > 0 ? "border-t border-[var(--hm-line)]" : ""}`}
        >
          <div className={i % 2 === 1 ? "lg:order-2" : ""}>
            <h2 id={`${p.id}-detail-title`} className="hm-h text-[clamp(1.75rem,3.4vw,2.75rem)]">
              {p.name}
            </h2>
            <p className="mt-5 max-w-[38em] text-[1.0625rem] leading-7 text-[var(--hm-ink)]">{p.built}</p>
            <details className="hm-details mt-4 text-[1.0625rem] leading-7">
              <summary className="hm-focus">Decisions you can see in the product</summary>
              <ul className="mt-2 grid max-w-[38em] gap-2 pl-5 text-[var(--hm-muted)] marker:text-[var(--hm-muted)]" style={{ listStyle: "disc" }}>
                {p.decisions.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </details>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hm-focus hm-link mt-5 inline-flex min-h-11 items-center gap-1 font-semibold"
            >
              Open {p.domain}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
          <figure className={`hm-laptop m-0 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
            <Image src={p.desktop.src} alt={p.desktop.label} width={1440} height={900} sizes="(min-width: 1024px) 44vw, 100vw" />
          </figure>
        </article>
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ */

function AlsoBuilt() {
  return (
    <section id="also" aria-labelledby="also-title" className="scroll-mt-20 border-t border-[var(--hm-line)] py-14 md:py-20">
      <div className="hm-wrap grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14">
        <h2 id="also-title" className="hm-h text-[clamp(1.75rem,3.4vw,2.75rem)]">
          Also built
        </h2>
        <ul className="grid gap-6">
          {alsoBuilt.map((item) => (
            <li key={item.name} className="grid gap-2 border-t border-[var(--hm-line)] pt-5 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-8">
              <h3 className="text-[1.125rem] font-bold leading-6">{item.name}</h3>
              <div>
                <p className="max-w-[40em] text-[1.0625rem] leading-7 text-[var(--hm-muted)]">{item.body}</p>
                {item.link && (
                  <a
                    href={item.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hm-focus hm-link mt-2 inline-flex min-h-11 items-center gap-1 font-semibold"
                  >
                    {item.link.label}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-20 border-t border-[var(--hm-line)] py-14 md:py-20">
      <div className="hm-wrap grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14">
        <div>
          <h2 id="experience-title" className="hm-h text-[clamp(1.75rem,3.4vw,2.75rem)]">
            Experience
          </h2>
          <p className="mt-3 text-[1.0625rem] leading-7 text-[var(--hm-muted)]">
            <Link href="/career" className="hm-focus hm-link text-[var(--hm-ink)]">
              All eight roles
            </Link>{" "}
            and the{" "}
            <Link href="/cv" className="hm-focus hm-link text-[var(--hm-ink)]">
              full CV
            </Link>
            .
          </p>
        </div>
        <ol className="grid">
          {roles.map((r) => (
            <li
              key={`${r.title}-${r.org}`}
              className="grid gap-1 border-t border-[var(--hm-line)] py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-baseline md:gap-6"
            >
              <span className="text-[1.125rem] font-bold leading-6">{r.org}</span>
              <span className="text-[1.0625rem] leading-6 text-[var(--hm-muted)]">{r.title}</span>
              <span className="text-[0.95rem] font-semibold tabular-nums">{r.dates}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Contact() {
  return (
    <section aria-labelledby="contact-title" className="border-t border-[var(--hm-line)] bg-[var(--hm-panel)] py-16 md:py-24">
      <div className="hm-wrap grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end lg:gap-14">
        <div>
          <h2 id="contact-title" className="hm-display text-[clamp(2.5rem,7vw,6rem)]">
            {contact.title}
          </h2>
          <a
            href={`mailto:${person.email}`}
            className="hm-focus hm-link mt-6 inline-block text-[clamp(1.25rem,2.4vw,1.75rem)] font-semibold"
          >
            {person.email}
          </a>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <DownloadCvButton className="sm:col-span-2" />
          <EmailButton />
          <Link href="/cv" className="hm-btn hm-focus">
            View CV
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
          </Link>
          <LinkedInButton />
          <GitHubButton />
          <p className="pt-2 text-[0.95rem] leading-6 text-[var(--hm-muted)] sm:col-span-2">
            {contact.consulting}{" "}
            <Link href="/consulting" className="hm-focus hm-link text-[var(--hm-ink)]">
              See consulting
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
