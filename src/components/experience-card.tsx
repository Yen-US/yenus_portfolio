"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { experiences } from "@/lib/resume-data";
import { Briefcase, ArrowUpCircle } from "lucide-react";
import { motion } from "framer-motion";

export function ExperienceCard() {
  const featured = experiences.slice(0, 4);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button
          type="button"
          className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          aria-label="View full experience"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-500" />
              <h2 className="text-xl font-semibold">Experience</h2>
            </div>

            <div className="space-y-4">
              {featured.map((exp, i) => (
                <div
                  key={i}
                  className="group relative rounded-lg border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10 dark:border-white/5 dark:bg-white/[0.02]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-semibold leading-tight">
                          {exp.role}
                        </h3>
                        {exp.promoted && (
                          <span title="Promoted">
                            <ArrowUpCircle className="h-3.5 w-3.5 shrink-0 text-green-500" />
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {exp.company}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {exp.period}
                      </p>
                    </div>
                  </div>

                  {exp.highlights && exp.highlights.length > 0 && (
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {exp.highlights[0]}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-1">
                    {exp.techBadges.slice(0, 4).map((badge) => (
                      <Badge
                        key={badge}
                        variant="secondary"
                        className="bg-white/10 text-[10px] px-1.5 py-0 dark:bg-white/5 hover:scale-105 transition-transform"
                      >
                        {badge}
                      </Badge>
                    ))}
                    {exp.techBadges.length > 4 && (
                      <Badge
                        variant="secondary"
                        className="bg-white/10 text-[10px] px-1.5 py-0 dark:bg-white/5"
                      >
                        +{exp.techBadges.length - 4}
                      </Badge>
                    )}
                    {exp.softBadges.slice(0, 2).map((badge) => (
                      <Badge
                        key={badge}
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 border-white/10 hover:scale-105 transition-transform"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {experiences.length > 4 && (
              <p className="text-xs text-center text-muted-foreground">
                View full experience
              </p>
            )}
          </div>
        </motion.button>
      </DialogTrigger>

      <DialogContent className="backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Experience
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/10 bg-white/5 p-3 dark:border-white/5 dark:bg-white/[0.02]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold leading-tight">
                      {exp.role}
                    </h3>
                    {exp.promoted && (
                      <span title="Promoted">
                        <ArrowUpCircle className="h-3.5 w-3.5 shrink-0 text-green-500" />
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {exp.company}
                  </p>
                  {exp.companyNote && (
                    <p className="text-xs text-muted-foreground/70">
                      {exp.companyNote}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/70">
                    {exp.location}
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    {exp.period}
                    {exp.tenure ? ` | ${exp.tenure}` : ""}
                  </p>
                </div>
              </div>

              {exp.description && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {exp.description}
                </p>
              )}

              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                  {exp.highlights.map((highlight) => (
                    <li key={highlight} className="leading-relaxed">
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {exp.techBadges.map((badge) => (
                  <Badge key={badge} variant="secondary">
                    {badge}
                  </Badge>
                ))}
                {exp.softBadges.map((badge) => (
                  <Badge key={badge} variant="outline">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
