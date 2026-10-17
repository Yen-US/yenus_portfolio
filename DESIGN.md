---
name: Yenson Umaña · Showroom
description: The homepage at /, a showroom of the two products Yenson built from scratch, each shown as a real phone rising out of a field in the product's own colour.
colors:
  stage: "#0e0f10"
  panel: "#17181a"
  line: "#2a2b2e"
  ink: "#f3f1ec"
  muted: "#a4a49d"
  bezel: "#0b0b0c"
  presencia-field: "#f4dca1"
  presencia-ink: "#0b0b0a"
  listo-field: "#0f5f3f"
  listo-ink: "#ffffff"
  listo-accent: "#ffb020"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.035em"
    fontVariation: "\"opsz\" 96, \"wdth\" 100"
  closer:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.035em"
    fontVariation: "\"opsz\" 96, \"wdth\" 100"
  heading:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
    fontVariation: "\"opsz\" 48"
  intro:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 2.4vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  lede:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.75rem
  body:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.75rem
    fontFeature: "\"tnum\""
  strong:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.5rem
  label:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.5rem
    fontFeature: "\"tnum\""
  brand:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 700
    lineHeight: 1.05
  screen-label:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 600
    lineHeight: 1.25
rounded:
  button: "0.5rem"
  switch: "0.75rem"
  card: "1.25rem"
  phone: "2.4rem"
  laptop: "0.9rem"
spacing:
  gutter-mobile: "1rem"
  gutter-desktop: "2rem"
  container: "88rem"
  section: "3.5rem"
  section-desktop: "5rem"
  card-pad: "1.25rem"
  card-pad-desktop: "1.75rem"
  card-min-height: "34rem"
components:
  button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    border: "1.5px solid {colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "0 1.1rem"
    height: "3rem"
  button-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stage}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stage}"
    border: "1.5px solid {colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "0 1.1rem"
    height: "3rem"
  button-on-field:
    backgroundColor: "transparent"
    textColor: "product ink"
    border: "1.5px solid product ink"
    rounded: "{rounded.button}"
    height: "3rem"
  switch:
    backgroundColor: "{colors.panel}"
    border: "1.5px solid {colors.line}"
    rounded: "{rounded.switch}"
    height: "3.5rem"
  switch-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stage}"
    rounded: "{rounded.button}"
  product-card:
    backgroundColor: "product field"
    textColor: "product ink"
    rounded: "{rounded.card}"
    padding: "1.25rem"
    minHeight: "34rem"
  phone:
    backgroundColor: "{colors.bezel}"
    border: "10px solid {colors.bezel}"
    rounded: "{rounded.phone} {rounded.phone} 0 0"
    width: "min(17rem, 72%)"
  laptop:
    backgroundColor: "{colors.bezel}"
    border: "8px solid {colors.bezel}"
    rounded: "{rounded.laptop}"
  contact-band:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
  nav-link:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  nav-link-hover:
    textColor: "{colors.ink}"
---

# Design System: Yenson Umaña · Showroom

## Overview

**Creative North Star: "The Showroom"**

The homepage shows the work instead of describing the person. A dark, neutral stage holds two product cards, each a field in that product's own colour with a real phone rising out of its bottom edge, showing the product's real public screens. The visitor swipes or taps through them. Below, each product gets one paragraph of what Yenson built and a disclosure of the decisions you can see in it, beside a real desktop capture. The rest of the record is brief and links to `/career` and `/cv`. There is no education, certification or skills inventory on this page; those live on the CV.

Depth is physical: a bezel around a screenshot, a card on a stage. There are no gradients, no blur, no glass, no shadows. Motion is the product's own: native scroll-snap through real screens, a segmented switch between the two products, buttons that press. Nothing waits on motion; without JavaScript the first screen of each product is visible and swipeable from the first frame.

**Scope.** This system governs `/`, everything inside the `.home` wrapper (the `(home)` route group), with `--hm-*` tokens on `.home`. The CV at `/cv` keeps the station world (`.station`, `--st-*`) and the consulting pages keep theirs. Product tints are set per card as `--tint-field`, `--tint-ink`, `--tint-accent` and are read from the live products, not invented.

**Key Characteristics:**
- Two products lead; identity is one sentence and a header.
- Each product card wears the product's own colour; the page itself is neutral.
- Real screens in a real bezel; no mockups, no illustrations.
- One family, Bricolage Grotesque, with optical size and width axes; tabular figures.
- Rounded, tactile shapes (cards 1.25rem, phones 2.4rem, buttons 0.5rem) on a flat stage.
- Depth is bezel and card, never shadow, gradient or blur.
- Deep detail sits behind disclosures or on existing pages.

## Colors

A dark stage, warm off-white ink, and two product colours that are not ours.

### Primary
- **Stage** (`stage`): the page ground, header, sections.
- **Ink** (`ink`): all primary text, primary button fill, the selected switch segment, focus rings.

### Secondary
- **Presencia field / ink** (`presencia-field`, `presencia-ink`): the Presencia Studio card, read from the live site's hero field.
- **Listo field / ink / accent** (`listo-field`, `listo-ink`, `listo-accent`): the Listo card, read from the live site's primary green and amber.

### Neutral
- **Panel** (`panel`): the switch housing, the mobile menu, the contact band.
- **Line** (`line`): 1px dividers and outlined borders on the stage.
- **Muted** (`muted`): secondary text, nav at rest, screen labels, unselected switch text.
- **Bezel** (`bezel`): phone and laptop frames.

### Named Rules
**The Borrowed Colour Rule.** A product's colour appears only on that product's card and in its OG tile. The page never adopts a product colour for its own elements.

**The Neutral Stage Rule.** Page text is ink or muted on stage or panel; on a card it is the product's ink on the product's field. Nothing else.

