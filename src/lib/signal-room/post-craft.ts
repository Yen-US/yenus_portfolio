/**
 * Post craft: the codified architecture behind the posts that actually work.
 *
 * Extracted from the Inference Readiness post (docs/sell/yenus-inference-readiness-post.md),
 * which is the current quality bar. Two things live here:
 *
 *   1. POST_FORMATS — the structural specs the generator writes against.
 *   2. getRubricChecks() — a deterministic lint that scores a draft against the
 *      bar without a model call, so a bad draft is visible before you read it.
 *
 * Advisory, not blocking: these colour a draft. Publishing judgement stays human.
 */

import type { PostDraft, PostFormat } from "@/lib/signal-room/types";

export interface FormatSpec {
  id: PostFormat;
  label: string;
  /** One line shown in the UI picker. */
  summary: string;
  /** Target character band for the post body. */
  minChars: number;
  maxChars: number;
  /** Ordered structural beats the model must produce. */
  beats: string[];
  /** Format-specific instruction appended to the draft prompt. */
  directive: string;
  /** Whether this format is scaffolded around numbered recognition patterns. */
  numbered: boolean;
  /** Expected count of numbered patterns, when numbered. */
  patternCount: [number, number];
}

export const POST_FORMATS: FormatSpec[] = [
  {
    id: "Recognition patterns",
    label: "Recognition patterns",
    summary:
      "Numbered patterns the reader recognises in their own team. The proven shape.",
    minChars: 2200,
    maxChars: 4800,
    numbered: true,
    patternCount: [4, 6],
    beats: [
      "Open with a recurring conversation or situation, told flat, no throat-clearing.",
      "Name the failure honestly: not ignorance, not carelessness — a decision made once under constraints that no longer hold.",
      "One line that hands off to the list: 'Here is the shape it takes.'",
      "4-6 numbered patterns. Each one: a short title, then Believed / Broke / Fix as three tight lines.",
      "Break the rhythm on exactly one pattern — tell it straight, no scaffold — so the reader stops skimming.",
      "A short 'what these have in common' close that reframes all of them as one root cause.",
      "Conditional CTA: name the offer, then qualify with 'if two or more sounded familiar'.",
    ],
    directive:
      "Each numbered pattern must be a shape the reader can test against their own team in one second. The Believed line must be a belief the reader probably holds right now, written in the past tense — that discomfort is the mechanism. The Fix line describes the shape of the fix, never a vendor or a tool.",
  },
  {
    id: "Single argument",
    label: "Single argument",
    summary:
      "One non-obvious claim, defended properly. For a position, not a checklist.",
    minChars: 1800,
    maxChars: 3800,
    numbered: false,
    patternCount: [0, 0],
    beats: [
      "State the claim inside the first three lines. No preamble, no 'lately I've been thinking'.",
      "Name the widely-held opposite view fairly enough that its holders would agree with your summary.",
      "The mechanism: why the common view survives despite being wrong.",
      "The strongest objection, stated in full, then answered — or conceded where it lands.",
      "What follows if the claim is true: the concrete decision that changes.",
      "Conditional CTA tied to who this actually applies to.",
    ],
    directive:
      "The claim must be falsifiable and one a competent reader could disagree with. If nobody could disagree, it is not an argument, it is a platitude — pick a sharper claim.",
  },
  {
    id: "Field note",
    label: "Field note",
    summary:
      "One measurement, one surprise, one reallocation. Short and specific.",
    minChars: 1200,
    maxChars: 2600,
    numbered: false,
    patternCount: [0, 0],
    beats: [
      "The thing you set out to measure, and why it seemed uninteresting.",
      "The method, in enough detail that the reader could repeat it this week.",
      "What came back, and specifically why it was not what you expected.",
      "What decision the result changed — the reallocation, not the insight.",
      "The generalisable rule, stated as a shape rather than a number.",
      "Light CTA, or no CTA. This format earns credibility, not calls.",
    ],
    directive:
      "Concrete method beats grand conclusion. The reader should be able to run your measurement on their own system before lunch. Never invent a figure to make the surprise larger.",
  },
  {
    id: "Contrarian correction",
    label: "Contrarian correction",
    summary:
      "A piece of common advice that quietly stopped being true. High risk, high reach.",
    minChars: 1600,
    maxChars: 3400,
    numbered: false,
    patternCount: [0, 0],
    beats: [
      "State the common advice in its most sympathetic form.",
      "Establish when and why it was correct — you are not calling anyone stupid.",
      "Name precisely what changed to invalidate it.",
      "The failure mode of following it today, described as a shape, not a horror story.",
      "The replacement rule, and the conditions under which the old advice still holds.",
      "Conditional CTA.",
    ],
    directive:
      "Never straw-man. Argue against the strongest version of the advice held by the smartest person who holds it, or the post reads as bait and the comments will say so.",
  },
];

export function getFormatSpec(format: PostFormat): FormatSpec {
  return POST_FORMATS.find((spec) => spec.id === format) ?? POST_FORMATS[0];
}

