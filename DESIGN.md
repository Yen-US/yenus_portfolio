---
name: Yenson Umaña · Sheet
description: The recruiter portfolio at /, read like a large-format drawing sheet with a title block, section cuts, and a dimensioned career chain.
colors:
  paper: "#f2f3f0"
  panel: "#e7e9e4"
  ink: "#121315"
  graphite: "#55585e"
  rule: "#c6c9c4"
  marker: "#ff4a00"
  on-ink-muted: "#b9bcb6"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 11.5vw, 8.25rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.035em"
    fontVariation: "\"wdth\" 125"
  section:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.035em"
    fontVariation: "\"wdth\" 125"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.625rem, 3.2vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "\"wdth\" 112"
  title-lead:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 4.2vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "\"wdth\" 112"
  role:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.25
  lede:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.75rem
    fontFeature: "\"tnum\""
  body-large:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.5rem
    fontFeature: "\"tnum\""
  brand:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 118"
  small:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.25
rounded:
  none: "0px"
spacing:
  gutter-mobile: "1rem"
  gutter-desktop: "2.5rem"
  container: "92rem"
  section: "4rem"
  section-desktop: "6rem"
  row: "1.75rem"
  row-desktop: "2.25rem"
  title-block-pad: "1.25rem"
  title-block-pad-desktop: "2rem"
