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
OPENAI_STRUCTURE_MODEL=gpt-4o-mini
OPENAI_RESEARCH_MODEL=gpt-5-mini
```

The Supabase service-role key must never use a `NEXT_PUBLIC_` prefix. Tables have RLS enabled with no public policies; only server routes use the service role.

When Supabase is absent, Signal Room loads fictional demo accounts and a sample post. Generated work can be used during the session but is not durable.

## Daily Workflow

### 1. Discover

- Search global Seed-Series B B2B AI startups using a production trigger.
- Prefer recent funding, enterprise pilots, production launches, platform hiring, evaluation/reliability hiring, or movement into regulated buyers.
- Open every cited source before saving a company.
- Reject generic matches, agencies, consumer-only products, and companies outside the selected stage.

Discovery uses OpenAI web search in two steps:

1. A search model produces a cited public report.
2. A structured model converts only that report and its exact citation ledger into candidates.

Sources shown in discovery are citations, not independently verified facts. Confirm the relevant claim before outreach.

### 2. Research

- Add the company website, launch posts, technical writing, jobs page, funding coverage, and public product documentation.
- Paste relevant LinkedIn text manually. Automated LinkedIn extraction is intentionally blocked.
- Add personal observations in manual context rather than presenting them as sourced facts.
- Generate the brief and review extraction failures.

The extractor:

- Allows only public HTTP/HTTPS pages on standard ports
- Blocks local/private network addresses and checks each redirect
- Blocks LinkedIn extraction
- Limits response size and request duration
- Does not bypass publisher `403` responses or disguise itself as a browser

The brief separates:

- Verified evidence with source URL
- Architecture hypotheses with supporting signals
- Questions needed to validate each hypothesis
- Explicit uncertainties

### 3. Prepare Manual Outreach

Review and edit every asset before use:

- Personalized opening lines
- Short LinkedIn/email message
- Three-to-five-minute Loom outline
- Discovery questions

No messages are sent automatically. Do not use Microsoft program lists, non-public startup information, or any language implying Microsoft endorsement.

### 4. Build LinkedIn Authority

Rotate between:

1. Technical field notes
2. Startup strategy
3. Operator stories

Each generated post is instructed to include:

- One non-obvious central claim
- A concrete startup operating scenario
- Three to five detailed decisions or a reusable framework
- A decisive takeaway
- An evidence ledger for factual claims

The Meat Check flags short takes, missing operating detail, unsupported factual claims, and generic AI phrases. Treat model quality scores as revision prompts, not objective measurements.

## Operating Boundaries

- Public web research only
- LinkedIn is manual paste/link only
- No private contact-data harvesting
- No automated outreach or engagement
- No evasion of robots, access controls, rate limits, or publisher blocks
- No confidential employer, program, client, or prospect information
- Architecture findings are hypotheses until validated in conversation

## Security Notes

Same-origin checks and in-memory rate limits reduce casual API abuse but are not authentication and are not durable distributed rate limiting. Before storing sensitive data or giving another person access, add Supabase Auth or a proper identity-aware access proxy and move rate limiting to a shared store.