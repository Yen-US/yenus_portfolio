# Signal Room Sales + LinkedIn Evidence Loop Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Turn Signal Room into the user-owned system of record for outbound sales and LinkedIn content performance, so Yenson can measure connection acceptance, reply conversion, follow-up performance, calls, proposals, revenue, and content-assisted pipeline without relying on LinkedIn APIs that do not expose the required personal-account data.

**Architecture:** Extend the existing private `/signal-room` workspace with a normalized but lightweight sales/content event ledger, deterministic funnel calculations, an actionable follow-up queue, manual metric snapshots, and approval-gated LinkedIn publishing through the existing integration boundary. Keep PostgreSQL or the repository’s existing durable store authoritative; models may draft, classify, or summarize but must not invent events, infer unobserved metrics, or publish without explicit human approval.

**Tech Stack:** Existing Next.js/TypeScript Signal Room application, existing persistence layer and account schemas, existing `src/proxy.ts` authentication, existing research/opener/Post Lab flows, existing model adapter, and Composio LinkedIn where supported.

---

## 1. Product context

Signal Room already supports:

```text
Discover → Research → Field test → Opener → Reply analysis
    → Call prep → Cost math → 90-day plan → Proposal
```

The current commercial signal is small but real:

- 5 LinkedIn connection requests sent;
- 1 accepted;
- 1 follow-up message sent;
- 0 replies so far.

The immediate bottleneck is not another generator. It is closing the measurement and action loops around steps that already exist.

### LinkedIn integration reality

Verified through Composio:

- authenticated personal profile reads work;
- publishing tools exist;
- known-post retrieval/reaction APIs may work only where LinkedIn grants access;
- author-feed enumeration is forbidden for this personal account;
- personal connection requests, acceptances, DMs, impressions, profile views, clicks, and complete post analytics are not reliably available through the current API permissions;
- the three supplied personal post URNs returned 403/404 through authenticated post/reaction tools, even though public post pages were recoverable.

Therefore:

> LinkedIn is a channel. Signal Room owns the operational record.

Do not build critical workflows that depend on unavailable or undocumented LinkedIn APIs. Manual confirmation is an intentional product feature where APIs stop.

---

## 2. Required outcomes

After implementation, Yenson must be able to:

1. See today’s sales actions in one queue.
2. Mark a connection request sent in one interaction.
3. Mark acceptance, message, follow-up, reply, call, proposal, win, loss, or disqualification without editing raw data.
4. Know which follow-ups are due after six business days.
5. See rates with honest denominators and small-sample warnings.
6. Compare opener variants, ICP presets, signal sources, and field-test types.
7. Register each LinkedIn post by URL/URN and capture metrics at 24 hours, 7 days, and 30 days.
8. Distinguish observed metrics from unavailable metrics.
9. Relate a post or prospect interaction to later profile views, DMs, calls, or opportunities only when Yenson explicitly attributes it.
10. Draft and validate LinkedIn posts in Post Lab, then publish only after explicit approval.
11. Preserve Signal Room’s existing fail-closed authentication.
12. Export the ledger to CSV/JSON for analysis and portability.

---

## 3. Non-negotiable product rules

- No automatic connection requests.
- No automatic unsolicited DMs.
- No browser automation designed to evade LinkedIn controls.
- No post publication without explicit per-post approval.
- No model may mark an event as sent, accepted, replied, booked, won, or lost.
- No model may manufacture impressions, reactions, comments, reposts, clicks, profile views, follower changes, or attribution.
- Missing metrics display as **unavailable**, never zero.
- All rates show numerator and denominator.
- Rates based on fewer than 20 eligible events display a small-sample warning.
- Preserve raw event history; derive current stage from events rather than destructively overwriting history.
- Timestamps use UTC in storage and Costa Rica local time in the UI.
- All account/contact/post writes include actor and source (`manual`, `import`, `composio`, `system-derived`).
- Publication, deletion, commenting, or external messaging remains approval-gated.
- Existing `/signal-room/*` and `/api/signal-room/*` authentication must continue to fail closed when `SIGNAL_ROOM_PASSWORD` is missing.

---

## 4. Funnel and state model

### 4.1 Prospect funnel

Canonical progression:

```text
researched
→ field_tested
→ connection_requested
→ connected
→ first_message_sent
→ follow_up_due
→ follow_up_sent
→ replied
→ qualified | disqualified
→ call_booked
→ call_completed
→ proposal_sent
→ won | lost | nurture
```

