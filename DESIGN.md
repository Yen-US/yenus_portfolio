---
name: Yenson Umaña · Station
description: The recruiter portfolio at / and /cv, read like a station departures board and a printed rail timetable.
colors:
  board-ink: "#0c0c0d"
  housing: "#141416"
  tile: "#1f1f22"
  tile-top: "#26262a"
  ghost-tile: "#18181a"
  hinge-seam: "#0a0a0b"
  rule-line: "#2c2c31"
  enamel-paper: "#f1f0ec"
  platform-grey: "#a6a6ad"
  timetable-yellow: "#ffc61a"
  timetable-ink: "#17140a"
  signal-orange: "#ff5a1f"
  signal-ink: "#120804"
  sheet-grey: "#4a4a50"
typography:
  display:
    fontFamily: "Big Shoulders, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 8vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Big Shoulders, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Big Shoulders, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 2rem
    fontFeature: "\"tnum\""
  body-strong:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.75rem
    fontFeature: "\"tnum\""
  label:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.25
    fontFeature: "\"tnum\""
  chip:
    fontFamily: "Big Shoulders, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.02em"
rounded:
  none: "0px"
  tile: "2px"
spacing:
  gutter-mobile: "1rem"
  gutter-desktop: "2rem"
  container: "84rem"
  panel-mobile: "1rem"
  panel-desktop: "2rem"
  row: "1.5rem"
  row-desktop: "2rem"
  section: "5rem"
  section-desktop: "7rem"
components:
  button-primary:
    backgroundColor: "{colors.signal-orange}"
    textColor: "{colors.signal-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.tile}"
    padding: "0 1.25rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.enamel-paper}"
    textColor: "{colors.signal-ink}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.enamel-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.tile}"
    padding: "0 1.25rem"
    height: "3rem"
  button-secondary-hover:
    backgroundColor: "{colors.enamel-paper}"
    textColor: "{colors.board-ink}"
  button-on-timetable:
    backgroundColor: "{colors.timetable-ink}"
    textColor: "{colors.timetable-yellow}"
    typography: "{typography.label}"
    rounded: "{rounded.tile}"
    padding: "0 1.25rem"
    height: "3rem"
  button-on-timetable-hover:
    backgroundColor: "{colors.board-ink}"
    textColor: "{colors.enamel-paper}"
  flap-tile:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.enamel-paper}"
    rounded: "{rounded.tile}"
  flap-tile-yellow:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.timetable-yellow}"
    rounded: "{rounded.tile}"
  flap-tile-ghost:
    backgroundColor: "{colors.ghost-tile}"
    rounded: "{rounded.tile}"
  flap-chip:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.enamel-paper}"
    typography: "{typography.chip}"
    rounded: "{rounded.tile}"
    padding: "0.3rem 0.7rem"
    height: "2.25rem"
  timetable-sheet:
    backgroundColor: "{colors.timetable-yellow}"
    textColor: "{colors.timetable-ink}"
    rounded: "{rounded.none}"
    padding: "3rem 2.5rem"
  board-panel:
    backgroundColor: "{colors.housing}"
    textColor: "{colors.enamel-paper}"
    rounded: "{rounded.none}"
    padding: "2rem"
  cv-sheet:
    backgroundColor: "{colors.enamel-paper}"
    textColor: "{colors.housing}"
    rounded: "{rounded.none}"
    padding: "3.5rem"
  nav-link:
    textColor: "{colors.platform-grey}"
    typography: "{typography.label}"
  nav-link-hover:
    textColor: "{colors.enamel-paper}"
---

# Design System: Yenson Umaña · Station

## Overview

**Creative North Star: "The Departures Board"**

A career read the way a traveller reads a station: role, route, and how to reach him at a glance. The world is board-black housing carrying split-flap tiles with a drawn hinge seam and ghost tiles for empty cells, printed timetable-yellow sheets that carry readable prose in black, enamel off-white signage type, and one signal orange reserved for the live action (Download CV). It is loud at the display scale and plain at the reading scale: monumental condensed capitals on the board, a calm DIN-like sans for everything a recruiter actually reads.

