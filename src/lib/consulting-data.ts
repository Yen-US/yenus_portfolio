export const consultant = {
  name: "Yenson Umaña",
  firstName: "Yenson",
  role: "AI Architecture & Technical Strategy for Startups",
  location: "Costa Rica · Working globally",
  email: "yen21000@gmail.com",
  linkedin: "https://www.linkedin.com/in/yenus/",
  github: "https://github.com/Yen-US",
  credential:
    "Senior AI Solution Architect supporting Microsoft for Startups globally via Accenture.",
  availability:
    "One active architecture or direction sprint at a time, plus a small number of advisory relationships.",
};

/**
 * The "what I'm seeing right now" line under the hero headline.
 *
 * Deliberately separate from the timeless positioning above it: the headline
 * says what the practice is, this says what the quarter looks like. Rotate it
 * when the pattern shifts — roughly quarterly. Keep it to one sentence, keep it
 * observational, and never let it narrow the practice to a single offer.
 *
 * `reviewAfter` is a reminder to yourself, not a rendered date.
 */
export const currentFocus = {
  label: "Currently",
  line:
    "Helping Series B teams close the gap between AI ambition and GPU reality.",
  reviewAfter: "2026-11-01",
};

export const decisionAreas = [
  {
    number: "01",
    title: "The decision, before the technology",
    body:
      "Define the outcome, the constraints, the cost of failure, and what must be true before the initiative deserves engineering investment.",
  },
  {
    number: "02",
    title: "Tradeoffs made explicit",
    body:
      "Model, data, retrieval, evaluation, security, latency, and human review decided deliberately — with the reasoning written down and reversible where it should be.",
  },
  {
    number: "03",
    title: "A path the team can execute",
    body:
      "Architecture decision records, sequencing, and acceptance gates your engineers can act on without translating founder intent through three layers.",
  },
];

export const engagements = [
  {
    number: "01",
    name: "Inference Readiness Review",
    duration: "1 week",
    summary:
      "Find out where your production inference path breaks before it breaks — quota, provider concentration, cost per request, and where the latency budget is actually spent.",
    bestFor:
      "AI-native teams running production inference at real volume, with a model, provider, or capacity decision arriving in the next 90 days and no written record of what was chosen or why.",
    deliverables: [
      "Quota and provider risk map with named single points of failure",
      "Model-substitution matrix and the eval evidence each swap needs",
      "Latency budget decomposed by hop, and fallback strategy",
      "90-day sequence with named owners and decision gates",
    ],
    featured: true,
  },
  {
    number: "02",
    name: "AI Architecture Sprint",
    duration: "2-4 weeks",
    summary:
      "Turn one consequential AI product or system decision into a production-ready architecture and a delivery path the team owns.",
    bestFor:
      "Teams with something important enough that the architecture cannot be improvised: an agent, a retrieval system, or an AI-native capability moving toward production without a senior architect in-house.",
    deliverables: [
      "Target architecture and architecture decision records",
      "System boundaries, guardrails, and human review paths",
      "Evaluation, observability, latency, and cost plan",
      "Phased delivery sequence and technical handoff",
    ],
  },
  {
    number: "03",
    name: "AI Direction Sprint",
    duration: "1-2 weeks",
    summary:
      "Answer which AI opportunity actually deserves to become a product initiative — and why the others can wait.",
    bestFor:
      "Founders and CTOs with strong market insight, several plausible AI directions, and no shared basis for choosing what deserves to ship first.",
    deliverables: [
      "Opportunities scored by value, feasibility, uncertainty, and risk",
      "Readiness and capability gap assessment",
      "One prioritized bet with a defensible rationale",
      "90-day sequence with owners and decision gates",
    ],
  },
  {
    number: "04",
    name: "Fractional AI Architect",
    duration: "Ongoing, usually after a sprint",
    summary:
      "Senior architecture judgment embedded beside the founder and engineering team, before the company needs or can justify the role full time.",
    bestFor:
      "Startups making a steady stream of consequential technical decisions — model and vendor choices, production reviews, roadmap tradeoffs — with no one senior enough to hold the architecture.",
    deliverables: [
      "Founder and architecture working sessions",
      "Model, vendor, and platform decisions",
      "Architecture and production reviews",
      "Technical risk, evaluation standards, and team unblockers",
    ],
  },
  {
    number: "05",
    name: "AI Engineering Enablement",
    duration: "3-6 weeks",
    summary:
      "Turn architecture decisions into shared engineering practice, so the same lessons stop being relearned team by team.",
    bestFor:
      "Scale-ups already running AI in production, but with inconsistent evaluation, unclear ownership, and no shared review standard.",
    deliverables: [
      "Shared architecture principles and review standards",
      "Evaluation and production workflow patterns",
      "Ownership model and right-sized governance",
      "Office hours and adoption measures",
    ],
  },
];

