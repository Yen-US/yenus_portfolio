---
title: Current State — Practice, Site, and Pipeline
status: snapshot
created: 2026-08-28
supersedes: "docs/sell/Consulting-Strategy.md (unadopted — see §8)"
review_after: after the first three real pricing conversations
---

# Current State

*What actually exists as of 28 Aug 2026, read off the codebase and the sell docs — not what was planned, and not what was aspired to.*

The purpose of this file is to be the one place that describes the practice as it is currently built, so the next strategy decision starts from evidence instead of memory.

---

## 1. The practice in one sentence

> Senior AI architecture judgment sold to funded startups making consequential inference and architecture decisions — delivered as fixed-scope sprints, sourced through a self-built outbound research system.

**Public positioning** (`src/lib/consulting-data.ts`, shipped in `bf4fd51`):

- Role: **AI Architecture & Technical Strategy for Startups**
- Credential: Senior AI Solution Architect supporting Microsoft for Startups globally via Accenture
- Location: Costa Rica, working globally
- Availability: one active sprint at a time, plus a small number of advisory relationships
- Current focus line: *"Helping Series B teams close the gap between AI ambition and GPU reality."* (review 2026-11-01)

There is a deliberate two-entity split: **Yenson** sells judgment, **Presencia Studio** holds engineering capacity. Presencia is never the default answer to an advisory engagement.

---

## 2. The offer ladder

Five engagements are published on the site. Prices are **not** rendered publicly — they live in `src/lib/signal-room/offers.ts` as internal planning bands.

| # | Engagement | Duration | Internal band | Upfront | Public? |
|---|---|---|---|---|---|
| 0 | Inference Risk Snapshot | 2 days | $2,500–3,500 | 100% | Ladder only — offered on a call |
| 1 | **Inference Readiness Review** | 1 week | $8,000–12,000 | 50% | **Featured** on site |
| 2 | AI Architecture Sprint | 2–4 weeks | — | 25% | Yes |
| 3 | AI Direction Sprint | 1–2 weeks | $3,500–6,000 | 25% | Yes |
| 4 | Fractional AI Architect | Ongoing, post-sprint | $4,000–9,000/mo | 50% mo. 1 | Yes |
| 5 | AI Engineering Enablement | 3–6 weeks | — | — | Yes |

Plus a **paid 90-minute working session at $500–750** as the floor rung, so "no budget" never ends a relationship with a good-fit team.

**Founding-client rate:** the Review at **$6,000** instead of $10,000, for the first two clients only, explicitly traded for a written referenceable outcome.

**Opening price:** $10,000, sliding to $12,000 for a recently-funded Series B and $8,000 for Series A. Pre-production teams are declined.

> ⚠️ Every number above is **reasoning, not market data**. An attempt to source 2026 comparables for AI audit pricing returned nothing usable — this market prices privately. Rewrite §3 of the playbook after three real pricing conversations.

---

## 3. Proof on hand

Two case studies, both in the Context / Decision / Constraints / Architecture / Tradeoffs / Result / Ownership shape:

1. **YC startup migration** (anonymized) — Vercel + GCP → Azure. Full stack moved in **7 days, zero customer-visible downtime**, team kept the runbook.
2. **Amplification Of Potential** (named) — live-event AI conversation prompts. **<2.5s p95**, **<$1 inference per event**, **zero PII in the model payload**, deterministic fallback path.

Plus operator proof: Presencia Loyalty (live wallet-based loyalty SaaS) and the Junior Rodríguez NFC product experience.

**The gap:** the site now leads with the Inference Readiness Review, and neither case study is an inference-readiness engagement. The featured offer has no proof behind it. That is the weakest point of the current page, and it closes the moment the first Review completes.

---

## 4. The Signal Room

A private, authenticated outbound workspace at `/signal-room`, built as the sourcing engine for the offer above. The full pipeline exists end to end:

```text
Discover → Research → Field test → Opener → Reply analysis
    → Call prep → Cost math → 90-day plan → Proposal
```

**Shipped surface**

- **Auth** — `src/proxy.ts` gates `/signal-room/*` and `/api/signal-room/*`. Single shared passphrase, HMAC-signed cookie over Web Crypto, 14-day session, **fails closed** if `SIGNAL_ROOM_PASSWORD` is unset. This closed the one genuine liability on the backlog.
- **6 ICP presets** — `inference-readiness` (first), `prototype-to-production`, `agent-reliability`, `rag-vertical`, `post-raise-scaling`, `cost-latency-pressure`.
- **Discovery** with multiple search angles and website resolution.
- **Research** producing source-backed account briefs (~30s each).
- **Field test plans** — the methodology's load-bearing step: measure one number yourself before writing.
- **Opener generation** — *refuses to generate without a logged observation on file, by design.*
- **Post Lab** — 4 formats, pillar rotation, ~10 tone checks (no-hype, no-bait, unsourced-figures, claim ledger, paragraph rhythm, punctuation voice…), LinkedIn character-limit handling, and **image generation**.
- **Autopilot** — picks the topic with no operator input, assembling evidence deterministically from account briefs while a model only picks the angle. Existing posts act as a negative constraint so an argument is never repeated.
- **Calls tab** — cost math, 90-day plan, proposal draft, offer picker wired to the ladder.
- Schema validation that truncates lists rather than rejecting; score clamping; timeout and retry tuning on the long model calls.

