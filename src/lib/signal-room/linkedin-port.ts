import "server-only";

import { createHash } from "node:crypto";
import type { CapabilityState } from "@/lib/signal-room/types";

/**
 * The LinkedIn boundary.
 *
 * Written as a port with an explicit capability model because the provider is
 * only partly usable: authenticated profile reads work, publishing exists, and
 * fetching your own posts or their reactions returned 403/404 on all three real
 * URNs tested. Modelling that honestly is the entire point of this file.
 *
 * The rule that matters: a refusal is a CapabilityState, never a metric. If
 * `getKnownPost` cannot read a post, the answer is `forbidden` — not zero
 * impressions. A dashboard that renders a 403 as 0 tells you a good post failed.
 *
 * No adapter is wired yet: `composio` is not a dependency of this repo, and
 * adding one for endpoints that return 403 would buy nothing. `NullLinkedInPort`
 * below is the honest default — every capability `unknown`, publishing
 * unsupported — so the app runs, the UI can render real capability states, and
 * a real adapter drops in without touching callers.
 */

export interface LinkedInProfile {
  memberId: string;
  headline: string;
  vanityName: string;
}

export interface LinkedInPostRead {
  urn: string;
  url: string;
  /**
   * Nullable throughout. Null is "the provider did not tell us", never zero.
   */
  impressions: number | null;
  reactions: number | null;
  comments: number | null;
}

export interface Unsupported {
  unsupported: true;
  state: CapabilityState;
  detail: string;
}

export function isUnsupported(value: unknown): value is Unsupported {
  return typeof value === "object" && value !== null && "unsupported" in value;
}

export interface ApprovedLinkedInPost {
  body: string;
  visibility: "public" | "connections";
  /**
   * The hash the operator approved. Publishing recomputes it from `body` and
   * refuses on mismatch, so an edit made after approval cannot ride out on the
   * strength of the old confirmation.
   */
  approvedContentHash: string;
}

export interface PublishResult {
  ok: boolean;
  urn: string | null;
  url: string | null;
  detail: string;
}

export interface LinkedInPort {
  getMyProfile(): Promise<LinkedInProfile | Unsupported>;
  getKnownPost(urn: string): Promise<LinkedInPostRead | Unsupported>;
  listKnownPostReactions(urn: string): Promise<{ total: number | null } | Unsupported>;
  publishApprovedPost(input: ApprovedLinkedInPost): Promise<PublishResult>;
}

/** Stable hash of exactly the bytes shown in the approval preview. */
export function contentHash(body: string): string {
  return createHash("sha256").update(body, "utf8").digest("hex");
}

/**
 * Verify an approval still applies to the text about to be published.
 *
 * Called immediately before any publish. Approval binds to content, not to a
 * post id, which is what makes "approve, then edit, then publish" impossible
 * rather than merely discouraged.
 */
export function approvalStillValid(body: string, approvedHash: string | null): boolean {
  return approvedHash !== null && contentHash(body) === approvedHash;
}

/**
 * The default port: nothing is wired, and it says so.
 *
 * Deliberately not a stub that returns fake numbers. Every read reports
 * `unknown`, publishing reports `unsupported`, and the UI renders those states
 * instead of inventing engagement.
 */
export const NullLinkedInPort: LinkedInPort = {
  async getMyProfile() {
    return {
      unsupported: true,
      state: "unknown",
      detail: "No LinkedIn provider is configured for this deployment.",
    };
  },
  async getKnownPost() {
    return {
      unsupported: true,
      state: "unknown",
      detail:
        "No provider configured. Personal-account post reads returned 403/404 when last tested.",
    };
  },
  async listKnownPostReactions() {
    return {
      unsupported: true,
      state: "unknown",
      detail: "No provider configured.",
    };
  },
  async publishApprovedPost() {
    return {
      ok: false,
      urn: null,
      url: null,
      detail:
        "Publishing is not wired. Post manually and register the URL in the post registry.",
    };
  },
};

export function getLinkedInPort(): LinkedInPort {
  return NullLinkedInPort;
}

/**
 * What we believe the provider can do, as of the last real test.
 *
 * Seeded from the plan's own findings rather than left empty, so the UI can
 * explain why a metric field is manual instead of leaving the operator to
 * wonder whether something is broken.
 */
export const KNOWN_CAPABILITIES: {
  capability: string;
  state: CapabilityState;
  detail: string;
}[] = [
  {
    capability: "profile.read",
    state: "unknown",
    detail: "Authenticated profile reads worked in testing; no adapter is wired here.",
  },
  {
    capability: "post.read",
    state: "forbidden",
    detail: "Three personal post URNs returned 403/404 through authenticated tools.",
  },
  {
    capability: "post.reactions.read",
    state: "forbidden",
    detail: "Reaction listing is not granted for personal accounts.",
  },
  {
    capability: "post.publish",
    state: "unsupported",
    detail: "Publishing tools exist upstream but are not wired in this deployment.",
  },
];
