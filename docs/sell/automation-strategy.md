# Automating the Setting Methodology

**Source:** four WhatsApp audios, 2026-08-11 (`docs/sell/transcripts.md`).
**Target system:** Signal Room (`/signal-room`), which already does discovery, research, and content.
**Question this doc answers:** what in that methodology can actually be automated, what must stay manual, and in what order to build it.

---

## 1. The methodology, extracted

The advice describes a discipline called **setting** — message-based prospecting, outbound by writing rather than ads. Seven stages:

| # | Stage | The mechanic |
|---|---|---|
| 1 | **Lock the ICP** | Pick who you're shooting at *before* shooting. Changing it later resets everything — "el proceso cambia, el outreach cambia". |
| 2 | **Research + use the product** | Sign up. Free tier, or pay $20. Run a couple of tests. Measure one number yourself. |
| 3 | **Correction-bait opener** | Greeting → genuine strengths → **exactly one** weakness you measured → your technical hypothesis of the cause, stated as a guess. |
| 4 | **The scaling question** | "You have ~1000 users. Could that process handle 2000?" Creates the need for your expertise. |
| 5 | **Tone** | Human, question-led. Never attack the ego. One jab, not a teardown. |
| 6 | **The ask** | "I do this for a living, I already analyzed you, 30 minutes, no commitment." Never take a call you don't already expect to close. |
| 7 | **Call = cost math → close** | Mutual fit → what it costs → what the reclaimed 25% would buy → revenue framing → "how long will you leave it broken?" → 90-day plan → price with an upfront split. |

### The load-bearing insight

Stage 3 only works because of stage 2. The message earns a reply because it contains **a number you personally observed**, plus a wrong-but-plausible guess about why. The CTO replies *to correct you* — and that correction is the most valuable input to the entire funnel.

Everything else in this document is downstream of that. A system that generates polished messages from public web citations produces exactly the generic outreach this methodology says gets ignored.

---

## 2. What Signal Room already has

Real assets, not stubs:

- **Discovery** — `POST /api/signal-room/discover`, one bounded web-search call, returns ≤3 candidates with citations.
- **Deterministic fit score** — `src/lib/signal-room/fit-score.ts`. 5 dimensions, 100 points. The model does *not* pick the number.
- **Research briefs** — `buildResearchBrief` in `src/lib/signal-room/ai.ts`, extracting public pages via `extract-public-page.ts` with a genuinely careful SSRF/redirect/LinkedIn-block guard.
- **`ArchitectureHypothesis {hypothesis, evidence, questionToValidate}`** — already the audio's core mechanic, already correctly labeled hypothesis-not-fact.
- **Outreach pack** — opening lines, short message, Loom outline, discovery questions. Copy-out only, never sends.
- **Booking + qualification** — `discovery_bookings` captures role, company stage, initiative stage, and **investment range** before the call.
- **Advisory quality checks** — `getMeatChecks` in `post-lab-panel.tsx`: deterministic lint that colours rather than blocks. Good pattern; reuse it.

**The pipeline status enum already anticipates the whole funnel** — `watchlist → researching → ready → contacted → replied → discovery → archived` — but nothing hangs off `contacted`, `replied`, or `discovery`. The stages exist as labels with no data behind them.

---

## 3. Gap analysis

| Stage | Status | The specific hole |
|---|---|---|
| 1. ICP lock | ⚠️ **Contradictory** | ICP exists in *three disconnected places* that already disagree. |
| 2. Research | ✅ Strong | Desk research is genuinely good. |
| 2b. Product trial | ❌ **Absent** | No trial state, no measurement, nowhere to put a number you observed. |
| 3. Correction opener | ⚠️ Wrong shape | Generates messages, but from citations only — and the prompt *forbids* the strengths the methodology requires. |
| 4. Scaling question | ❌ Absent | No user-count field anywhere. |
| 5. Tone rules | ❌ Absent | No lint for one-jab discipline or hedge-framing. |
| 6. Reply → ask | ❌ **Absent** | No messages table. The CTO's correction — the highest-value artifact in the funnel — has nowhere to live. |
| 7. Call & close | ❌ Absent | No cost math, no call notes, no proposal, no price. Booking table has **no FK to accounts** — a booked call never joins the researched account. |

### Three contradictions worth naming

**a) The ICP disagrees with itself.** The strategy doc says "bootstrapped through Series B+". `fit-score.ts` scores 0 outside Seed/A/B. The discovery prompt drops non-matching stages entirely. Audio 1's exact failure mode is already live in the repo.

**b) The current prompt forbids what the methodology requires.** `ai.ts` instructs: outreach must be *"free of flattery"*. The methodology opens with genuine strengths. These aren't the same thing — flattery is unearned, strengths are observed — but the prompt as written will suppress both.

