# Web Interface Guidelines review (vercel-labs/web-interface-guidelines), `/` showroom, 2026-10-17

Files: src/app/(home)/page.tsx, src/app/(home)/layout.tsx, src/components/home/home-chrome.tsx,
src/components/home/screens.tsx, src/app/globals.css (`.home` block), src/lib/home-data.ts.

## src/components/home/screens.tsx

screens.tsx:phone group - `role="group"` + `aria-roledescription="carousel"` + `tabIndex=0`, ArrowLeft/Right handlers ✓
screens.tsx:track - `tabIndex={-1}` so the scroller is not a nameless tab stop ✓
screens.tsx:dots - real `<button>`s with `aria-label` and `aria-current`, 2.75rem hit areas ✓
screens.tsx:label - `aria-live="polite"` screen name updates on step ✓
screens.tsx:images - explicit width/height, `sizes`, first screen of the first card `priority` + `fetchPriority="high"`, the rest lazy ✓
screens.tsx:pointer - tap-vs-drag discrimination (8px, 400ms) so a swipe never also steps ✓
screens.tsx - without JS the track is a native scroll-snap carousel showing the first screen ✓ (verified in WebKit no-JS capture)

## src/app/(home)/page.tsx

page.tsx:switch - radios + labels (clickable, keyboard, focus ring via `:focus-visible + label`), `<legend>` sr-only ✓
page.tsx:sections - `scroll-mt-20` on `#work`, `#also`, `#experience` ✓
page.tsx:details - native `<details>` disclosure for decisions ✓
page.tsx:links - external product links `target=_blank rel=noopener noreferrer` with a trailing icon `aria-hidden` ✓
page.tsx:copy - headings sentence case and first person: deliberate deviation from Title Case / second person
page.tsx:copy - no "..." ; numerals for counts ("1/4") ✓

## src/components/home/home-chrome.tsx

home-chrome.tsx:brand - `aria-label`, `translate="no"`, 44px tall ✓
home-chrome.tsx:nav - 44px links, hover state, focus ring ✓
home-chrome.tsx:menu - icon-only `summary` has `aria-label`; native `<details>`, closes after choosing with JS ✓
home-chrome.tsx:CV - header "CV" on phones carries sr-only "download (PDF)" ✓

## src/app/globals.css (`.home`)

.hm-focus - `outline: none` only with a `:focus-visible` replacement ✓
transitions - explicit property lists, no `transition: all` ✓
.hm-track - `scroll-behavior: smooth` only under `prefers-reduced-motion: no-preference`; reduced motion removes transitions ✓
.home - `color-scheme: dark`, `touch-action: manipulation`, tap highlight set, `tnum`, selection and scrollbar themed ✓
.hm-display/.hm-h - `text-wrap: balance` ✓

## src/app/(home)/layout.tsx

layout.tsx - `themeColor` matches the stage; one self-hosted variable font via next/font ✓

## Open deviations (deliberate)
- Sentence-case headings and first-person copy.
- Download CV appears in the header and the contact band with the same label and intent, by design.