This is not a rigid finite-state machine. Prospects may enter from warm introductions or inbound content at later stages. Store immutable events and derive the current stage deterministically.

### 4.2 Required sales event types

```typescript
type SalesEventType =
  | "prospect_researched"
  | "field_test_logged"
  | "connection_requested"
  | "connection_accepted"
  | "first_message_sent"
  | "follow_up_sent"
  | "reply_received"
  | "reply_classified"
  | "qualified"
  | "disqualified"
  | "call_booked"
  | "call_completed"
  | "proposal_sent"
  | "opportunity_won"
  | "opportunity_lost"
  | "moved_to_nurture"
  | "manual_note"
```

Each event needs:

```typescript
type SalesEvent = {
  id: string
  accountId: string
  contactId?: string
  type: SalesEventType
  occurredAt: string       // UTC ISO timestamp
  source: "manual" | "import" | "composio" | "system-derived"
  actor: "yenson" | "system"
  metadata: Record<string, unknown>
  createdAt: string
}
```

`system-derived` events may create reminders such as `follow_up_due`, but never claim that an external human action occurred.

### 4.3 Current-stage derivation

Implement one pure function that derives:

- current stage;
- last outbound timestamp;
- last inbound timestamp;
- next action;
- next-action due date;
- terminal disposition;
- stale/overdue status.

Add exhaustive tests. Do not distribute stage logic across UI components.

### 4.4 Business-day follow-up rule

Default policy:

- first follow-up becomes due **6 business days** after `first_message_sent`;
- only Monday–Friday count initially;
- use `America/Costa_Rica` to determine calendar days;
- if a reply, disqualification, call booking, loss, win, or nurture event happens first, cancel the due action;
- one follow-up only, then no further automated reminder unless manually moved to nurture;
- policy must be configurable, not hardcoded into components.

Do not add holiday calendars in this version.

---

## 5. Data model

The coding agent must inspect the existing persistence layer and adapt names to repository conventions. Prefer additive migrations.

### Entities

#### `contacts`

Minimum fields:

- `id`
- `accountId`
- `name`
- `role`
- `linkedinUrl`
- `linkedinMemberId` when known
- `relationship` (`cold`, `warm`, `inbound`, `referral`)
- timestamps

#### `sales_events`

Use the event shape above. Index `accountId`, `contactId`, `type`, and `occurredAt` appropriately.

#### `outreach_variants`

- `id`
- `name`
- `channel`
- `structure`
- `hypothesis`
- `activeFrom`
- `activeTo`

Examples:

- no-note connection request;
- signal-specific request note;
- warm-engagement-first;
- correction-bait opener;
- direct-fit opener.

#### `outreach_messages`

- `id`
- `accountId`
- `contactId`
- `variantId`
- `kind` (`connection_note`, `first_message`, `follow_up`)
- `draftText`
- `approvedText`
- `sentAt`
- `sentConfirmedBy`
- `fieldTestId` or observation link
- timestamps

Never infer `sentAt` from draft generation.

#### `content_posts`

- `id`
- `platform`
- `url`
- `platformUrn`
- `status` (`draft`, `approved`, `published`, `failed`, `archived`)
- `publishedAt`
- `hook`
- `topic`
- `format`
- `contentType` (`measured_test`, `decision_framework`, `operator_story`, `offer`)
- `ctaType` (`question`, `save`, `discussion`, `offer`, `none`)
- `offerMentioned`
- `sourceAccountIds[]` or join table
- `claimLedger`
- timestamps

#### `content_metric_snapshots`

- `id`
- `postId`
- `observedAt`
- `window` (`24h`, `7d`, `30d`, `custom`)
- `source` (`manual`, `linkedin_export`, `composio`, `public_page`)
- nullable metrics:
  - impressions
  - uniqueViews
  - reactions
  - comments
  - reposts
  - clicks
  - profileViews
  - follows
  - inboundMessages
  - callsAttributed
- `notes`
- timestamps

Nullable means unavailable. A recorded zero is distinct from null.

#### `attribution_events`

- `id`
- `accountId` or `contactId`
- `postId`
- `type` (`profile_view`, `follow`, `dm`, `call`, `opportunity`)
- `confidence` (`explicit`, `self_reported`, `inferred`)
- `evidenceNote`
- `occurredAt`

