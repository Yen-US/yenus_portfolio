import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { FlapBoard } from "@/components/portfolio/flap-board";
import {
  DownloadCvButton,
  StationFooter,
  StationHeader,
} from "@/components/portfolio/station-chrome";
import {
  certifications,
  education,
  experience,
  heroLine,
  leadProject,
  person,
  principles,
  projects,
  skillGroups,
  type Project,
} from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: { absolute: "Yenson Umaña · Senior AI Solution Architect" },
  description:
    "Senior AI Solution Architect building production agentic AI systems and Azure migrations. Selected work, architecture approach, experience, skills, and CV.",
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
        className="station-focus sr-only z-50 bg-[var(--st-yellow)] px-4 py-3 font-semibold text-[var(--st-yellow-ink)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <StationHeader />
      <main id="main">
        <Hero />
        <SelectedWork />
        <Approach />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <StationFooter />
    </>
  );
}

function Hero() {
  const board = [
    { text: person.name },
    { text: person.role, tone: "yellow" as const },
  ];
  return (
    <section aria-labelledby="hero-title" className="border-b border-[var(--st-line)]">
      <div className="station-wrap grid gap-6 py-8 md:py-12 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8 lg:py-10">
        <div className="flex flex-col justify-center">
          <h1 id="hero-title" className="sr-only">
            {person.name}, {person.role}
          </h1>
          <FlapBoard lines={board} cols={10} animate className="sm:hidden" />
          <FlapBoard lines={board} cols={13} animate className="hidden sm:block" />

          <p className="mt-7 max-w-[34rem] text-xl leading-8 text-[var(--st-paper)] md:text-2xl md:leading-9">
            {heroLine}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <DownloadCvButton />
            <a href={`mailto:${person.email}`} className="st-btn st-btn-secondary station-focus">
              <Mail aria-hidden="true" className="h-4 w-4" strokeWidth={2.25} />
              Email me
            </a>
          </div>
        </div>

        <div className="relative min-h-[22rem] overflow-hidden bg-[var(--st-yellow)] sm:min-h-[28rem] lg:min-h-0">
          <Image
            src="/YenUSPP2.webp"
            alt="Portrait of Yenson Umaña"
            fill
            preload
            fetchPriority="high"
            sizes="(min-width: 1024px) 34vw, 100vw"
            className="object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="station-display text-[clamp(3rem,8vw,6rem)] font-black leading-[0.9]"
    >
      {children}
    </h2>
  );
}

function StackLine({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <p className={`mt-6 text-sm font-semibold ${dark ? "text-[var(--st-yellow-ink)]/75" : "text-[var(--st-muted)]"}`}>
      <span className="sr-only">Stack: </span>
      {items.join(" / ")}
    </p>
  );
}

function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-20 py-20 md:py-28">
      <div className="station-wrap">
        <SectionTitle id="work-title">Selected work</SectionTitle>

        {/* The lead project turns face-out as its own route board. */}
        <article
          aria-labelledby="lead-title"
          className="mt-12 grid gap-8 bg-[var(--st-housing)] p-4 md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12"
        >
          <FlapBoard
            cols={12}
            className="self-start bg-[var(--st-ink)]"
            lines={[
              { text: leadProject.route[0] },
              { text: leadProject.route[1], tone: "yellow" },
              { text: leadProject.route[2] },
            ]}
          />
          <div>
            <h3 id="lead-title" className="station-display text-4xl font-extrabold leading-none md:text-5xl">
              {leadProject.name}
            </h3>
            <p className="mt-5 max-w-prose text-lg leading-8 text-[var(--st-paper)]">
              {leadProject.context}
            </p>
            <ul className="mt-6 grid gap-4">
              {leadProject.points.map((point) => (
                <li key={point} className="max-w-prose border-t border-[var(--st-line)] pt-4 leading-7 text-[var(--st-muted)]">
                  {point}
                </li>
              ))}
            </ul>
            <StackLine items={leadProject.stack} />
          </div>
        </article>

        <div className="mt-4 grid gap-4 lg:grid-cols-12">
          <ProjectPoster project={projects[0]} />
          <ProjectShot project={projects[1]} />
          <ProjectNote project={projects[2]} />
        </div>
      </div>
    </section>
  );
}

