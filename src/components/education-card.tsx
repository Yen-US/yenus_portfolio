"use client";

import { Badge } from "@/components/ui/badge";
import { education, certifications } from "@/lib/resume-data";
import { GraduationCap, Award } from "lucide-react";

export function EducationCard() {
  const azureCerts = certifications.filter((c) => c.issuer === "Microsoft");
  const otherCerts = certifications.filter((c) => !c.issuer);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-amber-500" />
        <h2 className="text-xl font-semibold">Education & Certs</h2>
      </div>

      {/* Education */}
      <div className="space-y-3">
        {education.map((edu, i) => (
          <div key={i} className="border-l-2 border-white/10 pl-3">
            <h3 className="text-sm font-semibold">{edu.degree}</h3>
            <p className="text-xs text-muted-foreground">{edu.institution}</p>
            <p className="text-xs text-muted-foreground/70">
              {edu.location}
              {edu.status && (
                <Badge variant="outline" className="ml-2 text-[10px] px-1.5 py-0 border-amber-500/30 text-amber-400">
                  {edu.status}
                </Badge>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Azure Certifications */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Award className="h-4 w-4 text-blue-500" />
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Certifications
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {azureCerts.map((cert) => (
            <Badge
              key={cert.name}
              variant="secondary"
              className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]"
            >
              {cert.name}
            </Badge>
          ))}
          {otherCerts.map((cert) => (
            <Badge
              key={cert.name}
              variant="outline"
              className="text-[10px] px-1.5 py-0 border-white/10"
            >
              {cert.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
