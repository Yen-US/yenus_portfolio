import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  isAuthConfigured,
  isCorrectPassword,
} from "@/lib/signal-room/auth";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";

const schema = z.object({ password: z.string().min(1).max(200) });

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }
  // Tight budget: this is the one endpoint worth brute-forcing.
  if (!takeRateLimit(request, "signal-login", 10, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many attempts. Wait 15 minutes." },
      { status: 429 }
    );
  }
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { error: "Auth is not configured. Set SIGNAL_ROOM_PASSWORD." },
      { status: 503 }
    );
  }

  try {
    const { password } = schema.parse(await request.json());
    if (!isCorrectPassword(password)) {
      // Deliberately identical for wrong password and malformed input, so the
      // response never reveals which part was wrong.
      return NextResponse.json({ error: "Incorrect passphrase." }, { status: 401 });
    }

    const token = await createSessionToken();
    if (!token) {
      return NextResponse.json({ error: "Could not start a session." }, { status: 503 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Incorrect passphrase." }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
