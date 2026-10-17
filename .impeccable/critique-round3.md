# impeccable critique + audit, `/` (showroom), 2026-10-17

⚠️ DEGRADED: single-context (bounded review sub-agents were authorised for this round, but the laptop install of
impeccable has no detector launcher binary, only the `.mjs` context scripts, so Assessment B's deterministic scan
could not run here; the last detector run on the VPS against the showroom source returned 0 findings before the
final card restructure). Assessment A was written from the final captures before any detector output was consulted.
Browser evidence: Playwright 1.63, real WebKit 26.6 (iPhone 15 at 393 and 320) and Chromium 153 at 1440.

## Assessment A: design review

**Design specificity: authored.** The composition is the two products in their own colours with their own real
screens; nothing on the first viewport could be reused by another person's portfolio. Identity is one sentence.

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of system status | 4 | The screen counter and dots name the current screen; the switch shows the chosen product. |
| 2 | Match system / real world | 4 | Products are shown as phones, swiped like phones. |
| 3 | User control and freedom | 4 | Native swipe, tap, dots, arrow keys; nothing is modal; nothing traps. |
| 4 | Consistency and standards | 3 | Buttons on the stage are ink-outlined, on a field they take the product ink: two looks for one control, by rule. |
| 5 | Error prevention | n/a | No forms. |
| 6 | Recognition rather than recall | 4 | CV in the header and the contact band; products named on the switch, the card and the chapter. |
| 7 | Flexibility and efficiency | n/a | Persuade surface. |
| 8 | Aesthetic and minimalist design | 4 | 316 visible words; every element carries information. |
| 9 | Error recovery | n/a | |
| 10 | Help and documentation | n/a | |
| **Total** | | **23/24** | Excellent |

**Cognitive load:** 0 of 8 failures; one decision per screen (which product, which screen, open it).

**Strengths:** the product is the first thing on a phone; the switch and tap are the whole interaction model; the
chapter paragraphs say what was built in one sentence each with the decisions behind a disclosure.

**Priority issues (all repaired in this round):** controls above the phone pushed the product below the fold on
phones (P1); the scroll track was a nameless tab stop (P2); the first build preloaded both cards' first screens (P3).

**Remaining observations:** on phones the identity line still takes three lines; the phone could rise higher with a
shorter sentence (founder's call). Lighthouse LCP is 0.5 s slower than the live board under simulated mobile
throttling because the first paint is a real 600px-wide product screenshot instead of text tiles.

## Assessment B: evidence

Captures (9 configs) show 0 horizontal overflow at 320 / 393 / 1440 and at true 200% zoom (720 CSS px), 0 images
growing on scroll, 0 console errors, first frame with H1, card and first screen painted at DOMContentLoaded.
Interactions on WebKit iPhone: switch (JS and no JS), tap stepper, dots, menu closes after choosing, storage denied
produces no errors; Chromium keyboard: ArrowRight/Left step screens, tab order is header, phone group, four dots,
open-product, next phone.

## Audit (technical), 0-4

| # | Dimension | Score | Key finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 4 | Lighthouse a11y 100; carousel group with roledescription and live label; 44px targets; skip link; landmarks. |
| 2 | Performance | 3 | JS 141 KB (baseline 139); CLS 0; TBT 5 ms; LCP 3.68 s simulated vs 3.13 s on the live board, same laptop. |
| 3 | Responsive | 4 | 320 / 393 / 1440 / 200% zoom clean; phones: field then controls; desktop: side column. |
| 4 | Theming | 4 | `--hm-*` tokens on `.home`; product tints per card; theme-color matches the stage. |
| 5 | Implementation integrity | 3 | Last deterministic scan 0 findings (VPS, pre-restructure); not re-run on the laptop. |
| **Total** | | **18/20** | Excellent |

Questions skipped: fewer than 3 open priority issues remain.
