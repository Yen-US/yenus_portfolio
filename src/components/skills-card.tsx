"use client";

import { Badge } from "@/components/ui/badge";
import { technicalSkills, softSkills } from "@/lib/resume-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Code2 } from "lucide-react";
import { motion } from "framer-motion";

export function SkillsCard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Code2 className="h-5 w-5 text-green-500" />
        <h2 className="text-xl font-semibold">Skills</h2>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Technical
        </p>
        <TooltipProvider>
          <div className="flex flex-wrap gap-1.5">
            {technicalSkills.map((skill, i) => (
              <Tooltip key={skill}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge
                      variant="secondary"
                      className="bg-white/10 dark:bg-white/5 cursor-default transition-colors hover:bg-blue-500/20"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{skill}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Soft Skills
        </p>
        <div className="flex flex-wrap gap-1.5">
          {softSkills.map((skill, i) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.05 }}
            >
              <Badge
                variant="outline"
                className="border-white/10 cursor-default transition-colors hover:border-purple-500/30 hover:bg-purple-500/10"
              >
                {skill}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
