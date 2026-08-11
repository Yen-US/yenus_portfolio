import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createObservation,
  deleteObservation,
} from "@/lib/signal-room/store";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";

const createSchema = z.object({
  accountId: z.string().uuid(),
  flow: z.string().trim().min(1).max(500),
  metric: z.string().trim().max(200),
  value: z.number().finite().nullable(),
  unit: z.string().trim().max(40),
  tier: z.string().trim().max(60),
  costUsd: z.number().min(0).max(100_000),
  rawNote: z.string().trim().max(4000),
  isWeakness: z.boolean(),
  observedAt: z.string().datetime(),
});

const deleteSchema = z.object({ id: z.string().uuid() });

export async function POST(request: NextRequest) {
  return handle(request, async () => {
    const input = createSchema.parse(await request.json());
    return NextResponse.json(
      { observation: await createObservation(input) },
      { status: 201 }
    );
  });
}

export async function DELETE(request: NextRequest) {
  return handle(request, async () => {
    const { id } = deleteSchema.parse(await request.json());
    await deleteObservation(id);
    return NextResponse.json({ ok: true });
  });
}

async function handle(request: NextRequest, action: () => Promise<NextResponse>) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }
  if (!takeRateLimit(request, "signal-observations", 120, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Observation limit reached." }, { status: 429 });
  }
  try {
    return await action();
  } catch (error) {
    console.error("Signal Room observation mutation failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Observation save failed." },
      { status: error instanceof z.ZodError ? 400 : 502 }
    );
  }
}
