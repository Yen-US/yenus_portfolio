import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeReply } from "@/lib/signal-room/setting-ai";
import { createMessage, deleteMessage } from "@/lib/signal-room/store";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";

const logSchema = z.object({
  accountId: z.string().uuid(),
  direction: z.enum(["sent", "received"]),
  channel: z.string().trim().max(40).default("linkedin"),
  body: z.string().trim().min(1).max(20_000),
  containedAsk: z.boolean().default(false),
  occurredAt: z.string().datetime(),
  analysis: z.unknown().nullable().default(null),
});

const analyzeSchema = z.object({
  account: z.object({
    name: z.string().trim().min(1).max(150),
    oneLiner: z.string().trim().max(500),
    targetName: z.string().trim().max(120),
    targetRole: z.string().trim().max(120),
  }),
  brief: z.unknown().nullable().default(null),
  observations: z.array(z.unknown()).default([]),
  thread: z.array(z.unknown()).default([]),
  reply: z.string().trim().min(1).max(20_000),
});

const deleteSchema = z.object({ id: z.string().uuid() });

export async function POST(request: NextRequest) {
  return handle(request, "signal-messages", 120, async () => {
    const body = await request.json();

    if (body?.action === "analyze") {
      if (!takeRateLimit(request, "signal-analyze-reply", 30, 60 * 60 * 1000)) {
        return NextResponse.json({ error: "Analysis limit reached." }, { status: 429 });
      }
      const input = analyzeSchema.parse(body);
      const analysis = await analyzeReply({
        account: input.account,
        brief: (input.brief as never) ?? null,
        observations: input.observations as never,
        thread: input.thread as never,
        reply: input.reply,
      });
      return NextResponse.json({ analysis });
    }

    const input = logSchema.parse(body);
    const message = await createMessage({
      accountId: input.accountId,
      direction: input.direction,
      channel: input.channel,
      body: input.body,
      containedAsk: input.containedAsk,
      occurredAt: input.occurredAt,
      analysis: (input.analysis as never) ?? null,
    });
    return NextResponse.json({ message }, { status: 201 });
  });
}

export async function DELETE(request: NextRequest) {
  return handle(request, "signal-messages", 120, async () => {
    const { id } = deleteSchema.parse(await request.json());
    await deleteMessage(id);
    return NextResponse.json({ ok: true });
  });
}

async function handle(
  request: NextRequest,
  bucket: string,
  max: number,
  action: () => Promise<NextResponse>
) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }
  if (!takeRateLimit(request, bucket, max, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Message limit reached." }, { status: 429 });
  }
  try {
    return await action();
  } catch (error) {
    console.error("Signal Room message request failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Message request failed." },
      { status: error instanceof z.ZodError ? 400 : 502 }
    );
  }
}
