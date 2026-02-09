"use client";

import { Badge } from "@/components/ui/badge";
import { skills } from "@/lib/resume-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Code2 } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { label: "Languages", items: skills.languages, color: "hover:bg-blue-500/20" },
  { label: "Frameworks", items: skills.frameworks, color: "hover:bg-purple-500/20" },
  { label: "Infrastructure & Tools", items: skills.infrastructure, color: "hover:bg-green-500/20" },
  { label: "Specializations", items: skills.specializations, color: "hover:bg-amber-500/20" },
];

export function SkillsCard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Code2 className="h-5 w-5 text-green-500" />
        <h2 className="text-xl font-semibold">Skills</h2>
      </div>

      <TooltipProvider>
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.label}>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {cat.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((skill, i) => (
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
                          className={`bg-white/10 dark:bg-white/5 cursor-default transition-colors ${cat.color}`}
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
            </div>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
