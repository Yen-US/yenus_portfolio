export const profile = {
  name: "Yenson Umaña Solano",
  alias: "YenUS",
  title: "Senior AI Solution Architect",
  tagline: "Designing agentic systems at Microsoft. Founder @ Presencia Studio.",
  avatar: "/YenUSPP2.webp",
  location: "Costa Rica",
  email: "yen21000@gmail.com",
  website: "yenus.dev",
  status: "Available for AI advisory & architecture consulting",
  bookingUrl: "https://www.presencia.studio/agendar",
  headline:
    "Architecting AI for Microsoft Startups · Early agent adopter, now expert · Open to advisory engagements",
  signals: [
    { label: "Microsoft AI-102 + AZ-204 Certified" },
    { label: "Building AI since before ChatGPT (Oct 2022)" },
    { label: "3 promotions in 2 years" },
  ],
  links: {
    linkedin: "https://www.linkedin.com/in/yenus/",
    github: "https://github.com/Yen-US",
    cv: "/Yenson_Umana_Resume.pdf",
    website: "https://yenus.dev",
    presencia: "https://presencia.studio",
    booking: "https://www.presencia.studio/agendar",
  },
};

export interface Experience {
  role: string;
  company: string;
  companyNote?: string;
  location: string;
  period: string;
  tenure?: string;
  promoted?: boolean;
  current?: boolean;
  founder?: boolean;
  description?: string;
  highlights?: string[];
  techBadges: string[];
  softBadges: string[];
}

export const experiences: Experience[] = [
  {
    role: "Senior AI Solution Architect",
    company: "Microsoft",
    companyNote: "via Accenture",
    location: "Remote (LATAM)",
    period: "May 2024 – Present",
    tenure: "2 years +",
    current: true,
    description:
      "Sole AI expert advising the Microsoft for Startups program across LATAM. Architecture reviews, agentic system design, cloud migrations, and enablement.",
    highlights: [
      "Sole AI advisor for the Microsoft for Startups program — architecture, migrations, cost optimization, agentic systems",
      "Led a US-based Y Combinator–backed startup through a full Vercel + GCP → Azure migration in 1 week using Claude Code, MCP, and agentic workflows",
      "Deliver enablement sessions on Azure AI, agent frameworks, and LLM productionization to founders and Microsoft account teams",
      "Hands-on with Azure AI Foundry, Azure Agent Dev Kit, Azure AI Search, OpenAI Responses API, and Microsoft Agent Framework",
    ],
    techBadges: [
      "Azure AI",
      "Agent Frameworks",
      "MCP",
      "OpenAI",
      "LangGraph",
      "Vector Databases",
      "Python",
      "TypeScript",
    ],
    softBadges: ["Advisory", "Architecture", "Public Speaking"],
  },
  {
    role: "Founder",
    company: "Presencia Studio",
    location: "Costa Rica",
    period: "2025 – Present",
    current: true,
    founder: true,
    description:
      "Premium aluminum NFC business cards + hosted digital contact profiles. Spanish-first luxury brand for Costa Rican entrepreneurs and brands.",
    highlights: [
      "Designing, building, and operating an end-to-end premium product — brand, e-commerce, fulfillment, and customer experience",
      "Shipped MVP on Next.js 16 + Supabase + Vercel with bilingual copy system, loyalty sub-product, and Apple Wallet integration",
      "Operating model that pairs offline craftsmanship (laser-engraved anodized aluminum) with always-on digital profiles",
    ],
    techBadges: ["Next.js", "Supabase", "Tailwind", "shadcn/ui", "Vercel", "Resend"],
    softBadges: ["Brand", "Product", "Operations"],
  },
  {
    role: "Full Stack Software Engineer",
    company: "Wind River",
    location: "San José, Costa Rica (Remote)",
    period: "Oct 2024 – Jun 2026",
    tenure: "2 years 10 months total at Wind River",
    promoted: true,
    highlights: [
      "Architected cloud systems with Angular, Vue.js, Next.js, Golang, and Java on PostgreSQL",
      "Led AI integration initiatives to lift developer productivity across the platform",
      "Designed scalable microservices with Docker, REST, gRPC, Protobuf, Apache Pulsar, and GraphQL",
    ],
    techBadges: ["Angular", "Vue.js", "Next.js", "Golang", "Java", "PostgreSQL", "Docker", "gRPC", "GraphQL"],
    softBadges: [],
  },
  {
    role: "Junior Software Tools Engineer",
    company: "Wind River",
    location: "Remote",
    period: "Sep 2023 – Oct 2024",
    promoted: true,
    highlights: [
      "Sole engineer for Engineering Excellence — owned end-to-end internal tooling",
      "Built automation, documentation platforms, project management tools, and billing dashboards",
    ],
    techBadges: ["React", "Angular", "Node.js", "PostgreSQL", "Docker", "Linux"],
    softBadges: [],
  },
  {
    role: "Software Developer Intern",
    company: "Wind River",
    location: "Remote",
    period: "Apr 2023 – Sep 2023",
    highlights: [
      "Pioneered the company's first SAFe documentation site and analytics layer",
      "Launched a collaborative blog for Agile best practices",
    ],
    techBadges: ["React", "Linux", "Nginx", "Docker"],
    softBadges: ["Growth Mindset", "Lean-Agile"],
  },
  {
    role: "Solutions Development Engineer",
    company: "OneReach.ai",
    location: "United States (Remote)",
    period: "Oct 2022 – Apr 2024",
    tenure: "1 year 6 months",
    highlights: [
      "Joined October 2022 — one month before ChatGPT launched. Building production AI before the rest of the field caught up.",
      "First exposure to conversational AI and agent orchestration at production scale",
      "Built intelligent automations for triage, first-response, and after-hours coverage",
    ],
    techBadges: ["JavaScript", "Next.js", "SQL", "Conversational AI"],
    softBadges: ["Adaptability"],
  },
  {
    role: "Technical Support Engineer",
    company: "Wrike",
    location: "Heredia, Costa Rica (Remote)",
    period: "Feb 2022 – Apr 2023",
    tenure: "1 year 2 months",
    highlights: [
      "Expert technical support for enterprise PM software — integrations, workflows, advanced configs",
    ],
    techBadges: ["API", "Jira"],
    softBadges: ["Customer Focus"],
  },
  {
    role: "Tier 2 Support Engineer & SME",
    company: "DocuSign",
    companyNote: "via Sitel",
    location: "San José, Costa Rica (Remote)",
    period: "Jan 2021 – Feb 2022",
    tenure: "1 year 1 month",
    promoted: true,
    highlights: [
      "Promoted to Tier 2 and recognized as Subject Matter Expert on API and SSO",
      "Mentored team and led knowledge-sharing on complex product features",
    ],
    techBadges: [],
    softBadges: ["Leadership", "Mentorship"],
  },
];

