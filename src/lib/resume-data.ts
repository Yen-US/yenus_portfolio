export const profile = {
  name: "Yenson Umaña Solano",
  alias: "YenUS",
  title: "Senior AI Solution Architect",
  tagline:
    "AI architecture for Microsoft for Startups founders. Agentic systems, Azure migrations, productionization.",
  avatar: "/YenUSPP2.webp",
  location: "Costa Rica",
  email: "yen21000@gmail.com",
  website: "yenus.dev",
  status: "Open: Q3 2026 · 2 of 4 advisory slots available",
  bookingUrl: "https://www.presencia.studio/agendar",
  headline:
    "AI advisor for Microsoft for Startups · Early agent adopter, now expert · 2 of 4 Q3 slots open",
  // Disclosure that closes the conflict-of-interest gap visitors otherwise have to guess at.
  commitmentLine:
    "I take outside engagements with non-conflicting clients via Presencia Studio.",
  icp:
    "Microsoft for Startups founders shipping AI to production — and a small number of non-conflicting external clients via Presencia Studio.",
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
    presenciaCatalog: "https://presencia.studio/catalog",
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
      "End-to-end brand experience studio: NFC cards, smart objects, custom brand activations, landing pages, wallet loyalty systems, and monthly digital presence plans. The vehicle through which I take outside advisory and architecture engagements.",
    highlights: [
      "Productized catalog spans physical (NFC cards, smart objects, 3D-printed magnets, merch) and digital (profiles, landing pages, wallet/loyalty cards, smart menus, custom brand experiences)",
      "Shipped MVP on Next.js 16 + Supabase + Vercel with bilingual copy system, loyalty sub-product, and Apple Wallet integration",
      "Custom brand experiences program — including the Junior Rodríguez NFC-enabled painting series — packages physical objects with connected digital journeys",
    ],
    techBadges: ["Next.js", "Supabase", "Tailwind", "shadcn/ui", "Vercel", "Resend"],
    softBadges: ["Brand", "Product", "Operations"],
  },
  {
    role: "Full Stack Software Engineer",
    company: "Wind River",
    location: "San José, Costa Rica (Remote)",
    period: "Oct 2024 – Present",
    tenure: "2 years 10 months total at Wind River",
    current: true,
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
  {
    title: "A painting that comes alive — Junior Rodríguez × Presencia",
    client: "Junior Rodríguez (artist)",
    clientNote: "Custom brand experience via Presencia Studio",
    period: "2026",
    problem:
      "An emerging painter wanted to sell more than canvas — to give collectors a story attached to the work, and to capture the moment a viewer first meets the piece without breaking the gallery experience.",
    approach:
      "Designed an NFC-enabled painting series: the physical work, the tap interaction, and the connected digital journey behind each piece. Built the artist's catalog page, the on-tap landing, and the content flow that turns each sale into a shareable moment.",
    outcome:
      "Each painting now sells with its experience attached, not just the canvas. Collectors photograph, tap, and post the moment — turning the artwork itself into a marketing asset the artist keeps charging for.",
    metrics: [
      { label: "Tier", value: "Premium Smart Object" },
      { label: "Format", value: "Object + landing + content" },
      { label: "Category", value: "One-of-a-kind in market" },
    ],
    stack: ["NFC", "Next.js", "Supabase", "Brand strategy", "Content design"],
  },
];

export interface ServiceOffering {
  name: string;
  scope: string;
  duration: string;
  price: string;
  deliverables: string[];
  bestFor: string;
  featured?: boolean;
}

export const serviceOfferings: ServiceOffering[] = [
  {
    name: "Architecture Review",
    scope:
      "Half-day deep-dive on your AI / agent architecture. We pressure-test the design, surface the highest-leverage decisions, and leave you with a one-page plan.",
    duration: "1 day",
    price: "From $1,500",
    deliverables: [
      "Architecture diagram with annotated risks",
      "1-page decision plan",
      "30-min written follow-up after the session",
    ],
    bestFor:
      "MS for Startups founders sanity-checking an agent or RAG architecture before a build sprint.",
  },
  {
    name: "Migration Sprint",
    scope:
      "End-to-end migration onto Azure using Claude Code, MCP, and Azure Agent Dev Kit. I author the architecture, run the agentic execution, and hand back an operating model your team keeps using.",
    duration: "1 week",
    price: "From $9,000",
    deliverables: [
      "Migration architecture + runbook",
      "Agent-driven repo refactors and infra provisioning",
      "Acceptance gates + post-mortem + handover",
    ],
    bestFor:
      "MS for Startups founders unlocking Azure credits or consolidating off multi-cloud setups.",
    featured: true,
  },
  {
    name: "Embedded AI Advisor",
    scope:
      "Recurring weekly cadence as your fractional AI architect. Architecture reviews, agent-stack guidance, vendor decisions, and team enablement on a monthly retainer.",
    duration: "Monthly retainer",
    price: "From $4,500 / month",
    deliverables: [
      "Weekly 60-min working session",
      "Async architecture reviews via shared channel",
      "Quarterly written roadmap update",
    ],
    bestFor:
      "Teams productionizing AI who want depth without a six-month consulting wrapper.",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const consultingFaqs: FaqItem[] = [
  {
    question: "How does this work alongside your Microsoft role?",
    answer:
      "I take outside engagements with non-conflicting clients via Presencia Studio. Anything that overlaps with the Microsoft for Startups portfolio I either decline or route through the program itself.",
  },
  {
    question: "Are you only for Microsoft for Startups members?",
    answer:
      "MS for Startups is the core ICP — that's where I spend most of my time and have the deepest context. I also take a small number of non-conflicting external engagements per quarter via Presencia Studio.",
  },
  {
    question: "Confidentiality?",
    answer:
      "Standard mutual NDA on request. Nothing client-specific ever crosses into Microsoft work or vice versa.",
  },
  {
    question: "What if my problem doesn't fit one of the packages?",
    answer:
      "Book the Architecture Review. If it's a fit, we scope a custom engagement from there. If it isn't, you still leave with a 1-page plan.",
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
