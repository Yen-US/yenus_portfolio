# yenus.dev Homepage Simplification Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Simplify `yenus.dev` into a focused conversion page for funded AI startup founders and CTOs facing production inference decisions, while preserving the existing visual identity, credible proof, and deliberate Yenson/Presencia boundary.

**Architecture:** Keep the existing single-page consulting architecture and data-driven rendering, but reduce the homepage information architecture to one buyer, one featured offer, one primary CTA, one low-commitment rung, and directly relevant proof. Move secondary services and biography/detail content to dedicated routes or retain them as concise linked pages rather than rendering the entire practice on the homepage.

**Tech Stack:** Existing Next.js/React/TypeScript site, current styling system and components, existing `src/lib/consulting-data.ts`, existing discovery route and analytics conventions.

---

## 1. Product context

### Current practice

Yenson sells senior AI architecture judgment to funded AI startups making consequential production inference and architecture decisions. The current featured offer is the **Inference Readiness Review**:

- one week;
- fixed scope;
- intended for production or near-production AI-native teams;
- focused on quota/provider risk, model substitution, latency, fallback, and a 90-day decision sequence.

The site currently publishes five services and extensive material about philosophy, case studies, process, biography, Presencia, FAQs, and discovery.

### Observed commercial signal

The first outbound test produced:

- 5 LinkedIn connection requests;
- 1 acceptance;
- 1 follow-up message;
- 0 replies so far.

This sample is too small to infer market rejection. The immediate bottleneck remains earning conversations. The site simplification is a bounded supporting task, not a reason to pause outreach or rebuild the brand.

### Strategic constraints

- Do not switch to local SMB positioning.
- Do not introduce the rejected `$150 Presencia Fix Plan`.
- Do not change the primary ICP away from funded AI startups.
- Do not invent claims, benchmarks, client logos, savings, testimonials, or scarcity.
- Do not imply Microsoft or Accenture endorses the independent practice.
- Do not imply confidential portfolio/customer information is used.
- Preserve the distinction: **Yenson sells advisory judgment; Presencia holds optional engineering capacity.**
- Preserve the ability to offer broader engagements after discovery without presenting five equal choices on the homepage.
- Treat all price bands as unvalidated unless the owner explicitly chooses to publish one.

---

## 2. Success criteria

The redesigned homepage must let a qualified visitor answer these within 20 seconds:

1. Is this for a team like mine?
2. What production problem does Yenson address?
3. What is the primary engagement?
4. What tangible decisions/artifacts result?
5. Why should I trust him?
6. What is the smallest sensible next action?

### Conversion objective

Primary conversion:

> A qualified founder or CTO opens the discovery flow with a specific production inference decision.

Secondary conversion:

> A good-fit visitor who is not ready for a one-week Review asks about the paid 90-minute working session.

### Measurement baseline

Before shipping, record current analytics for the most recent useful period where available:

- homepage visits;
- clicks to `/discovery`;
- completed discovery submissions/bookings;
- traffic sources;
- mobile/desktop split.

If no usable analytics exist, state that explicitly and establish event tracking in this change. Do not fabricate a baseline.

---

## 3. Target homepage information architecture

Render these sections, in this order:

1. **Focused hero**
2. **Three fit symptoms**
3. **One featured offer: Inference Readiness Review**
4. **One directly relevant proof section**
5. **What happens in one week**
6. **Low-commitment entry point**
7. **Short credibility and independence statement**
8. **Final CTA and compact footer**

Remove from the homepage or move behind dedicated links:

- the full five-service grid;
- long startup-reality/philosophy exposition;
- the full transformation grid;
- multiple case-study walkthroughs with every detail expanded;
- operator-proof cards unrelated to the primary inference decision;
- all five perspective/editorial pillars;
- the full employment/biography timeline;
- the long Yenson-versus-Presencia section;
- the full FAQ stack;
- repeated discovery CTAs after nearly every section.