export interface Project {
  name: string;
  url: string;
  type: string;
  description: string;
  period: string;
  image: string;
  imageDark?: string;
  tags: string[];
  techBadges: string[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    name: "Presencia Studio",
    url: "https://presencia.studio",
    type: "Founder · Luxury NFC platform",
    description:
      "Premium aluminum NFC business cards + hosted digital profiles. One tap opens your always-current contact page. Spanish-first, trust-first, made in Costa Rica.",
    period: "2025 – Present",
    image: "/yus.webp",
    imageDark: "/yus-light.webp",
    tags: ["Founder", "Luxury", "NFC", "SaaS"],
    techBadges: ["Next.js 16", "Supabase", "Tailwind v4", "shadcn/ui", "Vercel"],
    featured: true,
  },
  {
    name: "Ikido",
    url: "https://ikido.app",
    type: "Product · Human OS",
    description:
      "Goal-driven planning software for building and tracking the systems behind a life worth living.",
    period: "Ongoing",
    image: "/ikido.app.webp",
    tags: ["Product", "Planning"],
    techBadges: ["SaaS", "Product Design"],
  },
  {
    name: "YenUS Chatbot",
    url: "https://chat.yenus.dev",
    type: "Personal AI Assistant",
    description:
      "Personal extension of Vercel's chatbot with RAG over my data, web search, and image generation.",
    period: "Ongoing",
    image: "/chat.yenus.dev.webp",
    tags: ["RAG", "Agents"],
    techBadges: ["Vercel AI SDK", "OpenAI", "Next.js"],
  },
  {
    name: "Memoria Studio",
    url: "https://memorias.studio",
    type: "E-commerce",
    description:
      "AI-generated 3D-printed figurine business — operational and profitable side-venture.",
    period: "Ongoing",
    image: "/memorias.studio.webp",
    tags: ["3D Printing", "AI"],
    techBadges: ["E-commerce", "Operations"],
  },
];

