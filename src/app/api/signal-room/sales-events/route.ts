import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  deleteSalesEvent,
  recordSalesEvent,
} from "@/lib/signal-room/ledger-store";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";
import { SALES_EVENT_TYPES, TIME_PRECISIONS } from "@/lib/signal-room/types";

/**
 * Append to the sales ledger.
 *
 * `actor` and `source` are fixed server-side rather than accepted from the
 * client. Every event that arrives here came from the operator clicking
 * something, so allowing a request to declare itself `system` would let the
 * one distinction the ledger depends on be set by whoever calls the endpoint.
 */
const createSchema = z.object({
  accountId: z.string().uuid(),
  contactId: z.string().uuid().nullable().optional(),
  type: z.enum(SALES_EVENT_TYPES),
  occurredAt: z.string().datetime().optional(),
  observedAt: z.string().datetime().nullable().optional(),
  occurredAtPrecision: z.enum(TIME_PRECISIONS).optional(),
  variantId: z.string().uuid().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const deleteSchema = z.object({ id: z.string().uuid() });

export async function POST(request: NextRequest) {
  return handle(request, async () => {
    const input = createSchema.parse(await request.json());
    const event = await recordSalesEvent({
      ...input,
      source: "manual",
      actor: "yenson",
    });
    return NextResponse.json({ event }, { status: 201 });
  });
}

export async function DELETE(request: NextRequest) {
  return handle(request, async () => {
    const { id } = deleteSchema.parse(await request.json());
    await deleteSalesEvent(id);
    return NextResponse.json({ ok: true });
  });
}

async function handle(request: NextRequest, action: () => Promise<NextResponse>) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }
  if (!takeRateLimit(request, "signal-sales-events", 300, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Event limit reached." }, { status: 429 });
  }
  try {
    return await action();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid event." }, { status: 422 });
    }
    const message = error instanceof Error ? error.message : "Request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
