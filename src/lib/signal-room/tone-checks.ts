/**
 * Deterministic tone lint for outbound LinkedIn messages.
 *
 * Advisory by design, mirroring the Meat Check pattern in post-lab-panel.tsx:
 * these colour a draft, they do not block sending. The one genuine block in the
 * system lives elsewhere — a correction opener cannot be generated at all
 * without a recorded first-hand observation.
 *
 * Rules come from the methodology: one jab not a teardown, the hypothesis must
 * read as a guess so the reader wants to correct it, and no pressure.
 */

export interface ToneCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

const NEGATIVE_MARKERS = [
  "slow",
  "too long",
  "takes forever",
  "bottleneck",
  "problem",
  "broken",
  "weak",
  "fails",
  "failing",
  "buggy",
  "poor",
  "lacking",
  "missing",
  "wrong",
  "bad",
];

const HEDGE_MARKERS = [
  "my guess",
  "i suspect",
  "i'd assume",
  "i would assume",
  "probably",
  "it looks like",
  "seems like",
  "i imagine",
  "if i had to guess",
  "maybe",
  "might be",
];

const PRESSURE_MARKERS = [
  "asap",
  "let me know today",
  "limited spots",
  "just following up",
  "circling back",
  "acting fast",
  "don't miss",
  "last chance",
  "urgent",
];

const FLATTERY_MARKERS = [
  "huge fan",
  "love what you're building",
  "love what you are building",
  "amazing product",
  "incredible team",
  "big fan",
  "blown away",
  "revolutionary",
  "game changer",
  "game-changer",
];

const MAX_LENGTH = 900;
const MAX_NEGATIVE_MARKERS = 2;

function countMatches(haystack: string, needles: string[]) {
  return needles.filter((needle) => haystack.includes(needle));
}

export function getToneChecks(draft: string): ToneCheck[] {
  const text = draft.toLowerCase();
  const opener = text.slice(0, 200);

  const negatives = countMatches(text, NEGATIVE_MARKERS);
  const hedges = countMatches(text, HEDGE_MARKERS);
  const pressure = countMatches(text, PRESSURE_MARKERS);
  const flattery = countMatches(opener, FLATTERY_MARKERS);
  const questionCount = (draft.match(/\?/g) ?? []).length;

  return [
    {
      id: "one-jab",
      label: "One jab, not a teardown",
      passed: negatives.length <= MAX_NEGATIVE_MARKERS,
      detail:
        negatives.length <= MAX_NEGATIVE_MARKERS
          ? `${negatives.length} critical phrase${negatives.length === 1 ? "" : "s"}. Within range.`
          : `${negatives.length} critical phrases (${negatives.slice(0, 4).join(", ")}). Point at one thing you can help with, not everything that is wrong.`,
    },
    {
      id: "hedged-hypothesis",
      label: "Hypothesis reads as a guess",
      passed: hedges.length > 0,
      detail:
        hedges.length > 0
          ? `Hedged with "${hedges[0]}". A reader who knows the real cause will want to correct it.`
          : "No hedge found. State the cause as your guess so they correct you rather than ignore you.",
    },
    {
      id: "asks-question",
      label: "Invites a reply",
      passed: questionCount >= 1,
      detail:
        questionCount >= 1
          ? `${questionCount} question${questionCount === 1 ? "" : "s"}.`
          : "No question. The message should open a conversation, not deliver a verdict.",
    },
    {
      id: "no-pressure",
      label: "No pressure language",
      passed: pressure.length === 0,
      detail:
        pressure.length === 0
          ? "No urgency or follow-up filler."
          : `Remove: ${pressure.join(", ")}.`,
    },
    {
      id: "no-flattery",
      label: "Earned praise, not flattery",
      passed: flattery.length === 0,
      detail:
        flattery.length === 0
          ? "Opening is not generic praise."
          : `Generic praise in the opener: ${flattery.join(", ")}. Name something specific you observed instead.`,
    },
    {
      id: "length",
      label: "Short enough to read",
      passed: draft.length > 0 && draft.length <= MAX_LENGTH,
      detail:
        draft.length === 0
          ? "Empty draft."
          : draft.length <= MAX_LENGTH
            ? `${draft.length} characters.`
            : `${draft.length} characters. Over ${MAX_LENGTH} reads as a pitch.`,
    },
  ];
}

export function toneCheckSummary(checks: ToneCheck[]) {
  const failed = checks.filter((check) => !check.passed);
  return {
    passedCount: checks.length - failed.length,
    total: checks.length,
    failed,
  };
}

