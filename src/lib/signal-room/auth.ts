import "server-only";

/**
 * Session auth for the Signal Room.
 *
 * The route stores prospect financials — monthly spend, revenue figures, waste
 * estimates — so `noindex` plus an unlinked URL is not sufficient. Obscurity is
 * not access control.
 *
 * Deliberately a single shared passphrase rather than a user table: there is
 * exactly one operator, and adding accounts, resets, and a users schema would
 * be more surface to get wrong for no gain.
 *
 * Built on Web Crypto rather than `node:crypto` so the identical code verifies
 * a session in middleware and in a route handler. Duplicating the signing logic
 * per runtime is how the two halves drift apart and auth quietly stops working.
 *
 * The cookie carries an HMAC of its own expiry, signed with the passphrase, so
 * a forged cookie cannot be minted without the secret and a stolen one expires.
 * Rotating SIGNAL_ROOM_PASSWORD invalidates every existing session.
 */

export const SESSION_COOKIE = "signal_room_session";
const SESSION_DAYS = 14;
export const SESSION_MAX_AGE_SECONDS = SESSION_DAYS * 24 * 60 * 60;

function getSecret() {
  const secret = process.env.SIGNAL_ROOM_PASSWORD;
  // No fallback and no default. A default password on a route holding prospect
  // financials is worse than no auth, because it reads as protected.
  if (!secret || secret.length < 12) return null;
  return secret;
}

/** Whether auth is configured. Used to fail closed with a stated reason. */
export function isAuthConfigured() {
  return getSecret() !== null;
}

async function sign(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Length-independent, branch-free comparison so timing cannot leak a prefix. */
function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}

export async function createSessionToken() {
  const secret = getSecret();
  if (!secret) return null;
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  return `${expiresAt}.${await sign(String(expiresAt), secret)}`;
}

export async function isValidSessionToken(token: string | undefined) {
  const secret = getSecret();
  if (!secret || !token) return false;

  const [rawExpiry, providedSignature] = token.split(".");
  if (!rawExpiry || !providedSignature) return false;

  const expiresAt = Number(rawExpiry);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return false;

  return constantTimeEqual(await sign(rawExpiry, secret), providedSignature);
}

export function isCorrectPassword(candidate: string) {
  const secret = getSecret();
  if (!secret) return false;
  return constantTimeEqual(candidate, secret);
}
