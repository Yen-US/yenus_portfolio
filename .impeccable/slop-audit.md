# Slop diagnostic (Claude Design skill), portfolio `/`, round 2 (sheet world, 2026-10-16)

Diagnose first, then treat. Scored out of 10 (10 = maximum slop). Evidence: Playwright 1.63 captures in
`~/artifacts/yenus-fable-redesign/after/` (Chromium 1440 / 390 / 320, WebKit iPhone 15, reduced motion, no JS).

## Baseline being replaced (the live station board), re-scored for the record: 0 / 10
No tells fired in round 1's final audit. The founder's complaint was not slop; it was that the wording read as
common and that the design should go further. This round is judged on that, plus the ten tells.

## Before fix (first build of the sheet world): 1 / 10

| # | Tell | Fired? | Note |
|---|------|--------|------|
| 1 | Tech gradient | no | No gradients. The chain track briefly used a repeating-gradient for year ticks; removed before capture. |
| 2 | Generic tech hue | no | Ink on drafting white with one survey-orange marker. |
| 3 | Feature-tile grid | no | Work is three ruled details of unequal weight (lead detail larger), each with its own figure. |
| 4 | Accent rail | no | No coloured side strips. The OG card's 3px divider is a structural rule between two columns (detector false positive). |
| 5 | Unearned blur | no | None. |
| 6 | Monument stat | no | Certification codes are body text in the title block and skills; the chain numbers are dates, not stats. |
| 7 | Icon topper | no | Icons only inside buttons, trailing. |
| 8 | Center stack | no | Left-aligned asymmetric compositions; the title block is a right column, not a centred card. |
| 9 | Default type | no | Archivo variable (two widths), chosen for the drawing-stamp voice. |
| 10 | Wrong surface | no | Decide/Learn surface; a hero is earned, the work browses. |

**Counted, borderline:** none of the ten, but a compositional defect that behaves like tell 8/10: the title block's
actions were pushed to the bottom of a viewport-tall column, leaving a dead band and placing Download CV on the fold.

### Non-tell defects found in the same captures (higher priority than the score)
- **Title block dead band** (above): fixed by adding the sheet index (real counts, in-page links) and the Education row,
  so the block is full and the actions sit at about 760px on a 900px viewport.
- **Chain bars invisible in full-page captures and below the fold**: the scroll-timeline fill started from scaleX(0),
  so substantive content was hidden until scrolled. Fixed: bars are always painted (graphite) and only the ink overlay
  animates.
- Straight apostrophes in copy ("startup's"); replaced with typographic ones.
- The fixed mobile bar was a labelled `div`; now a `nav` landmark.
- Dead `.sh-menu` CSS removed.

## After fix: 0 / 10

| # | Tell | Fired? |
|---|------|--------|
| 1-10 | as above | no |

Compositional tells (3, 8, 10) did not fire in either pass. Detector (`impeccable detect`) on `src/app/(sheet)` and
`src/components/sheet` after fix: one warning, `side-tab` on the OG card's column divider, judged a false positive
(it separates two columns of a title block; it is not a card accent). Type-ramp advisories cleared by declaring the
`role` and `lede` steps in DESIGN.md and moving the chain title to 1.375rem.
