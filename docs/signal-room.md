# Signal Room

Signal Room is Yenson's internal workspace at `/signal-room` for manual account-based marketing and founder-led LinkedIn content.

It is intentionally absent from public navigation and sends `noindex`, `nofollow`, `noarchive`, and `nosnippet` directives. This is obscurity, not authentication. Anyone who learns the URL can open it. Do not store confidential client data, private contact details, credentials, or information obtained through Microsoft for Startups.

## Setup

1. Create a Supabase project.
2. Run `docs/supabase-signal-room.sql` in the Supabase SQL editor.
3. Add the following server environment variables locally and in deployment:

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

Optional model overrides:

```text
OPENAI_SEARCH_MODEL=gpt-4o-mini-search-preview
OPENAI_RESEARCH_MODEL=gpt-5-mini
```

The Supabase service-role key must never use a `NEXT_PUBLIC_` prefix. Tables have RLS enabled with no public policies; only server routes use the service role.

When Supabase is absent, Signal Room loads fictional demo accounts and a sample post. Generated work can be used during the session but is not durable.

## Daily Workflow

Three steps, in order. Everything else lives under **Advanced** and can be
ignored until the basics are working.

**1 · Find targets** — pick a client profile, run several search angles at once,
open the cited sources, save what is worth pursuing. Works with no setup.

Five profiles ship in `src/lib/signal-room/icp-presets.ts`, each mapped to one of
the engagements in the offer ladder:

| Profile | Converts into |
|---|---|
| Prototype stuck before production | AI Architecture Sprint |
| Agents that break at scale | AI Architecture Sprint |
| Vertical AI in regulated buyers | AI Architecture Sprint |
| Just raised, team outgrowing founder context | AI Engineering Enablement |
| Inference cost or latency pressure | AI Direction Sprint |

Each carries its own keyword banks, disqualifiers, three search angles, and the
weakness you could measure yourself on a free tier.

**Multi-angle search.** Angles run in parallel (up to four) and results are
merged by company identity: sources are unioned, the most specific trigger wins,
and a company found by more than one angle ranks higher. One angle timing out
does not lose the others — failures are reported, not fatal. Typical run:
8 candidates from 3 angles in about 12 seconds, versus 3 from a single search.

**Website resolution.** Citations are usually press or aggregator pages, and
those hosts are blocklisted as candidate domains, so many candidates arrive with
no website. A resolver then guesses domains from the company name, fetches each
one, and accepts a result only when the guessed label survives redirects *and*
the page's own `<title>` / `og:site_name` names the company.

It refuses to guess for generic single-word names. This is deliberate and was
learned from real failures: `people.ai` redirects to a rebrand, while `dust.ai`
and `people.dev` are *different companies* that legitimately own those names. A
wrong domain is worse than an empty field, because it sends you to research the
wrong business and write to the wrong CTO.

Results are labelled accordingly:

- **`cited`** — the domain came from a search citation. Strongest.
- **`site auto-found`** — guessed and verified. **Still check it is the right
  company** — a same-name business in another market can pass every check.
- **`no site`** — nothing confirmed. Open a source and paste the domain in.

Well-known large companies (OpenAI, Anthropic, Databricks…) are filtered out;
the search model occasionally mislabels their stage.

**2 · Research & write** — per account, four tabs in order:
1. *Research* — paste public URLs and the contact's name/role (found manually).
2. *Brief* — source-backed summary, evidence, architecture hypotheses.
3. *Use their product* — plan a test, then actually sign up and measure one
   thing. Log it.
4. *Write & send* — draft the opener, check tone, copy out, paste their reply
   back for analysis.

**3 · Calls** — cost-math questions, capture what they said, draft a 90-day plan.

The load-bearing rule: the opening message earns a reply because it contains **a
number you measured yourself**, plus a hedged guess at the cause that invites
correction. Step 3 of the account tabs is where that number comes from, and the
opener stays locked until it exists.

### Advanced

