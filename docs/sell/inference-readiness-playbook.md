# Inference Readiness Review — Close Playbook

*Yenson Umaña · Aug 2026 · internal, never sent to a prospect*

> **Provenance warning, read once.** Every number in this document is derived from *reasoning* — offer-ladder position, scope, and defensible ROI logic — not from market research. An attempt to source 2026 comparables for AI audit pricing returned nothing usable; two of the highest-profile independents in this space publish no rates at all, and one has exited consulting. This market prices privately.
>
> Treat these as **opening positions to test**, not validated bands. After three real pricing conversations you will know more than any research would have told you. Update this file then.

---

## 1. The one-sentence pitch

> "I run a one-week review that tells you where your inference path breaks if your provider throttles, what it actually costs you per request, and which model calls you could safely downgrade — with the eval evidence to prove it."

**Why this lands:** three concrete artifacts, one week, no ambiguity about what arrives. It does not ask them to believe anything about you. It describes an object.

**What to never say:** "audit," "assessment," "help you think through." Audit implies compliance and defensiveness. Assessment implies opinion. Help-you-think-through is unpriceable.

---

## 2. Why it should sound stupid to say no

You asked for framing that makes refusal hard. Here is the honest version — and one caveat first.

**The caveat that makes the rest work:** you cannot make it *stupid* to say no. You can make the *cost of the status quo* visible and the *cost of finding out* small. If a prospect says no to that, they have told you the problem isn't live yet, and that is genuinely useful information. Chasing them past that point is what turns a good offer into a bad reputation.

With that said, four framings, ranked by how well they hold under pressure:

### A. The asymmetry frame (strongest)

> "One week of my time against one quarter of finding out the hard way. If I find nothing, you've bought certainty on the thing you were quietly worried about — and I'll tell you plainly that you're in good shape, which is worth knowing before the board asks."

This is the strongest because **it prices the downside case honestly**. Most consultants pretend there's no scenario where the work finds little. Naming it makes you credible and, counterintuitively, makes the yes easier — you have removed the buyer's main fear, which is paying for a report that says "you're fine."

### B. The decision-forcing frame

> "You have a model decision coming in the next 90 days whether you schedule it or not. Either you make it with evidence in week one, or you make it under a deadline in month three. The decision is the same. The conditions are not."

Works when they have already named a live decision. Do not use it before they have — otherwise you are inventing urgency, and sophisticated buyers detect that instantly.

### C. The board frame

> "This produces something your board can read. Most inference risk lives in engineering's head, which means it's invisible upward until it's an incident."

Strong with CTOs who have a board seat or report to one. Weak with founding engineers, who don't care.

### D. The comparison frame (use last)

> "This costs less than two weeks of one senior infra hire, and you'll know in a week rather than a quarter."

Effective but it anchors you against salary, which caps you at a number lower than the value. Reach for it only when price is the last obstacle.

**The move that actually closes:** on the discovery call, get them to say the problem out loud in their own words. A problem they articulated is a problem they own. A problem you articulated is a problem they can dispute. Ask, then be quiet.

---

## 3. Pricing ladder

Four rungs. Purpose is to always have somewhere to go rather than discounting the top rung.

| # | Offer | Duration | Price (USD) | Upfront | Use when |
|---|---|---|---|---|---|
| 0 | **Inference Risk Snapshot** | 2 days | **$2,500–3,500** | 100% | Budget genuinely absent; keeps the door open |
| 1 | **Inference Readiness Review** | 1 week | **$8,000–12,000** | 50% | The default. Lead with this |
| 2 | **Review + Implementation Sprint** | 1 wk + 2–3 wks | **$22,000–35,000** | 40% | They want the fix, not just the map |
| 3 | **Fractional AI Architect** | Ongoing, post-review | **$4,000–9,000/mo** | 50% mo. 1 | Decisions keep arriving after you leave |

### Where to open

**Open at $10,000.** Reasoning: the middle of the band reads as a considered price rather than a negotiating position. $8,000 leaves money on the table with a funded Series B; $12,000 invites procurement scrutiny that slows a deal you want to close on the first call.

**Sliding rule by stage:**
- Series B, funded in last 12 months → **$12,000**, no hesitation in your voice
- Series A → **$8,000–10,000**
- Seed with real production volume → **$8,000**, and consider the Snapshot instead
- Anyone pre-production → **decline**. This offer does not fit and taking it produces a bad case study

### On the 50% upfront

Higher than the 25% elsewhere in your ladder, deliberately. A one-week engagement has no time to recover from a slow payer, and 50% on a $10k engagement is $5,000 — small enough not to be a procurement event, large enough to guarantee the week is real. If they resist, hold. Resistance to 50% on a one-week fixed scope is a signal about the buyer, not the price.