/** LinkedIn truncates a connection note past this. Hard platform limit. */
export const CONNECTION_NOTE_LIMIT = 300;

/** Acronyms a technical founder already knows. Expanding them reads as talking down. */
const REDUNDANT_EXPANSIONS = [
  /\bMCP\b[\s,(-]*model context protocol/i,
  /\bLLM\b[\s,(-]*large language model/i,
  /\bRAG\b[\s,(-]*retrieval[- ]augmented generation/i,
  /\bAPI\b[\s,(-]*application programming interface/i,
  /\bSLO\b[\s,(-]*service level objective/i,
  /\bTTFT\b[\s,(-]*time to first token/i,
];

/** Phrases that diagnose the reader's system before any conversation exists. */
const DIAGNOSIS_MARKERS = [
  "your architecture",
  "that pattern usually produces",
  "the tension that produces",
  "you're likely",
  "you are likely",
  "you probably have",
  "this usually breaks",
  "which means you",
];

/**
 * Checks specific to a connection request. Separate from getToneChecks because
 * the constraints genuinely differ: 300 hard characters, no measured weakness
 * to lean on, and the reader has not agreed to hear from you yet — so anything
 * that reads as diagnosing their system before they accepted is a real risk,
 * not a style preference.
 */
export function getConnectionNoteChecks(note: string): ToneCheck[] {
  const trimmed = note.trim();

  // Telegraphic lists like "latency + auth + drift" read as review notes rather
  // than a human introduction. Two or more joined fragments is the tell.
  const plusList = /\b[\w-]+\s\+\s[\w-]+\s\+\s[\w-]+\b/.test(trimmed);

  const expansions = REDUNDANT_EXPANSIONS.filter((pattern) => pattern.test(trimmed));
  const diagnoses = DIAGNOSIS_MARKERS.filter((marker) =>
    trimmed.toLowerCase().includes(marker)
  );

  // "I wrote it up" with nothing after it gives the reader no reason to accept.
  const vagueWriteUp =
    /\bwrote (it|this) up\b/i.test(trimmed) &&
    !/\bwrote (it|this) up (on|about|covering)\b/i.test(trimmed);

  const sentences = trimmed.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const longestWords = Math.max(
    0,
    ...sentences.map((sentence) => sentence.split(/\s+/).length)
  );

  return [
    {
      id: "within-limit",
      label: "Fits LinkedIn's 300-character cap",
      passed: trimmed.length > 0 && trimmed.length <= CONNECTION_NOTE_LIMIT,
      detail:
        trimmed.length === 0
          ? "Empty note."
          : trimmed.length <= CONNECTION_NOTE_LIMIT
            ? `${trimmed.length}/${CONNECTION_NOTE_LIMIT} characters.`
            : `${trimmed.length} characters. LinkedIn will cut the last ${trimmed.length - CONNECTION_NOTE_LIMIT}, usually mid-signoff.`,
    },
    {
      id: "no-telegraphic-list",
      label: "Reads as a sentence, not review notes",
      passed: !plusList,
      detail: plusList
        ? "Contains a compressed list like 'latency + auth + drift'. Say it as a phrase a person would speak: 'the challenges around auth, latency, and keeping context fresh'."
        : "No telegraphic lists.",
    },
    {
      id: "no-redundant-expansion",
      label: "Does not explain acronyms they know",
      passed: expansions.length === 0,
      detail:
        expansions.length === 0
          ? "No acronyms expanded unnecessarily."
          : "Expands an acronym the reader already knows. Write MCP, not 'MCP Model Context Protocol'.",
    },
    {
      id: "curiosity-not-diagnosis",
      label: "Curious, not diagnosing",
      passed: diagnoses.length === 0,
      detail:
        diagnoses.length === 0
          ? "Frames the topic as your own interest."
          : `Diagnoses their system before connecting: ${diagnoses.join(", ")}. Reframe as what you have been thinking about.`,
    },
    {
      id: "concrete-reason",
      label: "Gives a reason to accept",
      passed: !vagueWriteUp,
      detail: vagueWriteUp
        ? "'I wrote it up' alone gives them nothing. Say what it covers."
        : "The ask carries something specific.",
    },
    {
      id: "natural-sentences",
      label: "Sentences a person would speak",
      passed: longestWords > 0 && longestWords <= 34,
      detail:
        longestWords === 0
          ? "Empty note."
          : longestWords <= 34
            ? "Sentence length reads naturally."
            : `Longest sentence runs ${longestWords} words. Split it — long sentences in a 300-character note read as compressed.`,
    },
  ];
}
