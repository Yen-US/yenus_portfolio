---
version: 1
slug: "src-app-home-work-customer-acquisition-page-tsx"
primary_target: "src/app/(home)/work/customer-acquisition/page.tsx"
related_targets: ["src/lib/client-work-data.ts", "src/components/home/screens.tsx", "src/app/(home)/work/customer-acquisition/opengraph-image.tsx"]
---

## Scope
Route `/work/customer-acquisition`, added 2026-10-17 as a secondary page. Mode: Persuade with the work leading
(Experience secondary): a recruiter or prospect sees two client systems as real screens, reads one short case each,
and can open the live pages. The homepage showroom (`/`) is unchanged; `/work` (Startup Work) keeps its content and
gains one link line.

## Founder brief (verbatim, 2026-10-17)
"I want you to add, Guanacaste earthmoving and Jr Rodriguez work to my personal portfolio and presencia studio page,
not to the landing but maybe to an special customer acquisition section, same as listo on presencia side"

## Direction contract
THESIS: The client side of Presencia Studio, shown the way the founder's own products are shown: the real page in a
real phone, in the client's own colour, with one short case beside it.
OWN-WORLD: inherits the showroom world (`.home`, `--hm-*`, Bricolage Grotesque); client tints read from the live
client pages (GE dark earth #2a1409 with cream ink; JR warm paper #f4f0e6 with ink). New styles are `cw-*` only:
the acquisition-flow chain, the public-image gallery, the logo row.
STORY: breadcrumb and one-sentence title; GE card with five real screens and the case (context, what I built, how a
customer arrives, where it stands, two real job photos, links); JR card with five real screens and the case (three
real paintings, links); closer with the four return paths (products, startup work, CV, email).
FIRST VIEWPORT (phone): breadcrumb, title, one line, then the GE field with logo, name and the phone rising from it.
FORM: reuse of the showroom's `Screens` phone (tap or swipe to step, dots, arrow keys, native without JS); flow steps
as a chain of chips with the final step filled.
FINISH: slop diagnostic, critique and audit, Web Interface Guidelines review, recorded in `.impeccable/`.

## Facts and limits honoured
- GE: live bilingual pages, two-tap chooser into WhatsApp, fleet with manufacturer spec sheets, real photography,
  page/scroll/chooser events reported to the Presencia dashboard (read from the Presencia repo, read-only). No
  customer, quote or conversation figures.
- JR: live bilingual commission page with per-painting inquiry links, WhatsApp qualified by Presencia, formal inquiry
  form into the Presencia inbox as email threads, public Facebook page and ads (release and acceptance records of
  2026-10-17). No sale attributed; the paintings are JR's; canvas words in alts are descriptive, not titles.
- No budgets, account ids, dashboard URLs, lead data, testimonials, prices or minimums anywhere on the page.