### On discounting

**Do not discount the Review.** Move down the ladder instead. A discounted $10k review tells the buyer the price was arbitrary, which makes every future number you quote negotiable. A $3,000 Snapshot tells them scope maps to price. Same revenue outcome this quarter; completely different position next quarter.

The one exception: **first client**. See §7.

---

## 4. Cheaper options (the downgrade path)

The Snapshot exists for one reason: *never lose on budget alone.*

**Inference Risk Snapshot — 2 days, $2,500–3,500, paid in full upfront**

Delivers a genuine subset, not a teaser:
1. Quota and provider risk map — the single points of failure, named
2. Top three model-substitution candidates, with the eval each would require
3. One-page recommendation memo

Explicitly excluded: latency decomposition, fallback architecture, the 90-day sequence.

**How to offer it without devaluing the Review:**

> "If the full week isn't approvable this quarter, there's a two-day version — the risk map and the top substitution candidates. It won't give you the latency decomposition or the 90-day plan, so it's a smaller answer to a smaller question. But it will tell you whether the bigger question is worth asking."

That last sentence is the whole mechanism. The Snapshot is positioned as *qualification for the Review*, so taking it is a step toward you, not away.

**Conversion expectation:** a Snapshot that finds something real converts to a Review often. One that finds nothing means you correctly avoided a bad week. Both outcomes are good, which is why this rung is safe to offer.

**A third option if they still can't move:** a paid 90-minute working session at **$500–750**. Not a deliverable — a live decomposition of their inference path on a call, with a written summary after. This exists purely so that "no budget" never ends a relationship with a good-fit team.

---

## 5. The first call — 30 minutes, sharp

Structure is fixed. Do not improvise the order; the sequence is what produces the close.

**Minutes 0–2 · Frame**
> "Thirty minutes. I want to understand your inference path, and by the end we'll both know whether this is worth doing. If it isn't, I'll say so."

Permission to disqualify, given up front, is what removes their defensiveness. It is the highest-leverage 15 seconds of the call.

**Minutes 2–15 · The four questions** *(from the offer kit — do not add a fifth)*
1. What does your production inference path look like today? *(model, provider, rough volume, latency SLO)*
2. What failure mode worries you most in the next 90 days?
3. What have you already tried, and what did you learn?
4. If we ran this next week, who owns the decisions after I leave?

**Listen for these, they are your close material:**
- Any "we've been meaning to look at that" → the problem is acknowledged and unowned. Best signal on the call.
- Any number they cannot produce → cost per request, quota ceiling, TTFT breakdown. Each absent number is a line item in the proposal.
- Any single-provider dependency stated casually → §2 of the post, live.
- **Cannot answer Q4** → not ready. Say so. See §8.

**Minutes 15–22 · Play back, do not pitch**
> "Let me say back what I heard. You're running {model} through {provider} at roughly {volume}. The thing you're most worried about is {their words, exactly}. You've tried {X}, and it told you {Y}. And {name} would own what comes next."

Playing back their own words in their own vocabulary is the mechanism. Do not improve their phrasing. Their phrasing is what they'll repeat to their co-founder after the call.

**Minutes 22–27 · The offer, once**
> "Here's what I'd do. One week. You'd get {name the 2–3 deliverables that map to what they actually said}. Fixed scope, fixed price — $10,000, half up front. No retainer tail unless you want one.
>
> If I find you're in good shape, I'll tell you that plainly, and you'll have that in writing for your board."

Then **stop talking.** The first person to speak after a price loses the negotiation. This is the hardest discipline on the call and the one that matters most.

**Minutes 27–30 · Close on a date, not a decision**
> "Want me to send the one-page scope today, and we hold a start date for {specific date}? The date releases if you decide against it."

Asking for a *held date* rather than a *yes* is materially easier to agree to and produces a real commitment. A held date creates a natural follow-up that isn't nagging.

---

## 6. Objection handling

| They say | You say | Why it works |
|---|---|---|
| **"We can do this internally."** | "You probably can. The question is whether it happens before the decision arrives — it's usually the thing that stays on the roadmap because nothing is on fire yet. I'm buying you the calendar, not the capability." | Concedes competence, reframes to sequencing. Never argue they can't. |
| **"$10k is a lot for a week."** | "It is a week of my time and about eighteen months of pattern. If it's genuinely outside budget there's a two-day version at $3,000 — smaller answer, smaller question." | Justify with pattern, not hours. Move down the ladder, don't discount. |
| **"Send us a proposal."** *(often a soft no)* | "Happy to — one page, today. So it's the right one: is the thing you'd take to your team the quota risk, or the cost per request?" | Forces a specificity that reveals whether it's real interest or a polite exit. |
| **"We need to think about it."** | "Of course. What's the part you're least sure about?" | Surfaces the actual objection, which is never the stated one. |
| **"What if you don't find anything?"** | "Then I write that down and you have it for your board. That's a real outcome — most teams don't know which of their worries are real." | Do not promise you'll always find something. That promise cheapens the finding. |
| **"How do we know you won't share our details?"** | "Same way every other team does: I never carry specifics between engagements. That constraint is why you can talk to me openly. It's also why I can only tell you about patterns, never about anyone else's stack." | The firewall is the credential. Deliver it as strength, not apology. |
| **"Can you start Monday?"** | "Yes." | Do not manufacture scarcity you don't have. |