Only `explicit` and `self_reported` attribution count as sourced conversions in primary reporting. Show inferred attribution separately.

### Migration/backfill

Backfill current account timestamps into events where evidence exists:

- existing `askSentAt` → relevant sent event only if its semantics are verified;
- existing research/field-test timestamps → research/test events;
- never backfill acceptance or reply from absence/presence guesses.

Seed the known observed funnel as manually confirmed data only if no duplicate records already exist:

- 5 connection requests;
- 1 acceptance;
- 1 follow-up/first message as clarified from existing records;
- 0 replies is a report denominator result, not an event.

If mapping those five prospects is ambiguous, create an import screen rather than anonymous synthetic prospects.

---

## 6. Signal Room UX

### 6.1 Today / Action Queue

Make this the default operational view or first tab.

Sections:

1. **Overdue follow-ups**
2. **Due today**
3. **Connection outcomes to check manually**
4. **Field tests awaiting opener**
5. **Accepted connections awaiting first message**
6. **Replies awaiting classification**
7. **Upcoming calls/proposals**
8. **Post metrics due for capture**

Each row must support one-click or low-friction actions with confirmation:

- mark accepted;
- mark no longer pending / withdrawn;
- log message sent;
- log follow-up sent;
- log reply;
- classify reply;
- open LinkedIn URL;
- snooze/nurture;
- add note.

Do not add a generic AI summary where a deterministic due list suffices.

### 6.2 Account timeline

Show one chronological timeline containing:

- research;
- field-test evidence;
- generated drafts;
- confirmed sends;
- acceptances;
- replies;
- calls;
- proposals;
- disposition;
- content attribution.

Raw evidence and external URLs must remain inspectable.

### 6.3 Manual LinkedIn sync panel

Because connection/DM APIs are unavailable, provide a deliberate daily reconciliation flow:

> “Open LinkedIn, check these 8 pending contacts, then mark accepted, still pending, or unavailable.”

Features:

- opens profile in a new tab;
- keyboard-friendly status controls;
- records `observedAt` separately from actual event time if unknown;
- supports exact timestamp, approximate date, or unknown time;
- never assumes a pending request was rejected merely because time elapsed.

### 6.4 Funnel dashboard

Show:

- researched → field-tested rate;
- connection acceptance rate;
- first-message reply rate;
- follow-up reply rate;
- qualified-reply rate;
- reply → call rate;
- call → proposal rate;
- proposal → win rate;
- median days between stages;
- counts by ICP preset;
- counts by outreach variant;
- counts by signal source;
- counts by field-test type.

Every card displays `numerator / denominator` and date range.

Small-sample behavior:

- `< 20` eligible events: “Directional only — small sample.”
- `20–49`: “Early signal.”
- `>= 50`: no warning by default.

Do not add fake statistical significance. Optional Wilson intervals are acceptable if clearly labeled and tested.

### 6.5 Experiment comparison

Allow an operator to define a bounded experiment:

- hypothesis;
- start/end date;
- one changed variable;
- eligible ICP;
- variant A/B;
- minimum sample target;
- success metric;
- notes/outcome.

Initial experiments:

1. no-note request versus signal-specific note;
2. direct request versus warm-engagement-first;
3. correction-bait opener versus direct-fit question;
4. post with offer CTA versus post with discussion question.

Do not automate random assignment unless Yenson explicitly opts into it. Manual variant selection is sufficient.

---

## 7. LinkedIn profile workspace

Add a small profile-version panel to Signal Room.

Store:

- headline text;
- About text;
- Featured assets/URLs;
- effective date;
- hypothesis;
- notes;
- active/inactive state.

Seed current headline:

> Senior AI Solution Architect @ Microsoft · AI advisor for Microsoft for Startups · Agentic systems, Azure migrations, productionization

Seed recommended candidate:

> AI Architecture Advisor for Funded Startups | Inference Cost, Latency & Provider Risk | Senior AI Solution Architect supporting Microsoft for Startups via Accenture

Requirements:

- comparison view;
- copy-to-clipboard;
- manual “activated on LinkedIn” confirmation;
- funnel reporting by profile-version active period;
- do not mutate LinkedIn profile automatically in this version.

The UI must flag risky phrasing such as direct “@ Microsoft” employment claims when the source-of-truth relationship is through Accenture.