/* ------------------------------------------------------------------ */
/* Deterministic rubric lint                                           */
/* ------------------------------------------------------------------ */

export interface RubricCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
  /** Blocking checks are the ones that reliably ruin a post in public. */
  severity: "block" | "warn";
}

const HYPE_PHRASES = [
  "ai is changing everything",
  "the future is here",
  "game changer",
  "game-changer",
  "revolutionize",
  "revolutionise",
  "unlock the power",
  "in today's fast-paced",
  "in today's rapidly",
  "let that sink in",
  "read that again",
  "here's the kicker",
  "the bottom line is this",
  "at the end of the day",
  "needle-moving",
  "10x your",
  "supercharge",
  "leverage the power",
  "it's a no-brainer",
  "buckle up",
];

const ENGAGEMENT_BAIT = [
  "agree?",
  "thoughts?",
  "who else",
  "drop a comment",
  "comment below",
  "like if you",
  "repost if",
  "follow me for",
  "tag someone",
  "what do you think?",
  "am i wrong?",
];

const BELIEF_MARKERS = [
  "believed:",
  "what they believed",
  "we believed",
  "assumed:",
  "the assumption",
];

const BREAK_MARKERS = [
  "broke:",
  "what actually broke",
  "what broke",
  "what went wrong",
];

const FIX_MARKERS = ["fix:", "the fix", "fix shape", "the fix shape"];

const CONDITIONAL_CTA = [
  "if two or more",
  "if any of",
  "if one or more",
  "if two of",
  "if three or more",
  "if that sounded",
  "if this sounded",
  "if that sounds familiar",
  "if this is familiar",
  "if you recognised",
  "if you recognized",
];

/** Figures that read as invented specifics unless the source material carries them. */
const FIGURE_PATTERN =
  /\b\d[\d,.]*\s?(%|percent|x\b|ms\b|s\b|k\b|m\b|bn\b)|[$€£]\s?\d/gi;