export const principles = [
  "Model and vendor independence",
  "Architecture preserves options while uncertainty is high",
  "Human review where consequences demand it",
  "Evaluation before automation confidence",
  "Ownership transferred to your team",
];

export const proof = [
  {
    id: "yc-migration",
    eyebrow: "Anonymized startup engagement",
    title:
      "An urgent founder objective, turned into a target architecture the team could execute safely.",
    context:
      "A US-based Y Combinator startup needed its production stack off Vercel and Google Cloud and onto Azure, on a timeline set by the business rather than by engineering comfort.",
    decision:
      "Whether to move incrementally and carry two platforms for months, or define a single target architecture with acceptance gates and cut over once.",
    constraints:
      "No customer-visible downtime, a small team that still had to ship product, and no appetite for a migration that quietly became a quarter-long project.",
    architecture:
      "A defined target architecture, explicit acceptance gates per subsystem, and an agent-assisted execution path the engineering team ran themselves.",
    tradeoffs:
      "Chose one decisive cutover over a long dual-run: higher preparation cost, far lower carrying cost and ambiguity. Deferred optimization work that would have widened scope without reducing risk.",
    result:
      "The full stack moved in seven days with zero customer-visible downtime.",
    ownership:
      "A runbook and an operating approach the team kept using after the engagement ended.",
    metrics: [
      { value: "7 days", label: "full migration" },
      { value: "0 min", label: "visible downtime" },
      { value: "Full", label: "team handoff" },
    ],
  },
  {
    id: "aop-beacon",
    eyebrow: "Named client · Amplification Of Potential",
    title:
      "A live-event AI system designed around the conversations it must never create.",
    context:
      "AOP wanted AI-generated conversation prompts at live events, where the audience is present, the moment is unrepeatable, and a bad output is visible to everyone in the room.",
    decision:
      "How much to delegate to the model at all — and where a deterministic system had to remain in control of what an attendee could see.",
    constraints:
      "Under 2.5 seconds at the table, no attendee names in the model payload, no sensitive topics during the early event phase, and an inference budget that had to stay under a dollar per event.",
    architecture:
      "A phased experience model, a client-approved few-shot bank, explicit topic guardrails, a privacy boundary that keeps identity out of the payload by construction, and a deterministic fallback path.",
    tradeoffs:
      "Accepted a narrower generative range in exchange for bounded failure. Chose approved examples over open generation, and a deterministic fallback over a retry that could miss the moment.",
    result:
      "A reusable architecture for six active tables and up to 40 attendees, within the latency and cost envelope.",
    ownership:
      "Guardrail policy and prompt bank the client can extend without re-engineering the system.",
    metrics: [
      { value: "< 2.5s", label: "p95 latency target" },
      { value: "< $1", label: "inference budget / event" },
      { value: "Zero", label: "PII in model payload" },
    ],
  },
];

export const caseFields = [
  { key: "context", label: "Context" },
  { key: "decision", label: "Decision" },
  { key: "constraints", label: "Constraints" },
  { key: "architecture", label: "Architecture" },
  { key: "tradeoffs", label: "Tradeoffs" },
  { key: "result", label: "Result" },
  { key: "ownership", label: "Ownership" },
] as const;

export const operatorProof = [
  {
    title: "Presencia Loyalty",
    label: "Founder and operator",
    body:
      "Built and operate a live wallet-based loyalty SaaS — a product whose architecture decisions I still live with every week.",
  },
  {
    title: "Junior Rodríguez × Presencia",
    label: "Connected product experience",
    body:
      "Designed an NFC-enabled painting experience that joins a physical object, its story, and a shareable digital journey.",
  },
];

export const presencia = {
  eyebrow: "Two practices, one point of view",
  title: "Advisory is mine. Engineering capacity is Presencia's.",
  body:
    "I advise startup teams personally: the decision, the architecture, the sequence. Presencia Studio is the engineering organization I founded to build and operate software and AI systems for businesses.",
  note:
    "Running production systems keeps the architecture work grounded in the decisions teams actually live with after launch. When an engagement needs more implementation capacity than advisory provides, Presencia can become relevant — but it is never the default.",
  split: [
    {
      label: "Yenson Umaña",
      role: "Judgment",
      question:
        "What should we build, how should we build it, and what needs to be true before we commit?",
    },
    {
      label: "Presencia Studio",
      role: "Engineering capability",
      question:
        "What is holding the business back, and what system should we build to solve it?",
    },
  ],
};

