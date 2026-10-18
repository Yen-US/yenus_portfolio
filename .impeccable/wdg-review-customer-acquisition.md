# Web Interface Guidelines review, `/work/customer-acquisition`, 2026-10-17

Files: src/app/(home)/work/customer-acquisition/page.tsx, src/lib/client-work-data.ts, src/components/home/screens.tsx
(one optional prop added), src/app/globals.css (`cw-*` block), src/app/(consulting)/work/page.tsx (one link line).

## src/app/(home)/work/customer-acquisition/page.tsx

page.tsx:breadcrumb - `<Link>` to `/work`, underlined, 44px line box ✓
page.tsx:h1 - single `<h1>`, `text-wrap: balance` via `.hm-h`; case names are `<h2>`, case parts `<h3>` ✓
page.tsx:sections - `scroll-mt-20` on `#ge` and `#jr` ✓
page.tsx:flow - `<ol>` with `aria-label`; the final step is filled, not colour-only (also last in order) ✓
page.tsx:gallery - `<figure>` per image, explicit width/height, `sizes`, lazy by default, `fetchPriority="low"` ✓
page.tsx:links - external links `target=_blank rel=noopener noreferrer`, trailing icon `aria-hidden`, 44px ✓
page.tsx:closer - four return paths as buttons/links; email as text link ✓
page.tsx:copy - sentence case headings, first person (deliberate, matches the site); no "..." ; dates written out ✓

## src/lib/client-work-data.ts

client-work-data.ts - alt text descriptive, no catalogue titles; no phone numbers or ids; dated state lines ✓

## src/components/home/screens.tsx

screens.tsx:deferRest - optional prop, default off; homepage output unchanged (diff limited to the prop) ✓

## src/app/globals.css (`cw-*`)

.cw-flow li+li::before - decorative chevron drawn with borders, no glyph; chips 2.25rem tall (not interactive) ✓
.cw-gallery - auto-fit grid, images `width:100%; height:auto` ✓
transitions - none added; inherits the showroom's explicit lists ✓

## src/app/(consulting)/work/page.tsx

work/page.tsx:link - `<Link>` with underline-offset and hover colour, in a `<p>` at the end of the operator-proof section ✓

## Deviations (deliberate)
- Sentence-case headings and first-person copy, as on the rest of the site.