---

## 8. Post Lab upgrades

### 8.1 Content strategy enforcement

Support these content types and target mix:

- `measured_test`: 40%
- `decision_framework`: 25%
- `operator_story`: 20%
- `offer`: 15%

This is guidance, not an auto-publishing quota. Show recent mix and warn when every post sells.

Rule:

> Roughly three of four posts should teach, test, or invite discussion without naming the Review.

### 8.2 Length and structure checks

Default target for standard text posts:

- 700–1,300 characters;
- one sharp claim;
- one concrete production scenario;
- one measured or explicitly illustrative artifact;
- three implications or fewer;
- one genuine question.

Warnings, not hard failures, unless the post violates evidence rules.

Flag:

- paragraphs longer than 4 visual lines;
- total length above the chosen range;
- thesis appearing after the first 250 characters;
- more than one offer mention;
- repeated CTA language across recent posts;
- architecture memo tone without a concrete scenario;
- diagram suggesting measurement without units/source;
- universal claims without evidence;
- confidential/employer attribution risks.

### 8.3 Evidence state for visuals

Every diagram/image must be classified:

- `measured`;
- `derived_from_measured_data`;
- `illustrative`;
- `conceptual`.

For measured/derived visuals require:

- metric;
- unit;
- workload/context;
- observation date;
- source/evidence link;
- methodology note.

If absent, render an explicit “Illustrative” label suggestion and block wording that presents it as measured proof.

### 8.4 Claim ledger integration

Every numeric or comparative claim must map to:

- evidence record;
- personal observation;
- public source;
- client-approved case study;
- clearly labeled hypothesis/illustration.

Block publishing when a `[VERIFY]` marker or unsupported precise claim remains.

### 8.5 Recent-post critique records

Seed three records from the reviewed posts, without invented private metrics:

1. **Aug 12 — “Here is a conversation I keep having…”**
   - strongest structure;
   - five failure patterns;
   - offer CTA;
   - diagram is conceptual/illustrative unless measurement evidence is attached;
   - public page showed 0 comments at observation time; other metrics unavailable.

2. **Aug 18 — “The strongest case for one model…”**
   - rigorous but memo-length;
   - thesis and release-gate artifact arrive late;
   - offer CTA;
   - compress to one decision rule and example;
   - public page showed 0 comments; other metrics unavailable.

3. **Aug 27 — “Customer control stops being a valid reason…”**
   - strongest differentiated thesis;
   - highest cognitive load;
   - ambiguous VPC/support-path visual semantics;
   - offer CTA;
   - public page showed 0 comments; other metrics unavailable.

Store source URLs/URNs and assessment provenance.

---

## 9. Content metrics workflow

### Metric due dates

On confirmed publication, automatically schedule capture tasks at:

- 24 hours;
- 7 days;
- 30 days.

### Capture UI

Allow manual entry or import for:

- impressions;
- reactions;
- comments;
- reposts;
- clicks;
- profile views;
- follows;
- inbound DMs;
- calls attributed.

Requirements:

- blank = unavailable, not zero;
- prevent negative values;
- allow a screenshot or source note;
- deduplicate one canonical snapshot per post/window/source while preserving revisions/audit history;
- show deltas between windows;
- never derive impressions from reactions;
- record the LinkedIn URL and canonical URN.

### Import/export

Add CSV import for LinkedIn export/manual reporting when field names can be mapped safely. Provide preview and validation before commit.

Exports:

- sales events CSV;
- current funnel CSV;
- content posts CSV;
- content metric snapshots CSV;
- complete JSON backup.

No secret or authentication material in exports.

---

## 10. Composio LinkedIn adapter

Create or formalize a boundary such as:

```typescript
interface LinkedInPort {
  getMyProfile(): Promise<LinkedInProfile>
  getKnownPost?(urn: string): Promise<LinkedInPost | Unsupported>
  listKnownPostReactions?(urn: string): Promise<LinkedInReactions | Unsupported>
  publishApprovedPost(input: ApprovedLinkedInPost): Promise<PublishResult>
}
```

### Capability detection

Represent each capability explicitly:

```typescript
type CapabilityState = "available" | "forbidden" | "unsupported" | "unknown"
```

Do not treat 403/404 as zero data. Persist capability observations with timestamps, but avoid noisy retries.

### Publishing policy

Publishing flow:

