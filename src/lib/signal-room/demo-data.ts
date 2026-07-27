import type { Account, PostDraft, WorkspaceData } from "@/lib/signal-room/types";

const capturedAt = "2026-07-27T12:00:00.000Z";

export const demoAccounts: Account[] = [
  {
    id: "demo-orbit",
    name: "Orbit AI",
    website: "https://example.com/orbit-ai",
    stage: "Seed",
    location: "New York, US",
    oneLiner: "AI workflow software for regulated operations teams.",
    status: "ready",
    fitScore: 88,
    priority: "high",
    founderNames: ["Maya Chen"],
    linkedinUrl: "",
    notes: "Fictional demo account. Replace after Supabase is connected.",
    brief: {
      summary:
        "Orbit AI is a fictional Seed-stage example with a workflow product moving from pilot usage toward enterprise reliability requirements.",
      whyNow:
        "A recent enterprise pilot and platform-engineering job opening suggest the team may be formalizing production architecture.",
      productMotion: "B2B SaaS with a founder-led enterprise sales motion.",
      aiMaturity: "Prototype-to-production transition.",
      likelyPriorities: [
        "Evaluation coverage for workflow outputs",
        "Tenant isolation and auditability",
        "Latency and model-cost controls",
      ],
      evidence: [
        {
          claim: "The product is recruiting its first platform engineer.",
          sourceUrl: "https://example.com/orbit-ai/jobs",
          sourceTitle: "Orbit AI jobs (fictional demo)",
          observedAt: capturedAt,
        },
      ],
      architectureHypotheses: [
        {
          hypothesis:
            "Enterprise pilots may be creating pressure for explicit evaluation and audit boundaries.",
          evidence: "Public enterprise-pilot announcement and platform hiring signal.",
          questionToValidate:
            "Which workflow failure would make the current pilot impossible to expand?",
        },
      ],
      uncertainties: ["No public architecture detail", "Funding date is unverified"],
      outreach: {
        openingLines: [
          "Your move from pilot workflows toward a platform hire stood out - that is often where evaluation and audit decisions stop being optional.",
        ],
        shortMessage:
          "Saw Orbit AI is expanding an enterprise pilot while hiring for platform ownership. That transition often exposes evaluation, audit, and model-cost decisions that were safe to postpone in the prototype. I mapped three questions I would resolve before the next rollout. Useful if I send them?",
        loomOutline: [
          "Public signals and why they matter",
          "The likely production boundary",
          "Three architecture decisions to validate",
          "A low-risk next step",
        ],
        discoveryQuestions: [
          "What failure mode currently limits wider customer rollout?",
          "How are workflow outputs evaluated before they reach an operator?",
          "Which architecture decision is still being held in founder context?",
        ],
      },
    },
    sources: [
      {
        id: "demo-source-orbit-jobs",
        accountId: "demo-orbit",
        url: "https://example.com/orbit-ai/jobs",
        title: "Orbit AI jobs (fictional demo)",
        sourceType: "jobs",
        excerpt: "Hiring a founding platform engineer.",
        content: "Fictional demo content.",
        publishedAt: null,
        capturedAt,
      },
    ],
    createdAt: capturedAt,
    updatedAt: capturedAt,
  },
  {
    id: "demo-canvas",
    name: "Canvas Runtime",
    website: "https://example.com/canvas-runtime",
    stage: "Series A",
    location: "London, UK",
    oneLiner: "Agent infrastructure for vertical SaaS products.",
    status: "researching",
    fitScore: 76,
    priority: "medium",
    founderNames: [],
    linkedinUrl: "",
    notes: "Fictional demo account.",
    brief: null,
    sources: [],
    createdAt: capturedAt,
    updatedAt: capturedAt,
  },
];

export const demoPosts: PostDraft[] = [
  {
    id: "demo-post-architecture-debt",
    title: "The architecture debt hidden inside a successful AI demo",
    pillar: "Technical field note",
    status: "draft",
    hook: "The most dangerous AI prototype is the one that works in the demo.",
    draft:
      "The most dangerous AI prototype is the one that works in the demo.\n\nNot because it is bad. Because success creates pressure to scale assumptions nobody has named.\n\nImagine a Seed-stage B2B startup with an agent that handles a customer workflow end to end. The founder can show it live. Two design partners want it. The obvious next step is to connect more customers and move faster.\n\nThat is exactly when I would slow down four decisions.\n\n1. Define the evaluation contract\n\nA few successful runs are not an eval. Build a failure set from the workflow: missing context, conflicting instructions, stale retrieval, tool errors, and outputs that sound correct but violate policy. Decide the acceptance floor and who owns it before rollout.\n\n2. Draw the human boundary\n\nName what the agent may recommend, what it may execute, and what always requires approval. Then define escalation behavior for uncertainty. Human-in-the-loop is not a feature toggle. It is an operating decision.\n\n3. Set the dependency budget\n\nMeasure latency and cost per completed workflow, not per model call. Decide timeout behavior, model substitution rules, retry limits, and the fallback that still creates value when inference is unavailable.\n\n4. Move product context out of the prompt\n\nPrompts are not a durable state layer. Identify which customer facts, permissions, decisions, and tool results belong in application state so the team can replay, inspect, and debug a run.\n\nThis is not a request to enterprise-proof a young product. It is a way to separate reversible experiments from decisions that become expensive once customers depend on them.\n\nA prototype proves a path is possible. Production architecture proves the team can operate that path repeatedly.\n\nThose are different milestones. Treating them as one is where architecture debt starts.",
    takeaway:
      "Prototype success is evidence of possibility, not evidence of operability.",
    accountIds: [],
    evidence: [],
    quality: {
      specificity: 86,
      practicalValue: 91,
      credibility: 80,
      readability: 88,
      notes: ["Add one anonymized field example before publishing."],
    },
    createdAt: capturedAt,
    updatedAt: capturedAt,
  },
];

export const demoWorkspace: WorkspaceData = {
  mode: "demo",
  accounts: demoAccounts,
  posts: demoPosts,
};