- **Dashboard** — pipeline counters and next actions.
- **ICP tuning** — versioned targeting profile. Sharpening narrows a loose
  statement; locking is confirmed by typing `lock v{n}` and warns that accounts
  sourced under an earlier version stop being score-comparable. ICP v1 seeds
  with the original fit-score keyword banks, so historical scores stay
  interpretable. **This is a default, not a gate — discovery works without it.**
- **Post Lab** — LinkedIn authority content.

### Suggested Fit Score

Discovery calculates a deterministic `0-100` suggestion after parsing the cited
result. The model does not choose the number. The rubric is:

- ICP stage: 20
- B2B AI centrality: 20
- Prototype-to-production signal: 25
- Architecture-offer alignment: 20
- Recent urgency trigger: 15

Evidence confidence is shown separately and depends on verified website/source
coverage; it does not inflate the fit score. Saving preserves the score, derives
priority (`80+` high, `65-79` medium, below `65` low), and stamps the ICP version.

When no official website resolves from the citations, the candidate is marked
`site unverified` — open a source, find the real domain, and paste it in after
saving.

### The extractor

Allows only public HTTP/HTTPS pages on standard ports, blocks local/private
addresses and checks each redirect, blocks LinkedIn, limits response size and
duration, and does not disguise itself as a browser or bypass publisher `403`
responses.

### Field test — manual by design

Automating signup or scripted product use would violate the operating boundaries
and produce numbers that cannot be defended when a CTO pushes back. The tool
plans what to measure and stores what you observed; you run it.

Observations outrank inference in the research brief. With no observation
recorded, the brief is instructed to describe no performance, latency, or
reliability weakness at all.

### Correction opener — the one hard gate

With no logged observation the opener cannot be generated: the UI disables it,
the route returns `422`, and the function throws. Every other check advises
rather than blocks; this one blocks because the hook collapses without it.

Structure: greeting → two or three genuine strengths from observations or cited
evidence → **exactly one** weakness with its measured number → the cause stated
as a guess → the scaling question. Under 900 characters. No links, no ask for a
call — that comes after they reply.

A deterministic tone lint runs live beneath the draft: one jab not a teardown,
hedge present, invites a reply, no pressure language, no flattery opener, length.

### Reply analysis

Classifies intent, quotes the correcting sentence verbatim, marks each hypothesis
confirmed/refuted/open, extracts stated numbers verbatim (never estimates), flags
ego risk, proposes one next question, and answers whether the reply justifies
asking for the call — defaulting to `not_yet`.

### Calls

Cost math is computed by `cost-math.ts` — pure arithmetic, no model — and every
figure is tagged `stated`, `estimated`, or `unknown` based on whether you
recorded where it came from. Mutual fit must be judged before the money fields
unlock. **You type the price; the model never picks it.** Internal planning bands
live in `src/lib/signal-room/offers.ts` and are never rendered publicly.

## Operating Boundaries

- Public web research only
- LinkedIn is manual paste/link only
- No private contact-data harvesting or automated person resolution
- No automated outreach or engagement — every generated asset is copy-out
- No automated signup, scripted product use, or load generation against a
  prospect's product
- No call recording or transcription
- No evasion of robots, access controls, rate limits, or publisher blocks
- No Microsoft program lists, non-public startup information, or implied
  Microsoft endorsement

The methodology is compatible with all of these. What it asks for — that you
personally use the product and measure one real thing — is *less* automated than
generating outreach from citations alone, not more.

## Before the Call Stage Goes Live

Prospect revenue and spend figures are confidential client data, and this route
is obscured rather than authenticated. Either add real auth over `/signal-room`
and `/api/signal-room/*`, or record coarse bands instead of stated figures.
Do not paste a client's real financials into an unauthenticated page.
- No confidential employer, program, client, or prospect information
- Architecture findings are hypotheses until validated in conversation

## Security Notes

Same-origin checks and in-memory rate limits reduce casual API abuse but are not authentication and are not durable distributed rate limiting. Before storing sensitive data or giving another person access, add Supabase Auth or a proper identity-aware access proxy and move rate limiting to a shared store.