```text
Draft
→ Evidence validation
→ Human preview
→ Explicit approval
→ Publish
→ Read-back/reconciliation
→ Post record created
→ Metric-capture tasks scheduled
```

Requirements:

- approval must bind to an immutable content hash;
- any edit after approval invalidates approval;
- show exact author, body, media, and visibility before approval;
- store provider result/URN and display URL;
- after ambiguous failure, reconcile before retrying;
- no scheduled/autonomous publication in this version unless a separate explicit scheduling policy already exists and is preserved safely.

Do not store Composio tokens or account credentials in the database, logs, prompts, or exports.

---

## 11. Daily and weekly operating views

### Daily brief

Deterministically generate:

- follow-ups overdue/due;
- acceptances to check;
- connected prospects awaiting first message;
- replies needing classification;
- calls/proposals due;
- metric snapshots due;
- one recommended next sales action based on queue priority.

The model may summarize account context after the deterministic list exists. It may not reorder actions invisibly or manufacture urgency.

### Weekly review

Include:

- funnel counts/rates with denominators;
- sample-size warnings;
- variant performance;
- ICP performance;
- time-to-stage medians;
- content output and mix;
- content metrics by type/topic/CTA;
- attributed conversations/calls;
- overdue operational gaps;
- experiments reaching review thresholds.

Add a plain-language section:

> What did we observe? What remains unknown? What will we change once?

No recommendations based solely on fewer than 20 top-of-funnel events unless labeled exploratory.

---

## 12. Notifications

Preferred V1:

- in-app Action Queue is authoritative;
- optional Telegram/email daily summary may be added only if an existing safe notification adapter is present;
- notifications contain no confidential research details beyond what is necessary;
- one digest per day, no reminder spam;
- links return to authenticated Signal Room rows.

Do not build a new messaging integration solely for this feature.

---

## 13. Likely files to inspect

The current-state snapshot names:

- `src/proxy.ts`
- `src/lib/signal-room/offers.ts`
- `src/lib/consulting-data.ts`
- existing Signal Room routes under `src/app/signal-room/`
- existing Signal Room APIs under `src/app/api/signal-room/`
- `signal-room-backlog.md`

The coding agent must inspect the repository before editing and map these likely paths to exact files, including:

- persistence/schema/migrations;
- account types and repositories;
- Post Lab data and validators;
- opener/reply/call/proposal flows;
- model adapters;
- integration adapters;
- test framework;
- analytics/logging conventions.

Do not create duplicate state stores or a second parallel CRM model if an existing account/event abstraction can be extended cleanly.

---

## 14. Implementation sequence

### Task 1: Map existing Signal Room state and baseline

**Objective:** Replace plan assumptions with exact repository paths and current behavior.

1. Inspect package scripts, schema, migrations, account model, `askSentAt` semantics, Signal Room tabs/APIs, Post Lab, auth, and tests.
2. Produce a short map of existing fields and which new entity each maps to.
3. Run baseline tests/typecheck/lint/build.
4. Record current auth behavior for password set/unset.
5. Do not edit production code yet.

### Task 2: Add pure funnel and business-day policy tests

**Objective:** Specify deterministic behavior before persistence/UI work.

Test:

- normal progression;
- warm/inbound late-stage entry;
- one six-business-day follow-up;
- weekend crossing in Costa Rica time;
- cancellation after reply/disqualification/call/win/loss/nurture;
- unknown timestamps;
- duplicate event idempotency;
- current-stage and next-action derivation;
- null versus zero metric semantics;
- sample-size warning thresholds.

Run tests and verify they fail for the expected missing implementation.

### Task 3: Implement event ledger and migrations

**Objective:** Add durable, auditable sales/content storage.

1. Add additive schema/migration changes.
2. Implement repositories/services for events, variants, messages, posts, snapshots, attribution, and profile versions.
3. Add uniqueness/idempotency constraints.
4. Add source/actor/audit fields.
5. Implement safe backfill only for existing unambiguous timestamps.
6. Run migration and repository tests.
7. Commit: `feat(signal-room): add sales and content event ledger`.

### Task 4: Implement funnel derivation and reporting

**Objective:** Calculate rates and due actions from authoritative events.

1. Implement pure derivation functions.
2. Implement date-range reporting.
3. Show numerator/denominator and sample warnings.
4. Add tests for variants, ICPs, signal sources, and time-to-stage.
5. Commit: `feat(signal-room): add funnel reporting engine`.

