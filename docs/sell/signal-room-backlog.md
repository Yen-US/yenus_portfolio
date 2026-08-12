# Signal Room — Backlog

*Saved Aug 12 2026. Ordered by what actually costs money, not by effort.*

Context: the Signal Room pipeline is complete end to end — discover → research → field test → opener → reply analysis → call prep → cost math → 90-day plan → proposal. These are the gaps in that pipeline, not new surface area.

---

## 0. Add auth over `/signal-room` — **liability, not a feature**

There is no `middleware.ts`. The route is `noindex` and unlinked, which is obscurity, not access control. The sidebar already admits this: *"This route is obscured, not authenticated."*

The Calls tab stores prospect monthly spend, revenue figures, and waste estimates. Right now those sit behind a public URL.

Do this before typing a real prospect's numbers into it. It is smaller than every other item here.

---

## 1. Follow-up queue

`account.askSentAt` is written by `conversation-view.tsx` and read by nothing.

The playbook rule — *one follow-up after 6 business days, then drop* — currently lives in your head. A message sent and forgotten is the most common way a warm lead dies.

Build: a "waiting on reply" view with day counts, sorted by staleness, flagging anything past 6 business days. Roughly 60 lines. Highest ROI on this list.

---

## 2. Upgrade the proposal generator

`call-panel.tsx` builds `proposalText` from milestones plus a price. That is not what you send after a call that went well.

Missing:
- Scope boundary and explicit exclusions (the plan already returns `outOfScope` — it is not in the proposal text)
- What you need from them to start
- **A held start date.** The playbook closes on a date rather than a decision, and the generator cannot currently express one.

---

## 3. Objection rehearsal

Seven objection responses are written in `docs/sell/inference-readiness-playbook.md` §6. The Signal Room cannot drill you on them against a *specific* account.

Build: a `setting-ai` function taking an account brief plus the chosen price, returning the three likeliest objections from that particular CTO, and grading a drafted answer against the playbook responses.

This is what makes the first call sharp instead of improvised.

---

## 4. Tune the field-test plan for the inference ICP

`buildTestPlan` proposes generic latency tests. For `inference-readiness` it should specifically measure:
- Time to first token on the core AI action
- Whether repeated identical requests get faster (cache behaviour)
- Cold-start on first request after idle

These are the exact numbers the opener needs to quote, and the ICP preset's `measurableWeakness` already names them.

---

## 5. Target-list critique pass

Discovery has no "why is this a weak target" step. You will build 15 names with nothing ranking which 5 to field-test first beyond `fitScore`, which is keyword matching.

Build: a critique pass naming the weakest signal per row, so the first five you test are the five most likely to reply.

---

## 6. Second case study — *blocked until the first review completes*

`consulting-data.ts` `proof[]` currently holds two entries: `yc-migration` and `aop-beacon`.

When the first Inference Readiness Review finishes, publish it as a third, in the existing Context / Decision / Constraints / Architecture / Tradeoffs / Result / Ownership shape (`caseFields`). Anonymize if the client prefers — `yc-migration` already shows that pattern working.

**Why it matters:** two case studies is a portfolio, one is a fluke. The landing page now leads with an offer that has no proof behind it, which is the weakest point of the current page.

Get written permission to reference the outcome as part of closing the engagement, not after it. The playbook's founding-client rate (§7) already trades the discount for exactly this.

---

## Not on this list, deliberately

**More AI tools.** The pipeline is complete. Every gap above is a *connection* between steps that already work, or a guardrail on one. Adding a ninth generator would add surface area without adding a close.

**Price validation.** The bands in `offers.ts` are reasoning, not market data — an attempt to source 2026 comparables found that this market prices privately. Three real conversations will teach you more than research would. Update `docs/sell/inference-readiness-playbook.md` §3 then.
