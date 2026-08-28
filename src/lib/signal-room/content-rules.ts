/**
 * Publishing rules for LinkedIn drafts.
 *
 * Pure functions over text and metadata — no model calls. These encode the
 * lessons from the three reviewed posts plus the evidence discipline the
 * publishing rules already demand: no invented numbers, no unsupported
 * universals, no employer-attribution risk.
 *
 * `blockers` prevent publication. `warnings` are judgment calls the operator
 * overrules freely. Confusing the two is how a linter becomes something people
 * route around.
 */

import type { ContentPost, ContentType } from "@/lib/signal-room/types";

export interface ContentCheck {
  id: string;
  severity: "blocker" | "warning";
  message: string;
}

/** Target mix. Guidance for rotation, never an auto-publishing quota. */
export const CONTENT_MIX_TARGET: Record<ContentType, number> = {
  measured_test: 0.4,
  decision_framework: 0.25,
  operator_story: 0.2,
  offer: 0.15,
};

export const LENGTH_BAND = { min: 700, max: 1300 };

/**
 * Words that assert a universal without evidence. Each one turns a defensible
 * observation into a claim a single counterexample destroys — usually supplied
 * by the sharpest person in the comments.
 */
const UNIVERSAL_CLAIMS =
  /\b(every|all|always|never|no one|everyone|nobody|any team|most teams|all teams)\b/gi;

/**
 * Employment-attribution risk.
 *
 * The relationship is Accenture → Microsoft for Startups. Writing "@ Microsoft"
 * or "at Microsoft" claims direct employment, which is both inaccurate and the
 * kind of inaccuracy that costs a contract.
 */
// No /g flag: `.test()` on a global regex advances `lastIndex` between calls,
// so the same draft would pass or fail depending on what was checked before it.
const EMPLOYER_RISK = /(?:@|\bat)\s+Microsoft\b(?!\s+for\s+Startups)/i;

/** A precise figure is a claim; it needs a source or an explicit label. */
const PRECISE_NUMBER = /\b\d+(?:\.\d+)?\s*(?:%|ms|s\b|x\b|k\b|GB|TB|req\/s|tokens?)/gi;

export function checkDraft(input: {
  body: string;
  contentType: ContentType;
  offerMentioned: boolean;
  claimLedger: { claim: string; evidence: string; kind: string }[];
  visualEvidenceState?: "measured" | "derived_from_measured_data" | "illustrative" | "conceptual";
  visualHasMethodology?: boolean;
  recentPosts?: Pick<ContentPost, "contentType" | "ctaType" | "offerMentioned">[];
}): ContentCheck[] {
  const checks: ContentCheck[] = [];
  const body = input.body.trim();

  // --- Blockers: evidence integrity -------------------------------------

  if (/\[VERIFY\]/i.test(body)) {
    checks.push({
      id: "verify-marker",
      severity: "blocker",
      message: "A [VERIFY] marker is still in the text. Replace the number or cut the sentence.",
    });
  }

  const numbers = body.match(PRECISE_NUMBER) ?? [];
  const ledgerText = input.claimLedger.map((entry) => entry.claim).join(" ");
  const unsourced = numbers.filter((n) => !ledgerText.includes(n.trim()));
  if (unsourced.length > 0) {
    checks.push({
      id: "unsourced-figures",
      severity: "blocker",
      message: `Precise figures with no claim-ledger entry: ${[...new Set(unsourced)].join(", ")}. Add evidence or make the sentence qualitative.`,
    });
  }

  if (EMPLOYER_RISK.test(body)) {
    checks.push({
      id: "employer-attribution",
      severity: "blocker",
      message:
        'Reads as direct Microsoft employment. The relationship is "supporting Microsoft for Startups via Accenture".',
    });
  }

  if (
    (input.visualEvidenceState === "measured" ||
      input.visualEvidenceState === "derived_from_measured_data") &&
    !input.visualHasMethodology
  ) {
    checks.push({
      id: "visual-without-methodology",
      severity: "blocker",
      message:
        "A measured visual needs metric, unit, context, observation date, and method. Otherwise label it Illustrative.",
    });
  }

  // --- Warnings: structure and rhythm -----------------------------------

  if (body.length > LENGTH_BAND.max) {
    checks.push({
      id: "too-long",
      severity: "warning",
      message: `${body.length} characters. Above ${LENGTH_BAND.max} it reads as a memo — compress to one decision rule and one example.`,
    });
  }
  if (body.length > 0 && body.length < LENGTH_BAND.min) {
    checks.push({
      id: "too-short",
      severity: "warning",
      message: `${body.length} characters. Below ${LENGTH_BAND.min} there is usually no concrete scenario in it.`,
    });
  }

  // The thesis has to survive the "see more" fold.
  const firstSentenceEnd = body.search(/[.!?]\s/);
  if (firstSentenceEnd > 250 || (firstSentenceEnd === -1 && body.length > 250)) {
    checks.push({
      id: "late-thesis",
      severity: "warning",
      message: "The first full stop lands past 250 characters — the thesis is below the fold.",
    });
  }

  const longParagraphs = body
    .split(/\n{2,}/)
    .filter((paragraph) => paragraph.length > 320);
  if (longParagraphs.length > 0) {
    checks.push({
      id: "paragraph-rhythm",
      severity: "warning",
      message: `${longParagraphs.length} paragraph(s) run past four visual lines on mobile.`,
    });
  }

  const universals = body.match(UNIVERSAL_CLAIMS) ?? [];
  if (universals.length > 0) {
    checks.push({
      id: "universal-claim",
      severity: "warning",
      message: `Universal claims without evidence: ${[...new Set(universals.map((u) => u.toLowerCase()))].join(", ")}.`,
    });
  }

  const offerMentions = (body.match(/\b(Inference Readiness Review|book a call|work with me)\b/gi) ?? [])
    .length;
  if (offerMentions > 1) {
    checks.push({
      id: "repeated-offer",
      severity: "warning",
      message: `The offer appears ${offerMentions} times. Once is an invitation; twice is a pitch.`,
    });
  }

  if (!/\?/.test(body)) {
    checks.push({
      id: "no-question",
      severity: "warning",
      message: "No question anywhere. Discussion posts that ask nothing get read and scrolled.",
    });
  }

  // --- Warnings: mix across recent posts --------------------------------

  const recent = input.recentPosts ?? [];
  if (recent.length >= 3) {
    const selling = recent.filter((p) => p.offerMentioned).length + (input.offerMentioned ? 1 : 0);
    const total = recent.length + 1;
    if (selling / total > 0.35) {
      checks.push({
        id: "mix-too-salesy",
        severity: "warning",
        message: `${selling} of the last ${total} posts mention the offer. Roughly three of four should teach or test without selling.`,
      });
    }
    const sameCta = recent.filter((p) => p.ctaType === "offer").length;
    if (sameCta >= 3) {
      checks.push({
        id: "repeated-cta",
        severity: "warning",
        message: "The last three posts all closed on the offer CTA. Vary the close.",
      });
    }
  }

  return checks;
}

export function hasBlockers(checks: ContentCheck[]): boolean {
  return checks.some((check) => check.severity === "blocker");
}

/** Observed mix against target, for the rotation nudge in Post Lab. */
export function contentMix(posts: Pick<ContentPost, "contentType">[]) {
  const total = posts.length;
  return (Object.keys(CONTENT_MIX_TARGET) as ContentType[]).map((type) => {
    const count = posts.filter((post) => post.contentType === type).length;
    return {
      type,
      count,
      share: total === 0 ? null : count / total,
      target: CONTENT_MIX_TARGET[type],
    };
  });
}
