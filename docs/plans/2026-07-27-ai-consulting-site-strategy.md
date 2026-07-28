# AI Consulting Site Strategy

## Decision Summary

Yenson Umaña is positioned as an AI strategy and architecture partner for early and growth-stage startups moving from an ambitious AI idea or prototype toward production.

The site does not sell generic AI automation or open-ended software development. It sells senior judgment around consequential AI decisions, grounded in hands-on production experience.

Core promise:

> From AI ambition to production clarity.

Primary conversion:

> Request a free 30-minute discovery call.

Pricing is not published at launch. The discovery process qualifies the value, complexity, urgency, and available investment before an engagement is scoped.

## Ideal Customer Profile

### Primary Organizations

- Early and growth-stage startups, from bootstrapped through Series B+
- AI-native companies or startups making AI central to the product
- Founding and scaling teams, commonly 3 to 50 engineers
- A founder or CTO close to the product and architecture decisions
- Enough product momentum for the next AI decision to materially shape the company

### Primary Buyers

- Founder or technical co-founder
- CTO
- VP or Head of Engineering
- Technical Head of Product
- Founding AI or platform lead

### Trigger Moments

- The founders see several viable AI opportunities but no defensible first bet
- A promising agent, RAG system, or AI feature must move beyond prototype
- Teams disagree on models, platforms, data, evaluation, or governance
- A growing team is outgrowing decisions and context held by one founder
- The startup needs senior AI architecture guidance before it can justify a full-time hire

### Poor Fit

- Buyers seeking isolated no-code automations at the lowest possible price
- Companies without a founder, CTO, or technical owner close to the work
- Initiatives with no defined customer or business consequence
- Requests for outsourced development with no strategy, architecture, or adoption need

## Differentiated Position

The positioning rests on five credible advantages already present in Yenson's career:

1. Production AI experience beginning in October 2022, before ChatGPT's public launch.
2. Current AI architecture work supporting Microsoft for Startups globally via Accenture.
3. Enterprise customer and platform context across DocuSign, Wrike, Wind River, and OneReach.ai.
4. Founder/operator experience through live products, including Presencia Loyalty.
5. Pattern recognition from repeatedly helping startup teams find a clear production path while the product, models, and constraints are still moving.

The public claim is deliberately precise:

> Senior AI Solution Architect supporting Microsoft for Startups globally via Accenture.

Do not use an unchecked worldwide seniority superlative. Do not imply Microsoft or Accenture endorses the independent practice.

## Offer Ladder

### Free Discovery Call

- 30 minutes
- Confirms the decision, stakes, readiness, and mutual fit
- Not a free strategy session
- Visitor selects a weekday start in one-hour intervals from 10:00 AM through 5:00 PM Costa Rica
- Times are detected and displayed in the visitor's timezone with the Costa Rica equivalent
- Meeting is instantly confirmed and matching calendar invitations are emailed to both parties

### AI Direction Sprint

- 1 to 2 weeks
- Use-case prioritization, readiness, risk, and a 90-day roadmap
- Best when leadership knows AI matters but has not chosen the right first investment

### AI Architecture Sprint

- 2 to 4 weeks
- Flagship engagement for one consequential initiative
- Produces target architecture, decision records, human-AI boundaries, evaluation and operational plans, and a phased handoff

### AI Team Enablement

- 3 to 6 weeks
- Founder alignment, right-sized governance, team workflows, office hours, and adoption measures
- Enablement is tied to startup delivery practices rather than generic AI literacy

### Fractional AI Architect

- Available after an initial sprint
- Ongoing architecture review, vendor decisions, technical oversight, and leadership support
- Capacity assumption: one active sprint and a small number of advisory relationships

## Delivery Boundary

Implementation remains available only when it resolves a material unknown or supports team transfer.

Publicly emphasized:

- AI opportunity and use-case selection
- Product and systems architecture
- Agents and RAG architecture
- Production hardening, evaluation, guardrails, observability, latency, and cost
- Full-stack and cloud integration decisions
- Team enablement, governance, and executive adoption

Not publicly emphasized:

- Open-ended custom development
- Generic Make, Zapier, or n8n automation work
- Azure migration as a standalone service
- Tool-first or model-first consulting

## Proof Model

Launch proof is intentionally honest about what is a result and what is a design target.

### Primary Cases

1. Anonymized Y Combinator startup migration
   - Shows architecture authority and execution under time pressure
   - Approved facts: full production migration in seven days and zero customer-visible downtime
   - Keep the company anonymous and do not use its logo

