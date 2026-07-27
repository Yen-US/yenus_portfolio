export async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "The request failed.");
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