**The methodology it encodes** (extracted from four WhatsApp audios, 2026-08-11): *setting* — lock ICP → use the product and measure → correction-bait opener with exactly one observed weakness → the scaling question → the ask → call as cost math → close. The message earns a reply because it contains a number you personally observed plus a plausible-but-wrong guess about the cause. The CTO replies **to correct you**, and that correction is the funnel's most valuable input.

---

## 5. Open backlog

Ordered by what costs money, from `signal-room-backlog.md` with the auth item now resolved:

| # | Item | Why it matters |
|---|---|---|
| 1 | **Follow-up queue** | `account.askSentAt` is written and read by nothing. The 6-business-day follow-up rule lives only in your head. ~60 lines. Highest ROI on the list. |
| 2 | **Proposal generator upgrade** | Missing scope exclusions (`outOfScope` is computed but unused), what's needed to start, and a **held start date** — which is how the playbook actually closes. |
| 3 | **Objection rehearsal** | 7 playbook responses exist; nothing drills them against a *specific* account brief and price. |
| 4 | **Field-test tuning** for the inference ICP | Should measure TTFT, cache warming on repeat requests, cold start after idle — the exact numbers the opener quotes. |
| 5 | **Target-list critique pass** | Nothing ranks which 5 of 15 to field-test first beyond keyword `fitScore`. |
| 6 | **Third case study** | Blocked until the first Review completes. Get written permission as part of closing, not after. |

**Deliberately not on the list:** more AI generators. The pipeline is complete; every gap above is a *connection* between steps that already work.

---

## 6. Content

- **`yenus-inference-readiness-post.md`** — "The Inference Bill Comes Due", drafted for yenus.dev + LinkedIn. **Not published.** One `[VERIFY]` placeholder remains; publishing rules require every pattern to be one personally seen at least twice, and no invented numbers.
- **`upwork-profile.md`** — a separate, narrower positioning as *"a senior AI engineer who can architect and ship reliable LLM systems"*, leading with hands-on delivery rather than consulting. A deliberate channel-specific compression, not a contradiction.
- **`inference-readiness-playbook.md`** — the close playbook: pitch, four refusal framings, pricing ladder, the fixed 30-minute first-call structure, 7 objection responses, disqualification rules.

---

## 7. Honest status

**Built:** positioning, a five-rung offer ladder, two strong case studies, a close playbook, a published-ready post, and a complete outbound research system with auth.

**Not yet true:**

- **Zero closed revenue on this offer.** No Inference Readiness Review has been sold or delivered.
- **Zero validated prices.** Every band is derived reasoning.
- **The post is unpublished**, so the top of the funnel isn't running.
- **The featured offer has no case study**, which is the first thing a sophisticated buyer will notice.
- **The naming is unvalidated.** "Inference Readiness Review" is a working title — listen for which phrase founders repeat back on the first three calls and rename to match.

**The shape of the risk:** this is a high-ticket, low-volume motion with a long feedback loop, and the loop has not yet run once. Everything built so far is upstream of the first real conversation. The next unit of work that changes anything is a *sent message*, not a shipped feature.

---

## 8. The 48-hour list

Unchanged from the playbook, and still the correct next action:

1. **Pick the price you'll say out loud** — $10,000, or the $6,000 founding rate. Decide now, not on the call. Hesitation on a number is audible.
2. **Write the confidentiality firewall statement** — two sentences, memorized. You will be asked on the first call.
3. **Publish the post.** Replace or cut the remaining `[VERIFY]`.
4. **Build the 15** with the `inference-readiness` preset. Every row needs a specific signal.
5. **Field-test the top 5** before writing a single message.
6. **Send 5.** Read the replies. Adjust. Then send the rest.

---

## Appendix — a note on `Consulting-Strategy.md`

An untracked doc dated 2026-08-27 proposes a different business: a **$150 Fix Plan** sold to boutique hotels, restaurants, and surf schools in Tamarindo via WhatsApp, with "Consulting fixes the digital processes that slow growing businesses down" as public positioning and the Fix Plan as the site's primary CTA.

It contradicts everything in §1–§4 above: different buyer, different price by two orders of magnitude, different channel, different positioning. Its §11 action 1 would replace the positioning shipped in `bf4fd51`.

**Recorded as considered and not adopted.** Two things in it are worth keeping regardless:

- Its **delivery template** discipline — *"do not invent savings or percentages; if no baseline exists, recommend measuring it first"* and *"a recommendation not to build strengthens trust"* — which matches the intellectual honesty already in the playbook.
- Its **boundaries**, especially *"do not let this become five different companies at once."*

The legitimate need underneath it — **a faster feedback loop than a high-ticket outbound motion provides** — is real. The answer is the existing lower rungs (Snapshot at $2,500–3,500, working session at $500–750) pointed at the **same** ICP, not a second brand aimed at a different market. Local cash-flow work, if taken, stays unbranded and off the site.
