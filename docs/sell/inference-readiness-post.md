# The Inference Bill Comes Due

*Draft for yenus.dev + LinkedIn · Yenson Umaña · Aug 2026*

> **Publishing rules before you post.**
> 1. Every pattern below must be one you have personally seen at least twice. Delete any you cannot defend in a call. A pattern you cannot defend becomes an objection you cannot answer.
> 2. No company is named, described specifically enough to identify, or numerically fingerprinted. The value is the *shape*, never the source.
> 3. Numbers marked `[VERIFY]` are placeholders. Replace with your own observed ranges or cut the sentence. Do not publish an invented number — one wrong figure in public costs more than the post earns.

---

## The post

There is a specific conversation I keep having, and it always starts the same way.

A team ships an AI product. It works. Customers use it. Then usage grows, and something that was never a decision — which model, which provider, how many hops before the first token — turns into the most expensive thing on the engineering roadmap. Nobody chose it. It accumulated.

I spend my weeks around AI-native startups, and the failure isn't ignorance. These are strong teams. The failure is that inference decisions get made *once*, early, under different constraints, and then never revisited until something breaks in production.

Here is the shape it takes.

---

### 1. The quota assumption that was never an assumption

A team picks a provider during prototyping, when quota is irrelevant because volume is a rounding error. Eighteen months later that provider is load-bearing for the entire product, and the quota ceiling is a number nobody has looked up.

Then a customer signs that triples volume in a week.

What they believed: capacity scales when we need it.
What actually broke: quota increases are a queue, and the queue does not care about your launch date.
The fix shape: know your ceiling and your time-to-raise-it *before* you need it. Both numbers, written down. Most teams cannot produce either on demand.

### 2. One provider, three failure modes, no fallback

Single-provider concentration reads as a cost decision. It is actually an availability decision, and teams price only the first one.

The three ways it breaks are unrelated to each other: a rate-limit spike during your traffic peak, a model deprecation with a migration window shorter than your eval cycle, and regional degradation that your monitoring reports as "elevated latency" rather than an outage.

What they believed: our provider has good uptime.
What actually broke: uptime was fine. Availability *of the specific model at the specific rate we needed* was not.
The fix shape: a named secondary and a named escape hatch, with the switching cost estimated in advance. Not implemented necessarily — *estimated*. The estimate is what lets you decide under pressure.

### 3. The model-substitution question nobody can answer

Ask a team which of their production calls could run on a smaller model and you get one of two answers. Either "probably most of them" or "we'd have to test." Both mean the same thing: no evidence exists.

This matters because substitution is the largest cost lever available, and it is almost always blocked not by technical difficulty but by the absence of an eval that would make the swap *safe to approve*.

What they believed: we can downgrade models when cost becomes a problem.
What actually broke: cost became a problem, and nobody could sign off on the swap, because the only thing worse than a big inference bill is a quality regression you shipped to your largest customer.
The fix shape: build the eval before you need the swap. The eval is not a quality project. It is a purchasing option.

### 4. The latency budget is spent somewhere else

Teams optimize the model call. The model call is frequently not the problem.

When I decompose an end-to-end path by hop — retrieval, guardrail, model, post-process, serialization — the distribution rarely matches what the team expects. Retrieval and guardrail hops in particular have a way of quietly accumulating, because each one was added for a good reason and none was measured against a budget.

What they believed: we're slow because the model is slow.
What actually broke: time-to-first-token was fine. The hop *before* the model was doing more work than anyone had looked at in a year.
The fix shape: decompose before optimizing. The measurement takes an afternoon and routinely relocates the entire problem.

### 5. Cost per request is not a number the team has

Almost every team can tell you their monthly inference spend. Far fewer can tell you cost per request, and fewer still can break it down by feature.

This is the difference between a bill and a model. With a bill you can only react. With a model you can predict — which is what you need when someone asks whether the enterprise tier is profitable at the price you just quoted.

What they believed: we know what inference costs us.
What actually broke: they knew the total. They did not know that one low-traffic feature was consuming a disproportionate share, because nothing attributed spend to features.
The fix shape: attribute cost per request per feature. The first time a team does this, something surprising always turns up.

### 6. Fallbacks that fail in the same direction

The teams that *do* have fallbacks often have fallbacks pointed at correlated failure modes — a secondary model at the same provider, or a retry policy that amplifies load during exactly the rate-limit event it was meant to survive.

What they believed: we have a fallback.
What actually broke: the fallback shared a failure mode with the primary, so it was unavailable at precisely the moment it was needed.
The fix shape: fallbacks must be *uncorrelated*. Different provider, different region, or a deterministic non-AI path for the moments that cannot be missed. And the retry policy needs a circuit breaker, or it becomes the incident.

---

## What these have in common