Do not delete useful content without preserving it somewhere appropriate. Move it to `/services`, `/work`, or `/about` if those routes exist or can be added simply. If creating routes would materially widen scope, keep the source data intact and hide secondary material from the homepage until a later change.

---

## 4. Required copy direction

Copy below is a strong default. Preserve meaning; refine only for clarity and voice.

### Hero

**Eyebrow**

> AI architecture for funded startups

**Headline**

> Your AI works. Now make sure it survives production.

**Supporting copy**

> A one-week architecture review for AI teams facing inference cost, latency, provider, or capacity decisions in the next 90 days.

**Primary CTA**

> Bring me your inference bottleneck

**CTA destination**

`/discovery`

**Trust line**

> Senior AI Solution Architect supporting Microsoft for Startups globally via Accenture. Independent practice; no employer endorsement implied.

Do not lead with generic language such as “From AI ambition to production clarity” on the homepage. It may remain as secondary brand language elsewhere.

### Three fit symptoms

Heading:

> This review is useful when…

Cards or bullets:

1. **Cost is moving faster than usage**  
   You cannot explain cost per successful request or predict what scale does to margin.

2. **Latency has no accountable budget**  
   Retrieval, guardrails, model calls, and post-processing all consume time, but no owner can show where it goes.

3. **One provider decision can stop the product**  
   Quota, model availability, deprecation, or regional failure has no evaluated escape path.

Keep claims diagnostic and bounded. Do not say these conditions apply to “most” or “all” Series B companies without evidence.

### Featured offer

Heading:

> Inference Readiness Review

Subheading:

> One week to turn an exposed inference path into explicit decisions your team can own.

Deliverables:

- quota and provider risk map with named single points of failure;
- model-substitution matrix and required evaluation evidence;
- latency budget decomposed by hop;
- cold-start and fallback strategy;
- provider portfolio recommendation;
- 90-day sequence with owners and decision gates.

Boundary:

> Not a code audit, security review, implementation retainer, or vendor pitch.

Primary CTA:

> Explore fit for the Review

Do not publish the `$8K–$12K` internal range unless Yenson explicitly approves public pricing during implementation. The current strategy treats pricing as a live hypothesis.

### Proof

Use the strongest proof that demonstrates the underlying judgment without falsely presenting it as an Inference Readiness Review.

Recommended layout:

**Proof of the operating method**

- **AOP Beacon:** bounded model use around `<2.5s p95`, `<$1/event`, zero attendee PII in model payload, and deterministic fallback.
- **YC startup migration:** target architecture and acceptance gates enabled a seven-day migration with zero customer-visible downtime.

Include a frank note:

> These engagements demonstrate the architecture method; the first dedicated Inference Readiness Review will become the direct case study for this offer.

Only keep numeric claims already supported by the existing case-study source. Do not strengthen them.

Link to `/work` if available. Keep the homepage proof concise.

### What happens in one week

Use a four-step sequence:

1. **Map the live path** — workloads, models, providers, dependencies, traffic, and SLOs.
2. **Measure the failure surface** — cost, TTFT/latency, cold starts, quota, concentration, and fallback gaps.
3. **Make the decisions explicit** — viable substitutions, evidence needed, trade-offs, and ownership.
4. **Leave the team a sequence** — a 90-day plan with decision gates, not a backlog-shaped wishlist.

Do not promise direct production access by default. Access requirements must be scoped safely in discovery.

### Low-commitment entry point

Heading:

> One decision, before a full Review

Copy:

> Not ready for a one-week engagement? Use a paid 90-minute inference working session to resolve one bounded decision and identify the next test.

Outputs:

- one clearly framed inference decision;
- options and explicit trade-offs;
- the next measurement or experiment;
- a short written decision note after the call.

CTA:

> Ask about a working session

Route to `/discovery` with a query parameter or preselected engagement if the existing discovery form supports it. If not, add the smallest typed mechanism to preselect “90-minute working session.”