2. AOP Beacon
   - Named client with approval
   - Shows privacy boundaries, guardrails, fallback design, latency target, and cost target
   - Targets must remain labeled as targets until measured after a live event

### Operator Proof

1. Presencia Loyalty
   - Live SaaS product
   - Demonstrates product ownership after launch

2. Junior Rodríguez × Presencia
   - Named connected-product example
   - Supports product thinking and cross-physical/digital experience design
   - Secondary to the core AI cases

### Proof To Add Next

- Attributed client testimonials with name, title, and company
- Sanitized architecture diagrams and decision records
- Before/after adoption or operational metrics
- An AI initiative triage artifact visitors can inspect
- One detailed case with baseline, measurement period, intervention, and result attribution

## Homepage Information Architecture

1. Literal category and promise
2. Buyer and outcome definition
3. Current credibility statement
4. The startup reality and the leverage Yenson brings to early ambiguity
5. The before-and-after transitions produced by startup advisory
6. Engagement ladder with scope, duration, fit, and deliverables
7. Startup proof, led by the anonymized YC migration
8. Working method and operating principles
9. Startup architecture authority and conflict disclosure
10. FAQ for implementation, fit, training, confidentiality, and geography
11. Discovery request CTA

The previous job-seeking portfolio remains at `/career`, is excluded from search indexing, and is not linked in the consulting navigation.

## Visual Strategy

Direction: executive technical editorial.

- Light paper background with deep ink, forest signal green, and restrained brass
- Real portrait as a first-viewport personal-brand signal
- Serif display typography paired with technical monospace details
- Full-width bands and ruled layouts instead of nested cards
- Architecture artifacts and constraints instead of abstract AI imagery
- Limited entrance motion using transform and opacity
- Stable controls, no sliders, no decorative technology spheres, and no bento-grid homepage

## Discovery Operations

The `/discovery` page collects:

- Name, work email, company, role, and startup stage
- Current initiative stage
- A description of the decision or change
- Investment readiness
- Confirmed Costa Rica slot and detected visitor timezone
- Explicit consent for response

The API:

- Validates all fields with Zod
- Rejects cross-origin submissions
- Applies a basic per-IP rate limit
- Uses a hidden honeypot for low-cost bot filtering
- Sends an owner brief and a visitor receipt through Resend
- Sends a confirmed `.ics` calendar invitation with a stable meeting URL
- Does not add the visitor to a marketing list

Production requires a verified `yenus.dev` sender in Resend. Email-only scheduling cannot prevent calendar conflicts; a calendar availability integration can be added later if request volume warrants it.

## Initial Go-To-Market Use

The site should support three focused acquisition motions rather than trying every channel:

1. LinkedIn field notes
   - Architecture tradeoffs, AI failure modes, adoption patterns, and anonymized decision stories
   - Each post should reveal operating judgment, not repeat generic AI news

2. Warm network and relevant communities
   - Former colleagues, startup founders, product leaders, Microsoft ecosystem contacts, and trusted regional networks
   - Lead with a useful diagnosis or framework before asking for a call

3. Targeted outbound
   - Research a visible AI initiative or trigger
   - Send a short, specific note or Loom with the decision risks observed
   - Route the prospect to the discovery page, not a generic contact form

Three initial message wedges can be tested inside the same ICP:

- Choosing and sequencing the right AI initiatives
- Moving agents and RAG systems from prototype to production readiness
- Turning scattered AI usage into governed team adoption

## Funnel Metrics

Track:

- Discovery page visits
- Discovery form completion rate
- Qualified request rate
- Requested-to-confirmed call rate
- Confirmed call-to-proposal rate
- Proposal-to-close rate
- Engagement type and source

Do not optimize button colors or add popups before there is enough traffic to identify a real funnel constraint.

## Research Basis

Research completed on 2026-07-27 included:

- The supplied `AI Consulting Blueprint for Beginners in 2026`, used for discovery, qualification, consultative selling, onboarding, delivery, and retention patterns
- Kavita Ganesan / Opinosis Analytics for the personal expert plus consultancy model
- Winder.AI for technical proof and production credibility
- April Dunford for premium productized professional services
- Hamel Husain for inspectable technical authority
- Ivan Cortez for a launch-stage personal consultant site with a direct discovery path
- Edelman and LinkedIn's 2025 B2B thought leadership research
- 6sense's 2025 B2B buyer experience research
- Gartner's 2026 research on self-directed B2B buying and seller validation

Observed pattern: the strongest specialist sites combine narrow positioning, direct practitioner access, bounded engagements, inspectable proof, clear risk handling, and multiple ways for a buyer to qualify the expert before a call.