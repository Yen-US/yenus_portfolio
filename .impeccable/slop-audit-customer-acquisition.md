# Slop diagnostic (Claude Design skill), `/work/customer-acquisition`, 2026-10-17

Surface: Decide/Learn with the work leading (two client cases). Evidence: Playwright 1.63 captures in
`~/artifacts/yenus-fable-redesign/ca/` (real WebKit iPhone 15 at 393 and 320, Chromium 1440, reduced motion, no JS,
true 200% zoom at 720 CSS px, storage denied).

## Before fix (first build): 1 / 10

| # | Tell | Fired? | Note |
|---|------|--------|------|
| 1 | Tech gradient | no | Flat fields in the clients' own colours (GE dark earth, JR warm paper). |
| 2 | Generic tech hue | no | The stage is the showroom's neutral dark; the only hues are the clients'. |
| 3 | Feature-tile grid | no | Two cases of equal weight, each a phone beside a case; nothing is a tile row. |
| 4 | Accent rail | no | None. |
| 5 | Unearned blur | no | None. |
| 6 | Monument stat | no | No numbers at all beyond the screen counter and the date of the state line. |
| 7 | Icon topper | no | Icons only inside links and buttons. |
| 8 | Center stack | no | Left-aligned; phone right in the field. |
| 9 | Default type | no | Inherits Bricolage Grotesque from the showroom. |
| 10 | Wrong surface | no | Case page with the real page as the hero of each case. |

**Counted (copy, not composition):** the intro carried a second, muted sentence explaining what is *not* on the page
before the first client appeared, pushing the GE field below the first phone screen at 320. Removed; the distinction
now lives in the closer.

### Non-tell defects repaired
- Artwork alt text named canvases as if they were catalogue titles; now descriptive ("an astronaut under an On Air
  sign"), per the rule that canvas words are descriptive.
- The JR inquiry sentence implied a verified human reply from the JR mailbox; reworded to what is established (the
  form lands in the inbox as a thread; a person replies by email and hands it to JR).
- Gallery sources were 1080 and 828 px wide for 200 px slots; re-encoded at 720 and 640.
- All ten phone screens plus galleries loaded at equal priority on phones; screens after the first and the galleries
  now carry a low fetch priority on this page only (the homepage markup is unchanged).

## After fix: 0 / 10

Compositional tells (3, 8, 10) did not fire in either pass. Visible words 499 (desktop) / 491 (phone) for two full
cases with screens, flows, galleries and links.
