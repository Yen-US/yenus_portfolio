import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { planPost, type AutopilotBrief } from "@/lib/signal-room/post-autopilot";
import { generatePostPackage } from "@/lib/signal-room/post-pipeline";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";
import { createPost, getWorkspaceData } from "@/lib/signal-room/store";

// Autopilot adds a planning pass in front of the four generation passes, so this
// can legitimately run several minutes. Without this it is killed at the platform
// default and surfaces as an unexplained timeout.
export const maxDuration = 300;

const POST_FORMAT_VALUES = [
  "Recognition patterns",
  "Single argument",
  "Field note",
  "Contrarian correction",
] as const;

const PILLAR_VALUES = [
  "Technical field note",
  "Startup strategy",
  "Operator story",
] as const;

/**
 * Two shapes on one route:
 *   { autopilot: true }  — the brief is planned from the workspace.
 *   everything else      — the operator supplied the brief.
 *
 * A discriminated union rather than making every field optional, so an
 * autopilot request cannot silently fall through to a half-empty manual brief.
 */
const manualSchema = z.object({
  autopilot: z.literal(false).default(false),
  topic: z.string().trim().min(5).max(500),
  pillar: z.enum(PILLAR_VALUES),
  format: z.enum(POST_FORMAT_VALUES).default("Recognition patterns"),
  exemplar: z.string().trim().max(12_000).optional(),
  pointOfView: z.string().trim().min(10).max(1000),
  sourceMaterial: z.string().trim().max(18_000),
  accountIds: z.array(z.string()).max(10),
  persist: z.boolean().default(false),
});

const autopilotSchema = z.object({
  autopilot: z.literal(true),
  persist: z.boolean().default(false),
});

const schema = z.union([autopilotSchema, manualSchema]);

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }
  if (!takeRateLimit(request, "signal-posts", 20, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Post generation limit reached. Try again later." },
      { status: 429 }
    );
  }

  try {
    const input = schema.parse(await request.json());

    let brief: AutopilotBrief | null = null;
    let generationInput;

    if (input.autopilot) {
      const workspace = await getWorkspaceData();
      brief = await planPost({
        accounts: workspace.accounts,
        posts: workspace.posts,
        icp: workspace.icp,
      });
      generationInput = {
        topic: brief.topic,
        pillar: brief.pillar,
        format: brief.format,
        pointOfView: brief.pointOfView,
        sourceMaterial: brief.sourceMaterial,
      };
    } else {
      generationInput = {
        topic: input.topic,
        pillar: input.pillar,
        format: input.format,
        pointOfView: input.pointOfView,
        sourceMaterial: input.sourceMaterial,
        exemplar: input.exemplar,
      };
    }

    const generated = await generatePostPackage(generationInput);
    const post = {
      ...generated,
      pillar: generationInput.pillar,
      status: "draft" as const,
      accountIds: brief ? brief.accountIds : input.autopilot ? [] : input.accountIds,
    };

    if (!input.persist) return NextResponse.json({ post, brief });
    return NextResponse.json(
      { post: await createPost(post), brief },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signal Room post generation failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Post generation failed." },
      { status: error instanceof z.ZodError ? 400 : 502 }
    );
  }
}
