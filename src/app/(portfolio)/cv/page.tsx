import type { Metadata } from "next";
import {
  DownloadCvButton,
  StationFooter,
  StationHeader,
} from "@/components/portfolio/station-chrome";
import {
  certifications,
  competencies,
  cvProjects,
  education,
  experience,
  keywords,
  person,
  summary,
} from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "CV",
  description:
    "The CV of Yenson Umaña Solano, Senior AI Solution Architect: experience, selected projects, certifications, education, and keywords. Downloadable as the original PDF.",
  alternates: { canonical: "/cv" },
  openGraph: {
    title: "CV · Yenson Umaña, Senior AI Solution Architect",
    description:
      "Experience, selected projects, certifications, and education. Downloadable as the original PDF.",
    url: "https://yenus.dev/cv",
    siteName: "Yenson Umaña",
    type: "profile",
    locale: "en_US",
  },
};

/**
 * The CV as accessible HTML. The PDF download is generated from the same data
 * (`pnpm generate-public-cv`), so the two cannot disagree. Provenance and the
 * confirmed date corrections are recorded in docs/cv/PROVENANCE.md.
 */
export default function CvPage() {
  return (
    <>
      <a
        href="#main"
        className="station-focus sr-only z-50 bg-[var(--st-yellow)] px-4 py-3 font-semibold text-[var(--st-yellow-ink)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <StationHeader />
      <main id="main" className="station-wrap py-10 md:py-16">
        <div className="station-noprint mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="station-display text-[clamp(3rem,8vw,5.5rem)] font-black leading-[0.9]">
            Curriculum vitae
          </h1>
          <DownloadCvButton />
        </div>

        <article aria-label={`CV of ${person.fullName}`} className="cv-sheet px-5 py-8 md:px-14 md:py-14">
          <header className="border-b-[6px] border-[#141416] pb-6">
            <p className="station-display text-5xl font-black leading-none md:text-6xl">{person.fullName}</p>
            <p className="mt-2 text-xl font-semibold">{person.role}</p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.95rem]">
              <li>{person.location}</li>
              <li>
                <a className="station-focus station-link" href={`mailto:${person.email}`}>{person.email}</a>
              </li>
              <li>
                <a className="station-focus station-link" href={person.site}>yenus.dev</a>
              </li>
              <li>
                <a className="station-focus station-link" href={person.linkedin}>linkedin.com/in/yenus</a>
              </li>
              <li>
                <a className="station-focus station-link" href={person.github}>github.com/Yen-US</a>
              </li>
            </ul>
          </header>

          <CvSection title="Summary">
            <p className="max-w-[70ch] leading-7">{summary}</p>
          </CvSection>

          <CvSection title="Core competencies">
            <p className="max-w-[70ch] leading-7">{competencies.join(", ")}</p>
          </CvSection>

          <CvSection title="Experience">
            <ol className="grid gap-7">
              {experience.map((role) => (
                <li key={role.id}>
                  <h3 className="text-lg font-semibold leading-6">
                    {role.title}, {role.org}
                  </h3>
                  <p className="text-[0.95rem] text-[#4a4a50]">
                    {role.place} / {role.dates}
                  </p>
                  <ul className="mt-2 grid max-w-[70ch] list-disc gap-1 pl-5 leading-7 marker:text-[#4a4a50]">
                    {role.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </CvSection>

          <CvSection title="Selected projects">
            <ul className="grid gap-4">
              {cvProjects.map((project) => (
                <li key={project.name} className="max-w-[70ch] leading-7">
                  <span className="font-semibold">{project.name}.</span> {project.body}
                  <span className="block text-[0.95rem] text-[#4a4a50]">{project.stack}</span>
                </li>
              ))}
            </ul>
          </CvSection>

          <CvSection title="Certifications">
            <ul className="grid list-disc gap-1 pl-5 leading-7 marker:text-[#4a4a50]">
              {certifications.map((cert) => (
                <li key={cert.name}>{cert.code ? `${cert.code}: ${cert.name}` : cert.name}</li>
              ))}
            </ul>
          </CvSection>

          <CvSection title="Education">
            <p className="leading-7">
              {education.degree}, {education.school} ({education.status})
            </p>
          </CvSection>

          <CvSection title="Keywords">
            <p className="max-w-[70ch] leading-7 text-[#3a3a40]">{keywords.join(", ")}</p>
          </CvSection>
        </article>
      </main>
      <StationFooter />
    </>
  );
}

function CvSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-9 grid gap-3 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8">
      <h2 className="station-display text-2xl font-black leading-none">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