**c) The close needs a price the strategy refuses to publish.** Audio 4 closes with a specific number and a payment split. `docs/plans/2026-07-27-ai-consulting-site-strategy.md` says "Pricing is not published at launch." Until the offer ladder becomes data with real bands, the proposal step is a form with an empty required field. **No amount of code fixes that** — it's a business decision.

---

## 4. What can and cannot be automated

### Genuinely automatable
- Persisting a **versioned, locked ICP** and compiling it into both the discovery prompt and the fit-score keyword banks.
- Generating a **test plan**: what to try on the free tier, what to time, what would be surprising.
- Deriving **pipeline hypotheses that explain a specific measured number** (not generic ones).
- Composing the **correction-bait message** in the right shape, from a measurement you supply.
- **Analyzing a pasted reply**: is this a correction? which hypothesis did it confirm or refute? what numbers did they state verbatim?
- **Deterministic cost math** — arithmetic, not AI, so the number you say on the call is defensible.
- **Tone lint** — one-jab counting, hedge detection, pressure-language detection.

### Must stay manual — and why

| Manual | Reason |
|---|---|
| **Signing up and running the tests** | Scripted use of someone's product violates the stated boundaries and is ToS-hostile. It also produces numbers you can't defend when challenged. Run it yourself, like a user. |
| **Typing the measurement** | A model cannot observe your stopwatch. |
| **Choosing the ICP** | It's a business bet with a reset cost. A model asked to choose will drift toward whatever the last prompt emphasized — the precise failure audio 1 warns about. Force the choice to be explicit; don't make it. |
| **Finding the CTO** | LinkedIn extraction is blocked at three layers; no private contact harvesting. Manual paste, permanently. |
| **Sending anything** | Existing boundary. Copy-out only. |
| **The call itself** | Audio 4 is entirely soft-skill dependent — "if they're assholes I'd rather not." |
| **Setting the price** | Never let a model self-report a price the way it self-reports post quality. |

**No call recording or transcription is proposed.** Consent aside, `signal-room.md` forbids storing confidential prospect data at a URL that is *obscured, not authenticated*.

---

## 5. The blocking prerequisite

`/signal-room` has `robots: noindex` and **nothing else**. The sidebar admits it: *"This route is obscured, not authenticated."*

Stages 1–4 store your own research. Stage 7 stores **a prospect's revenue and cost figures** — exactly the confidential client data the doc forbids. So:

> **Add real auth over `/signal-room` and `/api/signal-room/*` before building the call stage.** A `proxy.ts` gate is enough. Alternatively store coarse bands rather than stated figures — but auth is the honest fix.

---

## 6. Build plan

Ordered by dependency and by value-per-unit-effort.

### Phase 0 — Auth gate · **S** · blocking for Phase 4
`proxy.ts` over `/signal-room` and `/api/signal-room/*`.

### Phase 1 — Lock the ICP · **M**
Resolves contradiction (a) and makes the ICP load-bearing instead of decorative.

- New table `signal_icp_profiles`: `version`, `statement`, `stages`, `regions`, `buyer_roles`, `disqualifiers`, `keyword_banks`, `measurable_weakness`, `is_active` (unique-where-active), `locked_at`.
- `signal_accounts` gains `icp_profile_id` + `disqualified_reason` + `target_role`.
- **`fit-score.ts` takes the ICP as a parameter** instead of module constants. Seed v1 with today's banks so scores don't shift.
- `discover/route.ts` derives stage/region from the locked ICP server-side; **400 if none is locked**.
- New `icp-panel.tsx`, fifth nav view. "Lock ICP" behind typed confirmation stating the reset cost.
- Fix `Today is 2026-07-27` in `ai.ts` → interpolated date. It's stale and silently biases "recent" trigger search.

### Phase 2 — Hands-on field test · **M** · ⭐ highest value
The keystone. Everything downstream is hollow without it.

- New `signal_observations` table: `flow`, `metric`, `value`, `unit`, `tier`, `cost_usd`, `raw_note`, `is_weakness`. Plus `signal_accounts.approx_users` (free text with provenance).
- New `POST /api/signal-room/test-plan` → `buildTestPlan()`. Proposes 3–5 things to try, the one number to measure each time, and a **`doNotDo` list** covering scripted access, load generation, and rate-limit evasion.
- `buildResearchBrief` gains a `FIRST-HAND OBSERVATIONS` input block. New instruction: *observations outrank inference; each hypothesis explaining an observation must reference it by id; **if no observations are supplied, do not describe any performance, latency, or reliability weakness**.*
- New "Field test" tab in `accounts-panel.tsx`.

