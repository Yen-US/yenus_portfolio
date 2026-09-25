import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPost, deletePost, updatePost } from "@/lib/signal-room/store";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";
import { POST_FORMATS_LIST, POST_PILLARS, POST_STATUSES } from "@/lib/signal-room/types";

/**
 * A draft written by the operator, not by the pipeline.
 *
 * Until this existed, `createPost` had exactly one caller — the generation
 * route — so a post Yenson wrote by hand (or drafted anywhere else) had
 * nowhere to land. The workspace could only hold text a model produced, which
 * is the wrong constraint for a practice whose whole credibility rests on
 * first-hand observation.
 *
 * `evidence` is accepted here for the same reason it is not optional in
 * spirit: the rubric in `content-rules.ts` blocks precise figures that have no
 * claim-ledger entry. A manual draft that carries numbers must carry their
 * sources in the same request, or it is simply unpublishable on arrival.
 */
const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  pillar: z.enum(POST_PILLARS),
  status: z.enum(POST_STATUSES).default("draft"),
  format: z.enum(POST_FORMATS_LIST).default("Single argument"),
  hook: z.string().trim().max(500).default(""),
  draft: z.string().trim().max(20_000).default(""),
  takeaway: z.string().trim().max(1000).default(""),
  accountIds: z.array(z.string()).max(10).default([]),
  outline: z.array(z.string().max(500)).max(20).default([]),
  evidence: z
    .array(
      z.object({
        claim: z.string().trim().max(500),
        sourceUrl: z.string().trim().max(600),
        sourceTitle: z.string().trim().max(300),
      })
    )
    .max(20)
    .default([]),
});

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(200).optional(),
  pillar: z.enum(POST_PILLARS).optional(),
  status: z.enum(POST_STATUSES).optional(),
  hook: z.string().max(500).optional(),
  draft: z.string().max(20_000).optional(),
  takeaway: z.string().max(1000).optional(),
  accountIds: z.array(z.string()).max(10).optional(),
});

const deleteSchema = z.object({ id: z.string().uuid() });

export async function POST(request: NextRequest) {
  return handleMutation(request, async () => {
    const input = createSchema.parse(await request.json());
    // Quality and critique stay null: both are pipeline judgments, and seeding
    // them from an operator draft would fake a review that never happened.
    const post = await createPost({
      ...input,
      quality: null,
      artifacts: null,
      critique: null,
    });
    return NextResponse.json({ post }, { status: 201 });
  });
}

export async function PATCH(request: NextRequest) {
  return handleMutation(request, async () => {
    const { id, ...input } = updateSchema.parse(await request.json());
    return NextResponse.json({ post: await updatePost(id, input) });
  });
}

export async function DELETE(request: NextRequest) {
  return handleMutation(request, async () => {
    const { id } = deleteSchema.parse(await request.json());
    await deletePost(id);
    return NextResponse.json({ ok: true });
  });
}

async function handleMutation(
  request: NextRequest,
  action: () => Promise<NextResponse>
) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  if (!takeRateLimit(request, "signal-post-updates", 120, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Post update limit reached." }, { status: 429 });
  }

  try {
    return await action();
  } catch (error) {
    console.error("Signal Room post mutation failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Post update failed." },
      { status: error instanceof z.ZodError ? 400 : 502 }
    );
  }
}