/** AOP Beacon: printed yellow poster, the most architecture-dense project. */
function ProjectPoster({ project }: { project: Project }) {
  return (
    <article
      aria-labelledby={`${project.id}-title`}
      className="flex flex-col bg-[var(--st-yellow)] p-6 text-[var(--st-yellow-ink)] md:p-8 lg:col-span-5 lg:row-span-2"
    >
      <p className="text-sm font-semibold">{project.role}</p>
      <h3 id={`${project.id}-title`} className="station-display mt-3 text-6xl font-black leading-[0.85] md:text-7xl">
        {project.name}
      </h3>
      <p className="mt-6 text-lg font-semibold leading-7">{project.summary}</p>
      <ul className="mt-6 grid gap-4 border-t-2 border-[var(--st-yellow-ink)] pt-6">
        {project.points.map((point) => (
          <li key={point} className="leading-7">{point}</li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
        <StackLine items={project.stack} dark />
        {project.link && (
          <a
            href={project.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="st-btn st-btn-dark station-focus mt-5"
          >
            {project.link.label}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}

function ProjectShot({ project }: { project: Project }) {
  return (
    <article
      aria-labelledby={`${project.id}-title`}
      className="grid bg-[var(--st-housing)] lg:col-span-7"
    >
      {project.image && (
        <div className="relative aspect-[16/9] overflow-hidden bg-[var(--st-tile)]">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-top"
          />
        </div>
      )}
      <div className="grid gap-4 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:p-8">
        <div>
          <p className="text-sm font-semibold text-[var(--st-yellow)]">{project.role}</p>
          <h3 id={`${project.id}-title`} className="station-display mt-2 text-4xl font-extrabold leading-none">
            {project.name}
          </h3>
          <p className="mt-4 max-w-prose leading-7 text-[var(--st-paper)]">{project.summary}</p>
          {project.points.map((point) => (
            <p key={point} className="mt-2 max-w-prose leading-7 text-[var(--st-muted)]">{point}</p>
          ))}
        </div>
        {project.link && (
          <a
            href={project.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="station-focus station-link inline-flex items-center gap-1 font-semibold text-[var(--st-paper)]"
          >
            {project.link.label}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}

function ProjectNote({ project }: { project: Project }) {
  return (
    <article
      aria-labelledby={`${project.id}-title`}
      className="grid gap-3 border-2 border-[var(--st-tile)] p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-8 md:p-8 lg:col-span-7"
    >
      <div>
        <p className="text-sm font-semibold text-[var(--st-yellow)]">{project.role}</p>
        <h3 id={`${project.id}-title`} className="station-display mt-2 text-3xl font-extrabold leading-none">
          {project.name}
        </h3>
      </div>
      <div>
        <p className="leading-7 text-[var(--st-paper)]">{project.summary}</p>
        <StackLine items={project.stack} />
      </div>
    </article>
  );
}

function Approach() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-title"
      className="scroll-mt-20 border-y border-[var(--st-line)] bg-[var(--st-housing)] py-20 md:py-28"
    >
      <div className="station-wrap grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionTitle id="approach-title">How I make architecture calls</SectionTitle>
          <p className="mt-6 max-w-md text-lg leading-8 text-[var(--st-muted)]">
            The rules I bring to every system, whether I am advising a startup team or running my own product.
          </p>
        </div>
        <ol className="grid gap-10 md:gap-12">
          {principles.map((item) => (
            <li key={item.title}>
              <h3 className="station-display text-[clamp(2.25rem,4.6vw,3.75rem)] font-extrabold leading-[0.95] text-[var(--st-paper)]">
                {item.title}
              </h3>
              <p className="mt-3 max-w-xl text-lg leading-8 text-[var(--st-muted)]">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Experience as a printed rail timetable: yellow sheet, black type, ruled rows. */
function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-20 py-20 md:py-28">
      <div className="station-wrap">
        <div className="bg-[var(--st-yellow)] px-5 py-8 text-[var(--st-yellow-ink)] md:px-10 md:py-12">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b-[6px] border-[var(--st-yellow-ink)] pb-5">
            <h2 id="experience-title" className="station-display text-[clamp(3rem,8vw,6rem)] font-black leading-[0.9]">
              Experience
            </h2>
            <Link href="/cv" className="station-focus station-link pb-2 text-base font-semibold">
              Read the full CV
            </Link>
          </div>

          <ol>
            {experience.map((role) => (
              <li
                key={role.id}
                className="grid gap-3 border-b-2 border-[var(--st-yellow-ink)] py-7 last:border-b-0 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8"
              >
                <p className="station-display text-2xl font-extrabold leading-none md:text-[1.75rem]">
                  {role.dates}
                </p>
                <div>
                  <h3 className="station-display text-3xl font-black leading-none md:text-4xl">
                    {role.title}
                  </h3>
                  <p className="mt-2 text-lg font-semibold">
                    {role.org} <span className="font-normal">/ {role.place}</span>
                  </p>
                  <ul className="mt-4 grid max-w-3xl gap-2 leading-7">
                    {role.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-2 border-t-[6px] border-[var(--st-yellow-ink)] pt-5 text-lg">
            <span className="font-semibold">Education.</span> {education.degree}, {education.school} ({education.status.toLowerCase()}).
          </p>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const [primaryCerts, otherCerts] = [
    certifications.filter((c) => c.code),
    certifications.filter((c) => !c.code),
  ];
  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-20 pb-20 md:pb-28">
      <div className="station-wrap">
        <SectionTitle id="skills-title">Skills</SectionTitle>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div className="grid gap-9">
            {skillGroups.map((group) => (
              <div key={group.name}>
                <h3 className="text-lg font-semibold text-[var(--st-yellow)]">{group.name}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="flapchip">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--st-yellow)]">Certifications</h3>
            <ul className="mt-4 grid gap-5">
              {primaryCerts.map((cert) => (
                <li key={cert.name} className="text-lg leading-7">
                  <span className="font-semibold text-[var(--st-paper)]">{cert.code}</span>{" "}
                  <span className="text-lg leading-7">{cert.name}</span>
                </li>
              ))}
            </ul>
            <ul className="mt-6 grid gap-1 text-lg leading-8 text-[var(--st-muted)]">
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

function Contact() {
  return (
    <section aria-labelledby="contact-title" className="border-t border-[var(--st-line)] bg-[var(--st-housing)] py-20 md:py-28">
      <div className="station-wrap grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <h2 id="contact-title" className="station-display text-[clamp(3.25rem,9vw,7rem)] font-black leading-[0.88]">
            Talk to me about the role.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--st-muted)]">
            Email is the fastest way to reach me:{" "}
            <a href={`mailto:${person.email}`} className="station-focus station-link text-[var(--st-paper)]">
              {person.email}
            </a>
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <DownloadCvButton />
          <a href={`mailto:${person.email}`} className="st-btn st-btn-secondary station-focus">
            <Mail aria-hidden="true" className="h-4 w-4" strokeWidth={2.25} />
            Email me
          </a>
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="st-btn st-btn-secondary station-focus">
            <Linkedin aria-hidden="true" className="h-4 w-4" strokeWidth={2.25} />
            LinkedIn
          </a>
          <a href={person.github} target="_blank" rel="noopener noreferrer" className="st-btn st-btn-secondary station-focus">
            <Github aria-hidden="true" className="h-4 w-4" strokeWidth={2.25} />
            GitHub
          </a>
          <p className="pt-3 text-[var(--st-muted)] sm:col-span-2">
            Looking for independent AI architecture advice for a startup instead?{" "}
            <Link href="/consulting" className="station-focus station-link text-[var(--st-paper)]">
              See consulting
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
