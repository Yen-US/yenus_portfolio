import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Download, Mail, Menu } from "lucide-react";
import { person } from "@/lib/portfolio-data";
import { MobileMenu } from "@/components/portfolio/mobile-menu";

export const navigation = [
  { href: "/#work", label: "Work" },
  { href: "/#approach", label: "How I decide" },
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/cv", label: "CV" },
  { href: "/consulting", label: "Consulting" },
];

const icon = { "aria-hidden": true, className: "h-4 w-4 shrink-0", strokeWidth: 2 } as const;

export function DownloadCvButton({ className = "" }: { className?: string }) {
  return (
    <a href={person.cvPdf} download={person.cvFileName} className={`sh-btn sh-btn-primary sh-focus ${className}`}>
      <span>
        Download CV <span className="sr-only">(PDF)</span>
      </span>
      <Download {...icon} />
    </a>
  );
}

export function EmailButton({ className = "" }: { className?: string }) {
  return (
    <a href={`mailto:${person.email}`} className={`sh-btn sh-focus ${className}`}>
      Email
      <Mail {...icon} />
    </a>
  );
}

export function ViewCvButton({ className = "" }: { className?: string }) {
  return (
    <Link href="/cv" className={`sh-btn sh-focus ${className}`}>
      View CV
      <ArrowUpRight {...icon} />
    </Link>
  );
}

export function LinkedInButton({ className = "" }: { className?: string }) {
  return (
    <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className={`sh-btn sh-focus ${className}`}>
      LinkedIn
      <ArrowUpRight {...icon} />
    </a>
  );
}

export function GitHubButton({ className = "" }: { className?: string }) {
  return (
    <a href={person.github} target="_blank" rel="noopener noreferrer" className={`sh-btn sh-focus ${className}`}>
      GitHub
      <ArrowUpRight {...icon} />
    </a>
  );
}

export function SheetHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--sh-ink)] bg-[var(--sh-paper)]">
      <div className="sh-wrap flex h-16 items-center justify-between gap-6">
        <Link href="/" className="sh-focus flex min-h-11 items-center gap-3" aria-label="Yenson Umaña, portfolio home">
          <Image
            src="/brand/yenson-umana-mark.svg"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 shrink-0"
          />
          <span translate="no" className="sh-label text-[1.05rem]">
            {person.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="sh-focus inline-flex min-h-11 items-center text-[0.95rem] text-[var(--sh-graphite)] transition-colors hover:text-[var(--sh-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <DownloadCvButton />
          </div>
          <MobileMenu
            summary={
              <summary
                className="sh-focus grid h-11 w-11 place-items-center border-[1.5px] border-[var(--sh-ink)]"
                aria-label="Open menu"
              >
                <Menu aria-hidden="true" className="h-5 w-5" />
              </summary>
            }
          >
            <nav
              aria-label="Primary"
              className="absolute right-0 top-[calc(100%+0.5rem)] w-64 border-[1.5px] border-[var(--sh-ink)] bg-[var(--sh-paper)] p-2"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="sh-focus flex min-h-11 items-center px-3 text-base font-semibold hover:bg-[var(--sh-ink)] hover:text-[var(--sh-paper)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}

export function SheetFooter() {
  return (
    <footer className="border-t border-[var(--sh-ink)]">
      <div className="sh-wrap flex flex-col gap-4 py-8 text-sm text-[var(--sh-graphite)] md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {person.fullName}. Based in {person.location}, working remotely.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={`mailto:${person.email}`} className="sh-focus sh-link hover:text-[var(--sh-ink)]">
            {person.email}
          </a>
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="sh-focus sh-link hover:text-[var(--sh-ink)]">
            LinkedIn
          </a>
          <a href={person.github} target="_blank" rel="noopener noreferrer" className="sh-focus sh-link hover:text-[var(--sh-ink)]">
            GitHub
          </a>
          <Link href="/consulting" className="sh-focus sh-link hover:text-[var(--sh-ink)]">
            Consulting
          </Link>
        </div>
      </div>
    </footer>
  );
}
