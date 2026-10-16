/**
 * Content for the recruiter portfolio at `/` in its "sheet" world (a drawing
 * sheet with a title block). Everything here derives from the two designated
 * sources: `portfolio-data.ts` (the CV, which also generates the public PDF)
 * and the career record published at `/career` (`resume-data.ts`).
 *
 * Rules, enforced by `sheet-data.test.ts`:
 * - No outcome, metric, client name, or testimonial that is not in those sources.
 * - Microsoft (via Accenture) ended Oct 2026 and Wind River ended Jun 2026;
 *   neither is current. Only Presencia Studio runs to the present.
 * - Early-career roles carry title, employer, dates and place only. No
 *   superlatives, tenure labels, or promotion counts from `/career` are reused.
 * - Positioning copy below is a DRAFT for the founder's approval.
 */

import { experiences } from "@/lib/resume-data";
import { certifications, education, experience, person, projects, skillGroups } from "@/lib/portfolio-data";

export { certifications, education, person, skillGroups };

/** The revision stamp printed in the title block. The page is dated, like a drawing. */
export const revision = "Oct 2026";

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const hero = {
  /** DRAFT positioning line. */
  title: "Production AI, drawn to scale.",
  /** Dates: OneReach.ai from Oct 2022 (CV); ChatGPT launched 30 Nov 2022. */
  lede:
    "Shipping AI systems since October 2022, a month before ChatGPT launched. Most recently leading AI advisory for Microsoft for Startups, via Accenture, from 2024 to 2026.",
  basedIn: "Costa Rica, works remotely",
};

/* ------------------------------------------------------------------ */
/* Selected work: three details                                        */
/* ------------------------------------------------------------------ */

export type Band = { label: string; note?: string; tone?: "ink" | "paper" };

export type Detail = {
  id: string;
  title: string;
  context: string;
  /** The decisions, as callouts. Each one is already published on `/` or in the CV. */
  decisions: string[];
  stack: string[];
  /** A typographic section cut of the system: ordered bands, top to bottom. */
  cut?: { bands: Band[]; dimension: string };
  image?: { src: string; alt: string; width: number; height: number };
  link?: { href: string; label: string };
};

const aop = projects.find((p) => p.id === "aop-beacon");
const presencia = projects.find((p) => p.id === "presencia-studio");

export const details: Detail[] = [
  {
    id: "azure-migration",
    title: "A full production migration, Vercel + GCP to Azure, in one week.",
    context:
      "For a startup in the Microsoft for Startups program; the client stays anonymous. Advisory work, executed hands-on.",
    decisions: [
      "One target architecture, an acceptance gate per subsystem, then a single cutover. No months of running two platforms.",
      "Agent-assisted execution with Claude Code and MCP, with the startup’s engineers in the loop so they owned the result.",
    ],
    stack: ["Azure", "Claude Code", "MCP", "Azure Agent Dev Kit"],
    cut: {
      bands: [
        { label: "Vercel + GCP", note: "source", tone: "ink" },
        { label: "Acceptance gate per subsystem", tone: "paper" },
        { label: "Single cutover", tone: "paper" },
        { label: "Azure", note: "target", tone: "ink" },
      ],
      dimension: "1 week",
    },
  },
  {
    id: "aop-beacon",
    title: "AOP Beacon: an AI conversation prompt at a live event table.",
    context:
      "NFC beacons on event tables open an AI-written prompt for the people sitting there. Architecture and build for Amplification of Potential.",
    decisions: [
      "The model gets four seconds. On a timeout, an error, or an empty reply, a prompt from a curated library takes over, so the moment is never lost.",
      "The request carries only the stage, the language, and the chosen cards. Participant names never reach the model.",
      "English and Spanish, across four conversation stages.",
    ],
    stack: aop?.stack ?? ["NFC", "OpenAI", "Next.js", "Supabase"],
    cut: {
      bands: [
        { label: "NFC beacon on the table", tone: "ink" },
        { label: "Stage, language, chosen cards", note: "the whole payload", tone: "paper" },
        { label: "Model", note: "4 s budget", tone: "ink" },
        { label: "Curated prompt library", note: "fallback", tone: "paper" },
      ],
      dimension: "4 s",
    },
    link: aop?.link,
  },
  {
    id: "presencia-studio",
    title: "Presencia Studio: NFC cards, QR menus and a loyalty program for small businesses in Costa Rica.",
    context:
      "Founded in 2025. The MVP runs on Next.js 16, Supabase and Vercel with a bilingual content system. Custom work includes the Junior Rodríguez NFC painting series, where each physical painting opens its own digital story.",
    decisions: [],
    stack: presencia?.stack ?? ["Next.js 16", "Supabase", "Vercel", "NFC"],
    image: presencia?.image,
    link: presencia?.link,
  },
];

