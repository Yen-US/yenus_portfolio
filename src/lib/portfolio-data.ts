/**
 * Recruiter portfolio content for `/` and `/cv`.
 *
 * Source of truth is Yenson's supplied CV plus public repository evidence.
 * Nothing here may claim an outcome, metric, client, or testimonial that is not
 * in one of those places. This module also generates the public CV PDF
 * (`pnpm generate-public-cv`), so the HTML CV and the download cannot drift.
 *
 * Departures from the supplied CV (see docs/cv/PROVENANCE.md):
 * - Employment dates confirmed by Yenson on 2026-10-15: Microsoft (via
 *   Accenture) ended Oct 2026, Wind River ended Jun 2026. The supplied CV
 *   listed both as "Present". No current-employment claim is made for either.
 * - Typographic dashes are written as plain hyphens to match the site's copy rules.
 */

export const person = {
  name: "Yenson Umaña",
  fullName: "Yenson Umaña Solano",
  role: "Senior AI Solution Architect",
  location: "Costa Rica",
  email: "yen21000@gmail.com",
  linkedin: "https://www.linkedin.com/in/yenus/",
  github: "https://github.com/Yen-US",
  site: "https://yenus.dev",
  cvPdf: "/yenson-ai-resume.pdf",
  cvFileName: "Yenson-Umana-Solano-CV.pdf",
};

export const heroLine =
  "I design and ship production agentic AI systems, most recently as an AI architect for Microsoft for Startups.";

/** CV summary, with the Microsoft for Startups role moved to the past tense. */
export const summary =
  "Senior AI Solution Architect specializing in agentic systems and Azure migrations. Former AI advisor for Microsoft for Startups (via Accenture), where I led cloud migrations and productionization. Founder of Presencia Studio, delivering brand experiences and advisory services.";

export const competencies = [
  "AI Architecture",
  "Agentic Systems",
  "Azure Migrations",
  "Cloud Solutions",
  "Production AI",
  "AI Advisory",
  "Leadership",
  "Public Speaking",
  "Mentorship",
  "Customer Focus",
];

export type Role = {
  id: string;
  title: string;
  org: string;
  place: string;
  /** Rendered as-is, month-granular. Keep it a range only when both ends are confirmed. */
  dates: string;
  points: string[];
};

export const experience: Role[] = [
  {
    id: "microsoft-accenture",
    title: "Senior AI Solution Architect",
    org: "Microsoft (via Accenture)",
    place: "Remote",
    dates: "May 2024 - Oct 2026",
    points: [
      "Led AI advisory for Microsoft for Startups, focusing on architecture, migrations, and agentic systems.",
      "Directed technical strategy for teams of 3-15 engineers on agent stack and migration paths.",
      "Executed a full Vercel + GCP to Azure migration in 1 week using Claude Code and MCP.",
      "Delivered enablement sessions on Azure AI, agent frameworks, and LLM productionization.",
      "Utilized Azure AI Foundry, Azure Agent Dev Kit, and OpenAI Responses API in production patterns.",
    ],
  },
  {
    id: "presencia",
    title: "Founder",
    org: "Presencia Studio",
    place: "Costa Rica",
    dates: "2025 - Present",
    points: [
      "Developed end-to-end brand experiences with NFC cards and smart objects.",
      "Launched MVP using Next.js 16, Supabase, and Vercel with bilingual systems.",
      "Created custom brand experiences, including NFC-enabled painting series.",
    ],
  },
  {
    id: "wind-river",
    title: "Full Stack Software Engineer",
    org: "Wind River",
    place: "Remote",
    dates: "Oct 2024 - Jun 2026",
    points: [
      "Architected cloud systems using Angular, Vue.js, and Golang on PostgreSQL.",
      "Led AI integration to enhance developer productivity.",
      "Designed scalable microservices with Docker, REST, and GraphQL.",
    ],
  },
  {
    id: "onereach",
    title: "Solutions Development Engineer",
    org: "OneReach.ai",
    place: "Remote",
    dates: "Oct 2022 - Apr 2024",
    points: [
      "Built production AI systems before the launch of ChatGPT.",
      "Developed intelligent automations for triage and first-response.",
      "Gained expertise in conversational AI and agent orchestration.",
    ],
  },
];

/** The face-out project on `/`. CV: Selected Projects, item 1. */
export const leadProject = {
  id: "azure-migration",
  name: "Vercel + GCP to Azure migration",
  route: ["VERCEL + GCP", "TO AZURE", "IN 1 WEEK"],
  context:
    "A full production migration for a Y Combinator-backed startup, delivered in one week as part of my Microsoft for Startups advisory work. The client stays anonymous.",
  points: [
    "One target architecture with acceptance gates per subsystem, then a single cutover, instead of carrying two platforms for months.",
    "Agent-assisted execution with Claude Code and MCP, run with the startup's own engineers so they owned the result.",
  ],
  stack: ["Azure", "Claude Code", "MCP", "Azure Agent Dev Kit"],
};

export type Project = {
  id: string;
  name: string;
  role: string;
  summary: string;
  points: string[];
  stack: string[];
  link?: { href: string; label: string };
  image?: { src: string; alt: string; width: number; height: number };
};

