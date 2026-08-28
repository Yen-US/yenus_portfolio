import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  activateProfileVersion,
  createProfileVersion,
} from "@/lib/signal-room/ledger-store";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";

/**
 * LinkedIn profile versions.
 *
 * Recording only — nothing here edits LinkedIn. "Activate" means the operator
 * confirms they pasted it in by hand, which is why the profile is never mutated
 * automatically in this version.
 */
const createSchema = z.object({
  headline: z.string().trim().min(1).max(300),
  about: z.string().trim().max(5000).optional(),
  featured: z.array(z.string().trim().max(500)).max(10).optional(),
  hypothesis: z.string().trim().max(1000).optional(),
  notes: z.string().trim().max(2000).optional(),
});

const activateSchema = z.object({ id: z.string().uuid() });

export async function POST(request: NextRequest) {
  return handle(request, async () => {
    const input = createSchema.parse(await request.json());
    return NextResponse.json(
      { version: await createProfileVersion(input) },
      { status: 201 }
    );
  });
}

export async function PATCH(request: NextRequest) {
  return handle(request, async () => {
    const { id } = activateSchema.parse(await request.json());
    await activateProfileVersion(id);
    return NextResponse.json({ ok: true });
  });
}

async function handle(request: NextRequest, action: () => Promise<NextResponse>) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }
  if (!takeRateLimit(request, "signal-profile-versions", 60, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Profile limit reached." }, { status: 429 });
  }
  try {
    return await action();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid profile version." }, { status: 422 });
    }
    const message = error instanceof Error ? error.message : "Request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