### Task 5: Build Today / Action Queue

**Objective:** Make daily execution obvious.

1. Add deterministic queue query/service.
2. Build grouped UI sections from §6.1.
3. Add manual action controls with confirmation and idempotency.
4. Add LinkedIn profile deep links.
5. Add empty/loading/error states.
6. Test permissions and cross-account isolation where applicable.
7. Commit: `feat(signal-room): add daily sales action queue`.

### Task 6: Add manual LinkedIn reconciliation and profile versions

**Objective:** Handle API gaps without losing measurement discipline.

1. Build pending-contact reconciliation flow.
2. Store observed versus actual/approximate timestamps.
3. Add headline/About/Featured version records.
4. Seed current and candidate headline.
5. Add copy-to-clipboard and manual activation confirmation.
6. Add profile-version period filters to funnel reports.
7. Commit: `feat(signal-room): track LinkedIn profile and manual outcomes`.

### Task 7: Upgrade Post Lab evidence and format checks

**Objective:** Turn recent post lessons into enforceable drafting assistance.

1. Add content types, target mix, CTA types, and offer-mention fields.
2. Add length, structure, density, thesis-position, repeated-CTA, evidence, and employer-risk checks.
3. Add visual evidence classification.
4. Integrate claim ledger publishing blockers.
5. Seed the three reviewed post critique records.
6. Add unit tests for every blocker/warning.
7. Commit: `feat(post-lab): add evidence-aware LinkedIn guidance`.

### Task 8: Build post registry and metric snapshots

**Objective:** Measure content without pretending LinkedIn exposes what it does not.

1. Add post registry list/detail views.
2. Schedule 24h/7d/30d metric-capture tasks.
3. Add manual snapshot form with null/zero distinction.
4. Add source note/screenshot reference.
5. Add deltas and grouped content reporting.
6. Test validation, deduplication, and revision audit.
7. Commit: `feat(signal-room): track LinkedIn post performance`.

### Task 9: Add Composio LinkedIn adapter and approved publishing

**Objective:** Use supported capabilities without coupling core state to provider gaps.

1. Implement `LinkedInPort` capability model.
2. Wrap profile read and approved post publication.
3. Gracefully record forbidden/unsupported known-post analytics.
4. Add immutable content-hash approval.
5. Add exact preview and per-post confirmation.
6. Reconcile provider result before retry.
7. Use mocked/fake adapter tests; do not publish during tests.
8. Commit: `feat(signal-room): add approval-gated LinkedIn adapter`.

### Task 10: Add import/export and weekly review

**Objective:** Make data portable and operationally useful.

1. Add CSV preview/import with field mapping and validation.
2. Add sales/content CSV exports and complete JSON backup.
3. Add deterministic weekly review.
4. Add optional model summary only after facts are calculated.
5. Test no secrets/credentials enter exports.
6. Commit: `feat(signal-room): add sales review and data portability`.

### Task 11: Security and end-to-end verification

**Objective:** Prove the upgrade does not weaken the private workspace.

Verify:

- `/signal-room/*` and APIs fail closed without password;
- unauthenticated writes are rejected;
- CSRF/origin protections match existing conventions;
- external post/message content is treated as data;
- content approval invalidates after edits;
- no PII enters analytics;
- no credentials/tokens enter prompts, DB, logs, or exports;
- duplicate submissions are idempotent;
- timezone behavior is correct;
- inaccessible LinkedIn metrics remain null/unavailable;
- existing research/opener/call/proposal flows still work.

Run complete tests, typecheck, lint, and build.

### Task 12: Open a review PR

PR must include:

- schema diagram or concise data-model summary;
- migration/backfill behavior;
- screenshots of Action Queue, funnel dashboard, reconciliation, Post Lab warnings, and metric snapshots;
- exact LinkedIn capabilities implemented and unavailable;
- test/build output;
- security verification;
- no evidence of external publication during implementation;
- rollback notes.

Suggested title:

> `feat(signal-room): close the sales and LinkedIn measurement loop`

Do not merge automatically. Request Yenson’s approval after showing real UI and tests.

---

## 15. Acceptance criteria