## Typography

**Family:** Bricolage Grotesque (variable: `opsz` 12 to 96, `wdth` 75 to 100, `wght` 200 to 800), loaded once via next/font as `--font-home`. No second family, no monospace.

**Character:** A characterful grotesque that stays plain at reading sizes and gets tight and heavy at display sizes through its optical size axis.

### Hierarchy
- **Display** (800, opsz 96, clamp 2.25rem to 3.75rem, 0.95): product names on the cards. The contact closer runs to 6rem.
- **Heading** (700, opsz 48, clamp 1.75rem to 2.75rem, 1.05): section and chapter titles.
- **Intro** (700, clamp 1.375rem to 2rem): the one-sentence H1.
- **Lede** (400, 1.125rem, 1.75rem): the one line on each card.
- **Body** (400, 1.0625rem, 1.75rem): chapter paragraphs, list bodies, decisions.
- **Strong** (700, 1.125rem): employer names and item names in lists.
- **Label** (600, 0.95rem): buttons, dates, nav, the stage caption.
- **Screen label** (600, 0.85rem): the current screen's name on a card.

### Named Rules
**One Sentence Rule.** Each unit of copy is one sentence: the intro, a card line, a chapter paragraph, a decision. If it needs a second sentence it belongs behind a disclosure or on another page.

**The Credential Is Not Here Rule.** Certifications, education and skills inventories do not appear on `/`.

## Layout

One centred container, `min(100% - 2rem, 88rem)` on phones and `min(100% - 4rem, 88rem)` from 768px. Sections are separated by 1px lines and padded 3.5rem (5rem from 768px).

The showroom: intro sentence, then on phones a two-segment switch and one product card (the other is hidden by CSS `:has`, no JavaScript); from 1024px both cards sit side by side and the switch disappears. On phones a card is a field (name, line, then the phone right-aligned and clipped by the field's bottom edge so it reads as rising out of it) with the dots, the current screen's name and the open-product button in a row under the field on the stage. From 640px the whole card is the field: copy across the top, the dots, screen name and open button in a column bottom-left, the phone bottom-right.

Chapters alternate copy and laptop capture left to right. Also built and Experience are two-column (title left, ruled rows right). Contact is a closer with the email and the five actions. On phones every grid collapses to one column and the switch chooses which product card shows.

## Elevation & Depth

Physical only: a card on the stage, a bezel around a screen. No shadows, gradients, blur or glass.

## Shapes

Rounded, tactile: cards 1.25rem, the phone 2.4rem at its top corners (bottom edge clipped by the card), laptop 0.9rem, switch 0.75rem, buttons 0.5rem. Dots are 0.5rem circles that scale to 1.5x when current.

## Components

### Buttons
Outlined ink pills with 0.5rem corners, 3rem tall, a 16px stroke icon before or after the label. Default fills ink on hover; primary (Download CV) is ink-filled and empties on hover. On a product card, buttons take the product's ink and fill with it on hover. `:active` scales to 0.985. Focus is a 3px ink outline at 3px offset (product ink on a card).

### Product switch
Two radios styled as a segmented control inside a panel housing; the checked segment fills ink. Pure CSS, keyboard operable; hidden from 1024px where both cards are visible.

### Product card
A field in the product's tint with the product's ink; min height 34rem; name in Display, one line in Lede; the phone bottom-right rising from the edge; open-product button bottom-left; dots and the screen label on the left.

### Phone (signature)
A bezel (10px, bezel colour, 2.4rem top corners, no bottom edge) around a horizontal scroll-snap track of the product's real public screens (600x1298 captures). Native swipe works without JavaScript; with it, a tap steps to the next screen, dots are live buttons with 2.75rem hit areas, arrow keys step, and the current screen's label updates politely. Smooth scrolling only under `prefers-reduced-motion: no-preference`.

### Laptop
An 8px bezel around the product's real desktop capture (1440x900).

### Disclosure
`<details>` with a bold summary and a "+" that rotates to "x" when open. Holds the decisions list.

### Navigation
Sticky 4rem header on the stage with a 1px line; brand mark in an ink square and the name; links in Label muted turning ink on hover; Download CV (phones: "CV") at right; a native `<details>` menu under 1024px.

### Social card
The OG image: name and role, the one line, and the two product fields side by side with their domains.

## Do's and Don'ts

### Do:
- **Do** lead with the products; identity is one sentence.
- **Do** use only real public screens and desktop captures of the products, labelled by what they show.
- **Do** read product colours from the live products and keep them on their cards.
- **Do** keep every copy unit to one sentence and put depth behind disclosures or on `/career` and `/cv`.
- **Do** keep swiping native and tapping a progressive enhancement.

### Don't:
- **Don't** put education, certifications or a skills inventory on `/`.
- **Don't** invent traction, user counts, revenue or outcomes for either product.
- **Don't** use gradients, blur, glass or shadows; depth is bezel and card.
- **Don't** add a second typeface or a monospace face.
- **Don't** show account, admin or customer pages of the products; public pages only.

## Addendum: client work page (`/work/customer-acquisition`, 2026-10-17)

Inherits this system unchanged. Each client case is a product card in the client's own colour (read from the
client's live page: Guanacaste Earthmoving dark earth `#2a1409` with cream ink `#f6efe1`; JR Rodríguez warm paper
`#f4f0e6` with ink) carrying the client's logo, name, one line and the phone of real public screens. Beside it: one
sentence on the role, then Context, What I built, How a customer arrives, Where it stands (dated), real public
images, public links. Three additions, all prefixed `cw-`: the acquisition-flow chain (outlined chips, final step
filled ink, a drawn chevron between steps), the public-image gallery (auto-fit grid, 0.75rem corners on the panel
colour), and the logo row. No new colours, type, shadows or motion.
