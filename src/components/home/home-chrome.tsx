import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Download, Mail, Menu } from "lucide-react";
import { MobileMenu } from "@/components/portfolio/mobile-menu";
import { navigation, person } from "@/lib/home-data";

const icon = { "aria-hidden": true, className: "h-4 w-4 shrink-0", strokeWidth: 2 } as const;

export function DownloadCvButton({ className = "" }: { className?: string }) {
  return (
    <a href={person.cvPdf} download={person.cvFileName} className={`hm-btn hm-btn-primary hm-focus ${className}`}>
      <Download {...icon} />
      <span>
        Download CV <span className="sr-only">(PDF)</span>
      </span>
    </a>
  );
}

export function EmailButton({ className = "" }: { className?: string }) {
  return (
    <a href={`mailto:${person.email}`} className={`hm-btn hm-focus ${className}`}>
      <Mail {...icon} />
      Email
    </a>
  );
}

export function LinkedInButton({ className = "" }: { className?: string }) {
  return (
    <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className={`hm-btn hm-focus ${className}`}>
      LinkedIn
      <ArrowUpRight {...icon} />
    </a>
  );
}

export function GitHubButton({ className = "" }: { className?: string }) {
  return (
    <a href={person.github} target="_blank" rel="noopener noreferrer" className={`hm-btn hm-focus ${className}`}>
      GitHub
      <ArrowUpRight {...icon} />
    </a>
  );
}

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--hm-line)] bg-[var(--hm-bg)]">
      <div className="hm-wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="hm-focus flex min-h-11 items-center gap-3" aria-label="Yenson Umaña, portfolio home">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--hm-ink)] p-1.5">
            <Image src="/brand/yenson-umana-mark.svg" alt="" width={26} height={26} className="h-full w-full object-contain" />
          </span>
          <span translate="no" className="hm-h whitespace-nowrap text-[clamp(0.95rem,4vw,1.1rem)] font-bold">
            {person.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hm-focus inline-flex min-h-11 items-center text-[0.95rem] text-[var(--hm-muted)] transition-colors hover:text-[var(--hm-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <DownloadCvButton className="hidden sm:inline-flex" />
          <a href={person.cvPdf} download={person.cvFileName} className="hm-btn hm-btn-primary hm-focus sm:hidden">
            CV<span className="sr-only"> download (PDF)</span>
          </a>
          <MobileMenu
            summary={
              <summary
                className="hm-focus grid h-11 w-11 place-items-center rounded-lg border-[1.5px] border-[var(--hm-line)]"
                aria-label="Open menu"
              >
                <Menu aria-hidden="true" className="h-5 w-5" />
              </summary>
            }
          >
            <nav
              aria-label="Primary"
              className="absolute right-0 top-[calc(100%+0.5rem)] w-64 rounded-xl border-[1.5px] border-[var(--hm-line)] bg-[var(--hm-panel)] p-2"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hm-focus flex min-h-11 items-center rounded-lg px-3 text-base font-semibold hover:bg-[var(--hm-ink)] hover:text-[var(--hm-bg)]"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={`mailto:${person.email}`}
                className="hm-focus flex min-h-11 items-center rounded-lg px-3 text-base font-semibold hover:bg-[var(--hm-ink)] hover:text-[var(--hm-bg)]"
              >
                Email
              </a>
            </nav>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}

export function HomeFooter() {
  return (
    <footer className="border-t border-[var(--hm-line)]">
      <div className="hm-wrap flex flex-col gap-4 py-8 text-sm text-[var(--hm-muted)] md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {person.fullName}. {person.location}, working remotely.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={`mailto:${person.email}`} className="hm-focus hm-link hover:text-[var(--hm-ink)]">
            {person.email}
          </a>
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="hm-focus hm-link hover:text-[var(--hm-ink)]">
            LinkedIn
          </a>
          <a href={person.github} target="_blank" rel="noopener noreferrer" className="hm-focus hm-link hover:text-[var(--hm-ink)]">
            GitHub
          </a>
          <Link href="/career" className="hm-focus hm-link hover:text-[var(--hm-ink)]">
            Career record
          </Link>
          <Link href="/consulting" className="hm-focus hm-link hover:text-[var(--hm-ink)]">
            Consulting
          </Link>
        </div>
      </div>
    </footer>
  );
}
