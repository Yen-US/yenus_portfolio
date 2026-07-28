# Yenson Umaña · AI Architecture for Startups

Personal-brand consulting site for Yenson Umaña, focused on helping early and growth-stage startups move from AI ambition to production clarity.

The previous career portfolio is preserved at `/career` and excluded from search indexing.

## Routes

- `/` - Consulting homepage
- `/discovery` - Qualified discovery call request
- `/career` - Hidden archive of the previous portfolio
- `/signal-room` - Unlinked startup research and LinkedIn content workspace
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
DISCOVERY_MEETING_URL=https://meet.google.com/your-meeting-room
```

Verify `yenus.dev` in Resend before using the production sender. The discovery
form offers weekday starts every hour from 10:00 AM through 5:00 PM Costa Rica,
confirms the selected 30-minute call immediately, and sends matching `.ics`
invitations to the visitor and Yenson. `DISCOVERY_MEETING_URL` is not provided by
Resend; configure a stable Google Meet or Zoom room separately.

`OPENAI_API_KEY` remains optional for the archived portfolio's AI summary feature.
It is required for Signal Room discovery, research briefs, and Post Lab generation.

## Signal Room

Signal Room is an unlinked, `noindex` operator workspace for:

- Finding cited Seed-Series B B2B AI startup candidates
- Extracting selected public pages and building source-backed account briefs
- Keeping facts separate from architecture hypotheses
- Preparing manual opening lines, outreach drafts, Loom outlines, and discovery questions
- Drafting substantive LinkedIn posts across technical, strategy, and operator pillars

Run [docs/supabase-signal-room.sql](docs/supabase-signal-room.sql) in Supabase, then add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the server environment. Without those values, the route runs in labeled demo mode and saves only for the current browser session.

The route is obscured, not authenticated. Do not store sensitive information there. Add real authentication before using it for confidential client or personal data.

## Content

- `src/lib/consulting-data.ts` - Consulting positioning, offers, proof, approach, and FAQs
- `src/lib/resume-data.ts` - Archived career and portfolio content
- `docs/plans/2026-07-27-ai-consulting-site-strategy.md` - Positioning and conversion decisions
- `docs/signal-room.md` - Research workflow, data-source rules, and setup