/* ------------------------------------------------------------------ */
/* How I decide: rules with the project each came from                 */
/* ------------------------------------------------------------------ */

export const rules = [
  {
    title: "Budget the model’s time, then design the miss.",
    body: "Four seconds, then the curated library. The table never waits on a slow or empty reply.",
    source: "AOP Beacon",
  },
  {
    title: "Private data stays out of the payload by construction, not by policy.",
    body: "The request is the stage, the language and the chosen cards. There is no field a name could travel in.",
    source: "AOP Beacon",
  },
  {
    title: "One cutover with gates beats two platforms for months.",
    body: "Each subsystem earned its acceptance gate, then the whole stack moved once.",
    source: "Vercel + GCP to Azure",
  },
  {
    title: "The team that runs the system owns every decision in it.",
    body: "The migration ran with the startup’s own engineers; the enablement sessions existed so nobody had to call me back.",
    source: "Microsoft for Startups advisory",
  },
];

/* ------------------------------------------------------------------ */
/* Experience: the dimensioned chain                                   */
/* ------------------------------------------------------------------ */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Months since Jan 2021 for "May 2024", "2025", or "Present". `Present` resolves to the revision month. */
export function monthIndex(label: string, origin = "Jan 2021"): number {
  const parse = (s: string): [number, number] => {
    const t = s.trim();
    if (/^present$/i.test(t)) return parse(revision);
    const m = t.match(/^([A-Z][a-z]{2})\s+(\d{4})$/);
    if (m) return [+m[2], MONTHS.indexOf(m[1])];
    const y = t.match(/^(\d{4})$/);
    if (y) return [+y[1], 0];
    throw new Error(`Unparseable month label: ${s}`);
  };
  const [oy, om] = parse(origin);
  const [y, mo] = parse(label);
  return (y - oy) * 12 + (mo - om);
}

export type ChainRole = {
  title: string;
  org: string;
  place: string;
  /** Month-granular, plain hyphen, as displayed. */
  dates: string;
  start: number;
  /** Exclusive end month index; for a running role, the revision month + 1. */
  end: number;
  current: boolean;
  /** CV bullets, only for roles on the CV. */
  points: string[];
};

export const chainOrigin = "Jan 2021";
/** The axis runs to the end of the revision year so the open bar has room. */
export const chainEnd = monthIndex("Dec 2026") + 1;
export const chainYears = [2021, 2022, 2023, 2024, 2025, 2026];

const cvPoints = new Map(experience.map((r) => [`${r.title} @ ${r.org}`, r.points]));

/**
 * The eight roles from `/career`, in the order published there. Titles, employers,
 * periods and places are copied; nothing else from that page is reused.
 */
export const chain: ChainRole[] = experiences.map((role) => {
  const [startLabel, endLabel] = role.period.split(/\s+[-–—]\s+/);
  const current = /present/i.test(endLabel);
  const org = role.companyNote ? `${role.company} (${role.companyNote})` : role.company;
  const start = monthIndex(startLabel, chainOrigin);
  const end = current ? monthIndex(revision, chainOrigin) + 1 : monthIndex(endLabel, chainOrigin) + 1;
  return {
    title: role.role,
    org,
    place: role.location,
    dates: `${startLabel} - ${endLabel}`,
    start,
    end,
    current,
    points: cvPoints.get(`${role.role} @ ${org}`) ?? [],
  };
});

/** DRAFT section title. Both dates are on the record: DocuSign from Jan 2021, Microsoft from May 2024. */
export const experienceTitle = "Tier 2 support in January 2021. Senior AI architect by May 2024.";
export const experienceNote = "Eight roles. The dates are exact, and three of the roles overlap.";

/* ------------------------------------------------------------------ */
/* Sheet index: the title block's table of contents, with real counts  */
/* ------------------------------------------------------------------ */

export const sheetIndex = [
  { href: "#work", label: "Selected work", count: `${details.length} details` },
  { href: "#approach", label: "How I decide", count: `${rules.length} rules` },
  { href: "#experience", label: "Experience", count: `${chain.length} roles, 2021 to ${revision.slice(-4)}` },
  {
    href: "#skills",
    label: "Skills and certifications",
    count: `${skillGroups.reduce((n, g) => n + g.items.length, 0)} skills, ${certifications.length} certifications`,
  },
];

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const contact = {
  title: "Have a role in mind? Send it.",
  body: "Email is the fastest way to reach me. The CV is one page as PDF, or readable on this site.",
  consulting:
    "Looking for independent AI architecture advice for a startup instead? That is the consulting side of this site.",
};
