# Slop diagnostic (Claude Design skill), portfolio `/`, round 3 (showroom, 2026-10-17)

Diagnose first, then treat. Scored out of 10 (10 = maximum slop). Evidence: Playwright 1.63 captures in
`~/artifacts/yenus-fable-redesign/after/` on the laptop (real WebKit iPhone 15 at 393 and 320 wide, Chromium 1440,
reduced motion, no JS, 200% zoom, storage denied). The rejected round-2 sheet preview is commit c594e70.

## Before fix (first showroom build): 1 / 10

| # | Tell | Fired? | Note |
|---|------|--------|------|
| 1 | Tech gradient | no | None. Fields are flat product colours read from the live products. |
| 2 | Generic tech hue | no | The page is neutral dark; the only hues are Presencia's sand and Listo's green, which are theirs. |
| 3 | Feature-tile grid | no | Two product cards are the subject, not a feature grid; chapters alternate. |
| 4 | Accent rail | no | None. |
| 5 | Unearned blur | no | None. |
| 6 | Monument stat | no | No numbers except dates and the screen counter. |
| 7 | Icon topper | no | Icons only inside buttons. |
| 8 | Center stack | no | Left-aligned; the phone is right-aligned and clipped by the field's bottom edge. |
| 9 | Default type | no | Bricolage Grotesque with optical size and width, chosen for the builder voice. |
| 10 | Wrong surface | no | Decide/Learn with the work leading: the products are the hero. |

**Counted, borderline (compositional, tell 8 family):** the lower card area was first positioned absolutely, so the
controls collided with the phone on narrow screens and the phone fell below the first phone viewport.

### Non-tell defects found in captures and repaired
- Phones: the dots, screen name and open-product button sat above the phone, pushing the product image below the
  fold. Fixed: the field now holds name, line and the phone; the controls sit under the field on the stage.
- 393 and 320: the phone now starts about 600 CSS px down with the identity line, product switch and product name
  above it; roughly the top third of the phone is in the first viewport. (Noted as a remaining limit: a shorter
  identity line would raise it further.)
- The scroll-snap track was keyboard-focusable in Chromium (a nameless tab stop); it is now `tabindex="-1"` and the
  phone group handles arrow keys.
- Straight apostrophes, brand name wrapping at 320, both cards preloading their first screen: fixed in round 3a.

## After fix: 0 / 10

Compositional tells (3, 8, 10) did not fire. The founder's bar for this round was not the score: a memorable phone
first screen (real product, real colour, a phone you can swipe), easy work discovery (one switch, one tap), and
prose cut by more than half: 1014 visible words on the rejected preview to 316 on desktop and 295 on a phone (69%
and 71% cut). Education and certifications do not appear anywhere on `/` (enforced by `home-data.test.ts` and
checked on the rendered HTML).
