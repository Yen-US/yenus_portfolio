import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { discoverAcrossAngles } from "@/lib/signal-room/ai";
import { resolveMissingWebsites } from "@/lib/signal-room/resolve-website";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";
import { getActiveIcp } from "@/lib/signal-room/store";

const schema = z.object({
  // Either a single angle or several. Several is the point.
  angles: z.array(z.string().trim().min(3).max(500)).min(1).max(4).optional(),
  query: z.string().trim().min(3).max(500).optional(),
  region: z.string().trim().min(2).max(100).optional(),
  stages: z.array(z.enum(["Seed", "Series A", "Series B"])).min(1).max(3).optional(),
  limit: z.number().int().min(1).max(12).default(8),
});

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }
  if (!takeRateLimit(request, "signal-discover", 12, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Research limit reached. Try again later." }, { status: 429 });
  }

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Review the search angles." }, { status: 400 });
  }

  const angles = input.angles?.length ? input.angles : input.query ? [input.query] : [];
  if (angles.length === 0) {
    return NextResponse.json({ error: "Add at least one search angle." }, { status: 400 });
  }

  try {
    // The locked ICP supplies defaults; it never blocks a search.
    const icp = await getActiveIcp().catch(() => null);
    const stages =
      input.stages ??
      (icp?.stages.filter((stage) => stage !== "Unknown") as string[] | undefined) ??
      ["Seed", "Series A", "Series B"];
    const region = input.region ?? icp?.regions[0] ?? "Global, English-speaking markets";

    const { companies, failedAngles } = await discoverAcrossAngles({
      angles,
      region,
      stages,
      perAngle: 3,
      limit: input.limit,
      disqualifiers: icp?.disqualifiers,
      icp,
    });

    // Recover official domains for candidates whose citations were all press
    // coverage. Verified by fetching, never guessed.
    const withWebsites = await resolveMissingWebsites(companies);
    const resolved = withWebsites.map((company, index) => ({
      ...company,
      websiteConfidence:
        company.website && !companies[index].website
          ? ("resolved" as const)
          : company.websiteConfidence,
    }));

    return NextResponse.json({
      companies: resolved,
      icpVersion: icp?.version ?? null,
      anglesRun: angles.length,
      failedAngles,
    });
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
        ? "Public-signal search took too long. Try fewer angles."
        : error instanceof Error
          ? error.message
          : "Discovery failed.";
    return NextResponse.json(
      { error: message },
      { status: /too long/i.test(message) ? 504 : 502 }
    );
  }
}
