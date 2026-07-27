import "server-only";

import { NextRequest } from "next/server";

const limits = new Map<string, { count: number; resetAt: number }>();

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";

  const allowed = new Set([new URL(request.url).origin]);
  const configuredSite = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredSite) allowed.add(new URL(configuredSite).origin);
  return allowed.has(origin);
}

export function takeRateLimit(
  request: NextRequest,
  bucket: string,
  max: number,
  windowMs: number
) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = `${bucket}:${forwarded ?? request.headers.get("x-real-ip") ?? "anonymous"}`;
  const now = Date.now();
  const current = limits.get(key);

  if (!current || current.resetAt <= now) {
    limits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= max) return false;
  current.count += 1;
  return true;
}