import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildTestPlan } from "@/lib/signal-room/setting-ai";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";

// These routes make bounded model calls that can legitimately run ~60s.
// Without this they are killed at the platform default and surface as a timeout.
export const maxDuration = 120;

const schema = z.object({
  account: z.object({
    name: z.string().trim().min(1).max(150),
    website: z.string().trim().max(500),
    stage: z.enum(["Seed", "Series A", "Series B", "Unknown"]),
    oneLiner: z.string().trim().max(500),
  }),
  brief: z.unknown().nullable().default(null),
});

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }
  if (!takeRateLimit(request, "signal-test-plan", 20, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Test plan limit reached." }, { status: 429 });
  }

  try {
    const input = schema.parse(await request.json());
    const testPlan = await buildTestPlan({
      account: input.account,
      brief: (input.brief as never) ?? null,
    });
    return NextResponse.json({ testPlan });
  } catch (error) {
    console.error("Signal Room test plan failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Test plan failed." },
      { status: error instanceof z.ZodError ? 400 : 502 }
    );
  }
}