Do not present this as free. Do not necessarily expose `$500–$750` publicly unless Yenson approves; copy may say “paid.”

### Short credibility section

Keep only evidence relevant to buyer confidence:

- production AI work since 2022;
- more than 60 founding teams advised;
- current Senior AI Solution Architect role supporting Microsoft for Startups via Accenture;
- based in Costa Rica, working globally in English;
- one active sprint at a time.

Include the confidentiality firewall:

> My independent work uses only public information and information a client explicitly provides for its engagement. No confidential Microsoft, Accenture, or other client information is used or disclosed.

Preserve the existing conflict-review statement.

### Final CTA

Heading:

> Bring the inference decision your team cannot leave implicit.

Copy:

> In 30 minutes, we will clarify the constraint, whether the Review fits, and the next responsible step—even when that step is not hiring me.

Button:

> Start a technical conversation

---

## 5. Visual and UX direction

- Preserve the existing premium, restrained visual identity.
- Do not redesign the logo, typography system, or color system.
- Reduce total homepage length materially—target roughly **40–55% less rendered copy**.
- Use generous whitespace and short line lengths.
- Keep one dominant CTA style and one secondary text-link style.
- Do not repeat the same CTA more than three times: hero, low-commitment section, final CTA.
- Ensure sticky/header navigation reflects the reduced structure.
- On mobile, place the buyer/problem, offer, and CTA before any long proof content.
- Avoid carousels, auto-playing animation, popups, countdowns, fake availability, chat widgets, and generic AI imagery.
- Preserve accessibility: semantic headings, visible focus, keyboard navigation, reduced-motion support, contrast, and descriptive link labels.

---

## 6. Likely files to inspect and change

The current-state document identifies these source files:

- Modify: `src/lib/consulting-data.ts`
- Inspect/possibly modify: the homepage route under `src/app/` (find the component rendering consulting data)
- Inspect/possibly modify: existing section components under `src/components/`
- Inspect/possibly modify: discovery form route/component under `src/app/discovery/`
- Inspect/possibly modify: analytics utilities or root layout
- Preserve: `src/lib/signal-room/offers.ts` internal price bands unless needed for a typed engagement identifier
- Do not expose or weaken: `src/proxy.ts` Signal Room protection

The coding agent must inspect the repository and replace these “likely” paths with exact paths before editing. Do not invent a parallel page system if reusable components already exist.

---

## 7. Implementation tasks

### Task 1: Establish baseline and map the current render tree

**Objective:** Identify exact homepage, navigation, section, discovery, analytics, and test files before changing behavior.

**Steps:**

1. Inspect `package.json`, app/router layout, homepage route, `src/lib/consulting-data.ts`, section components, discovery flow, and current tests.
2. Record the rendered homepage sections in order.
3. Record current CTA labels and destinations.
4. Record existing analytics events and whether discovery conversions are measurable.
5. Run the existing quality checks and record baseline results.
6. If a browser test framework exists, capture the current desktop and mobile homepage as baselines.
7. Commit no changes in this task.

**Expected result:** A short implementation note or PR description section with exact files and baseline behavior.

### Task 2: Add content-model tests for the focused homepage

**Objective:** Make the new information hierarchy testable before rewriting UI.

**Steps:**

1. Identify the existing test framework.
2. Add or update tests asserting:
   - one primary featured offer;
   - presence of the three fit symptoms;
   - presence of the paid working-session rung;
   - no public internal price unless explicitly enabled;
   - confidentiality statement present;
   - primary CTA targets discovery;
   - no more than the intended homepage service cards/sections.
3. Run the focused test and verify it fails against the old structure for the expected reasons.
4. Commit the failing specification test if the repository convention allows red commits; otherwise keep it uncommitted until Task 3.

### Task 3: Reshape the consulting content model

**Objective:** Represent the homepage as one offer and move secondary material out of its primary data path.

**Steps:**

