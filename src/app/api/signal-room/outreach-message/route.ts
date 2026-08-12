import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildCorrectionOpener } from "@/lib/signal-room/setting-ai";
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
  account: z.object({
    name: z.string().trim().min(1).max(150),
    oneLiner: z.string().trim().max(500),
    approxUsers: z.string().trim().max(200),
    targetName: z.string().trim().max(120),
    targetRole: z.string().trim().max(120),
  }),
  brief: z.unknown().nullable().default(null),
  observations: z.array(observationSchema),
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

    // The one hard gate in the system. The methodology's hook is a weakness you
    // personally measured; without one this message would be generic outreach
    // dressed up as research. Advisory checks get skipped, so this one blocks.
    if (input.observations.length === 0) {
      return NextResponse.json(
        {
          error:
            "No field test recorded. Use the product, measure one thing, and log it before drafting the opener.",
        },
        { status: 422 }
      );
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
