---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/cv/page.tsx"]
---

## Scope
Route `/` — recruiter-facing portfolio. Mode: Persuade (recruiter decides and acts: CV, email, LinkedIn). Consulting landing moved verbatim to `/consulting`.

## Audience, job, action
Recruiters, hiring managers, technical interviewers for remote Senior AI Solution Architect / agentic AI roles. Job: confirm fit in seconds. Action: download CV, email, LinkedIn, read on-site CV at `/cv`.

## Direction contract
THESIS: A career read like a station departures board — role, route, and how to reach him at a glance. Refuses the dark-neon dev portfolio and the cream editorial serif.
OWN-WORLD: Board-black housing (#0b0b0c) with split-flap tiles (hinge seam, ghost tiles drawn), committed timetable yellow (#ffc919) printed sheets carrying readable prose in black, enamel off-white signage, signal orange reserved for the live action only. Condensed signage display face on flaps; DIN-like sans for timetables and codes (amended after finish review: no mono face; mono as a technical costume is a craft-floor refusal, and it would add a font file to the critical path). Square corners, flat overlap, no shadows, no gradients.
STORY: Visitor sees name + "Senior AI Solution Architect" flip in, understands production agentic AI + Azure, scans selected work (lead project face-out, others as spines), reads how he decides, the experience timetable, skills, then downloads the CV or emails.
FIRST VIEWPORT: Full-bleed black board. Top rail: brand mark, nav, "Consulting" link. Flap rows at monumental scale: YENSON UMAÑA / SENIOR AI SOLUTION ARCHITECT. Beneath, a short line of plain copy and a yellow timetable strip with "Download CV (PDF)" (orange), "View CV", email. Portrait sits in a board cell at right on desktop, below on mobile.
FORM: Split-flap departures board + printed rail timetable; #6 of my ordered list; seed key 3cac0cb4. Signature interaction: flaps cascade into place once on load (CSS only, staggered per tile); static at rest; reduced motion shows final text.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Deviations from the contract, with reasons
- Portrait sits on a yellow timetable panel, not a board-housing cell: the portrait is a dark shirt and dark hair on a transparent cutout, which disappears against board black. Yellow keeps the face legible and ties it to the timetable sheet.
- `/cv` prints on off-white (#f1f0ec), not timetable yellow: it is the long-form reading and print document. Off-white prints cleanly on office printers and reads as a CV to ATS-minded recruiters; yellow stays reserved for the timetable devices.

## Unresolved
"YC-backed" client descriptor withheld from / , /cv and the PDF until approved; zero-downtime claim not reused (not in CV).