Depth is flat overlap: housing sits on ink, tiles sit on housing, a yellow sheet sits on the board. Nothing floats, nothing glows, nothing graduates. The one motion is mechanical and once: the hero board's upper leaves flutter onto characters that are already painted, then the board is static.

**Scope.** This system governs only `/` and `/cv`, everything rendered inside the `.station` wrapper (the `(portfolio)` route group layout). Tokens are declared as `--st-*` custom properties on `.station`, not on `:root`. The consulting world (cream and serif palette in `:root` and `.consulting-shell`, `consulting-` classes, served at `/consulting`, `/services`, `/work`, `/about`, `/discovery`) is a separate, intentionally preserved system and is out of scope for this file. Do not pull its tokens into station surfaces or station tokens into it.

**Key Characteristics:**
- Board-black housing, split-flap tiles with a hinge seam, ghost tiles for empty cells.
- Timetable yellow as a printed sheet material carrying black prose, never as a text accent on long copy.
- Signal orange appears only on the Download CV action.
- Condensed signage capitals for display; DIN-like sans for reading, with tabular figures throughout.
- Near-square corners (2px) on tiles and buttons; sheets and panels are square.
- Flat overlap for depth; no drop shadows, no gradients, no blur.
- One CSS-only arrival flutter on the hero board; content never waits on it.

## Colors

A black station hall lit by one yellow timetable and one orange signal, with enamel-white signage between.

### Primary
- **Timetable Yellow** (`timetable-yellow`): the printed sheet material. Fills the hero action strip, the Experience timetable, the portrait panel, and the header brand-mark square; colours the second (role) line of every flap board, project spine names, and skill-group headings on the board. Also the focus ring and text selection colour on dark.
- **Timetable Ink** (`timetable-ink`): black type and heavy rules printed on yellow; also the fill of the dark button that sits on a yellow strip.

### Secondary
- **Signal Orange** (`signal-orange`): the live action only. The Download CV button (header, hero strip, CV page, contact) and the Download CV link in the mobile menu. Its text is **Signal Ink** (`signal-ink`).

### Neutral
- **Board Ink** (`board-ink`): the page ground, header bar, and theme colour.
- **Housing** (`housing`): the board cabinet behind flap rows, and alternating section bands (Approach, Contact), project panels, and the mobile menu panel. Also the ink colour of the CV sheet.
- **Tile** (`tile`) with **Tile Top** (`tile-top`, upper leaf at 32% opacity), **Ghost Tile** (`ghost-tile`), and **Hinge Seam** (`hinge-seam`): the split-flap material. Tile is reused for flap chips, the mobile menu button, and image wells.
- **Rule Line** (`rule-line`): 1px dividers on dark: header and footer borders, section borders, project and principle row rules.
- **Enamel Paper** (`enamel-paper`): primary text on dark, primary hover state, and the CV sheet ground.
- **Platform Grey** (`platform-grey`): secondary text on dark (nav at rest, supporting copy, stack lines, footer).
- **Sheet Grey** (`sheet-grey`): secondary text and list markers on the CV sheet.

### Named Rules
**The One Signal Rule.** Signal orange marks the Download CV action and nothing else. A second orange element is a second signal, and the board stops meaning anything.

**The Printed Sheet Rule.** Yellow is a surface you print black text on, or a short label colour at display or heading scale on dark. Long prose is never set in yellow on black.

**The CV Paper Rule.** The `/cv` sheet is enamel paper, not yellow: it is the long-form reading and print document. In print the station ground becomes white and chrome is hidden.

## Typography

**Display Font:** Big Shoulders (optical size axis; fallback ui-sans-serif, system-ui, sans-serif), loaded via next/font as `--font-station-display`
**Body Font:** Barlow 400 and 600 (fallback ui-sans-serif, system-ui, sans-serif), loaded via next/font as `--font-station-body`

**Character:** Station signage over a timetable. Big Shoulders is always uppercase, condensed and heavy, set tight; Barlow is the plain DIN-like voice that does the reading. Tabular figures are on for the whole world so dates and codes align like a timetable.

