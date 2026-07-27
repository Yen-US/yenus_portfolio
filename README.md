# Yenson Umaña · AI Architecture for Startups

Personal-brand consulting site for Yenson Umaña, focused on helping early and growth-stage startups move from AI ambition to production clarity.

The previous career portfolio is preserved at `/career` and excluded from search indexing.

## Routes

- `/` - Consulting homepage
- `/discovery` - Qualified discovery call request
- `/career` - Hidden archive of the previous portfolio
- `/blog` - Reserved blog route
- `/api/discovery` - Validated Resend delivery endpoint

## Development

```bash
pnpm install
pnpm dev
pnpm build
```

The local site runs at [http://localhost:3000](http://localhost:3000).

## Environment

Copy the values documented in `.env.example` into `.env`.

Required for discovery email delivery:

```text
RESEND_API_KEY=
RESEND_FROM_EMAIL=Yenson Umana <discovery@yenus.dev>
DISCOVERY_NOTIFICATION_EMAIL=yen21000@gmail.com
NEXT_PUBLIC_SITE_URL=https://yenus.dev
```

Verify `yenus.dev` in Resend before using the production sender. The discovery form sends one owner brief and one visitor receipt. The requested time remains pending until Yenson confirms it by replying.

`OPENAI_API_KEY` remains optional for the archived portfolio's AI summary feature.

## Content

- `src/lib/consulting-data.ts` - Consulting positioning, offers, proof, approach, and FAQs
- `src/lib/resume-data.ts` - Archived career and portfolio content
- `docs/plans/2026-07-27-ai-consulting-site-strategy.md` - Positioning and conversion decisions