- [ ] Sales actions are stored as immutable events.
- [ ] Current stage and next action are derived deterministically.
- [ ] Six-business-day follow-ups appear automatically and cancel correctly.
- [ ] One follow-up maximum is enforced by default.
- [ ] Today view shows all due sales/content actions.
- [ ] Manual LinkedIn reconciliation records source and observation time.
- [ ] Funnel rates show numerator, denominator, range, and sample warning.
- [ ] Results can be grouped by ICP, signal, field test, opener variant, and profile version.
- [ ] LinkedIn profile versions are tracked without automatic profile mutation.
- [ ] Current and recommended headlines are seeded accurately.
- [ ] Post Lab supports the four content types and target mix.
- [ ] Posts are warned for excessive length/density, delayed thesis, repetitive offer CTA, and unsupported visuals.
- [ ] Numeric claims and measured visuals require evidence metadata.
- [ ] `[VERIFY]` or unsupported precise claims block publication.
- [ ] The three reviewed posts are recorded with URLs, URNs, critique, and metric limitations.
- [ ] Post metric snapshots distinguish null from zero.
- [ ] Capture tasks are created for 24h, 7d, and 30d.
- [ ] Content reporting includes type/topic/CTA and attributed pipeline.
- [ ] Primary attribution counts only explicit/self-reported evidence.
- [ ] Composio capability failures are surfaced, not treated as zero.
- [ ] Publishing requires exact preview and content-hash-bound approval.
- [ ] No connection requests or DMs are automated.
- [ ] Sales/content data can be exported without secrets.
- [ ] Signal Room auth still fails closed.
- [ ] Existing flows and full verification pass.

---

## 16. Non-goals

- Automated connection requests.
- Automated cold DMs or follow-ups.
- Browser automation to imitate LinkedIn usage.
- Scraping private LinkedIn pages or evading controls.
- Automatic profile editing.
- Autonomous posting.
- A general-purpose CRM.
- Holiday-aware business calendars.
- Statistical significance theater on tiny samples.
- Rebuilding Discover, Research, Field Test, Calls, or Proposals.
- Adding another AI generator.
- Repositioning the consulting practice.
- Treating likes/impressions as the final business outcome.

---

## 17. Risks and trade-offs

### Manual confirmation creates operator work

This is preferable to false automation. Optimize the reconciliation UI until daily updates take less than five minutes.

### Event ledger may feel heavy at five prospects

Keep the schema and UI simple, but build for truthful history. The current small sample is exactly when backfilling cleanly is cheapest.

### Publishing integration may be unreliable

Core draft/evidence/approval state must remain useful without Composio. Provider failures must not corrupt the ledger.

### Content metrics may encourage vanity optimization

Keep attributed replies, calls, opportunities, and revenue beside impressions. Optimize for qualified conversations, not applause.

### Too much implementation can become avoidance

Ship in vertical slices. The first useful release is event ledger + follow-up queue + funnel denominators. Yenson should continue outreach while later tasks are built.

---

## 18. Recommended release slices

### Slice A — Sales truth and action

- event ledger;
- business-day follow-up policy;
- Today queue;
- funnel dashboard;
- manual LinkedIn reconciliation.

Ship this first. It addresses the immediate bottleneck.

### Slice B — Content truth

- post registry;
- metric snapshots;
- profile versions;
- three historical post records;
- weekly review.

### Slice C — Controlled publishing

- Post Lab evidence upgrades;
- capability-aware Composio adapter;
- immutable approval;
- publish and reconcile.

Do not block Slice A on LinkedIn publishing.

---

## 19. Coding-agent kickoff prompt

> Implement the attached Signal Room sales and LinkedIn evidence-loop plan in the existing repository. Start by inspecting the real persistence model, `askSentAt` semantics, route/component layout, Post Lab validators, integration adapters, tests, and `src/proxy.ts`; replace all likely paths in the plan with exact paths before editing. Build Slice A first and open an interim PR if the remaining work becomes large. Preserve fail-closed authentication and existing research/opener/call/proposal flows. Store external outcomes only when manually confirmed or provider-verified. Treat unavailable LinkedIn metrics as null, never zero. Do not automate connection requests or DMs, do not publish any post during implementation, and do not place credentials in prompts, data, logs, or exports. Work test-first, make small commits, run full verification, and stop before merge with screenshots and evidence.

---

## Final product principle

The system should reduce the time between **something happened on LinkedIn** and **we know what to do next**—without pretending LinkedIn gave us data it never provided.
