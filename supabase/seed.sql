-- Fictional starter records for Signal Room.
-- Stable IDs and ON CONFLICT DO NOTHING make this safe to rerun without
-- deleting or overwriting later workspace edits.

insert into public.signal_accounts (
  id,
  name,
  website,
  stage,
  location,
  one_liner,
  status,
  fit_score,
  priority,
  founder_names,
  linkedin_url,
  notes,
  brief,
  created_at,
  updated_at
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Orbit AI',
    'https://example.com/orbit-ai',
    'Seed',
    'New York, US',
    'Fictional AI workflow software for regulated operations teams.',
    'ready',
    88,
    'high',
    '["Maya Chen"]'::jsonb,
    '',
    'Fictional starter account. Replace it with a real cited target after setup.',
    $brief$
    {
      "summary": "Orbit AI is a fictional Seed-stage example with a workflow product moving from pilot usage toward enterprise reliability requirements.",
      "whyNow": "A fictional enterprise pilot and platform-engineering hiring signal suggest the team may be formalizing production architecture.",
      "productMotion": "B2B SaaS with a founder-led enterprise sales motion.",
      "aiMaturity": "Prototype-to-production transition.",
      "likelyPriorities": [
        "Evaluation coverage for workflow outputs",
        "Tenant isolation and auditability",
        "Latency and model-cost controls"
      ],
      "evidence": [
        {
          "claim": "This fictional example is hiring a founding platform engineer.",
          "sourceUrl": "https://example.com/orbit-ai/jobs",
          "sourceTitle": "Orbit AI jobs - fictional starter source",
          "observedAt": "2026-07-27T12:00:00.000Z"
        }
      ],
      "architectureHypotheses": [
        {
          "hypothesis": "Enterprise pilots may be creating pressure for explicit evaluation and audit boundaries.",
          "evidence": "Fictional enterprise-pilot announcement and platform hiring signal.",
          "questionToValidate": "Which workflow failure would make the current pilot impossible to expand?"
        }
      ],
      "uncertainties": [
        "Fictional demo account",
        "No real architecture detail"
      ],
      "outreach": {
        "openingLines": [
          "Your move from pilot workflows toward a platform hire stood out - that is often where evaluation and audit decisions stop being optional."
        ],
        "shortMessage": "Saw Orbit AI is expanding an enterprise pilot while hiring for platform ownership. That transition often exposes evaluation, audit, and model-cost decisions that were safe to postpone in the prototype. I mapped three questions I would resolve before the next rollout. Useful if I send them?",
        "loomOutline": [
          "Public signals and why they matter",
          "The likely production boundary",
          "Three architecture decisions to validate",
          "A low-risk next step"
        ],
        "discoveryQuestions": [
          "What failure mode currently limits wider customer rollout?",
          "How are workflow outputs evaluated before they reach an operator?",
          "Which architecture decision is still being held in founder context?"
        ]
      }
    }
    $brief$::jsonb,
    '2026-07-27T12:00:00.000Z',
    '2026-07-27T12:00:00.000Z'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Canvas Runtime',
    'https://example.com/canvas-runtime',
    'Series A',
    'London, UK',
    'Fictional agent infrastructure for vertical SaaS products.',
    'researching',
    76,
    'medium',
    '[]'::jsonb,
    '',
    'Fictional starter account. Add sources before preparing outreach.',
    null,
    '2026-07-27T12:00:00.000Z',
    '2026-07-27T12:00:00.000Z'
  )
on conflict (id) do nothing;

insert into public.signal_sources (
  id,
  account_id,
  url,
  title,
  source_type,
  excerpt,
  content,
  published_at,
  captured_at
)
values (
  '33333333-3333-4333-8333-333333333333',
  '11111111-1111-4111-8111-111111111111',
  'https://example.com/orbit-ai/jobs',
  'Orbit AI jobs - fictional starter source',
  'jobs',
  'Fictional starter source for a founding platform engineer role.',
  'This is fictional seed content used to demonstrate source-backed account research.',
  null,
  '2026-07-27T12:00:00.000Z'
)
on conflict (id) do nothing;

insert into public.signal_posts (
  id,
  title,
  pillar,
  status,
  hook,
  draft,
  takeaway,
  account_ids,
  evidence,
  quality,
  created_at,
  updated_at
)
values (
  '44444444-4444-4444-8444-444444444444',
  'The architecture debt hidden inside a successful AI demo',
  'Technical field note',
  'draft',
  'The most dangerous AI prototype is the one that works in the demo.',
  $post$
The most dangerous AI prototype is the one that works in the demo.

Not because it is bad. Because success creates pressure to scale assumptions nobody has named.

Imagine a Seed-stage B2B startup with an agent that handles a customer workflow end to end. The founder can show it live. Two design partners want it. The obvious next step is to connect more customers and move faster.

That is exactly when I would slow down four decisions.

1. Define the evaluation contract

A few successful runs are not an eval. Build a failure set from the workflow: missing context, conflicting instructions, stale retrieval, tool errors, and outputs that sound correct but violate policy. Decide the acceptance floor and who owns it before rollout.

2. Draw the human boundary

Name what the agent may recommend, what it may execute, and what always requires approval. Then define escalation behavior for uncertainty. Human-in-the-loop is not a feature toggle. It is an operating decision.

3. Set the dependency budget

Measure latency and cost per completed workflow, not per model call. Decide timeout behavior, model substitution rules, retry limits, and the fallback that still creates value when inference is unavailable.

4. Move product context out of the prompt

Prompts are not a durable state layer. Identify which customer facts, permissions, decisions, and tool results belong in application state so the team can replay, inspect, and debug a run.

This is not a request to enterprise-proof a young product. It is a way to separate reversible experiments from decisions that become expensive once customers depend on them.

A prototype proves a path is possible. Production architecture proves the team can operate that path repeatedly.

Those are different milestones. Treating them as one is where architecture debt starts.
  $post$,
  'Prototype success is evidence of possibility, not evidence of operability.',
  '[]'::jsonb,
  '[]'::jsonb,
  $quality$
  {
    "specificity": 90,
    "practicalValue": 92,
    "credibility": 88,
    "readability": 90,
    "notes": [
      "Experience-based starter draft; no external factual claims are attached.",
      "Replace the hypothetical scenario with an approved anonymized field example when available."
    ]
  }
  $quality$::jsonb,
  '2026-07-27T12:00:00.000Z',
  '2026-07-27T12:00:00.000Z'
)
on conflict (id) do nothing;