# Product

<!-- impeccable:product-schema 1 -->

> Written 2026-10-15 from the founder's written brief (relayed by Jarvis) and repository evidence.
> No interactive interview was possible in this session; facts marked *(inferred)* need founder confirmation.

## Platform

web

## Users

- **Primary:** recruiters, hiring managers, and technical interviewers at international remote-first
  companies evaluating Yenson Umaña for Senior AI Solution Architect / production agentic AI engineering
  roles. They arrive from a LinkedIn profile, a CV link, or an application, usually scanning in under a
  minute before deciding whether to read on or download the CV.
- **Secondary:** startup founders and CTOs looking for independent AI architecture advice. They are served
  by the consulting landing at `/consulting` and its sub-routes (`/services`, `/work`, `/about`, `/discovery`).

## Product Purpose

`yenus.dev` is Yenson Umaña's personal site. `/` is a recruiter-facing portfolio: who he is, what he has
shipped, how he reasons about architecture, his experience, skills, and an easy path to contact and the CV.
Success is a recruiter understanding the role fit within seconds and taking one action: download the CV,
email, or open LinkedIn.

## Positioning

A production agentic AI architect who has been shipping conversational/agent systems since 2022 (OneReach.ai),
now advises startups through Microsoft for Startups (via Accenture), and also builds and operates his own
products (Presencia Studio). The combination of advisory judgement and hands-on operation is the claim.

## Capabilities and Constraints

- Next.js 16 App Router, server-rendered; content must be visible without JavaScript.
- The previous consulting landing must stay intact at `/consulting`, including the discovery booking flow.
- English is the primary language for international remote hiring. *(inferred)* No locale routing exists in
  this repository today.
- No paid image generation and no new third-party services.

## Brand Commitments

- Name: **Yenson Umaña** (CV full name: Yenson Umaña Solano). Brand mark: `public/brand/yenson-umana-mark.svg`.
- Portrait assets: `public/YenUSPP2.webp`, `public/YenUSPP3.webp`.
- Founder dislikes: primitive SVG/clipart, generic AI-dashboard cards, cream backgrounds, italic accent
  headings, gratuitous numbered sections. Likes bold, creative, animated design.

## Evidence on Hand

- CV: Yenson's supplied CV is the source for credentials; the public download `public/yenson-ai-resume.pdf`
  is a generated derivative with founder-confirmed date corrections (see `docs/cv/PROVENANCE.md`).
- Public repositories: `Yen-US/amplification-of-potential` (AOP Beacon), `Yen-US/copilot-gateway`,
  `Yen-US/yenus_portfolio`.
- Live products: presencia.studio (Presencia Studio), usalisto.com (Listo) — source repos are private.
- **Must not be fabricated or published:** client names beyond those already public, business outcomes,
  testimonials, "60+ teams" counts, private metrics, internal credentials, employer-confidential work.
- Employment dates confirmed by Yenson on 2026-10-15: Microsoft (via Accenture) May 2024 - Oct 2026,
  Wind River Oct 2024 - Jun 2026. Neither role may be presented as current.

## Product Principles

1. Every claim traces to the CV or to public repository evidence.
2. Recruiter speed first: role, proof, CV within one viewport.
3. Show architecture judgement (decisions and trade-offs), not adjectives.
4. Confidential client and employer detail stays out.

## Accessibility & Inclusion

WCAG 2.2 AA; full keyboard access; `prefers-reduced-motion` respected; no scroll hijacking.
