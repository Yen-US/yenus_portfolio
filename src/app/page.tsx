import NavBar from "@/components/nav-bar";
import { ScrollProgress } from "@/components/scroll-progress";
import { GradientBackground } from "@/components/gradient-background";
import { BentoGrid, BentoCard } from "@/components/bento-grid";
import { GlassCard } from "@/components/glass-card";
import { HeroSection } from "@/components/welcome-card";
import { ExperienceCard } from "@/components/experience-card";
import { ProjectsCard } from "@/components/projects-card";
import { SkillsCard } from "@/components/skills-card";
import { EducationCard } from "@/components/education-card";
import { ContactCard } from "@/components/contact-card";
import { AiSummaryCard } from "@/components/ai-summary-card";
import { CaseStudiesCard } from "@/components/case-studies-card";
import { SpeakingCard } from "@/components/speaking-card";
import { ConsultingCta } from "@/components/consulting-cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <GradientBackground />
      <ScrollProgress />

      <div className="relative z-10 min-h-screen">
        <NavBar />

        <main className="mx-auto max-w-6xl px-6 md:px-8">
          {/* Editorial hero */}
          <HeroSection />

          {/* Refined bento */}
          <BentoGrid>
            {/* 01 — Experience (2 cols, 2 rows) */}
            <BentoCard colSpan={2} rowSpan={2}>
              <GlassCard className="h-full">
                <ExperienceCard />
              </GlassCard>
            </BentoCard>

            {/* 02 — Ask me / AI Insight (2 cols, 2 rows) */}
            <BentoCard colSpan={2} rowSpan={2}>
              <GlassCard className="h-full">
                <AiSummaryCard />
              </GlassCard>
            </BentoCard>

            {/* 05 — Signature case study (full width) */}
            <BentoCard colSpan={4}>
              <GlassCard className="h-full">
                <CaseStudiesCard />
              </GlassCard>
            </BentoCard>

            {/* 03 — Ventures (3 cols) */}
            <BentoCard colSpan={3}>
              <GlassCard className="h-full">
                <ProjectsCard />
              </GlassCard>
            </BentoCard>

            {/* 06 — Credentials (1 col) */}
            <BentoCard colSpan={1}>
              <GlassCard className="h-full">
                <EducationCard />
              </GlassCard>
            </BentoCard>

            {/* 08 — Speaking (3 cols) */}
            <BentoCard colSpan={3}>
              <GlassCard className="h-full">
                <SpeakingCard />
              </GlassCard>
            </BentoCard>

            {/* 07 — Contact (1 col) */}
            <BentoCard colSpan={1}>
              <GlassCard className="h-full">
                <ContactCard />
              </GlassCard>
            </BentoCard>

            {/* 04 — Stack (full width) */}
            <BentoCard colSpan={4}>
              <GlassCard className="h-full">
                <SkillsCard />
              </GlassCard>
            </BentoCard>
          </BentoGrid>

          {/* 09 — Consulting CTA */}
          <ConsultingCta />
        </main>

        <Footer />
      </div>
    </>
  );
}