1. Refactor `src/lib/consulting-data.ts` or its actual equivalent using existing types.
2. Add typed content for:
   - focused hero;
   - three fit symptoms;
   - Inference Readiness Review;
   - concise proof;
   - one-week process;
   - paid working session;
   - confidentiality/independence statement;
   - final CTA.
3. Keep broader service definitions available for `/services` or future use; do not delete internal offer logic.
4. Avoid duplicating copy across component files.
5. Run typecheck and focused tests.
6. Commit: `refactor(site): focus homepage content model`.

### Task 4: Simplify the homepage render

**Objective:** Render the target information architecture and remove secondary cognitive load.

**Steps:**

1. Update the homepage component to render the eight sections in §3.
2. Remove or relocate the five-service grid, long philosophy, full biography, full FAQ, and repeated CTAs from the homepage.
3. Preserve links to deeper material when routes exist.
4. Keep at most three discovery CTA placements.
5. Ensure section IDs and navigation match rendered sections.
6. Run focused tests, lint, and typecheck.
7. Commit: `feat(site): simplify consulting homepage`.

### Task 5: Add the paid working-session path

**Objective:** Give qualified visitors a lower-commitment entry without creating another ICP or brand.

**Steps:**

1. Inspect how `/discovery` captures engagement intent.
2. Add a typed `working-session` option or equivalent.
3. Support a query parameter such as `/discovery?engagement=working-session` if consistent with current patterns.
4. Validate unknown query values safely.
5. Ensure the form/email/record preserves the selected intent.
6. Add tests for valid, missing, and invalid values.
7. Run the relevant test suite.
8. Commit: `feat(site): add inference working-session entry point`.

### Task 6: Add conversion instrumentation

**Objective:** Make the next site decision evidence-based.

**Track at minimum:**

- primary hero CTA click;
- working-session CTA click;
- final CTA click;
- discovery form start;
- discovery completion or confirmed booking handoff.

**Steps:**

1. Reuse the existing analytics provider; do not add a second provider without necessity.
2. Use stable event names and non-sensitive properties such as CTA location and engagement type.
3. Do not send free-text problem descriptions, email addresses, company names, or other PII as analytics properties.
4. Add tests where analytics helpers are testable.
5. Document event names in the PR description or existing analytics documentation.
6. Commit: `feat(site): track consulting conversion events`.

### Task 7: Responsive, accessibility, and content verification

**Objective:** Verify the simplified page works as a real conversion surface.

**Desktop widths:** 1440 and 1024.  
**Mobile widths:** 390 and 360.

**Verify:**

- no horizontal overflow;
- hero offer and CTA visible quickly on mobile;
- heading hierarchy is logical;
- keyboard traversal reaches all interactive elements;
- focus states are visible;
- CTA labels are descriptive;
- decorative media has correct alt treatment;
- reduced motion is respected;
- copy does not contain unsupported universal/market claims;
- Microsoft/Accenture independence language is visible;
- no internal prices leak accidentally;
- all internal links resolve;
- `/signal-room` remains inaccessible without authentication.

Capture screenshots if the repository workflow supports artifacts.

### Task 8: Full verification and PR

**Objective:** Deliver a reviewable, low-risk site simplification.

**Run the project’s exact scripts. At minimum, where available:**

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

Also run:

- focused homepage tests;
- discovery-flow tests;
- browser/e2e smoke test for homepage → discovery;
- link check if available;
- secret scan or repository verification workflow.

Create a PR containing:

- before/after screenshots at desktop and mobile sizes;
- rendered-section count before/after;
- copy/IA summary;
- analytics event list;
- explicit statement that Signal Room auth was not weakened;
- test/build results;
- any content moved to deeper pages rather than deleted.

Suggested PR title:

> `feat(site): focus homepage on inference readiness`

Do not merge automatically. Request Yenson’s visual and copy approval.

---

## 8. Acceptance criteria

