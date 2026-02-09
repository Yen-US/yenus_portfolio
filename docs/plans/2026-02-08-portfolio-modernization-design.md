# Portfolio Modernization Design

## Overview

Modernize the Yenson Umana portfolio from Next.js 14 to Next.js 16, redesign the UI with a bento grid + 3D glassmorphism card layout, and add a hybrid AI-powered summary card feature using GPT-4o.

## 1. Architecture & Upgrade Strategy

### Next.js 14 to 16 Migration

- Upgrade React 18 to 19.2, Next.js 14 to 16
- Rename `middleware.ts` to `proxy.ts` (if exists)
- Make all `params`/`searchParams` access async (`await props.params`)
- Turbopack becomes the default bundler (no flag needed)
- Replace `next lint` with direct ESLint config
- Enable React Compiler for automatic memoization (`reactCompiler: true`)
- Use `@next/codemod` to automate what it can
- Node.js minimum: 20.9.0

### Tech Stack Additions

- `framer-motion` — 3D tilt effects, entrance animations, scroll animations
- `openai` SDK — GPT-4o calls for AI summary generation
- Additional shadcn components: Card, Tabs, Tooltip, Skeleton, Dialog
- CSS custom properties for glassmorphism (backdrop-blur, translucent backgrounds)

### Project Structure (new/changed files)

```
src/
├── app/
│   ├── api/ai-summary/route.ts    ← OpenAI API route
│   ├── page.tsx                    ← Redesigned with BentoGrid
│   └── blog/page.tsx               ← Keep for future
├── components/
│   ├── bento-grid.tsx              ← Grid layout system
│   ├── glass-card.tsx              ← 3D tilt + glassmorphism card
│   ├── ai-summary-card.tsx         ← AI-powered insight cards
│   ├── tilt-card.tsx               ← Mouse-tracking 3D effect
│   └── section-reveal.tsx          ← Scroll-triggered animations
├── lib/
│   ├── ai.ts                       ← OpenAI helper + prompt templates
│   └── resume-data.ts              ← Structured resume data (AI context)
├── scripts/
│   └── generate-summaries.ts       ← Build-time AI summary generation
└── data/
    └── generated-summaries.json    ← Pre-built AI summaries
```

## 2. UI Design — Bento Grid + 3D Glass Cards

### Bento Grid Layout

The homepage becomes a responsive bento grid where each section (welcome, experience, projects, skills, education) is a card of varying size.

```
Desktop (4-col grid):
┌──────────────┬───────────┐
│   Welcome    │  AI       │
│   (2x2)      │  Summary  │
│              │  (1x2)    │
├───────┬──────┴───────────┤
│ Exp   │   Projects       │
│ (1x2) │   (2x2)          │
│       │                  │
├───────┼──────┬───────────┤
│Skills │ Edu  │  Contact  │
│(1x1)  │(1x1) │  (1x1)   │
└───────┴──────┴───────────┘

Mobile: single-column stack (all cards full-width)
```

### Glass Card Component

Each bento cell is a GlassCard with:

- **Glassmorphism**: `backdrop-blur-xl`, semi-transparent `bg-white/5` (dark) / `bg-white/70` (light), subtle `border border-white/10`
- **3D tilt**: Mouse-tracking via framer-motion's `useMotionValue` + `useTransform` — card rotates up to 8deg on X/Y axes following the cursor
- **Glow effect**: Radial gradient follows mouse position on hover, soft spotlight feel
- **Entrance animations**: Cards stagger-animate in on scroll using `whileInView` with spring physics

### Dark Mode Glassmorphism

- Dark: cards float on a deep gradient background (`from-slate-950 via-blue-950 to-slate-950`) with blur and translucency
- Light: cards sit on a clean light gray with frosted-glass whites
- Animated gradient mesh background behind the grid (subtle, slow-moving CSS animation)

### shadcn Components Used

- `Card` — base for GlassCard wrapper
- `Badge` — skill tags with glassmorphism variant
- `Avatar` — profile picture
- `Tooltip` — hover details on skills/tech icons
- `Skeleton` — loading state while AI summaries generate
- `Tabs` — experience timeline toggle (if needed)
- `Dialog` — expanded project views on click

## 3. AI-Generated Summary Cards

### Build-Time (Pre-Generated)

- A `scripts/generate-summaries.ts` script runs at build/deploy time
- Sends structured resume data (`lib/resume-data.ts`) to GPT-4o with prompts:
  - "Write a 2-sentence executive summary of this engineer's profile for a tech recruiter"
  - "Summarize this engineer's strongest technical areas in 1 sentence"
  - "What makes this candidate stand out? 1 sentence."
- Results saved to `data/generated-summaries.json` — served statically, zero latency

### On-Demand (Visitor-Triggered)

- "Ask about me" input on the AI card lets visitors type questions
- Example: "What's his experience with cloud infrastructure?"
- Hits `api/ai-summary/route.ts` which calls GPT-4o with resume as system context
- Response streams in with a typing animation (skeleton to text fade-in)
- Rate-limited: 3 requests per session via cookie

### AI Card UI

