import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  isAuthConfigured,
  isValidSessionToken,
} from "@/lib/signal-room/auth";

/**
 * Gate for the Signal Room and its API.
 *
 * Fails closed: if SIGNAL_ROOM_PASSWORD is unset the route is unreachable
 * rather than open. An unconfigured secret must never mean "let everyone in" on
 * a surface that stores prospect financials.
 */
// Next 16.1.6 still reads `config` here, not `proxyConfig` — the newer name is
// documented but not yet implemented in this version. Verified against
// node_modules/next/dist: PROXY_FILENAME exists, proxyConfig does not.
// An unrecognised export means NO matcher, which runs this on every route.
export const config = {
  matcher: ["/signal-room/:path*", "/api/signal-room/:path*"],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page and its POST must stay reachable, or there is no way in.
  if (pathname === "/signal-room/login" || pathname === "/api/signal-room/login") {
    return NextResponse.next();
  }

  if (!isAuthConfigured()) {
    return isApiPath(pathname)
      ? NextResponse.json(
          { error: "Signal Room auth is not configured. Set SIGNAL_ROOM_PASSWORD." },
          { status: 503 }
        )
      : new NextResponse(
          "Signal Room auth is not configured. Set SIGNAL_ROOM_PASSWORD and redeploy.",
          { status: 503, headers: { "content-type": "text/plain" } }
        );
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (await isValidSessionToken(token)) return NextResponse.next();

  // An expired session mid-draft should read as an API error, not as HTML
  // arriving where JSON was expected.
  if (isApiPath(pathname)) {
    return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });
  }

  const loginUrl = new URL("/signal-room/login", request.url);
  if (pathname !== "/signal-room") loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

function isApiPath(pathname: string) {
  return pathname.startsWith("/api/");
}
