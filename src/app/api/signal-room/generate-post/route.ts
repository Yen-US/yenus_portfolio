import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateLinkedInPost } from "@/lib/signal-room/ai";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";
import { createPost } from "@/lib/signal-room/store";

const schema = z.object({
  topic: z.string().trim().min(5).max(500),
  pillar: z.enum(["Technical field note", "Startup strategy", "Operator story"]),
  pointOfView: z.string().trim().min(10).max(1000),
  sourceMaterial: z.string().trim().max(18_000),
  accountIds: z.array(z.string()).max(10),
  persist: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  if (!takeRateLimit(request, "signal-posts", 20, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Post generation limit reached. Try again later." }, { status: 429 });
  }

  try {
    const input = schema.parse(await request.json());
    const generated = await generateLinkedInPost(input);
    const post = {
      ...generated,
      pillar: input.pillar,
      status: "draft" as const,
      accountIds: input.accountIds,
    };

    if (!input.persist) return NextResponse.json({ post });
    return NextResponse.json({ post: await createPost(post) }, { status: 201 });
  } catch (error) {
    console.error("Signal Room post generation failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Post generation failed." },
      { status: error instanceof z.ZodError ? 400 : 502 }
    );
  }
}