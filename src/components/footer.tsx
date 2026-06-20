import Link from "next/link";
import { profile } from "@/lib/resume-data";

export default function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-6xl border-t border-border/50 px-6 py-10">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="font-display text-lg tracking-tight text-foreground">
            Yenson <span className="text-brass">Umaña</span>
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {profile.title} · {profile.location}
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <Link href={profile.links.linkedin} target="_blank" rel="noopener" className="transition-colors hover:text-brass">
            LinkedIn
          </Link>
          <Link href={profile.links.github} target="_blank" rel="noopener" className="transition-colors hover:text-brass">
            GitHub
          </Link>
          <Link href={`mailto:${profile.email}`} className="transition-colors hover:text-brass">
            Email
          </Link>
          <Link href={profile.links.presencia} target="_blank" rel="noopener" className="transition-colors hover:text-brass">
            Presencia
          </Link>
        </nav>

        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
          © {new Date().getFullYear()} · Built with care
        </p>
      </div>
    </footer>
  );
}
