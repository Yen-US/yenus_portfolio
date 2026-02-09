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
import { ExternalLink, FolderGit2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function ProjectsCard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FolderGit2 className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-semibold">Projects</h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Dialog key={i}>
            <DialogTrigger asChild>
              <motion.button
                className="group relative overflow-hidden rounded-lg border border-white/5 bg-white/5 p-3 text-left transition-colors hover:bg-white/10 dark:border-white/5 dark:bg-white/[0.02]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative mb-2 aspect-video overflow-hidden rounded-md bg-black/10">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-sm font-semibold leading-tight">
                  {project.name}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                  {project.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-white/10 text-[10px] px-1.5 py-0 dark:bg-white/5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.button>
            </DialogTrigger>

            <DialogContent className="backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-white/20">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {project.name}
                  <Link
                    href={project.url}
                    target="_blank"
                    rel="noopener"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {project.type}
                  </p>
                  <p className="mt-1 text-sm">{project.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {project.period}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.techBadges.map((badge) => (
                    <Badge key={badge} variant="secondary">
                      {badge}
                    </Badge>
                  ))}
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
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
