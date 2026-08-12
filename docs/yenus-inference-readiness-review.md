# Inference Readiness Review — Offer + Outreach Kit

*yenus.dev · Yenson Umaña · drafted Aug 12 2026*

---

## 1. Positioning (the wedge)

**The signal:** Series B AI startups are hitting the same wall right now — GPU quota waits, model-availability caps, inference cost blowing up unit economics, latency SLOs quietly missed because fallback paths weren't designed for the current provider landscape.

**The unfair advantage:** I sit inside Microsoft for Startups via Accenture. I'm seeing the *shape* of this problem across dozens of teams every month. Not any single team's data — the pattern.

**The offer:** a diagnosis I already made before they hired me, packaged as a fixed-scope, fixed-price artifact a CTO can forward to the board.

**Ethics fence (non-negotiable):** Nothing learned inside Microsoft/Accenture leaves. The pitch sells *pattern recognition* — "I've seen this shape 40 times" — never *identification*. If a specific team's specifics ever show up in outreach, the whole positioning collapses.

---

## 2. The Artifact — "Inference Readiness Review"

**Format:** 1 week. Fixed scope. Fixed price. Named deliverable.
**For:** Series B AI-native teams with a production or near-production inference path.
**Not for:** Pre-PMF, no live workload, or teams still choosing a first model.

### What the team gets

1. **Quota & provider risk map** — where the current stack breaks if the primary provider throttles, deprecates a model, or waitlists a quota bump. Named single points of failure.
2. **Model-substitution matrix** — for each production prompt/agent path: which calls survive a swap to a smaller / cheaper / open-weight model, which don't, and what the eval evidence would need to look like to make the swap safely.
3. **Latency budget breakdown** — time-to-first-token and end-to-end latency decomposed by hop (retrieval, guardrail, model, post-process). Where the budget is actually being spent vs. where the team thinks it is.
4. **Cold-start & fallback strategy** — what happens on provider outage, rate-limit spike, or regional degradation. Deterministic fallback paths where the moment can't be missed.
5. **Provider portfolio recommendation** — primary / secondary / escape-hatch, with the reasoning written down and the switching cost estimated.
6. **90-day sequence** — ordered, owner-assigned, decision-gated. Not a wishlist.

### What it is not
Not a code audit. Not a security review. Not a rewrite. Not a vendor pitch. Not billable hours dressed up as a deliverable.

### Pricing anchor
Fixed price. Positioned against the cost of *one week of a wrong quota bet* — which for a Series B running production inference is typically $15k–$60k in burnt spend or missed SLO. Price the review well below that number. (Draft range: $8k–$12k USD; tune after first 3 sales conversations.)

---

## 3. Lead Magnet — the post that does the outreach for you

**Title (working):** *"What I'm seeing across AI startups fighting for GPU quota in Q3 2026"*

**Shape:**
- 800–1,200 words. Published on yenus.dev + LinkedIn.
- Anonymized, specific, useful. Zero name-drops.
- Structured as 5–7 *patterns*, each with (a) what the team believed, (b) what actually broke, (c) what the fix shape looks like.
- Ends with a soft line: *"If any of that sounds familiar, I run a one-week Inference Readiness Review — link."*

**Why this works:** the post *is* the outreach. Founders read it, recognize themselves, DM you. Inbound at senior positioning beats a hundred cold notes.

---

## 4. Outreach — surgical, not volume

**Target list:** 15 named Series B AI-native companies. Selection filter (need at least one):
- Public post / talk about their AI stack in the last 90 days
- Job listing that screams the problem (Inference Engineer, Platform Engineer w/ vLLM, GPU Ops)
- Mutual connection who can warm the intro
- Product that visibly depends on a model you know is quota-constrained

**Do not:** blast Series B lists, use templated tooling, or send more than 15 in the first wave.

### Cold DM / Email template

> **Subject:** Quota, TTFT, and the trade nobody's writing down
>
> {First name} —
>
> I spend my week inside the AI startup portfolio at Microsoft for Startups (via Accenture), and the same wall keeps showing up: quota waits stretching product timelines, model-substitution decisions being made under budget pressure without eval evidence, and latency budgets that look fine on paper until the first regional throttle.
>
> I'm not writing to sell you a platform. I'm writing because {specific signal you observed about their company — post, talk, listing, product behavior} suggests you may be inside one of those trade-offs right now.
>
> I package this as a one-week **Inference Readiness Review** — quota risk map, model-substitution matrix, latency decomposition, fallback strategy, and a 90-day sequence your team owns after I leave. Fixed scope, fixed price, no retainer tail unless you want one.
>
> If the shape sounds right, I'll send a 1-page scope and we can decide in a 30-minute call whether it fits.
>
> — Yenson
> yenus.dev

**Rules:**
- The `{specific signal}` line is non-optional. If you can't write it, they're not on the list.
- No calendar link in the first message. Reply-to-book raises quality.
- One follow-up after 6 business days, then drop.
- If they reply and it's clearly not fit, refer them somewhere useful. Reputation compounds.

### LinkedIn variant (shorter)

> Saw {specific signal}. I'm seeing the same quota / inference / model-substitution pressure across the AI startup portfolio at MS for Startups this quarter — enough of a pattern that I packaged the diagnosis as a fixed one-week review. If it's a live problem for you, worth 20 min? — Yenson, yenus.dev

---

## 5. Discovery call — 30 minutes, 4 questions

1. **What does your production inference path look like today?** (Primary model, provider, rough QPS, latency SLO.)
2. **What's the failure mode you're most worried about in the next 90 days?** (Quota, cost, latency, model deprecation, eval drift.)
3. **What have you already tried, and what did you learn from it?**
4. **If we ran this next week, who on your team owns the decisions after I leave?**

If they can't answer #4, the engagement isn't ready. Say so.

---

## 6. Adjacency — the natural next lanes (do not lead with these)

- **Performance & TTFT tuning** — sells the *retainer*, not the first meeting.
- **Eval architecture** — pairs with model substitution; introduce inside the review.
- **Fractional AI Architect** — the retainer shape from yenus.dev; the Inference Readiness Review is the natural front door to it.

Urgent (quota) sells the first meeting. Important (perf, eval) sells the second engagement. Keep them in that order.

---

## 7. What Jarvis flagged as risks

- **The Microsoft/Accenture firewall.** Draft a 2-sentence public statement about how you handle information from the day job before the first outreach goes out. Have it ready if a founder asks. This *protects* the positioning — senior architects handle this cleanly; consultants get vague.
- **"Almost every Series B" is the wrong volume.** 15 surgical > 100 templated. Compounding beats coverage at this positioning tier.
- **Naming.** "Inference Readiness Review" is the working title. Alternatives to test: *Compute & Latency Audit*, *Inference Architecture Review*, *Quota Risk Review*. Pick after the first 3 discovery calls tell you which phrase founders repeat back.

---

## 8. Next actions (in order)

1. Lock the artifact name + price (48h).
2. Draft the lead-magnet post (this week).
3. Build the 15-name target list w/ specific-signal column (this week).
4. Send wave 1 of outreach (next week).
5. First discovery calls → tune scope + price → publish post → open inbound.
