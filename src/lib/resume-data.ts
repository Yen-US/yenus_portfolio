export const profile = {
  name: "Yenson Umana Solano",
  alias: "YenUS",
  title: "Full Stack Software Engineer",
  avatar: "/YenUSPP2.webp",
  location: "Costa Rica",
  links: {
    linkedin: "https://www.linkedin.com/in/yenus/",
    github: "https://github.com/Yen-US",
    cv: "/api",
  },
};

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  description?: string;
  techBadges: string[];
  softBadges: string[];
}

export const experiences: Experience[] = [
  {
    role: "Full Stack Software Engineer",
    company: "Wind River",
    location: "San Jose, Costa Rica (WFH)",
    period: "2024 / 10 - Current",
    description:
      "I design and develop systems on the cloud using Angular, Vue.js, JavaScript, Golang, Next.js, Java, and utilize Postgres databases. I leverage technologies like Docker, REST APIs, GRPC, Protobuf, Pulsar, and GraphQL. A key part of my role involves exploring AI methodologies to enhance software components.",
    techBadges: [
      "React",
      "Angular",
      "Node",
      "Express",
      "PostgreSQL",
      "Java",
      "Linux",
      "Nginx",
      "Docker",
    ],
    softBadges: [],
  },
  {
    role: "Junior Software Tools Engineer",
    company: "Wind River",
    location: "San Jose, Costa Rica (WFH)",
    period: "2023 / 09 - 2024 / 10",
    description:
      "Solo software engineer for the Engineering Excellence department, I design, develop and maintain software solutions for the department, including automations, documentation websites, project management tools, billing dashboards.",
    techBadges: [
      "React",
      "Angular",
      "Node",
      "Express",
      "PostgreSQL",
      "Java",
      "Linux",
      "Nginx",
      "Docker",
    ],
    softBadges: [],
  },
  {
    role: "Software Developer Internship",
    company: "Wind River",
    location: "San Jose, Costa Rica (WFH)",
    period: "2023 / 04 - 2023 / 09",
    description:
      "Created, improved and maintained the first scaled agile framework documentation website in the whole company, implemented visibility features such as analytics, and a blog.",
    techBadges: ["React", "Linux", "Nginx", "Docker"],
    softBadges: ["Growth Mindset", "Lean-Agile"],
  },
  {
    role: "Technical Support Engineer / Solutions Development Engineer",
    company: "Onereach.ai",
    location: "US (Remote)",
    period: "2022 / 10 - 2024 / 04",
    description:
      "Led, automated, and supported the OneReach.ai support team, automated several repetitive tasks such as first responses, automatic triaging, and after hours notifications.",
    techBadges: ["JavaScript", "NextJS", "SQL"],
    softBadges: ["Adaptability", "Time Management"],
  },
  {
    role: "Technical Support Engineer",
    company: "Wrike",
    location: "Heredia, Costa Rica (WFH)",
    period: "2022 / 02 - 2023 / 04",
    description: undefined,
    techBadges: ["API", "Jira"],
    softBadges: ["Work etiquette", "Customer Focus"],
  },
  {
    role: "Tier 2, Technical Support Engineer, SME",
    company: "DocuSign (Sitel)",
    location: "San Jose, Costa Rica (WFH)",
    period: "2021 / 01 - 2022 / 02",
    description: undefined,
    techBadges: [],
    softBadges: ["Leadership", "Teamwork", "Presentation", "Conflict Resolution"],
  },
  {
    role: "Customer Service Advisor",
    company: "Santander bank (Concentrix)",
    location: "Heredia, Costa Rica",
    period: "2020 / 10 - 2021 / 01",
    description: undefined,
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
    techBadges: ["React", "NextJS", "TypeScript"],
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
    techBadges: ["React", "NextJS", "TypeScript"],
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
    techBadges: ["React", "NextJS", "TypeScript"],
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
    techBadges: ["React", "NextJS", "TypeScript"],
  },
];

export const technicalSkills = [
  "React",
  "Angular",
  "Node",
  "Express",
  "PostgreSQL",
  "Java",
  "Linux",
  "Nginx",
  "JavaScript",
  "TypeScript",
  "NextJS",
  "SQL",
  "API",
  "Jira",
  "Docker",
];

export const softSkills = [
  "Growth Mindset",
  "Lean-Agile",
  "Adaptability",
  "Time Management",
  "Work etiquette",
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

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
}

export const education: Education[] = [
  {
    degree: "Computer Engineer",
    institution: "Technological Institute of Costa Rica (TEC)",
    location: "Cartago, Costa Rica",
    period: "2026",
  },
  {
    degree: "Python I",
    institution: "SITEL Technical Academy",
    location: "Heredia, Costa Rica",
    period: "2021",
  },
  {
    degree: "CISCO IT Essentials",
    institution: "SITEL Technical Academy",
    location: "Heredia, Costa Rica",
    period: "2021",
  },
  {
    degree: "High School Diploma",
    institution: "Santa Maria De Guadalupe School",
    location: "Heredia, Costa Rica",
    period: "2013 - 2017",
  },
];
