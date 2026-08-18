import "server-only";

import OpenAI from "openai";

/**
 * Diagram generation for a finished post.
 *
 * Verified against gpt-image-2-2026-04-21: it returns `b64_json` only, never a
 * URL, so the bytes come back inline and the caller decides where they live.
 *
 * They are deliberately NOT written to disk. Vercel's filesystem is read-only
 * at runtime, so a public/ write would work locally and fail in production —
 * the worst kind of bug. The image is returned to the browser as a data URL for
 * the operator to download. Persisting it properly is a Supabase Storage job.
 */

const imageModel = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-2-2026-04-21";

/** Appended to every prompt so one post's diagram matches the next one's. */
const HOUSE_STYLE =
  "Flat vector editorial diagram, engineering-notebook style, on a warm off-white background (#faf7f2). Thin sans-serif labels, thin rules, generous white space. Exactly one accent colour, burnt orange (#c0492a), placed only where the surprise is. Everything else near-black on off-white. No people, no photorealism, no 3D, no gradients, no glow, no drop shadows, no circuit boards, no brain imagery, no stock-illustration style. Every word must be spelled correctly and rendered legibly.";

export interface GeneratedImage {
  /** data: URL, ready for <img src> and for a download link. */
  dataUrl: string;
  prompt: string;
  model: string;
  bytes: number;
}

export async function generatePostImage(
  prompt: string
): Promise<GeneratedImage> {
  if (!prompt.trim()) throw new Error("No image prompt supplied.");

  const openai = getOpenAI();
  const composed = `${prompt.trim()}\n\n${HOUSE_STYLE}`;

  const response = await openai.images.generate(
    {
      model: imageModel,
      prompt: composed,
      // 3:2 landscape. LinkedIn crops toward this ratio in the feed.
      size: "1536x1024",
      n: 1,
    },
    { timeout: 240_000, maxRetries: 1 }
  );

  const b64 = response.data?.[0]?.b64_json;
  if (!b64) throw new Error("Image model returned no image data.");

  return {
    dataUrl: `data:image/png;base64,${b64}`,
    prompt: composed,
    model: imageModel,
    bytes: Math.round((b64.length * 3) / 4),
  };
}

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
