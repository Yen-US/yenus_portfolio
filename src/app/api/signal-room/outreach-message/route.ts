import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildConnectionNote, buildCorrectionOpener } from "@/lib/signal-room/setting-ai";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";

// These routes make bounded model calls that can legitimately run ~60s.
// Without this they are killed at the platform default and surface as a timeout.
export const maxDuration = 120;

const observationSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  flow: z.string(),
  metric: z.string(),
  value: z.number().nullable(),
  unit: z.string(),
  tier: z.string(),
  costUsd: z.number(),
  rawNote: z.string(),
  isWeakness: z.boolean(),
  observedAt: z.string(),
});

const schema = z.object({
  format: z.enum(["opener", "connection"]).default("opener"),
  account: z.object({
    name: z.string().trim().min(1).max(150),
    oneLiner: z.string().trim().max(500),
    approxUsers: z.string().trim().max(200),
    targetName: z.string().trim().max(120),
    targetRole: z.string().trim().max(120),
  }),
  brief: z.unknown().nullable().default(null),
  observations: z.array(observationSchema),
  /**
   * Explicit operator acknowledgment that no field test happened. Required to
   * draft without observations, so "I couldn't use the product" is always a
   * deliberate choice rather than a step silently skipped.
   */
  skipFieldTest: z.boolean().default(false),
  patternLine: z.string().trim().max(600).default(""),
});

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }
  if (!takeRateLimit(request, "signal-opener", 20, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Message limit reached." }, { status: 429 });
  }

  try {
    const input = schema.parse(await request.json());

    // Still a gate, now a softer one. A measured weakness is the strongest hook
    // the methodology has, so it stays the default — but many products are
    // sales-gated or waitlisted, and refusing to draft at all just pushes the
    // work into an untracked text editor. The operator must opt out on purpose.
    if (input.observations.length === 0 && !input.skipFieldTest) {
      return NextResponse.json(
        {
          error:
            "No field test recorded. Log one observation, or turn on \"I can't use this product\" to draft from public signal instead.",
        },
        { status: 422 }
      );
    }

    if (input.format === "connection") {
      const note = await buildConnectionNote({
        account: input.account,
        brief: (input.brief as never) ?? null,
        observations: input.observations,
        patternLine: input.patternLine,
      });
      return NextResponse.json({ note });
    }

    const opener = await buildCorrectionOpener({
      account: input.account,
      brief: (input.brief as never) ?? null,
      observations: input.observations,
    });
    return NextResponse.json({ opener });
  } catch (error) {
    console.error("Signal Room opener generation failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Message generation failed." },
      { status: error instanceof z.ZodError ? 400 : 502 }
    );
  }
}
