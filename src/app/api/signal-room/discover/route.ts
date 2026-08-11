import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { discoverCompanies } from "@/lib/signal-room/ai";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";
import { getActiveIcp } from "@/lib/signal-room/store";

const schema = z.object({
  query: z.string().trim().min(3).max(500),
  region: z.string().trim().min(2).max(100).optional(),
  stages: z.array(z.enum(["Seed", "Series A", "Series B"])).min(1).max(3).optional(),
  count: z.number().int().min(1).max(3).default(3),
});

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  if (!takeRateLimit(request, "signal-discover", 8, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Research limit reached. Try again later." }, { status: 429 });
  }

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Review the search angle and result count." },
      { status: 400 }
    );
  }

  try {
    // The locked ICP is a default, never a gate. Finding targets is the
    // bottleneck; blocking discovery until an ICP exists helps nobody.
    const icp = await getActiveIcp().catch(() => null);
    const stages =
      input.stages ??
      (icp?.stages.filter((stage) => stage !== "Unknown") as string[] | undefined) ??
      ["Seed", "Series A", "Series B"];
    const region = input.region ?? icp?.regions[0] ?? "Global, English-speaking markets";

    const companies = await discoverCompanies({
      query: input.query,
      count: input.count,
      stages,
      region,
      disqualifiers: icp?.disqualifiers,
      icp,
    });
    return NextResponse.json({ companies, icpVersion: icp?.version ?? null });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Signal Room discovery output could not be normalized", error.issues);
      return NextResponse.json(
        { error: "Search results could not be normalized. Run the search again." },
        { status: 502 }
      );
    }

    console.error("Signal Room discovery failed", error);
    const message =
      error instanceof Error && /timed out|timeout|aborted/i.test(error.message)
        ? "Public-signal search took too long. Try a narrower query."
        : error instanceof Error
          ? error.message
          : "Discovery failed.";
    return NextResponse.json(
      { error: message },
      { status: /too long/i.test(message) ? 504 : 502 }
    );
  }
}