export interface CaseStudy {
  title: string;
  client: string;
  clientNote?: string;
  period: string;
  problem: string;
  approach: string;
  outcome: string;
  metrics: { label: string; value: string }[];
  stack: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    title: "Full Vercel + GCP → Azure migration in one week",
    client: "US-based Y Combinator startup",
    clientNote: "Microsoft for Startups member",
    period: "2026",
    problem:
      "A YC-backed startup needed to move their entire production stack off Vercel and Google Cloud and onto Azure to unlock Microsoft for Startups credits — without disrupting customers.",
    approach:
      "Authored the migration architecture end-to-end, then orchestrated execution with Claude Code, MCP servers, and Azure Agent Dev Kit. Agents handled repo-wide refactors, infra provisioning, and contract verification while I drove design decisions and acceptance gates.",
    outcome:
      "Migration completed in 7 days from a path the founders could understand and own. Zero customer-visible downtime. Team gained an agentic operating model they continued using post-engagement.",
    metrics: [
      { label: "Duration", value: "1 week" },
      { label: "Downtime", value: "0 min" },
      { label: "Services moved", value: "Full stack" },
    ],
    stack: ["Azure", "Claude Code", "MCP", "Azure Agent Dev Kit", "Terraform"],
  },
];

export interface Speaking {
  title: string;
  audience: string;
  format: string;
  cadence?: string;
  topics: string[];
}

export const speaking: Speaking[] = [
  {
    title: "Building production agents on Azure",
    audience: "Microsoft for Startups founders & Microsoft account teams",
    format: "Workshop / Office Hours",
    cadence: "Ongoing",
    topics: ["Agent frameworks", "MCP", "Azure AI Foundry", "Cost optimization"],
  },
  {
    title: "From prompt engineering to agentic architecture",
    audience: "Startup engineering teams",
    format: "Advisory session",
    cadence: "On request",
    topics: ["LLM productionization", "RAG patterns", "Vector databases", "Eval"],
  },
  {
    title: "Cloud migrations with AI agents",
    audience: "Founders considering Azure migration",
    format: "Strategy session",
    cadence: "On request",
    topics: ["Migration planning", "Agent-driven execution", "Risk management"],
  },
];

export interface Conference {
  name: string;
  location: string;
  years: string[];
  note?: string;
}

export const conferences: Conference[] = [
  {
    name: "Mobile World Congress",
    location: "Barcelona",
    years: ["2026"],
    note: "Mobile, AI, and connectivity at industry scale",
  },
  {
    name: "Talent Arena",
    location: "Barcelona",
    years: ["2025", "2026"],
    note: "Engineering culture and the future of work",
  },
  {
    name: "JSConf Spain",
    location: "Madrid",
    years: ["2025", "2026"],
    note: "Bleeding-edge JavaScript and runtime evolution",
  },
];

export const skills = {
  agentsAndAI: [
    "Claude Code",
    "OpenCode",
    "Codex",
    "GitHub Copilot",
    "MCP",
    "LangGraph",
    "LangChain",
    "Microsoft Agent Framework",
    "Azure Agent Dev Kit",
    "Harness CI agents",
    "Hermes",
  ],
  aiFoundations: [
    "OpenAI Responses API",
    "OpenAI Completions",
    "Self-hosted LLMs",
    "RAG",
    "Vector DBs (Azure AI Search, Pinecone)",
    "FastAPI",
    "Eval pipelines",
  ],
  cloud: [
    "Azure AI Foundry",
    "Azure Cloud",
    "Azure AI-102",
    "Azure AZ-204",
    "Solution Architecture",
    "Cloud Migrations",
  ],
  languages: ["TypeScript", "Python", "Golang", "Java", "JavaScript"],
  frameworks: ["Next.js", "React", "Angular", "Vue.js", "FastAPI"],
  infrastructure: [
    "Docker",
    "PostgreSQL",
    "REST APIs",
    "gRPC",
    "Protobuf",
    "GraphQL",
    "Apache Pulsar",
    "Kubernetes",
    "Supabase",
  ],
};

export const technicalSkills = [
  ...skills.agentsAndAI,
  ...skills.aiFoundations,
  ...skills.cloud,
  ...skills.languages,
  ...skills.frameworks,
];

export const softSkills = [
  "Advisory",
  "Architecture",
  "Public Speaking",
  "Mentorship",
  "Leadership",
  "Customer Focus",
  "Growth Mindset",
  "Adaptability",
];

export interface Certification {
  name: string;
  issuer?: string;
}

export const certifications: Certification[] = [
  { name: "AI-102: Azure AI Engineer Associate", issuer: "Microsoft" },
  { name: "AZ-204: Azure Developer Associate", issuer: "Microsoft" },
  { name: "Agile Foundations" },
  { name: "Project Management" },
  { name: "Agile Project Leadership" },
];

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  status?: string;
}

export const education: Education[] = [
  {
    degree: "Computer Engineering (Licentiate)",
    institution: "Tecnológico de Costa Rica",
    location: "Cartago, Costa Rica",
    period: "On Hold",
    status: "On Hold",
  },
];
