import NavBar from "@/components/nav-bar";
import { ScrollProgress } from "@/components/scroll-progress";
import { GradientBackground } from "@/components/gradient-background";
import { BentoGrid, BentoCard } from "@/components/bento-grid";
import { GlassCard } from "@/components/glass-card";
import { WelcomeCard } from "@/components/welcome-card";
import { ExperienceCard } from "@/components/experience-card";
import { ProjectsCard } from "@/components/projects-card";
import { SkillsCard } from "@/components/skills-card";
import { EducationCard } from "@/components/education-card";
import { ContactCard } from "@/components/contact-card";
import { AiSummaryCard } from "@/components/ai-summary-card";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <GradientBackground />
      <ScrollProgress />

      <div className="relative z-10 min-h-screen">
        <NavBar />

        <main className="mx-auto max-w-5xl px-4 py-8 md:px-6">
          <BentoGrid>
            {/* Welcome — spans 3 cols */}
            <BentoCard colSpan={3}>
              <GlassCard>
                <WelcomeCard />
              </GlassCard>
            </BentoCard>

            {/* AI Summary — 1 col, 2 rows */}
            <BentoCard colSpan={1} rowSpan={2}>
              <GlassCard className="h-full">
                <AiSummaryCard />
              </GlassCard>
            </BentoCard>

            {/* Experience — 1 col, 2 rows */}
            <BentoCard colSpan={1} rowSpan={2}>
              <GlassCard className="h-full">
                <ExperienceCard />
              </GlassCard>
            </BentoCard>

            {/* Projects — 2 cols */}
            <BentoCard colSpan={2}>
              <GlassCard>
                <ProjectsCard />
              </GlassCard>
            </BentoCard>

            {/* Skills — 2 cols */}
            <BentoCard colSpan={2}>
              <GlassCard>
                <SkillsCard />
              </GlassCard>
            </BentoCard>

            {/* Education — 1 col */}
            <BentoCard colSpan={1}>
              <GlassCard>
                <EducationCard />
              </GlassCard>
            </BentoCard>

            {/* Contact — 1 col */}
            <BentoCard colSpan={1}>
              <GlassCard>
                <ContactCard />
              </GlassCard>
            </BentoCard>
          </BentoGrid>
        </main>

        <Footer />
      </div>
    </>
  );
}
