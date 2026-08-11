import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sharpenIcp } from "@/lib/signal-room/setting-ai";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";
import {
  createIcpProfile,
  getActiveIcp,
  listIcpProfiles,
  lockIcpProfile,
} from "@/lib/signal-room/store";

const sharpenSchema = z.object({
  statement: z.string().trim().min(10).max(2000),
});

const createSchema = z.object({
  label: z.string().trim().min(1).max(150),
  statement: z.string().trim().min(10).max(4000),
  stages: z.array(z.enum(["Seed", "Series A", "Series B", "Unknown"])).min(1).max(4),
  regions: z.array(z.string().trim().max(120)).max(10),
  buyerRoles: z.array(z.string().trim().max(120)).max(10),
  disqualifiers: z.array(z.string().trim().max(200)).max(20),
  keywordBanks: z.object({
    ai: z.array(z.string().trim().max(60)).max(30),
    b2b: z.array(z.string().trim().max(60)).max(30),
    production: z.array(z.string().trim().max(60)).max(30),
    architecture: z.array(z.string().trim().max(60)).max(30),
    urgency: z.array(z.string().trim().max(60)).max(30),
  }),
  measurableWeakness: z.string().trim().max(600),
});

const lockSchema = z.object({ id: z.string().uuid() });

export async function GET(request: NextRequest) {
  return handle(request, "signal-icp-read", 120, async () => {
    const [active, all] = await Promise.all([getActiveIcp(), listIcpProfiles()]);
    return NextResponse.json({ active, profiles: all });
  });
}

export async function POST(request: NextRequest) {
  return handle(request, "signal-icp-write", 60, async () => {
    const body = await request.json();

    // Sharpening returns a draft only. It never activates anything.
    if (body?.action === "sharpen") {
      const input = sharpenSchema.parse(body);
      const draft = await sharpenIcp({
        statement: input.statement,
        currentIcp: await getActiveIcp(),
      });
      return NextResponse.json({ draft });
    }

    const input = createSchema.parse(body);
    return NextResponse.json({ profile: await createIcpProfile(input) }, { status: 201 });
  });
}

export async function PATCH(request: NextRequest) {
  return handle(request, "signal-icp-write", 60, async () => {
    const { id } = lockSchema.parse(await request.json());
    return NextResponse.json({ profile: await lockIcpProfile(id) });
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
    return NextResponse.json({ error: "ICP request limit reached." }, { status: 429 });
  }
  try {
    return await action();
  } catch (error) {
    console.error("Signal Room ICP request failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "ICP request failed." },
      { status: error instanceof z.ZodError ? 400 : 502 }
    );
  }
}