export const perspective = {
  eyebrow: "Point of view",
  title: "Decision-making under technical uncertainty.",
  body:
    "The hard part is rarely finding another AI idea. It is deciding which one deserves to become a system. These are the questions I keep returning to with founders and engineering leaders.",
  themes: [
    {
      number: "01",
      title: "Architecture decisions",
      body:
        "When an agent should actually be a deterministic workflow. Choosing between retrieval, tools, and fine-tuning. Which decisions become expensive to reverse.",
    },
    {
      number: "02",
      title: "Production AI",
      body:
        "What separates a demo from a system you can be responsible for: evaluation, latency and cost budgets, observability, and failure modes named before launch.",
    },
    {
      number: "03",
      title: "Founder and CTO decisions",
      body:
        "What not to build. How to prioritize AI opportunities. When to hire an AI engineer versus an architect. What belongs in the first 90 days.",
    },
    {
      number: "04",
      title: "AI economics",
      body:
        "Cost per successful task, model routing, inference economics, build versus buy, and what a tolerable failure actually costs the business.",
    },
    {
      number: "05",
      title: "Architecture teardowns",
      body:
        "Realistic technical situations worked through end to end — the constraints, the options considered, and why one path won.",
    },
  ],
};

export const careerSignals = [
  {
    year: "2022",
    title: "Production AI before the boom",
    body:
      "Joined OneReach.ai in October 2022 and began building conversational AI and orchestration systems at production scale.",
  },
  {
    year: "2023-24",
    title: "One-person platform ownership",
    body:
      "Owned roadmap, tooling, and architecture for Wind River's Engineering Excellence function before moving into full-stack platform engineering.",
  },
  {
    year: "Today",
    title: "Startup architecture at the decision table",
    body:
      "Work with founders and lean engineering teams on AI architecture, agent systems, evaluation, and technical direction through Microsoft for Startups.",
  },
  {
    year: "Also",
    title: "Founder and operator",
    body:
      "Founded Presencia Studio and operate production systems personally, which keeps the advice honest about what happens after launch.",
  },
];

export const approach = [
  {
    number: "01",
    title: "Frame the decision",
    body:
      "Before choosing a model or a platform: define the business outcome, the constraints, the cost of failure, and what must be true for the initiative to deserve investment.",
  },
  {
    number: "02",
    title: "Make tradeoffs explicit",
    body:
      "Compare viable approaches across quality, latency, cost, security, maintainability, and what the team can realistically operate.",
  },
  {
    number: "03",
    title: "De-risk with evidence",
    body:
      "Use focused prototypes, evaluations, and failure-mode reviews where they resolve an important unknown — not as theater.",
  },
  {
    number: "04",
    title: "Transfer the capability",
    body:
      "Leave the decisions, the reasoning, and the standards with your team, so the work compounds after the engagement ends.",
  },
];

export const fitCriteria = {
  good: [
    "There is real momentum and a customer or market signal",
    "AI is strategically relevant, not decorative",
    "Several plausible technical directions are open",
    "Architecture decisions are becoming consequential",
    "The team is capable but has no senior AI architecture leadership",
    "The company moves too fast for a traditional consulting engagement",
  ],
  poor: [
    "A chatbot or a basic automation with no product ownership behind it",
    "Generic AI training disconnected from an operating change",
    "Inexpensive development capacity",
    "Implementation resources rather than technical judgment",
  ],
};

export const faqs = [
  {
    question: "Do you implement the systems you design?",
    answer:
      "I use prototypes and technical validation when they reduce a material risk, and I can support an internal team through delivery. The core offer is senior judgment — direction, architecture, and adoption — not open-ended outsourced development.",
  },
  {
    question: "What kind of company is the best fit?",
    answer:
      "Startups and scale-ups with real momentum, a founder or CTO close to the decision, a team ready to execute, and an AI initiative consequential enough to shape the next year. If what you need is implementation capacity rather than technical judgment, I will say so early.",
  },
  {
    question: "How is this different from what Presencia Studio does?",
    answer:
      "I advise founders and engineering teams personally on decisions and architecture. Presencia Studio is the engineering organization I founded to build and operate systems. They reinforce each other, but an advisory engagement never assumes Presencia does the building.",
  },
  {
    question: "How does this work alongside your current role?",
    answer:
      "I accept a limited number of non-conflicting engagements, each subject to a conflict review. Client work is independent and does not imply endorsement by Microsoft, Accenture, or any current or former employer.",
  },
  {
    question: "Can you work with a distributed or international team?",
    answer:
      "Yes. I work from Costa Rica with teams globally in English, using a mix of live working sessions and documented asynchronous decisions.",
  },
  {
    question: "How do you handle confidentiality?",
    answer:
      "A mutual NDA is available on request. Engagement boundaries, data access, model usage, IP ownership, and retention expectations are agreed before sensitive material is shared.",
  },
];