### Phase 3 — Correction opener + tone lint · **M**
- New `POST /api/signal-room/outreach-message` → `buildCorrectionOpener()`. Returns the message in labeled parts: greeting, strengths, the one weakness with its number, hypothesis-as-guess, scaling question.
- Prompt fix: replace *"free of flattery"* with *"two or three genuine strengths drawn only from field-test observations or cited evidence; never unearned praise."*
- Constraints: exactly one weakness · hypothesis hedged (`"my guess is…"`) so a CTO who knows the real reason wants to correct it · no numbers absent from the field test · under 900 chars.
- **The one hard gate in the system:** if `usedProduct !== true`, refuse to emit the correction-bait variant. Everywhere else, advise. Here, block — the hook collapses without it, and an advisory check gets skipped every time.
- New `tone-checks.ts`, sibling of `getMeatChecks`: ≤2 negative markers, hedge present, no pressure language, no flattery opener, ≤900 chars.

### Phase 4 — Conversation capture · **M**
Where the methodology's actual product gets stored.

- New `signal_messages` table: `direction`, `channel`, `body`, `sent_at`, plus `ask_sent_at` on the account.
- New `POST /api/signal-room/analyze-reply` → classifies intent (`corrected_you | curious | dismissive | …`), extracts the **correction quote verbatim**, marks each hypothesis confirmed/refuted/open, pulls stated numbers verbatim (never estimates), flags ego risk, and answers **"does this justify asking for the call yet?" — defaulting to `not_yet`.**
- Conversation tab in `AccountDetail`. `AccountDetail` is already the largest component; split it into `account-detail/` before adding a fourth tab.

### Phase 5 — Call, cost math, close · **M–L** · requires Phase 0
- `signal_calls`: `monthly_spend_usd`, `spend_basis`, `waste_pct`, `waste_basis`, `reclaim_intent`, `revenue_now/target`, `cost_of_delay`, `outcome`. Plus `mutual_fit` on the account, and **finally an FK from `discovery_bookings` to `signal_accounts`**.
- **`cost-math.ts` — pure functions, no model.** Monthly/annual reclaim, capacity gain, payback vs price, cost-of-delay per month. Every figure carries a `basis` string so the UI can distinguish *their* number from *your* estimate — that distinction is what stops you getting corrected mid-call.
- `POST /api/signal-room/call-prep` — converts each architecture hypothesis into **a question that makes the prospect state a number out loud**, labeled with the cost-math field it fills. Produces questions, never numbers.
- `POST /api/signal-room/plan-90` — day-30/60/90 milestones, each an *outcome with proving evidence*, not an activity. Unvalidated hypotheses become explicit day-30 validation milestones. Never implies a price.
- `src/lib/signal-room/offers.ts` — the offer ladder as data with real price bands. **Business prerequisite, not a coding task.**

---

## 7. Sequencing

```
Phase 1 (ICP lock) ──► Phase 2 (field test) ──► Phase 3 (opener) ──► Phase 4 (replies)
                                                                          │
Phase 0 (auth) ─────────────────────────────────────────────────────► Phase 5 (call/close)
```

**If only one phase gets built: Phase 2.** The field test is the difference between outreach that earns a reply and outreach that doesn't. Phases 3–5 are amplifiers on evidence that Phase 2 produces; without it they amplify nothing.

---

## 8. Honest risks

1. **Tooling doesn't create the habit.** `trial_notes` is a text box; it does not make you sign up and time the thing. Building all five phases without changing the operator habit produces a well-instrumented pipeline for messages that still don't earn replies. Phase 2's hard gate is the only structural defense.
2. **The `fit-score` refactor changes the meaning of every stored score.** Backfill `icp_profile_id = v1` or accept that historical scores are only interpretable against v1.
3. **Booking↔account matching is heuristic.** Domain matching will produce wrong links. Confirm-don't-auto; log unmatched rather than guessing. Ship it last.
4. **Price is unresolved.** Audio 4's close needs a number. The strategy doc declines to publish one. Resolve before Phase 5.
5. **Discovery's `count: 3` is a coincidence.** It's a serverless timeout constant, not the methodology's "three targets." If you adopt three-per-batch as a rule, label it as one.

---

## 9. Boundaries this plan does not cross

Unchanged from `docs/signal-room.md`:

- Public web research only
- LinkedIn is manual paste/link only
- No private contact-data harvesting
- **No automated outreach or engagement** — every generated asset is copy-out
- No evasion of robots, access controls, rate limits, or publisher blocks
- No automated signup, scripted product use, or load generation against a prospect's product
- No call recording or transcription
- No Microsoft program lists, non-public startup information, or implied Microsoft endorsement

The methodology is compatible with all of these. What it asks for — that you personally use the product and measure one real thing — is *less* automated than what the system does today, not more. That is the point.
