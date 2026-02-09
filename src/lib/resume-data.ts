export const profile = {
  name: "Yenson Umana Solano",
  alias: "YenUS",
  title: "Full-Stack AI/ML Engineer",
  avatar: "/YenUSPP2.webp",
  location: "Costa Rica",
  email: "yen21000@gmail.com",
  website: "yenus.dev",
  headline: "3 promotions in 2 years | Azure AI-102 & AZ-204 Certified | 5+ years in tech",
  links: {
    linkedin: "https://www.linkedin.com/in/yenus/",
    github: "https://github.com/Yen-US",
    cv: "/api",
    website: "https://yenus.dev",
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
  description?: string;
  highlights?: string[];
  techBadges: string[];
  softBadges: string[];
}

export const experiences: Experience[] = [
  {
    role: "Full Stack Software Engineer",
    company: "Wind River",
    location: "San Jose, Costa Rica (Remote)",
    period: "Oct 2024 – Present",
    tenure: "2 years 10 months total",
    promoted: true,
    highlights: [
      "Architect and develop cloud-based systems using Angular, Vue.js, Next.js, Golang, and Java with PostgreSQL",
      "Lead AI integration initiatives, implementing AI methodologies to enhance software components and developer productivity",
      "Design scalable microservices leveraging Docker, REST APIs, gRPC, Protobuf, Apache Pulsar, and GraphQL",
      "Drive system reliability through comprehensive testing strategies and performance optimization in Agile",
    ],
    techBadges: [
      "Angular",
      "Vue.js",
      "Next.js",
      "Golang",
      "Java",
      "PostgreSQL",
      "Docker",
      "gRPC",
      "GraphQL",
    ],
    softBadges: [],
  },
  {
    role: "Junior Software Tools Engineer",
    company: "Wind River",
    location: "San Jose, Costa Rica (Remote)",
    period: "Sep 2023 – Oct 2024",
    promoted: true,
    highlights: [
      "Sole engineer for Engineering Excellence, owning end-to-end development of critical internal tools",
      "Built automation systems, documentation platforms, project management tools, and billing dashboards",
      "Reduced manual processes and improved team efficiency through custom-built solutions",
    ],
    techBadges: [
      "React",
      "Angular",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "Linux",
    ],
    softBadges: [],
  },
  {
    role: "Software Developer Intern",
    company: "Wind River",
    location: "San Jose, Costa Rica (Remote)",
    period: "Apr 2023 – Sep 2023",
    highlights: [
      "Pioneered the company's first Scaled Agile Framework (SAFe) documentation website",
      "Implemented analytics and visibility features to track adoption across the organization",
      "Launched a collaborative blog platform for Agile best practices",
    ],
    techBadges: ["React", "Linux", "Nginx", "Docker"],
    softBadges: ["Growth Mindset", "Lean-Agile"],
  },
  {
    role: "Technical Support Engineer / Solutions Development Engineer",
    company: "OneReach.ai",
    location: "United States (Remote)",
    period: "Oct 2022 – Apr 2024",
    tenure: "1 year 6 months",
    highlights: [
      "Led multidisciplinary support operations while leveraging dev skills to automate workflows",
      "Built intelligent automation for first responses, ticket triaging, and after-hours notifications",
      "Elevated support quality through technical expertise and process optimization",
    ],
    techBadges: ["JavaScript", "Next.js", "SQL"],
    softBadges: ["Adaptability", "Time Management"],
  },
  {
    role: "Technical Support Engineer",
    company: "Wrike",
    location: "Heredia, Costa Rica (Remote)",
    period: "Feb 2022 – Apr 2023",
    tenure: "1 year 2 months",
    highlights: [
      "Provided expert technical support for enterprise project management software",
      "Developed deep product knowledge for integrations, workflows, and advanced configurations",
    ],
    techBadges: ["API", "Jira"],
    softBadges: ["Work Etiquette", "Customer Focus"],
  },
  {
    role: "Tier 2 Technical Support Engineer & SME",
    company: "DocuSign (via Sitel)",
    location: "San Jose, Costa Rica (Remote)",
    period: "Jan 2021 – Feb 2022",
    tenure: "1 year 1 month",
    promoted: true,
    highlights: [
      "Promoted to Tier 2 and recognized as Subject Matter Expert for technical excellence",
      "Mentored team members and led knowledge-sharing sessions on complex product features",
    ],
    techBadges: [],
    softBadges: ["Leadership", "Teamwork", "Presentation", "Conflict Resolution"],
  },
  {
    role: "Customer Service Advisor",
    company: "Santander Bank (via Concentrix)",
    location: "Heredia, Costa Rica",
    period: "Oct 2020 – Jan 2021",
    tenure: "3 months",
    highlights: [
      "Delivered high-quality customer service for banking products, building rapport and resolving inquiries",
    ],
    techBadges: [],
    softBadges: [
      "Empathy & Rapport",
      "Professional Communication",
      "Cultural Sensitivity",
      "Negotiation",
    ],
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
}

export const projects: Project[] = [
  {
    name: "Los Ticos Customs Store",
    url: "https://losticoscustoms.tech/",
    type: "Full Stack Project",
    description: "CEO and Founder of a Costa Rican custom tech store.",
    period: "2024 / 04 - Current",
    image: "/LTC.webp",
    tags: ["Marketplace", "v1.0"],
    techBadges: ["React", "Next.js", "TypeScript"],
  },
  {
    name: "Eco Tico Crafts Store",
    url: "https://ecoticocrafts.com/",
    type: "Full Stack Project",
    description:
      "CEO and Founder of a Costa Rican conservation project for local endangered species.",
    period: "2024 / 04 - Current",
    image: "/ecoticolanding.webp",
    tags: ["Marketplace", "v1.0"],
    techBadges: ["React", "Next.js", "TypeScript"],
  },
  {
    name: "YUS Automation",
    url: "https://yus-automation.vercel.app/",
    type: "Full Stack Project",
    description:
      "CEO and Founder of a professional services business focused on AI automations processes and business.",
    period: "2024 / 03 - Current",
    image: "/yus.webp",
    imageDark: "/yus-light.webp",
    tags: ["Automations", "v1.0"],
    techBadges: ["React", "Next.js", "TypeScript"],
  },
  {
    name: "Notery.ai Simple Chat",
    url: "https://notery-ai-simple-chat.vercel.app",
    type: "Full Stack Project",
    description:
      "Personal ChatGPT-like tool, focused on improving notes. Open source and completely free.",
    period: "2024 / 01 - Current",
    image: "/notery.webp",
    imageDark: "/notery-light.webp",
    tags: ["Simple chat", "v1.0"],
    techBadges: ["React", "Next.js", "TypeScript"],
  },
];

// Organized by category as in the resume
export const skills = {
  languages: [
    "JavaScript",
    "TypeScript",
    "Golang",
    "Java",
    "Python",
  ],
  frameworks: [
    "Angular",
    "Vue.js",
    "Next.js",
    "React",
  ],
  infrastructure: [
    "Docker",
    "PostgreSQL",
    "REST APIs",
    "gRPC",
    "Protobuf",
    "GraphQL",
    "Apache Pulsar",
    "Azure Cloud",
  ],
  specializations: [
    "AI/ML Integration",
    "Solution Architecture",
    "Agile/SAFe Methodologies",
    "Process Automation",
  ],
};

// Flat list for backward compat
export const technicalSkills = [
  ...skills.languages,
  ...skills.frameworks,
  ...skills.infrastructure,
];

export const softSkills = [
  "Growth Mindset",
  "Lean-Agile",
  "Adaptability",
  "Time Management",
  "Work Etiquette",
  "Customer Focus",
  "Leadership",
  "Teamwork",
  "Presentation",
  "Conflict Resolution",
  "Empathy & Rapport",
  "Professional Communication",
  "Cultural Sensitivity",
  "Negotiation",
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
  { name: "Jira Software" },
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
    institution: "Tecnologico de Costa Rica",
    location: "Cartago, Costa Rica",
    period: "In Progress",
    status: "In Progress",
  },
];
