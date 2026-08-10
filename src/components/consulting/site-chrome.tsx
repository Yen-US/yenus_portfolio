import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { consultant } from "@/lib/consulting-data";

const navigation = [
  { href: "/#work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#approach", label: "Approach" },
  { href: "/#perspective", label: "Perspective" },
  { href: "/#about", label: "About" },
];

export function ConsultingHeader() {
  return (
    <header className="consulting-header sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="consulting-container flex h-[72px] items-center justify-between gap-6">
        <Link
          href="/"
          className="focus-ring flex shrink-0 items-center gap-3 rounded-sm"
          aria-label="Yenson Umaña, home"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-border bg-card p-1">
            <Image
              src="/brand/yenson-umana-mark.svg"
              width={32}
              height={32}
              priority
              alt=""
              aria-hidden="true"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="leading-none">
            <span className="block text-sm font-semibold">Yenson Umaña</span>
            <span className="mt-1 hidden font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
              AI architecture &amp; technical strategy
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-7 lg:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/discovery"
          className="focus-ring group inline-flex min-h-10 items-center justify-center gap-2 rounded-sm bg-foreground px-4 text-sm font-semibold text-background transition-colors hover:bg-signal"
        >
          <span className="hidden sm:inline">Discuss your initiative</span>
          <span className="sm:hidden">Discovery</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </header>
  );
}

export function ConsultingFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="consulting-container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
        <div>
          <p className="consulting-display text-3xl">Yenson Umaña</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            AI architecture and technical strategy for startup founders and CTOs
            making consequential decisions while the path is still open.
          </p>
        </div>

        <div>
          <p className="consulting-kicker">Navigate</p>
          <nav className="mt-4 flex flex-col items-start gap-3 text-sm">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-signal">
                {item.label}
              </Link>
            ))}
            <Link href="/discovery" className="hover:text-signal">
              Discovery
            </Link>
          </nav>
        </div>

        <div>
          <p className="consulting-kicker">Connect</p>
          <div className="mt-4 flex flex-col items-start gap-3 text-sm">
            <Link href={consultant.linkedin} target="_blank" rel="noopener" className="hover:text-signal">
              LinkedIn
            </Link>
            <Link href={consultant.github} target="_blank" rel="noopener" className="hover:text-signal">
              GitHub
            </Link>
            <Link href={`mailto:${consultant.email}`} className="hover:text-signal">
              {consultant.email}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="consulting-container flex flex-col gap-2 py-5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Yenson Umaña</p>
          <p>Independent practice · Costa Rica · Global delivery</p>
        </div>
      </div>
    </footer>
  );
}