- [ ] Homepage addresses funded AI startup founders/CTOs, not generic startups or local SMBs.
- [ ] One primary offer is featured: Inference Readiness Review.
- [ ] Hero names inference cost, latency, provider, or capacity decisions.
- [ ] Three diagnostic fit symptoms appear above detailed proof.
- [ ] Review deliverables and boundaries are clear.
- [ ] Proof is concise and is not misrepresented as a completed Review.
- [ ] One-week process is understandable without consultation jargon.
- [ ] Paid 90-minute working session is visible as the lower-commitment rung.
- [ ] Internal offer prices remain private unless explicitly approved.
- [ ] Confidentiality and independence statements are accurate and visible.
- [ ] Full five-service grid is not rendered on the homepage.
- [ ] Homepage copy is reduced by approximately 40–55% from the current render.
- [ ] No more than three primary discovery CTA placements exist.
- [ ] Discovery intent is preserved for the working-session CTA.
- [ ] Conversion events contain no PII.
- [ ] Existing visual identity remains recognizable.
- [ ] Mobile, keyboard, contrast, and reduced-motion checks pass.
- [ ] Signal Room continues to fail closed without its password.
- [ ] Existing tests, typecheck, lint, and production build pass.
- [ ] No unsupported claims or invented evidence are introduced.

---

## 9. Non-goals

- Rebranding Yenson or Presencia.
- Rebuilding the Signal Room.
- Changing the outbound methodology.
- Publishing the unverified inference post.
- Creating another service line or ICP.
- Building checkout/payment collection.
- Publishing internal prices without explicit approval.
- Adding a CMS.
- Adding chat, lead magnets, popups, or marketing automation.
- Fabricating a direct Inference Readiness case study.
- Broad SEO work beyond correct metadata for this focused page.

---

## 10. Risks and trade-offs

### Narrow positioning may exclude adjacent buyers

This is intentional. Broader services remain available after discovery or on deeper pages. Homepage clarity takes priority over catalog completeness.

### The featured offer still lacks direct case-study proof

State this honestly. Use existing work only as proof of method. The first paid Review should be contracted with permission for a referenceable outcome.

### A redesign may become avoidance

Time-box implementation. Do not expand scope beyond this plan. The commercial experiment continues during development.

### Connection acceptance is upstream of the site

Do not evaluate this redesign using LinkedIn acceptance rate. Evaluate it using site-to-discovery behavior among visitors who actually arrive, plus qualitative feedback from qualified prospects.

### Working session could cannibalize the Review

Position it as one bounded decision, not a compressed Review. Do not include the full risk map, substitution matrix, latency decomposition, and 90-day plan at the lower rung.

---

## 11. Post-launch measurement

Review after either:

- 100 qualified homepage visits, or
- 10 prospect-driven visits identifiable through non-PII campaign/source tagging, or
- 3 real discovery/pricing conversations,

whichever creates useful evidence first.

Measure:

- hero CTA click-through;
- working-session CTA click-through;
- discovery starts and completions;
- which problem language prospects repeat back;
- whether visitors understand the Review without explanation;
- whether the working session attracts the same ICP;
- whether prospects ask for broader services despite the narrower homepage.

Do not reposition again from raw visit counts alone. Combine analytics with conversation evidence.

---

## 12. Coding-agent kickoff prompt

Use this exact framing when handing the plan to a coding agent:

> Implement the attached `yenus.dev` homepage simplification plan in the existing repository. Begin by inspecting the actual project and mapping every “likely” path in the plan to an exact file. Preserve the current design system and Signal Room authentication. Work test-first where practical, make small commits, and stop before merge with a PR containing before/after screenshots and complete verification output. Do not publish internal prices, invent proof, change the ICP, or add unrelated marketing features. If the repository architecture conflicts with the plan, document the conflict and choose the smallest adaptation that preserves the acceptance criteria.

---

## Final implementation principle

The page should feel like a senior technical specialist opened one clear door—not like a capable consultancy placed its entire inventory in the lobby.