components:
  button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    border: "1.5px solid {colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 1rem"
    height: "3rem"
  button-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-primary:
    backgroundColor: "{colors.marker}"
    textColor: "{colors.ink}"
    border: "1.5px solid {colors.marker}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 1rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  title-block:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    border: "1.5px solid {colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.25rem"
  band-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
    height: "3.75rem"
  band-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    border: "1.5px solid {colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
    height: "3.75rem"
  chain-track:
    backgroundColor: "{colors.panel}"
    height: "0.75rem"
  chain-bar:
    backgroundColor: "{colors.ink}"
    height: "0.75rem"
  contact-band:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
  nav-link:
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
  nav-link-hover:
    textColor: "{colors.ink}"
---

# Design System: Yenson Umaña · Sheet

## Overview

**Creative North Star: "The Working Drawing"**

A senior architect's portfolio read the way an engineer reads a drawing sheet: a title block that says who, what, and how to reach them; details that cut through real systems and annotate the decisions inside them; a dimensioned chain where career dates are lengths you can compare. The world is drafting white (a cool off-white, not cream), ink, graphite for secondary text, and one survey-orange marker reserved for the live action (Download CV) and the open end of the one running role. One type family, Archivo, in two widths: expanded to its widest for display, normal for everything a recruiter reads.

Depth is ink on paper. Nothing floats, nothing glows, nothing graduates. Motion is drafting motion: rules ink in from the left over content that is already painted, chain bars are inked as they scroll into view, a detail's title widens by a few units of the width axis when it is hovered, and buttons press one pixel. Nothing waits on motion; reduced motion shows the finished sheet.

**Scope.** This system governs `/`, everything inside the `.sheet` wrapper (the `(sheet)` route group). Tokens are `--sh-*` custom properties on `.sheet`, not on `:root`. The CV at `/cv` keeps its own "station" world (`.station`, `--st-*`, Big Shoulders and Barlow) in the `(portfolio)` route group, and the consulting pages keep theirs (`:root`, `.consulting-shell`). Do not pull tokens across worlds.

**Key Characteristics:**
- Drafting-white paper, ink rules, graphite secondary text, one marker colour reserved for the CV action and the live chain end.
- A title block that carries identity, a sheet index with real counts, and every recruiter action; on phones its two main actions move to a fixed bottom bar.
- One family, two widths: Archivo expanded (width 125) for display, normal width for reading, tabular figures throughout.
- Square corners everywhere; depth is ink on paper, never shadow, gradient, blur or glass.
- Section cuts: systems drawn as stacked ink and paper bands with a dimension line, not illustrations.
- A dimensioned career chain: roles as bars on one Jan 2021 to Dec 2026 axis; overlaps overlap.
- Motion that inks the sheet in and never gates content.

## Colors

A white sheet, ink, graphite, and one marker.

### Primary
- **Paper** (`paper`): the sheet, every surface except the contact band, the ink bands and the ink bars. Also the text colour on ink.
- **Ink** (`ink`): all primary text, every structural rule, the ink bands, the chain bars, the contact band, buttons on hover, and the focus ring on paper.

### Secondary
- **Marker** (`marker`): the Download CV button (header, title block, mobile bar, contact band) and the 5px cap on the running role's bar. Its text is Ink.

### Neutral
- **Graphite** (`graphite`): secondary text (nav at rest, metadata labels, stack lines, sources, dimension labels, the always-painted base of chain bars, the footer).
- **Rule** (`rule`): hairline dividers inside listings and the title block table.
- **Panel** (`panel`): the chain track behind bars.
- **On-ink Muted** (`on-ink-muted`): secondary text on the ink contact band and the notes in ink bands.

### Named Rules
**The One Marker Rule.** Marker means "the live action" and "now". It appears on Download CV and on the open end of the one running role, and nowhere else. A second marker element is a second signal.

**The Ink-on-Paper Rule.** Text is ink or graphite on paper, or paper or on-ink-muted on ink. No text is ever set in marker.

**The Not-Cream Rule.** Paper is a cool off-white (#f2f3f0). It must not drift warm.

## Typography

**Family:** Archivo (variable: `wdth` 62 to 125, `wght` 100 to 900), loaded once via next/font as `--font-sheet`. No second family, no monospace.

**Character:** A drawing title stamp over an engineer's notes. Display is Archivo pushed to its widest width at 800, set tight. Reading is the same family at normal width, 400 and 600, with tabular figures so dates and codes align.

### Hierarchy
- **Display** (800, width 125, clamp 2.25rem to 8.25rem, 0.9): the hero statement only.
- **Section** (800, width 125, clamp 2.25rem to 5rem, 0.9): section titles and the contact closer (which may run to 6.5rem).
- **Title** (800, width 112, clamp 1.625rem to 2.75rem; the lead detail clamp 1.875rem to 3.5rem, 1.0): detail titles and rule titles. On hover or focus-within, width eases to 120.
- **Title block name** (800, width 125, uppercase, clamp 2rem to 2.75rem).
- **Lede** (400, 1.125rem to 1.375rem, 1.6): the hero lede and detail context lines, capped at about 32em.
- **Body** (400, 1.0625rem, 1.75rem): callouts, rule bodies, chain bullets, skills. Caps at about 36em.
- **Label** (600, 0.95rem): buttons, metadata rows, the sheet index, stack lines, sources. Nav links use the same size at 400.
- **Brand** (700, width 118, uppercase, 1.05rem): the name in the header only.
- **Small** (400, 0.8rem): dimension labels and axis years, always in graphite.

### Named Rules
**The Two Widths Rule.** Width 125 speaks at display and section scale; width 112 for titles; width 100 for everything that is read. No other widths except the hover ease to 120.

**The Credential Is Body Rule.** Certification codes are bold body text beside their names, never display-scale numbers.

**No Eyebrow Rule.** No small uppercase label sits above a heading. The heading carries its own weight.

## Layout

One centred container, `min(100% - 2rem, 92rem)` on phones and `min(100% - 5rem, 92rem)` from 768px. Sections are separated by 1px ink rules and padded 4rem (6rem from 768px). Compositions are left-aligned and asymmetric: the hero is a drawing area beside a 26rem title block at 1024px and above and fills the viewport under the 4rem header; details are 1.1fr copy beside 0.9fr figure; rules and skills are two columns (title left, body right); the chain is a 22rem text column beside the axis.

Listings are ruled rows, never cards: 2px ink rule to open, hairline rules between rows. Figures (section cuts, the portrait, the Presencia screenshot) sit in the right column of their detail. On phones every grid collapses to one column, the title block becomes a bordered block under the lede, the chain bar moves above its text, and the two main actions live in a fixed bottom bar. Anchor targets carry a 5rem scroll margin for the sticky header.

## Elevation & Depth

Flat. There are no shadows, gradients, blur or glass. A surface is lifted by being a different material: paper, ink, or panel. The only line-weights are 1px (rules), 1.5px (borders of buttons, the title block, paper bands), 2px (section openers) and 3px (the OG card frame).

## Shapes

Square. Every button, band, block, figure frame and bar has 0 radius. Rules are the recurring form: hairlines inside listings, 1px ink structural rules, 1.5px ink borders, 2px ink openers, and the dimension line with 15px end ticks and a centred graphite label on a paper patch.

## Components

### Buttons
Ink-outlined blocks with the label left and a 16px stroke icon right; they fill on hover and press on click.
- **Shape:** square, minimum height 3rem, 1rem inline padding, 1.5px ink border.
- **Default:** paper with ink text; hover fills ink with paper text. Used for View CV, Email, LinkedIn, GitHub.
- **Primary (Download CV):** marker with ink text, marker border; hover fills ink with paper text. Only for the CV download.
- **On ink (contact band):** ink with paper border and text; hover fills paper with ink text. Primary keeps marker.
- **Hover / Focus / Active:** 160ms colour transitions; `:active` translates down 1px. Focus is a 3px ink outline at 3px offset; on ink it switches to paper.

### Title Block
A bordered block (1.5px ink) on phones, the hero's right column with a 1px ink left rule on desktop. Three parts separated by 1px ink rules: identity (name in display uppercase, role, a hairline-ruled table of Based in, Certified, Education, Revision), the sheet index (desktop only: four in-page links with real counts), and the actions (Download CV full width, then View CV and Email, then LinkedIn and GitHub in pairs).

### Mobile Action Bar
Fixed to the bottom under 1024px, paper with a 1.5px ink top rule, two buttons (Download CV, Email), padded for the safe area. Present in server HTML; with JavaScript it slides away while the title block is on screen.

### Section Cut
A figure of 2px-gapped bands, each 3.75rem tall with a label left and a graphite or on-ink-muted note right. Ink bands are solid ink with paper text; paper bands are paper with a 1.5px ink border. A dimension line below carries the one measure the system was designed to (1 week, 4 s). Bands slide 4px right, staggered 30ms, when the detail is hovered.

### Career Chain
A six-column year axis (2021 to 2026) with 1px ink ticks and graphite years, then one ruled row per role: title, employer and place, dates; the track (panel) with the bar (graphite base, ink overlay) positioned by month; CV bullets under the bar for CV roles. The running role's bar ends in a 5px marker cap. The ink overlay sweeps across each bar over its entry into the viewport (CSS scroll timeline only).

### Navigation
- **Desktop (1024px and up):** sticky 4rem header on paper with a 1px ink rule below; brand mark and the name in Brand type at left; links in Label at 400 graphite turning ink on hover, 1.75rem apart; Download CV at right.
- **Mobile:** a native `<details>` menu that works without JavaScript; a 2.75rem ink-outlined square opens a 16rem bordered panel of 2.75rem-tall links that fill ink on hover.
- **Links in text:** 1.5px underline at 0.2em offset, 40% current colour at rest, full on hover.

### Social card
The OG image is the title block drawn at 1200x630: paper, a 3px ink frame, the hero statement left, name, role, place and certifications right, a marker strip with yenus.dev and CV.

## Do's and Don'ts

### Do:
- **Do** scope every sheet style under `.sheet` with `--sh-*` tokens; leave the station and consulting worlds untouched.
- **Do** reserve marker for Download CV and the running role's bar end.
- **Do** set display in Archivo width 125 at 800 and reading in width 100 at 400 and 600 with tabular figures.
- **Do** keep every corner square and separate layers by material (paper, ink, panel), never by shadow.
- **Do** render final content in the server HTML; motion may ink it in, never gate it.
- **Do** draw systems as bands and dimension lines, never as illustrations.
- **Do** keep every bar's length an actual number of months.

### Don't:
- **Don't** use drop shadows, gradients, blur, glass, or a blueprint grid background.
- **Don't** add a second typeface or a monospace face.
- **Don't** set text in marker, or long prose in graphite on ink.
- **Don't** put a small uppercase label above any heading.
- **Don't** add a count, outcome, client, or superlative that is not in the CV or the `/career` record.
- **Don't** use cards or rounded containers for listings; use ruled rows.
