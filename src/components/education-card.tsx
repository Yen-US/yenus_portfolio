"use client";

import { education } from "@/lib/resume-data";
import { GraduationCap } from "lucide-react";

export function EducationCard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-amber-500" />
        <h2 className="text-xl font-semibold">Education</h2>
      </div>

      <div className="space-y-3">
        {education.map((edu, i) => (
          <div key={i} className="border-l-2 border-white/10 pl-3">
            <h3 className="text-sm font-semibold">{edu.degree}</h3>
            <p className="text-xs text-muted-foreground">{edu.institution}</p>
            <p className="text-xs text-muted-foreground/70">
              {edu.location} &middot; {edu.period}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
