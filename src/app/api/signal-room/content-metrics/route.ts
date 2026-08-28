import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { upsertMetricSnapshot } from "@/lib/signal-room/ledger-store";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";
import { METRIC_SOURCES, METRIC_WINDOWS } from "@/lib/signal-room/types";

/**
 * Record one reading of one post.
 *
 * Every metric is `.nullable().optional()` on purpose, and the two mean
 * different things at the edge: an omitted field and an explicit null both
 * store null ("LinkedIn did not give us this"), while an explicit 0 stores 0
 * ("we looked, it was zero"). Coercing a blank form field to 0 here would
 * silently manufacture the measurement the whole feature exists to avoid.
 */
const metric = z.number().int().min(0).max(100_000_000).nullable().optional();

const schema = z.object({
  postId: z.string().uuid(),
  window: z.enum(METRIC_WINDOWS),
  source: z.enum(METRIC_SOURCES).optional().default("manual"),
  observedAt: z.string().datetime().optional(),
  impressions: metric,
  uniqueViews: metric,
  reactions: metric,
  comments: metric,
  reposts: metric,
  clicks: metric,
  profileViews: metric,
  follows: metric,
  inboundMessages: metric,
  callsAttributed: metric,
  notes: z.string().trim().max(2000).optional(),
});

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }
  if (!takeRateLimit(request, "signal-content-metrics", 200, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Metric limit reached." }, { status: 429 });
  }
  try {
    const input = schema.parse(await request.json());
    return NextResponse.json(
      { snapshot: await upsertMetricSnapshot(input) },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid metrics." }, { status: 422 });
    }
    const message = error instanceof Error ? error.message : "Request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
