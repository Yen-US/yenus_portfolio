import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildResearchBrief } from "@/lib/signal-room/ai";
import { extractPublicPage } from "@/lib/signal-room/extract-public-page";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";
import { replaceAccountSources, updateAccount } from "@/lib/signal-room/store";
import type { ResearchSource } from "@/lib/signal-room/types";

const schema = z.object({
  accountId: z.string().min(1),
  account: z.object({
    name: z.string().trim().min(1).max(150),
    website: z.string().trim().max(500),
    stage: z.enum(["Seed", "Series A", "Series B", "Unknown"]),
    location: z.string().trim().max(150),
    oneLiner: z.string().trim().max(500),
    notes: z.string().trim().max(5000),
  }),
  urls: z.array(z.string().trim().url()).max(8),
  manualContext: z.string().trim().max(12_000),
  observations: z.array(z.unknown()).default([]),
  persist: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  if (!takeRateLimit(request, "signal-research", 12, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Research limit reached. Try again later." }, { status: 429 });
  }

  try {
    const input = schema.parse(await request.json());
    const settled = await Promise.allSettled(input.urls.map(extractPublicPage));
    const capturedAt = new Date().toISOString();
    const sources: ResearchSource[] = settled.flatMap((result, index) => {
      if (result.status === "rejected") return [];
      const page = result.value;
      return [
        {
          id: `pending-${index}`,
          accountId: input.accountId,
          url: page.url,
          title: page.title,
          sourceType: inferSourceType(page.url),
          excerpt: page.description || page.content.slice(0, 280),
          content: page.content,
          publishedAt: page.publishedAt,
          capturedAt,
        },
      ];
    });
    const failures = settled.flatMap((result, index) =>
      result.status === "rejected"
        ? [{ url: input.urls[index], error: result.reason instanceof Error ? result.reason.message : "Extraction failed." }]
        : []
    );

    if (sources.length === 0 && !input.manualContext) {
      return NextResponse.json(
        { error: "No public page could be extracted. Add manual context or another URL.", failures },
        { status: 422 }
      );
    }

    const brief = await buildResearchBrief({
      account: input.account,
      sources,
      manualContext: input.manualContext,
      observations: input.observations as never,
    });

    let persistedSources = sources;
    if (input.persist) {
      persistedSources = await replaceAccountSources(
        input.accountId,
        sources.map(({ id: _id, accountId: _accountId, ...source }) => source)
      );
      await updateAccount(input.accountId, { brief, status: "ready", sources: persistedSources });
    }

    return NextResponse.json({ brief, sources: persistedSources, failures });
  } catch (error) {
    console.error("Signal Room research failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Research failed." },
      { status: error instanceof z.ZodError ? 400 : 502 }
    );
  }
}

function inferSourceType(url: string) {
  const path = new URL(url).pathname.toLowerCase();
  if (path.includes("job") || path.includes("career")) return "jobs";
  if (path.includes("blog") || path.includes("news")) return "news";
  if (path.includes("docs")) return "technical";
  return "web";
}