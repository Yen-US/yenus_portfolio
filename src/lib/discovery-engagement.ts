/**
 * Which rung of the offer ladder a visitor arrived through.
 *
 * Lives in its own module rather than beside the form: the discovery page is a
 * Server Component and must narrow the query string before render, and a
 * `"use client"` file cannot export a function the server is allowed to call.
 */
export type DiscoveryEngagement = "review" | "working-session";

/**
 * Narrow an untrusted `?engagement=` value. Anything unrecognised — a typo, a
 * stale link, a probe — degrades to "review" rather than throwing, because a
 * malformed URL should still be able to book a call.
 */
export function parseEngagement(value: unknown): DiscoveryEngagement {
  return value === "working-session" ? "working-session" : "review";
}