### Hierarchy
- **Display** (900, clamp 3rem to 6rem, line-height 0.9): section titles (Selected work, Experience, Skills, How I make architecture calls, the CV page title). The contact closer runs one step larger (clamp 3.25rem to 7rem, 0.88).
- **Headline** (800, clamp 2rem to 3.25rem, 0.95): principle titles in the Approach listing; the lead project name at 2.25rem to 3rem.
- **Title** (800 to 900, 1.875rem to 2.25rem, 0.95 to 1): project spine names, experience role titles, timetable dates (1.5rem to 1.75rem), CV section heads (1.5rem).
- **Body** (400, 1.125rem, 2rem leading): reading copy, capped at about 65 to 70 characters (`max-w-prose`, `max-w-xl`, `70ch` on the CV). The hero lede runs at 1.25rem to 1.5rem.
- **Label** (600, 0.95rem): buttons, organisation lines, links on yellow. Nav links use the same size at 400. Small supporting text is 0.875rem in platform grey.
- **Chip** (Big Shoulders 700, 1.05rem, uppercase, 0.02em tracking): skill tags only.
- **Flap glyph** (Big Shoulders 800, sized to the tile: `100cqw / cols * 1.02`, line-height 1): board characters only.

### Named Rules
**The Two Voices Rule.** Big Shoulders speaks in capitals at heading scale and above; Barlow speaks everything that is read. No third face, and no monospace.

**The Credential Is Body Rule.** Codes and numbers (certification codes, dates in copy) are bold body text beside their names, not display-scale stat monuments.

## Layout

A single centred container, `min(100% - 2rem, 84rem)` on mobile and `min(100% - 4rem, 84rem)` from 768px. Sections are full-bleed bands with 5rem vertical padding, 7rem from 768px, alternating board ink and housing, separated by 1px rule lines. Compositions are left-aligned and asymmetric: the hero is a 1.6fr board column against a 1fr portrait panel at 1024px and above and fills the viewport below the 4rem header; the lead project is board beside copy; project spines are three columns (0.85fr / 1.5fr / 0.9fr); principles and timetable rows are two columns (title left, reason right; dates in an 11rem column on the timetable, 12rem section heads on the CV).

Listings are ruled rows, not cards: rows of 1.5rem vertical padding (2rem from 768px). The lead project turns face-out as its own route board; the rest stay spine-out as ruled rows beneath it. On mobile every grid collapses to one column, the hero board drops from 13 to 10 columns, and the portrait panel moves below the action strip. Anchor targets carry a 5rem scroll margin for the sticky header.

## Elevation & Depth

Flat. Depth is conveyed only by tonal overlap in the stated order (ink, housing, tile, tile top) and by a printed yellow sheet laid on the board. There are no drop shadows, no gradients, no blur or glass. The single `box-shadow` in the world is an inset 1.5px enamel stroke used as the secondary button's border; it is a line, not elevation.

### Named Rules
**The Flat Overlap Rule.** A surface is lifted by being a different material laid on top, never by a shadow. If a layer needs to separate, move it one step along ink, housing, tile.

## Shapes

Near-square. Flap tiles, flap chips, and buttons carry a 2px radius, the softness of a pressed enamel tile; every panel, sheet, band, image well, and brand-mark square is square-cornered. Flap tiles keep an aspect ratio of 0.74 with a 2px hinge seam across the middle and a lighter upper half. Rules are the other recurring form: 1px rule lines on dark; on the yellow timetable, 6px heavy rules close the header and footer of the sheet and 2px rules divide rows; the Approach listing opens with a 3px enamel rule; the CV sheet header closes with a 6px ink rule.

## Components