export const projects: Project[] = [
  {
    id: "aop-beacon",
    name: "AOP Beacon",
    role: "Architecture and build for Amplification of Potential",
    summary:
      "NFC beacons on event tables open an AI conversation prompt for the people sitting there.",
    points: [
      "The model gets four seconds. On a timeout, an error, or an empty reply, the table sees a prompt from a curated library instead, so the moment is never lost.",
      "Requests carry only the stage, language, and chosen cards. Participant names never reach the model.",
      "Bilingual, English and Spanish, across four conversation stages.",
    ],
    stack: ["NFC", "OpenAI", "Next.js", "Supabase"],
    link: {
      href: "https://github.com/Yen-US/amplification-of-potential",
      label: "Source on GitHub",
    },
  },
  {
    id: "presencia-studio",
    name: "Presencia Studio",
    role: "Founder",
    summary:
      "Websites, NFC business cards, QR menus, and a loyalty program for small businesses in Costa Rica.",
    points: [
      "Launched the MVP on Next.js 16, Supabase, and Vercel with a bilingual content system.",
    ],
    stack: ["Next.js 16", "Supabase", "Vercel", "NFC"],
    link: { href: "https://presencia.studio", label: "presencia.studio" },
    image: {
      src: "/portfolio/presencia-studio.png",
      alt: "The Presencia Studio homepage in Spanish, with an English toggle, showing a sample QR menu, digital business card, and loyalty stamp card.",
      width: 1440,
      height: 900,
    },
  },
  {
    id: "junior-rodriguez",
    name: "Junior Rodríguez × Presencia",
    role: "Connected product experience",
    summary:
      "An NFC-enabled painting series. Each physical painting opens its own digital story.",
    points: [],
    stack: ["NFC", "Next.js", "Vercel"],
  },
];

/**
 * How I make architecture decisions. Condensed from the principles already
 * published on the consulting pages (`src/lib/consulting-data.ts`).
 */
export const principles = [
  {
    title: "Decide before the technology.",
    body: "Name the outcome, the constraints, and the cost of failure before choosing a model or a platform.",
  },
  {
    title: "Not everything should be an agent.",
    body: "A deterministic workflow is often the safer system. Autonomy has to earn its place.",
  },
  {
    title: "Evaluation before confidence.",
    body: "Latency, cost, and failure modes get measured and budgeted before anything is automated.",
  },
  {
    title: "Humans review what matters.",
    body: "Where a bad output has real consequences, a person stays in the loop by design.",
  },
  {
    title: "Leave the team owning it.",
    body: "Decisions, reasoning, and runbooks stay with the engineers who run the system after I leave.",
  },
];

export const skillGroups = [
  {
    name: "AI and agents",
    items: [
      "LLM",
      "RAG",
      "Agentic systems",
      "MCP",
      "Vector databases",
      "Azure OpenAI",
      "Azure AI Foundry",
      "Azure Agent Dev Kit",
      "Microsoft Agent Framework",
      "OpenAI Responses API",
      "LangChain",
      "Claude Code",
      "OpenCode",
    ],
  },
  {
    name: "Cloud and platform",
    items: ["Azure", "Docker", "Kubernetes", "CI/CD", "Vercel", "PostgreSQL", "REST APIs", "GraphQL"],
  },
  {
    name: "Languages and frameworks",
    items: ["TypeScript", "Python", "Golang", "Next.js", "Vue.js", "Angular", "FastAPI"],
  },
];

export const certifications = [
  { code: "AI-102", name: "Azure AI Engineer Associate" },
  { code: "AZ-204", name: "Azure Developer Associate" },
  { code: null, name: "Agile Foundations" },
  { code: null, name: "Project Management" },
  { code: null, name: "Agile Project Leadership" },
];

export const education = {
  degree: "Computer Engineering (Licentiate)",
  school: "Tecnológico de Costa Rica",
  status: "On hold",
};

/** CV keyword line, verbatim order. Rendered on `/cv` only. */
export const keywords = [
  "LLM", "RAG", "agentic systems", "vector database", "Azure OpenAI", "MCP", "CI/CD",
  "TypeScript", "Python", "Claude Code", "OpenCode", "LangChain", "Microsoft Agent Framework",
  "Azure Agent Dev Kit", "Azure AI Foundry", "Docker", "REST APIs", "GraphQL", "Kubernetes",
  "PostgreSQL", "Next.js", "Vue.js", "Angular", "FastAPI", "OpenAI Responses API", "Vercel",
];

/** CV "Selected projects", as listed on the PDF. Rendered on `/cv`. */
export const cvProjects = [
  {
    name: "Full Vercel + GCP to Azure Migration",
    body: "Led a 1-week migration for a YC-backed startup, utilizing Claude Code and MCP for seamless transition.",
    stack: "Azure, Claude Code, MCP, Azure Agent Dev Kit",
  },
  {
    name: "Junior Rodríguez × Presencia",
    body: "Created NFC-enabled painting series for a unique brand experience.",
    stack: "NFC, Next.js, Vercel",
  },
  {
    name: "AOP Beacon",
    body: "Designed NFC beacons with AI conversation prompts for live events.",
    stack: "NFC, OpenAI, Web App",
  },
];

/**
 * Word-wraps text onto a fixed-width split-flap board. Words never break
 * across rows; a word longer than the row is hard-split as a last resort.
 */
export function layoutFlapRows(lines: string[], cols: number): string[] {
  const rows: string[] = [];
  for (const line of lines) {
    let current = "";
    for (const rawWord of line.toUpperCase().split(/\s+/).filter(Boolean)) {
      let word = rawWord;
      while (word.length > cols) {
        if (current) rows.push(current);
        rows.push(word.slice(0, cols));
        word = word.slice(cols);
        current = "";
      }
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length <= cols) {
        current = candidate;
      } else {
        rows.push(current);
        current = word;
      }
    }
    if (current) rows.push(current);
  }
  return rows;
}