```
┌─────────────────────────────┐
│ ✦ AI Insight                │
│                             │
│ "Yenson is a full-stack     │
│  engineer with 4+ years     │
│  building scalable React &  │
│  cloud-native systems..."   │
│                             │
│ ┌─────────────────────────┐ │
│ │ Ask about me...     [→] │ │
│ └─────────────────────────┘ │
│                             │
│ ↻ Refresh insight           │
└─────────────────────────────┘
```

- Sparkle icon with subtle pulse animation to signal "AI-powered"
- Pre-generated summaries cycle on "Refresh insight" click (no API call)
- Input field triggers on-demand GPT-4o call
- Streaming response with typewriter effect via framer-motion

### Cost Control

- Build-time generation: ~$0.01 per deploy
- On-demand: GPT-4o is cheap, plus 3-request session cap
- No API key exposed — all calls through Next.js API route
- Environment variable `OPENAI_API_KEY` only on server side

## 4. Animations & Interactions

### Page Load Sequence

1. Background gradient mesh fades in (200ms)
2. Welcome card slides up + fades in (spring, 0ms delay)
3. AI Summary card slides in from right (spring, 100ms delay)
4. Remaining cards cascade in row-by-row (100ms stagger each)

Uses framer-motion `whileInView` + `staggerChildren`.

### Card Interactions

| Interaction | Effect |
|---|---|
| Mouse enter | Card lifts slightly (translateZ 20px), glow gradient appears |
| Mouse move | 3D tilt follows cursor (max 8deg), glow follows mouse position |
| Mouse leave | Smooth spring back to flat, glow fades |
| Click (projects) | Card expands into Dialog with full project details |
| Scroll into view | Fade-up with spring physics, once per session |

### 3D Tilt Implementation

- framer-motion `useMotionValue` tracks mouse X/Y relative to card center
- `useTransform` maps position to rotateX/rotateY (clamped to +/-8deg)
- `perspective: 1000px` on parent for depth
- CSS `transform-style: preserve-3d` for child elements that pop forward

### Scroll-Driven Animations

- **Progress indicator**: thin gradient bar at top of viewport, fills left-to-right as visitor scrolls. Uses `useScroll` + `useSpring`.
- **Parallax depth**: cards at different grid positions move at slightly different speeds (+/-10-20px offset) on scroll for subtle layered depth.
- **Section reveal on scroll**: each card has `whileInView` trigger — translate up 30px + fade from 0 to 1 opacity. Spring physics (stiffness: 100, damping: 15). `viewport={{ once: true, amount: 0.3 }}`.
- **Background gradient shift**: mesh background subtly shifts color palette based on scroll position. Top: cooler blues, middle: purples, bottom: warmer tones. Done via `useScroll` scrollYProgress mapped to CSS custom properties.

### Micro-Interactions

- Skill badges: subtle scale bounce on hover (1.05)
- Social links: icon color shift + lift on hover
- AI card sparkle: continuous gentle pulse (opacity 0.5 to 1, 2s loop)
- "Refresh insight" button: rotate icon 360deg on click
- Theme toggle: smooth color transition on all glass surfaces (300ms)

### Performance Guardrails

- All animations use `transform` and `opacity` only (GPU-composited)
- `will-change: transform` on tilt cards
- `prefers-reduced-motion` media query disables tilt + stagger, keeps simple fades
- Lazy load below-fold cards with `whileInView`

## 5. Implementation Phases

### Phase 1: Next.js 16 Upgrade
- Run `@next/codemod` upgrade tool
- Update all dependencies (React 19.2, Next.js 16)
- Fix breaking changes (async params, proxy rename, ESLint)
- Enable Turbopack + React Compiler
- Verify existing site works on new stack

### Phase 2: Component Foundation
- Install new shadcn components (Card, Tooltip, Skeleton, Dialog, Tabs)
- Build BentoGrid layout component
- Build GlassCard with 3D tilt + glassmorphism
- Build SectionReveal scroll animation wrapper
- Build ScrollProgress bar component
- Set up animated gradient mesh background
- Dark/light mode glassmorphism theming

### Phase 3: Page Redesign
- Extract current content into structured data (`resume-data.ts`)
- Rebuild homepage as bento grid with glass cards
- Migrate Welcome, Experience, Projects, Skills, Education into bento cells
- Add Dialog for expanded project views
- Add parallax + scroll-driven background shift
- Responsive design (mobile single-column)

### Phase 4: AI Feature
- Set up OpenAI integration (`lib/ai.ts`)
- Build `api/ai-summary/route.ts` with streaming + rate limiting
- Build `scripts/generate-summaries.ts` for build-time generation
- Build AI Summary Card component with typewriter effect
- Add "Ask about me" input + session-based rate limiting
- Generate initial summaries and commit to `data/`

### Phase 5: Polish & Performance
- Accessibility audit (prefers-reduced-motion, keyboard nav, aria labels)
- Lighthouse performance check
- Final animation tuning (spring constants, delays, stagger timing)
- Mobile interaction adjustments (no tilt on touch, tap to expand)
- Test dark/light mode transitions
