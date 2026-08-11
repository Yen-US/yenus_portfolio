export async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const responseText = await response.text();
  let data: (T & { error?: string }) | null = null;
  if (responseText) {
    try {
      data = JSON.parse(responseText) as T & { error?: string };
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const fallback =
      response.status === 504
        ? "The search reached its time limit. Try a narrower query."
        : `The request failed (${response.status}).`;
    throw new Error(data?.error ?? fallback);
  }
  if (!data) throw new Error("The server returned an unreadable response.");
  return data;
}

export function getAccountIdentityKey(name: string, website: string) {
  const normalizedWebsite = website
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "")
    .toLowerCase();

  return normalizedWebsite
    ? `website:${normalizedWebsite}`
    : `name:${name.trim().toLowerCase().replace(/\s+/g, " ")}`;
}

/** Fields every new account starts with, so call sites stay in sync. */
export const NEW_ACCOUNT_DEFAULTS = {
  icpProfileId: null,
  disqualifiedReason: "",
  targetRole: "",
  targetName: "",
  approxUsers: "",
  mutualFit: "unknown",
  askSentAt: null,
} as const;

/** Relations a locally-created (demo mode) account starts empty. */
export function emptyAccountRelations() {
  return {
    sources: [],
    observations: [],
    messages: [],
    call: null,
  };
}