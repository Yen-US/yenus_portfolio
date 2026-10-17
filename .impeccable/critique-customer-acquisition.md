# impeccable critique + audit, `/work/customer-acquisition`, 2026-10-17

⚠️ DEGRADED: single-context (the impeccable detector launcher binary is not installed on this laptop; the review was
written from the final captures and source in one context). Browser evidence: Playwright 1.63, real WebKit 26.6
(iPhone 15 at 393 and 320) and Chromium 153 at 1440.

## Assessment A: design review

**Design specificity: authored.** Each case is the client's real page in a phone, in the client's own colour, with
the client's own logo, photographs and paintings. The flow chain reads the actual path (ad, page, two taps,
WhatsApp, quote; post or ad, page, WhatsApp or form, Presencia qualifies, JR and buyer talk). Nothing could be
reused for another studio's clients without replacing every image and every line.

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of system status | 4 | Breadcrumb, screen counter, dated state line per case. |
| 2 | Match system / real world | 4 | Pages shown as phones; the flow uses the words a customer would. |
| 3 | User control and freedom | 4 | Native swipe, tap, dots, arrows; four return paths in the closer. |
| 4 | Consistency and standards | 4 | Same card, phone, button and link system as the homepage. |
| 5 | Error prevention | n/a | No forms. |
| 6 | Recognition rather than recall | 4 | Both clients named in the card, the case and the links; founder products distinguished in the closer. |
| 7 | Flexibility and efficiency | n/a | |
| 8 | Aesthetic and minimalist design | 3 | Two "What I built" lists of four items each are the densest text on the site; still one sentence per item. |
| 9 | Error recovery | n/a | |
| 10 | Help and documentation | n/a | |
| **Total** | | **23/24** | Excellent |

**Cognitive load:** 0 of 8 failures; one case per screen on phones.

**Priority issues (repaired in this pass):** intro too long before the first client (P2); artwork alts as titles
(P2, claims); inquiry wording stronger than the evidence (P1, claims); heavy gallery sources (P3).

**Remaining observations:** the "What I built" lists could become disclosures if the founder wants the page even
shorter; simulated-mobile LCP is slower than the homepage because the first GE screen is a photograph-heavy page.

## Assessment B: evidence

Captures (9 configs x 3 routes): 0 horizontal overflow on the new page, `/` and `/work` at 320 / 393 / 1440 and at
true 200% zoom (720 CSS px); 0 images growing on scroll; 0 console errors. Interactions on WebKit iPhone: tap steps
the GE phone, dot 4 jumps the JR phone to the inquiry screen, breadcrumb/home/CV/email paths present; no-JS first
screen loaded; Chromium arrow keys step. All five external links answer 200 (GET only). Rendered HTML contains no
account ids, dashboard hosts, phone numbers, UTM parameters, budgets or testimonials.

## Audit (technical), 0-4

| # | Dimension | Score | Key finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 4 | Lighthouse a11y 100; carousel group semantics; descriptive alts; 44px targets; skip link; landmarks. |
| 2 | Performance | 2 | JS 149 KB; CLS 0; TBT 5 ms; LCP 5.3 s simulated mobile (homepage 3.7 s on the same harness). First screen is a photo-heavy page; other images now low priority. |
| 3 | Responsive | 4 | 320 / 393 / 1440 / 200% clean; cards stack on phones, side by side from 1024px. |
| 4 | Theming | 4 | Showroom tokens; client tints per card; `cw-*` additions only. |
| 5 | Implementation integrity | 3 | Data module with tests for claims, privacy and assets; detector not run on this machine. |
| **Total** | | **17/20** | Good |

Questions skipped: fewer than 3 open priority issues remain.

## Addendum (presenciaCM note, same day)
Founder: "We can briefly mention a bit about the underlying system enabling this, presenciaCM". Added a two-sentence
"The system behind both" section between the cases and the closer, and named presenciaCM in the GE events line and
the JR inquiry line. Claims checked read-only against the presenciaCM repository and the inquiry release record;
boundaries stated (wabot separate, a person approves and closes, internal tool, not a product to sign up for). No
screenshot of the system. Re-verified: 0 overflow, 0 errors, interactions unchanged; visible words 582 / 574.
Slop re-score: 0/10 (a text section, no new composition).
