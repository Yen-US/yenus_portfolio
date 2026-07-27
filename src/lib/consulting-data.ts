export const consultant = {
  name: "Yenson Umaña",
  firstName: "Yenson",
  role: "Startup AI Strategy & Architecture Advisor",
  location: "Costa Rica · Working globally",
  email: "yen21000@gmail.com",
  linkedin: "https://www.linkedin.com/in/yenus/",
  github: "https://github.com/Yen-US",
  credential:
    "Senior AI Solution Architect supporting Microsoft for Startups globally via Accenture.",
  availability:
    "One active strategy or architecture sprint at a time, plus a small number of advisory relationships.",
};

export const decisionAreas = [
  {
    number: "01",
    title: "Clarity while the path is still open",
    body:
      "Turn a promising but messy idea into one defined problem, one near-term outcome, and a sequence the team can defend.",
  },
  {
    number: "02",
    title: "A production-ready architecture",
    body:
      "Make the model, data, retrieval, evaluation, security, cost, and human-review decisions before they become expensive rework.",
  },
  {
    number: "03",
    title: "A senior partner beside the team",
    body:
      "Work directly with someone who can move between founder priorities and engineering tradeoffs, with no sales layer or junior handoff.",
  },
];

export const engagements = [
  {
    number: "01",
    name: "AI Direction Sprint",
    duration: "1-2 weeks",
    summary:
      "Turn a crowded field of AI possibilities into one clear first bet and a path the team can execute.",
    bestFor:
      "Founders and CTOs with strong market insight, several plausible AI directions, and no shared way to choose what deserves to ship first.",
    deliverables: [
      "Use-case portfolio scored by value, feasibility, and risk",
      "Startup readiness and capability gap assessment",
      "90-day roadmap with owners and decision gates",
      "Founder and technical-team readout",
    ],
  },
  {
    number: "02",
    name: "AI Architecture Sprint",
    duration: "2-4 weeks",
    summary:
      "Turn one consequential AI idea or prototype into a production-ready system plan.",
    bestFor:
      "Startup teams moving an agent, RAG system, or AI-native product capability toward production without a senior AI architect in-house.",
    deliverables: [
      "Target architecture and architecture decision records",
      "Human-AI boundaries, guardrails, and escalation paths",
      "Evaluation, observability, latency, and cost plan",
      "Phased delivery roadmap and technical handoff",
    ],
    featured: true,
  },
  {
    number: "03",
    name: "AI Team Enablement",
    duration: "3-6 weeks",
    summary:
      "Give a growing startup shared AI practices before founder knowledge and one-off experiments become delivery bottlenecks.",
    bestFor:
      "Scale-ups with pilots or production AI, but inconsistent evaluation, unclear ownership, or teams learning the same lessons separately.",
    deliverables: [
      "Founder and engineering-lead alignment",
      "Right-sized governance and production playbook",
      "Team workflows, evaluation patterns, and review standards",
      "Office hours, pilot support, and adoption measures",
    ],
  },
];

export const advisory = {
  name: "Fractional AI Architect",
  duration: "Ongoing, after an initial sprint",
  summary:
    "Senior technical judgment for a startup that needs an experienced AI architecture partner before it is ready to hire that role full time.",
  items: [
    "Founder and architecture working sessions",
    "Model, vendor, and platform decisions",
    "Technical risk and delivery oversight",
    "Team unblockers and production reviews",
  ],
};

export const proof = [
  {
    id: "yc-migration",
    eyebrow: "Anonymized startup engagement",
    title: "A full production migration completed in one week, with no visible downtime.",
    challenge:
      "A US-based Y Combinator startup needed to move its production stack from Vercel and Google Cloud to Azure without disrupting customers.",
    intervention:
      "I turned an urgent founder objective into the target architecture, acceptance gates, and an agent-assisted execution path the engineering team could follow.",
    result:
      "The full stack moved in seven days with zero customer-visible downtime, plus a runbook and operating approach the team could continue using.",
    metrics: [
      { value: "7 days", label: "full migration" },
      { value: "0 min", label: "visible downtime" },
      { value: "Full", label: "team handoff" },
    ],
  },
  {
    id: "aop-beacon",
    eyebrow: "Named client · Amplification Of Potential",
    title: "A live-event AI system designed around the conversations it must never create.",
    challenge:
      "AOP needed personalized prompts in under 2.5 seconds without sending attendee names to the model or allowing sensitive topics into an early event phase.",
    intervention:
      "I designed the phased experience, prompt architecture, client-approved few-shot bank, explicit topic guardrails, privacy boundary, and deterministic fallback path.",
    result:
      "A reusable architecture for six active tables and up to 40 attendees, with a sub-$1 event inference budget and zero PII in the model payload by construction.",
    metrics: [
      { value: "< 2.5s", label: "p95 latency target" },
      { value: "< $1", label: "inference budget / event" },
      { value: "Zero", label: "PII in model payload" },
    ],
  },
];

export const operatorProof = [
  {
    title: "Presencia Loyalty",
    label: "Founder and operator",
    body:
      "Built and operate a live wallet-based loyalty SaaS, translating product strategy into a system businesses and customers use.",
  },
  {
    title: "Junior Rodríguez × Presencia",
    label: "Connected product experience",
    body:
      "Designed an NFC-enabled painting experience that joins a physical object, its story, and a shareable digital journey.",
  },
];

export const careerSignals = [
  {
    year: "2022",
    title: "Production AI before ChatGPT",
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
      "Work with founders and lean engineering teams on AI architecture, agent systems, evaluation, productionization, and technical direction through Microsoft for Startups.",
  },
];

export const approach = [
  {
    number: "01",
    title: "Frame the decision",
    body:
      "Clarify the business outcome, baseline, users, constraints, and what must be true for the initiative to deserve investment.",
  },
  {
    number: "02",
    title: "Make tradeoffs explicit",
    body:
      "Compare viable approaches across quality, latency, cost, security, maintainability, and organizational readiness.",
  },
  {
    number: "03",
    title: "De-risk with evidence",
    body:
      "Use focused prototypes, evaluations, and failure-mode reviews where they resolve an important unknown - not as theater.",
  },
  {
    number: "04",
    title: "Transfer the capability",
    body:
      "Leave decisions, standards, and operating knowledge with your team so the work compounds after the engagement ends.",
  },
];

export const faqs = [
  {
    question: "Do you implement the systems you design?",
    answer:
      "I use prototypes and technical validation when they reduce a material risk, and I can support an internal team through delivery. The core offer is senior strategy, architecture, and adoption - not open-ended outsourced development.",
  },
  {
    question: "What kind of company is the best fit?",
    answer:
      "Early and growth-stage startups with a founder or CTO close to the decision, a product or engineering team ready to execute, and an AI initiative important enough to shape the company.",
  },
  {
    question: "How does this work alongside your current role?",
    answer:
      "I accept a limited number of non-conflicting engagements, each subject to a conflict review. Client work is independent and does not imply endorsement by Microsoft, Accenture, or any current or former employer.",
  },
  {
    question: "Is training available on its own?",
    answer:
      "Yes, when it is tied to a defined operating change. I design role-specific executive and team sessions around your systems, governance, and adoption goals rather than generic AI literacy presentations.",
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