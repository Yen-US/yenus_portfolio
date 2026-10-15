import Image from "next/image";
import Link from "next/link";
import { Download, Menu } from "lucide-react";
import { person } from "@/lib/portfolio-data";
import { MobileMenu } from "@/components/portfolio/mobile-menu";

const navigation = [
  { href: "/#work", label: "Work" },
  { href: "/#approach", label: "Approach" },
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/cv", label: "CV" },
  { href: "/consulting", label: "Consulting" },
];

export function DownloadCvButton({ className = "st-btn-primary" }: { className?: string }) {
  return (
    <a
      href={person.cvPdf}
      download={person.cvFileName}
      className={`st-btn station-focus ${className}`}
    >
      <Download aria-hidden="true" className="h-4 w-4" strokeWidth={2.25} />
      Download CV
      <span className="sr-only">(PDF)</span>
    </a>
  );
}

export function StationHeader() {
  return (
    <header className="station-noprint sticky top-0 z-40 border-b border-[var(--st-line)] bg-[var(--st-ink)]">
      <div className="station-wrap flex h-16 items-center justify-between gap-6">
        <Link href="/" className="station-focus flex items-center gap-3" aria-label="Yenson Umaña, portfolio home">
          <span className="grid h-10 w-10 shrink-0 place-items-center bg-[var(--st-yellow)] p-1.5">
            <Image
              src="/brand/yenson-umana-mark.svg"
              alt=""
              width={28}
              height={28}
              className="h-full w-full object-contain"
            />
          </span>
          <span translate="no" className="station-display text-xl font-extrabold leading-none tracking-[0.01em]">
            {person.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="station-focus text-[0.95rem] text-[var(--st-muted)] transition-colors hover:text-[var(--st-paper)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <DownloadCvButton />
          </div>
          <MobileMenu
            summary={
              <summary
                className="station-focus grid h-11 w-11 place-items-center bg-[var(--st-tile)] text-[var(--st-paper)]"
                aria-label="Open menu"
              >
                <Menu aria-hidden="true" className="h-5 w-5" />
              </summary>
            }
          >
            <nav
              aria-label="Primary"
              className="absolute right-0 top-[calc(100%+0.5rem)] w-60 bg-[var(--st-housing)] p-2"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="station-focus flex min-h-11 items-center px-3 text-base font-semibold hover:bg-[var(--st-tile)]"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={person.cvPdf}
                download={person.cvFileName}
                className="station-focus flex min-h-11 items-center px-3 text-base font-semibold text-[var(--st-orange)] hover:bg-[var(--st-tile)] sm:hidden"
              >
                Download CV (PDF)
              </a>
            </nav>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}

export function StationFooter() {
  return (
    <footer className="station-noprint border-t border-[var(--st-line)]">
      <div className="station-wrap flex flex-col gap-4 py-8 text-sm text-[var(--st-muted)] md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {person.fullName}. Based in {person.location}, working remotely.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={`mailto:${person.email}`} className="station-focus station-link hover:text-[var(--st-paper)]">
            {person.email}
          </a>
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="station-focus station-link hover:text-[var(--st-paper)]">
            LinkedIn
          </a>
          <a href={person.github} target="_blank" rel="noopener noreferrer" className="station-focus station-link hover:text-[var(--st-paper)]">
            GitHub
          </a>
          <Link href="/consulting" className="station-focus station-link hover:text-[var(--st-paper)]">
            Consulting
          </Link>
        </div>
      </div>
    </footer>
  );
}