---

## 7. First-client adjustment

You have not closed one yet. That changes exactly two things and nothing else.

**One-time founding-client rate: $6,000** — offered explicitly and once:

> "I'm building the case-study set for this specific review. I'll do the full week at $6,000 instead of $10,000, and in exchange I'd want a written outcome I can reference — anonymized if you prefer. That rate is for the first two teams."

**Why it's safe to name the discount:** naming the reason preserves the anchor. An unexplained $6,000 *is* your price. A $6,000 with a stated reason and a stated expiry is a $10,000 price with a temporary condition. The distinction is the entire difference between a founding rate and a permanent one.

**Do not** discount below $6,000, extend past two clients, or offer it to a team that clearly has budget. A well-funded Series B offered a founding rate reads as desperation, not generosity.

---

## 8. Disqualify fast

Walking away is a pricing decision. The engagements that go badly are the ones you should have declined.

**Decline when:**
- No production inference path — the entire deliverable is inapplicable
- Cannot name who owns decisions after you leave — the work will not land
- Wants a code audit or a rewrite — different offer, and you'd be underpriced
- Wants hourly, or wants to expand scope pre-signature — the engagement is already failing
- Inference is fully abstracted by a vendor with no infrastructure decisions of their own

**How to decline well:**
> "Honestly, I don't think this is the right time for it — {reason}. When {specific condition} is true, it becomes a good fit. Want me to check back then?"

A clean decline generates referrals at a surprising rate. Founders remember the consultant who talked them out of spending money.

---

## 9. Running this in the Signal Room

Wired and typechecked. The mechanics:

**Offers** — `src/lib/signal-room/offers.ts` now carries `Inference Readiness Review` (1 wk, $8–12k, 50% upfront) and `Inference Risk Snapshot` (2 days, $2.5–3.5k, 100% upfront). Both appear in the Calls tab offer picker. Adjust bands there as real conversations teach you.

**ICP preset** — `inference-readiness` is the first preset in the Discover panel. Series A/B only, three search angles: public GPU/inference/serving discussion, inference-infra hiring, and recent latency/TTFT engineering posts. Disqualifiers explicitly exclude pre-PMF and vendor-abstracted teams so they never reach your list.

**The measurable weakness** — TTFT and end-to-end latency on their core AI action, several runs, plus whether repeated identical requests get faster. This is what the opener needs: an observation you made yourself, not a claim you read. **Run it before writing.** The opener step will refuse to generate without an observation on file, by design.

**The wave:**
1. Discover → preset `inference-readiness` → all three angles → target ~15 names
2. Research → source-backed brief per account (~30s each)
3. Field test → measure the latency weakness yourself, log the observation
4. Opener → generate → **read it aloud before sending**
5. LinkedIn, manually, ~5/day. Not 15 in one afternoon.

**Set your real prices in `offers.ts` before the first call.** The bands there are my reasoning, not your market data.

---

## 10. The 48-hour list

1. **Pick the price you'll say out loud.** $10,000 or the $6,000 founding rate. Decide now, not on the call — hesitation on a number is audible and it is the single most expensive tell in the conversation.
2. **Write the firewall statement** — two sentences, memorized. You will be asked on the first call.
3. **Publish the post.** Strip anything you can't defend, replace or cut every `[VERIFY]`.
4. **Build the 15.** Discover with the `inference-readiness` preset. Every row needs a specific signal or it doesn't go on the list.
5. **Field-test the top 5** before writing a single message.
6. **Send 5.** Not 15. Read the replies. Adjust. Then send the rest.

---

## Open items

- **Prices are reasoning, not research.** Rewrite §3 after three real pricing conversations.
- **`/signal-room` is still unauthenticated.** The Calls tab stores prospect financials — monthly spend, revenue, waste estimates. Put auth in front of it before you type a real prospect's numbers into it. This is the only item here that is a genuine liability rather than a refinement.
- **Naming is unvalidated.** "Inference Readiness Review" is the working title. Listen for which phrase founders repeat back on the first three calls, and rename to match their words.
