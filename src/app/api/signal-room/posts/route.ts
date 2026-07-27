import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { deletePost, updatePost } from "@/lib/signal-room/store";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(200).optional(),
  pillar: z.enum(["Technical field note", "Startup strategy", "Operator story"]).optional(),
  status: z.enum(["idea", "draft", "ready", "published"]).optional(),
  hook: z.string().max(500).optional(),
  draft: z.string().max(10_000).optional(),
  takeaway: z.string().max(1000).optional(),
  accountIds: z.array(z.string()).max(10).optional(),
});

const deleteSchema = z.object({ id: z.string().uuid() });

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