---
version: 1
slug: "src-app-sheet-page-tsx"
primary_target: "src/app/(sheet)/page.tsx"
related_targets: ["src/components/sheet/sheet-chrome.tsx", "src/components/sheet/career-chain.tsx", "src/lib/sheet-data.ts", "src/app/(sheet)/opengraph-image.tsx"]
---

## Scope
Route `/` — recruiter-facing portfolio, redesigned 2026-10-16 (replaces the station departures board, which stays at `/cv`). Mode: Persuade (recruiter decides and acts: CV, email, LinkedIn), Experience secondary (the work leads).

## Audience, job, action
Recruiters, hiring managers, technical interviewers for remote Senior AI Solution Architect / agentic AI roles. Job: confirm fit in seconds. Action: download CV, email, LinkedIn, GitHub, read the on-site CV at `/cv`.

## Direction contract
THESIS: A working drawing. The architect's portfolio read like a drawing sheet: a title block says who, what, where and how to reach him; details cut through real systems and annotate the decisions inside them; experience is a dimensioned chain where dates are lengths.
OWN-WORLD: Drafting white (#f2f3f0, cool, not cream), ink (#121315), graphite (#55585e), hairline rule (#c6c9c4), one survey-orange marker (#ff4a00) reserved for the CV action and the open end of the one running role. Archivo variable in two widths (125 display, 100 reading), tabular figures, no second family, no mono. Square corners; ink on paper for depth; no shadow, gradient, blur, glass or blueprint grid.
STORY: The visitor reads "Production AI, drawn to scale." beside a title block with the name, role, place, certifications, education and a sheet index, and a Download CV action. Three details (Azure migration, AOP Beacon, Presencia Studio) each show a section cut and the decisions. Four rules, each naming the project it came from. The chain shows eight roles from Tier 2 support (Jan 2021) to senior architect (May 2024) and beyond, overlaps included. Skills, certifications, then the ink contact band.
FIRST VIEWPORT (desktop): drawing area left with the statement, lede and portrait standing on a dimension line; title block right with identity, metadata table, sheet index and five actions. (Phone): statement, lede, portrait; the two main actions in a fixed bottom bar until the title block scrolls into view.
FORM: Drawing-sheet conventions (title block, section cut, dimension line, chain) as composition; chosen from three explored compositions (section drawing, kinetic broadside, tap-to-open objects). Signature interaction: rules ink in on arrival; chain bars are inked as they enter the viewport; detail titles widen on hover; buttons press 1px.
FINISH: reviewed with the Claude Design slop diagnostic, the impeccable detector, and the Web Interface Guidelines; DESIGN.md replaced; evidence in `~/artifacts/yenus-fable-redesign/`.

## Deviations from the contract, with reasons
- The sheet index is desktop-only: on phones the fixed action bar already carries the two actions and the index would push the statement down.
- The chain bars are always painted in graphite with an ink overlay that animates, so the chain reads in print, in full-page captures and without scroll timelines.

## Unresolved
- Positioning copy ("Production AI, drawn to scale.", section titles, rules) is a draft for the founder.
- "YC-backed" client descriptor still withheld; early-career roles carry title, employer, dates and place only.
- English proficiency and availability are not stated anywhere because they are unconfirmed.
