import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildCallPrep, buildNinetyDayPlan } from "@/lib/signal-room/setting-ai";
import { upsertCall } from "@/lib/signal-room/store";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";
import { CALL_OUTCOMES, OFFER_NAMES } from "@/lib/signal-room/types";

// These routes make bounded model calls that can legitimately run ~60s.
// Without this they are killed at the platform default and surface as a timeout.
export const maxDuration = 120;

const accountSchema = z.object({
  name: z.string().trim().min(1).max(150),
  oneLiner: z.string().trim().max(500),
  stage: z.enum(["Seed", "Series A", "Series B", "Unknown"]),
  approxUsers: z.string().trim().max(200).default(""),
});

const prepSchema = z.object({
  account: accountSchema,
  brief: z.unknown().nullable().default(null),
  observations: z.array(z.unknown()).default([]),
});

const planSchema = z.object({
  account: accountSchema,
  brief: z.unknown().nullable().default(null),
  offerName: z.enum(OFFER_NAMES),
  call: z.record(z.string(), z.unknown()).default({}),
});

const saveSchema = z.object({
  accountId: z.string().uuid(),
  heldAt: z.string().datetime().nullable().optional(),
  monthlySpendUsd: z.number().min(0).max(100_000_000).nullable().optional(),
  spendBasis: z.string().trim().max(1000).optional(),
  wastePct: z.number().int().min(0).max(100).nullable().optional(),
  wasteBasis: z.string().trim().max(1000).optional(),
  reclaimIntent: z.string().trim().max(2000).optional(),
  revenueNowUsd: z.number().min(0).max(1_000_000_000).nullable().optional(),
  revenueTargetUsd: z.number().min(0).max(1_000_000_000).nullable().optional(),
  costOfDelay: z.string().trim().max(2000).optional(),
  notes: z.string().trim().max(20_000).optional(),
  offer: z.string().trim().max(120).optional(),
  priceUsd: z.number().min(0).max(10_000_000).nullable().optional(),
  upfrontUsd: z.number().min(0).max(10_000_000).nullable().optional(),
  plan: z.unknown().nullable().optional(),
  outcome: z.enum(CALL_OUTCOMES).optional(),
});

export async function POST(request: NextRequest) {
  return handle(request, async () => {
    const body = await request.json();

    if (body?.action === "prep") {
      const input = prepSchema.parse(body);
      const prep = await buildCallPrep({
        account: input.account,
        brief: (input.brief as never) ?? null,
        observations: input.observations as never,
      });
      return NextResponse.json({ prep });
    }

    if (body?.action === "plan") {
      const input = planSchema.parse(body);
      const plan = await buildNinetyDayPlan({
        account: input.account,
        brief: (input.brief as never) ?? null,
        call: input.call as never,
        offerName: input.offerName,
      });
      return NextResponse.json({ plan });
    }

    const { accountId, ...rest } = saveSchema.parse(body);
    const call = await upsertCall(accountId, rest as never);
    return NextResponse.json({ call });
  });
}

async function handle(request: NextRequest, action: () => Promise<NextResponse>) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }
  if (!takeRateLimit(request, "signal-calls", 60, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Call request limit reached." }, { status: 429 });
  }
  try {
    return await action();
  } catch (error) {
    console.error("Signal Room call request failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Call request failed." },
      { status: error instanceof z.ZodError ? 400 : 502 }
    );
  }
}