export function getRubricChecks(
  draft: string,
  post: Pick<PostDraft, "evidence" | "format" | "pillar">,
  sourceMaterial = ""
): RubricCheck[] {
  const text = draft.toLowerCase();
  const spec = getFormatSpec(post.format ?? "Recognition patterns");
  const paragraphs = draft.split(/\n\s*\n/).filter((item) => item.trim().length > 0);
  const numbered = draft.match(/^\s*\d+[.)]\s/gm)?.length ?? 0;
  const chars = draft.trim().length;

  const hype = HYPE_PHRASES.filter((phrase) => text.includes(phrase));
  const bait = ENGAGEMENT_BAIT.filter((phrase) => text.includes(phrase));
  const emDashes = (draft.match(/—/g) ?? []).length;
  const questions = (draft.match(/\?/g) ?? []).length;

  const hasBelief = BELIEF_MARKERS.some((marker) => text.includes(marker));
  const hasBreak = BREAK_MARKERS.some((marker) => text.includes(marker));
  const hasFix = FIX_MARKERS.some((marker) => text.includes(marker));
  const scaffoldParts = [hasBelief, hasBreak, hasFix].filter(Boolean).length;

  const closing = text.slice(Math.floor(text.length * 0.7));
  const hasConditionalCta = CONDITIONAL_CTA.some((phrase) => closing.includes(phrase));

  const sourceFigures = new Set(
    (sourceMaterial.match(FIGURE_PATTERN) ?? []).map((item) =>
      item.toLowerCase().replace(/\s+/g, "")
    )
  );
  const unsourcedFigures = [
    ...new Set(
      (draft.match(FIGURE_PATTERN) ?? [])
        .map((item) => item.toLowerCase().replace(/\s+/g, ""))
        .filter((item) => !sourceFigures.has(item))
    ),
  ];

  const longestParagraph = paragraphs.reduce(
    (max, item) => Math.max(max, item.trim().length),
    0
  );

  const checks: RubricCheck[] = [
    {
      id: "length-band",
      label: "Length earns the scroll",
      severity: "warn",
      passed: chars >= spec.minChars && chars <= spec.maxChars,
      detail:
        chars < spec.minChars
          ? `${chars.toLocaleString()} characters. ${spec.label} needs at least ${spec.minChars.toLocaleString()} to develop the claim.`
          : chars > spec.maxChars
            ? `${chars.toLocaleString()} characters, over the ${spec.maxChars.toLocaleString()} band. Cut the weakest section rather than trimming every sentence.`
            : `${chars.toLocaleString()} characters. Inside the ${spec.minChars.toLocaleString()}-${spec.maxChars.toLocaleString()} band.`,
    },
    {
      id: "no-hype",
      label: "No borrowed marketing register",
      severity: "block",
      passed: hype.length === 0,
      detail:
        hype.length === 0
          ? "No content-marketing phrasing detected."
          : `Found ${hype.map((item) => `"${item}"`).join(", ")}. One of these undoes the operator register for the whole post.`,
    },
    {
      id: "no-bait",
      label: "No engagement bait",
      severity: "block",
      passed: bait.length === 0,
      detail:
        bait.length === 0
          ? "Closes on a position, not a prompt."
          : `Found ${bait.map((item) => `"${item}"`).join(", ")}. Readers you want treat these as a signal to scroll.`,
    },
    {
      id: "unsourced-figures",
      label: "Every figure is defensible",
      severity: "block",
      passed: unsourcedFigures.length === 0,
      detail:
        unsourcedFigures.length === 0
          ? "No numeric claims beyond the supplied source material."
          : `${unsourcedFigures.slice(0, 5).join(", ")} appear in the draft but not in your source material. Replace with a shape or cut the sentence — one wrong public figure costs more than the post earns.`,
    },
    {
      id: "claim-ledger",
      label: "Claims are sourced or explicitly experiential",
      severity: "warn",
      passed: post.evidence.length > 0 || post.pillar === "Operator story",
      detail:
        post.evidence.length > 0
          ? `${post.evidence.length} sourced claim${post.evidence.length === 1 ? "" : "s"} attached.`
          : "No external sources. Keep every claim framed as something you have personally seen.",
    },
    {
      id: "paragraph-rhythm",
      label: "Paragraph rhythm survives mobile",
      severity: "warn",
      passed: longestParagraph <= 600 && paragraphs.length >= 6,
      detail:
        longestParagraph > 600
          ? `Longest paragraph is ${longestParagraph} characters. On a phone that is a wall, and the wall is where readers leave.`
          : `${paragraphs.length} paragraphs, longest ${longestParagraph} characters.`,
    },
    {
      id: "question-restraint",
      label: "Question restraint",
      severity: "warn",
      passed: questions <= 3,
      detail:
        questions <= 3
          ? `${questions} question${questions === 1 ? "" : "s"}.`
          : `${questions} questions. Rhetorical questions read as hedging — assert instead.`,
    },
    {
      id: "punctuation-voice",
      label: "Commas over em dashes",
      severity: "warn",
      passed: emDashes <= 3,
      detail:
        emDashes <= 3
          ? `${emDashes} em dash${emDashes === 1 ? "" : "es"}.`
          : `${emDashes} em dashes. Heavy em dash use is the strongest current tell of machine drafting. Convert most to commas or full stops.`,
    },
  ];

  if (spec.numbered) {
    const [minPatterns, maxPatterns] = spec.patternCount;
    checks.push(
      {
        id: "pattern-count",
        label: "Pattern count",
        severity: "warn",
        passed: numbered >= minPatterns && numbered <= maxPatterns,
        detail:
          numbered < minPatterns
            ? `${numbered} numbered patterns. Below ${minPatterns} the post reads as a take, not a diagnostic.`
            : numbered > maxPatterns
              ? `${numbered} numbered patterns. Past ${maxPatterns} the reader skims and the strongest ones lose weight.`
              : `${numbered} numbered patterns.`,
      },
      {
        id: "belief-break-fix",
        label: "Believed / Broke / Fix scaffold",
        severity: "block",
        passed: scaffoldParts === 3,
        detail:
          scaffoldParts === 3
            ? "All three scaffold parts present. The reversal is the mechanism that produces the DM."
            : `Missing ${[!hasBelief && "Believed", !hasBreak && "Broke", !hasFix && "Fix"].filter(Boolean).join(", ")}. Without the reversal the patterns become advice, and advice invites disagreement instead of recognition.`,
      },
      {
        id: "rhythm-break",
        label: "One pattern breaks the rhythm",
        severity: "warn",
        passed: countScaffoldedSections(draft) < numbered && numbered > 0,
        detail:
          countScaffoldedSections(draft) < numbered
            ? "At least one pattern is told straight. That reset is what stops the reader skimming to the punchlines."
            : "Every pattern uses the same scaffold. Tell exactly one straight to reset the pace before the strongest patterns land.",
      }
    );
  }

  checks.push({
    id: "conditional-cta",
    label: "CTA qualifies rather than invites",
    severity: "warn",
    passed: hasConditionalCta,
    detail: hasConditionalCta
      ? "Conditional CTA present. A reader who recognised one pattern is a bad call; four is a close."
      : "No conditional close. 'If two or more sounded familiar' filters the inbound and does your qualifying before the call.",
  });

  return checks;
}

function countScaffoldedSections(draft: string) {
  return draft
    .split(/^\s*\d+[.)]\s/m)
    .slice(1)
    .filter((section) => {
      const text = section.toLowerCase();
      return (
        BELIEF_MARKERS.some((marker) => text.includes(marker)) &&
        BREAK_MARKERS.some((marker) => text.includes(marker))
      );
    }).length;
}

export function summariseRubric(checks: RubricCheck[]) {
  const failed = checks.filter((check) => !check.passed);
  return {
    passed: checks.length - failed.length,
    total: checks.length,
    blocking: failed.filter((check) => check.severity === "block").length,
    ready: failed.every((check) => check.severity !== "block"),
  };
}