None of these is a hard engineering problem. Every one is a decision that was made implicitly, under constraints that no longer hold, and never written down anywhere someone could revisit it.

That is why they surface as surprises. Not because the teams are careless — because there is no artifact that says *here is what we chose, here is why, here is what would make us choose differently*. Without that artifact, every one of these becomes visible only on the day it breaks.

Writing it down takes about a week. Finding out the hard way takes a quarter.

---

*I run a one-week Inference Readiness Review for AI teams with a production inference path: quota risk map, model-substitution matrix, latency decomposition, fallback strategy, and a 90-day sequence your team owns after I leave. Fixed scope, fixed price. If two or more of the above sounded familiar, it's probably worth a conversation — yenus.dev*

---

## Notes on why this post is built this way

**Why patterns, not advice.** Advice invites disagreement. Patterns invite recognition. A reader who recognizes themselves in #3 has already done your qualifying for you — and arrives at the call having self-diagnosed, which is the single biggest predictor of a fast close.

**Why the "what they believed" structure.** Each pattern names a belief the reader probably holds *right now*. That is the mechanism. The discomfort of reading your own current belief in the past tense is what produces the DM.

**Why no numbers in the body.** Specific figures invite "that's not our experience" and expose you to any single case that contradicts. Shapes are harder to argue with and safer given where you work.

**Why the CTA is conditional.** "If two or more sounded familiar" filters. A reader who recognized one pattern is a bad call. A reader who recognized four is a close.

**The firewall.** Nothing here is sourced from any specific team. If asked directly on a call — and you will be — the honest answer is the strong one: *"I see the pattern across a portfolio. I never carry specifics between teams, which is exactly why you can talk to me freely."* The constraint is the credential. Say it early rather than defensively.

---

## The image

**Recommendation: one diagram, not a photo, and not an infographic.**

Three reasons, in order of weight:

1. **Stock photography actively costs you here.** A server rack or a glowing-brain render signals *content marketing* to exactly the audience you want — CTOs who have seen ten thousand of them. The post's whole credibility rests on sounding like an operator rather than a funnel. A generic photo undoes that above the fold, before a word is read.
2. **A full infographic competes with the post.** Six patterns rendered as six icons gives the reader permission to skim the image and skip the text. But the *text* is the mechanism — the "what they believed" reversal is what produces the DM. Never let the image summarize what the words need to do.
3. **One diagram earns the scroll.** A single visual that makes *one* idea concrete — and leaves the other five unexplained — pulls the reader down rather than satisfying them.

So: illustrate **pattern #4 only** (the latency budget being spent somewhere other than the model). It's the most visual, the most immediately surprising, and the one that most reliably makes a reader think *wait, is that us?*

### Prompt — primary (latency decomposition bar)

Paste into Midjourney, DALL·E, Ideogram, or your generator of choice:

> A minimal technical diagram on a warm off-white background, in the style of a precise engineering notebook illustration. A single horizontal bar spanning the width, divided into five labeled segments of clearly unequal width, reading left to right: "retrieval" (wide), "guardrail" (wide), "model" (narrow), "post-process" (medium), "serialize" (thin). Each segment a different flat muted color — slate blue, warm grey, a single accent of burnt orange on the narrow "model" segment. Thin sans-serif labels beneath each segment. Thin vertical tick marks along the bar like a measuring rule. Generous white space above and below. No people, no photorealism, no 3D, no gradients, no glow, no drop shadows, no circuit-board or brain imagery. Flat vector, editorial, restrained. 16:9.

**Why this composition:** the burnt-orange accent on the *narrowest* segment is the entire argument in one glance — the thing everyone optimizes is the thing taking the least time. Colour draws the eye exactly where the surprise is.

### Prompt — alternate (quota ceiling)

If the bar reads too dry, illustrate pattern #1 instead:

> A minimal editorial line chart on a warm off-white background, engineering-notebook style. A single dark ascending curve labeled "volume" rising steeply from left to right. A flat horizontal dashed line near the top labeled "quota ceiling" in burnt orange. The curve intersects the dashed line near the right edge, and that intersection is marked with a small open circle. Thin sans-serif labels, thin axis rules, generous white space. Flat vector, no people, no photorealism, no 3D, no gradients, no glow. 16:9.

### Rules for whatever comes back

- **Read every word in the image.** Generators mangle text constantly. Mislabeled segments in a post about measurement rigor is the worst possible failure, and it's the most likely one.
- **If the labels won't render cleanly after three tries, rebuild it by hand.** This diagram is five rectangles and five words — twenty minutes in Figma, or an SVG in your own site's palette, which will look better than any generation anyway.
- **Match your site, not the generator's defaults.** The warm off-white and single accent are chosen to sit inside your existing palette. A visual that clashes with yenus.dev reads as borrowed.
- **One image total.** Do not add a second for LinkedIn. Scarcity of visuals is part of the senior register.
