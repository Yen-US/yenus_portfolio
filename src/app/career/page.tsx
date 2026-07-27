import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Career Archive",
  description:
    "Yenson Umana's career history, selected projects, technical experience, and credentials.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CareerPage() {
  return (
    <>
      <GradientBackground />
      <ScrollProgress />

      <div className="relative z-10 min-h-screen">
        <NavBar />

        <main className="mx-auto max-w-6xl px-6 md:px-8">
          <HeroSection />

          <BentoGrid>
            <BentoCard colSpan={2} rowSpan={2}>
              <GlassCard className="h-full">
                <ExperienceCard />
              </GlassCard>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={2}>
              <GlassCard className="h-full">
                <AiSummaryCard />
              </GlassCard>
            </BentoCard>

            <BentoCard colSpan={4}>
              <GlassCard className="h-full">
                <CaseStudiesCard />
              </GlassCard>
            </BentoCard>

            <BentoCard colSpan={3}>
              <GlassCard className="h-full">
                <ProjectsCard />
              </GlassCard>
            </BentoCard>

            <BentoCard colSpan={1}>
              <GlassCard className="h-full">
                <EducationCard />
              </GlassCard>
            </BentoCard>

            <BentoCard colSpan={3}>
              <GlassCard className="h-full">
                <SpeakingCard />
              </GlassCard>
            </BentoCard>

            <BentoCard colSpan={1}>
              <GlassCard className="h-full">
                <ContactCard />
              </GlassCard>
            </BentoCard>

            <BentoCard colSpan={4}>
              <GlassCard className="h-full">
                <SkillsCard />
              </GlassCard>
            </BentoCard>
          </BentoGrid>

          <ConsultingCta />
        </main>

        <Footer />
      </div>
    </>
  );
}