### Buttons
Tactile signage blocks: solid, square-ish, and pressed 1px on activation.
- **Shape:** near-square (2px), minimum height 3rem, 1.25rem inline padding, 0.6rem gap for a leading 16px stroke icon.
- **Primary (Download CV):** signal orange with signal ink text; hover turns to enamel paper. Only for the CV download.
- **Secondary:** transparent with an inset 1.5px enamel stroke and enamel text; hover fills enamel with board ink text. Used for email, LinkedIn, GitHub on the contact band.
- **On-timetable:** timetable ink with yellow text, for the action that sits on a yellow strip (View CV); hover goes to board ink with enamel text.
- **Hover / Focus:** 160ms colour transitions; `:active` translates down 1px. Focus is a 3px yellow outline at 3px offset; on a yellow strip the ring switches to timetable ink.

### Chips
- **Style:** flap chips for skills: tile ground, enamel text, Big Shoulders 700 uppercase at 1.05rem, 2px radius, 2.25rem minimum height. Static, not interactive.
- **State:** none. Chips carry no hinge seam: at chip scale the seam reads as strikethrough.

### Cards / Containers
The world has no cards. It has three container materials:
- **Board panel:** housing ground, square, 1rem padding (2rem from 768px); holds the lead project and the ruled project spines.
- **Timetable sheet:** yellow ground, timetable ink text, square, 2rem by 1.25rem padding (3rem by 2.5rem from 768px), 6px and 2px ink rules. Holds Experience and the hero action strip (a tighter 0.75rem to 1rem strip).
- **CV sheet:** enamel paper ground, housing-coloured ink, square, 2rem by 1.25rem padding (3.5rem from 768px); prints on white with no padding.

### Navigation
- **Desktop (1024px and up):** sticky 4rem header on board ink with a 1px rule line below; yellow brand-mark square and the name in Big Shoulders 800 at left; links in Barlow 0.95rem platform grey turning enamel on hover, 1.75rem apart; Download CV at right.
- **Mobile:** a native `<details>` menu that works without JavaScript; a 2.75rem tile-coloured square button opens a 15rem housing panel of 2.75rem-tall links that turn tile on hover. Download CV (PDF) appears in the panel in signal orange below 640px.
- **Links in text:** 1px underline at 0.22em offset, 45% current-colour at rest, full colour on hover.

### Split-Flap Board (signature)
A board of real text laid out into fixed columns (13 on desktop, 10 on mobile for the hero; 12 for the lead project route board). Each cell is a flap tile; empty cells are ghost tiles so the grid of the board is always visible. The first line is enamel, following lines may be yellow. Tile gaps and padding scale with container queries. The board is `aria-hidden`; its text is always provided beside it as a real heading.

**Motion:** only the hero board animates. Each non-ghost tile's upper leaf flutters 2 to 5 times (90ms linear `scaleY` squash onto the hinge, 55% opacity) with a deterministic stagger, then disappears. Characters are server-rendered at full opacity from the first frame; with no JS, no animation support, or `prefers-reduced-motion`, the final board is identical.

## Do's and Don'ts

### Do:
- **Do** scope every station style under `.station` and use the `--st-*` tokens; leave the consulting world untouched.
- **Do** reserve signal orange for Download CV.
- **Do** print readable prose on yellow in timetable ink, with heavy 6px rules at sheet edges and 2px row rules.
- **Do** set display type in Big Shoulders uppercase at 800 to 900 and reading type in Barlow 400/600 with tabular figures.
- **Do** keep tiles, chips, and buttons at 2px radius and every panel square.
- **Do** separate layers by material (ink, housing, tile, yellow sheet), never by shadow.
- **Do** render final content in the server HTML; motion may decorate it, never gate it.
- **Do** switch the focus ring from yellow to timetable ink on yellow surfaces.

### Don't:
- **Don't** use drop shadows, gradients, blur, or glass. An inset stroke used as a button border is allowed.
- **Don't** add a monospace face or a third typeface.
- **Don't** set long prose in yellow or orange on black.
- **Don't** draw a hinge seam on anything smaller than a flap tile.
- **Don't** place the dark-shirted portrait directly on board black; it sits on a yellow panel.
- **Don't** turn credentials or numbers into display-scale stat monuments.
- **Don't** use cards with rounded corners for listings; use ruled rows.
- **Don't** animate anything beyond the one hero arrival flutter.
