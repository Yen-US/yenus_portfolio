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
