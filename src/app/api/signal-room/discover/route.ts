import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { discoverCompanies } from "@/lib/signal-room/ai";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";

const schema = z.object({
  query: z.string().trim().min(3).max(500),
  region: z.string().trim().min(2).max(100),
  stages: z.array(z.enum(["Seed", "Series A", "Series B"])).min(1).max(3),
  count: z.number().int().min(1).max(12).default(8),
});

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
      { error: "Review the search query, market, and funding stages." },
      { status: 400 }
    );
  }

  try {
    const companies = await discoverCompanies(input);
    return NextResponse.json({ companies });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Signal Room discovery output could not be normalized", error.issues);
      return NextResponse.json(
        { error: "Search results could not be normalized. Run the search again." },
        { status: 502 }
      );
    }

    console.error("Signal Room discovery failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Discovery failed." },
      { status: 502 }
    );
  }
}