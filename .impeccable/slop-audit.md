# Slop diagnostic (Claude Design skill), portfolio `/` and `/cv`

Evidence: Playwright v1.63.0 captures in `~/artifacts/yenus-portfolio-qa/r1/` (Chromium 1440, Chromium 390,
WebKit iPhone 15, plus reduced-motion variants).

## Round 1 score: 1 / 10

| # | Tell | Fired? | Note |
|---|------|--------|------|
| 1 | Tech gradient | no | No gradients anywhere; depth is flat overlap. |
| 2 | Generic tech hue | no | Timetable yellow + reserved signal orange on board black. |
| 3 | Feature-tile grid | no | Work is one face-out board + an asymmetric 5/7 poster grid, not equal icon tiles. |
| 4 | Accent rail | no | No coloured left strips. |
| 5 | Unearned blur | no | No blur or glass. |
| 6 | Monument stat | **borderline, counted** | `AI-102` / `AZ-204` set at 36px display size read as stat monuments rather than credentials. |
| 7 | Icon topper | no | Icons only inside buttons. |
| 8 | Center stack | no | Left-aligned asymmetric compositions throughout. |
| 9 | Default type | no | Big Shoulders (signage display) + Barlow (DIN-like body), chosen for the station world. |
| 10 | Wrong surface | no | Decide/Learn surface; the hero is earned and the work section browses. |

### Non-tell defects found in the same captures (higher priority than the score)
- **Critical:** hero flap characters invisible after the arrival animation in motion-enabled browsers. The
  flutter leaf parks at `rotateX(-90deg)` under `perspective`, which projects over the glyph instead of
  vanishing. Reduced-motion captures were correct.
- Hero board under-scaled on desktop: 16 columns leave large ghost areas and empty space above and below.
- Flap glyphs sit small inside their tiles.
- OG card text line uses two middle dots (taste rule: max one per line).
- Contact line "I reply from <email>" reads awkwardly.

## Repairs (matched to diagnosis)
- Tell 6 → remove the monument: certification codes drop to the body hierarchy (bold, same size as the name line).
- Leaf: `backwards` fill so it returns to its hidden base state after fluttering.
- Board: desktop 13 columns (bigger tiles, fewer ghost cells); glyph size raised to fill the tile.
- OG line separators changed to slashes; contact copy rewritten plainly.

## Round 2 score: 0 / 10

Evidence: `~/artifacts/yenus-portfolio-qa/r3/` and `after/` (post-repair captures).

| # | Tell | Fired? |
|---|------|--------|
| 1-5, 7-10 | as round 1 | no |
| 6 | Monument stat | no: certification codes now bold body text beside their names |

Compositional tells (3, 8, 10) did not fire in either round. Defects repaired and verified in captures:
- Hero characters render in Chromium and WebKit with motion on (the flap motion is now 2D `scaleY`, no
  `perspective`, removing the projected-leaf failure and a Chromium full-page raster artifact seen in round 2).
- Desktop board is 13 columns; glyphs fill the tiles.
- OG separators and contact copy repaired.

Additional repairs from the web-design-guidelines review: mobile menu closes after link selection (still a
native `<details>` without JS), skip link on `/cv`, `theme-color`, `translate="no"` on the name, touch-action.
