"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { projects } from "@/lib/resume-data";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function ProjectsCard() {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-baseline justify-between gap-3">
        <SectionLabel kicker="03" title="Other ventures" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {projects.length} active
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Dialog key={i}>
            <DialogTrigger asChild>
              <motion.button
                className="group/proj relative flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-secondary/30 text-left transition-all hover:border-brass/40 hover:bg-secondary/50 focus-ring"
                whileTap={{ scale: 0.99 }}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(min-width: 640px) 240px, 100vw"
                    className="object-cover transition-transform duration-700 group-hover/proj:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/0 to-transparent" />
                  {project.featured && (
                    <span className="absolute left-3 top-3 rounded-full border border-brass/40 bg-background/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-brass backdrop-blur">
                      Flagship
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base leading-tight text-foreground">
                      {project.name}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover/proj:-translate-y-0.5 group-hover/proj:translate-x-0.5 group-hover/proj:text-brass" />
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
                    {project.type}
                  </p>
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </motion.button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl border-border/60 bg-card/95 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 font-display text-2xl tracking-tight">
                  {project.name}
                  <Link
                    href={project.url}
                    target="_blank"
                    rel="noopener"
                    className="text-muted-foreground transition-colors hover:text-brass"
                    aria-label={`Visit ${project.name}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-lg border border-border/60">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-brass">
                    {project.type}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                    {project.description}
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                    {project.period}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.techBadges.map((badge) => (
                    <Badge
                      key={badge}
                      variant="secondary"
                      className="rounded-full border-border/60 bg-secondary/60 font-mono text-[10px] font-normal uppercase tracking-wider"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass">
        {kicker}
      </span>
      <h2 className="font-display text-2xl leading-none tracking-tight">
        {title}
      </h2>
    </div>
  );
}
