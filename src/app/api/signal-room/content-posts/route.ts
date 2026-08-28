import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createContentPost,
  updateContentPost,
} from "@/lib/signal-room/ledger-store";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";
import {
  CONTENT_POST_STATUSES,
  CONTENT_TYPES,
  CTA_TYPES,
} from "@/lib/signal-room/types";

const createSchema = z.object({
  url: z.string().trim().url(),
  platformUrn: z.string().trim().max(200).optional(),
  draftId: z.string().uuid().nullable().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  hook: z.string().trim().max(500).optional(),
  topic: z.string().trim().max(300).optional(),
  format: z.string().trim().max(120).optional(),
  contentType: z.enum(CONTENT_TYPES).optional(),
  ctaType: z.enum(CTA_TYPES).optional(),
  offerMentioned: z.boolean().optional(),
  status: z.enum(CONTENT_POST_STATUSES).optional(),
  critique: z
    .object({
      assessment: z.string().max(4000),
      strengths: z.array(z.string().max(500)).max(20),
      weaknesses: z.array(z.string().max(500)).max(20),
    })
    .nullable()
    .optional(),
});

const updateSchema = createSchema.partial().extend({ id: z.string().uuid() });

export async function POST(request: NextRequest) {
  return handle(request, async () => {
    const input = createSchema.parse(await request.json());
    return NextResponse.json({ post: await createContentPost(input) }, { status: 201 });
  });
}

export async function PATCH(request: NextRequest) {
  return handle(request, async () => {
    const { id, ...rest } = updateSchema.parse(await request.json());
    return NextResponse.json({ post: await updateContentPost(id, rest) });
  });
}

async function handle(request: NextRequest, action: () => Promise<NextResponse>) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }
  if (!takeRateLimit(request, "signal-content-posts", 120, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Post limit reached." }, { status: 429 });
  }
  try {
    return await action();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid post." }, { status: 422 });
    }
    const message = error instanceof Error ? error.message : "Request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
