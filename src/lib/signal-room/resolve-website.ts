import "server-only";

/**
 * Resolves a startup's official website when discovery citations were all press
 * or aggregator coverage (TechCrunch, Crunchbase and friends are deliberately
 * blocklisted as candidate domains, which is correct but leaves many candidates
 * with no site).
 *
 * IMPORTANT LIMITATION, learned by testing against real data: guessing a domain
 * from a company name is not reliable on its own. `people.ai` redirects to a
 * rebrand, `dust.ai` and `people.dev` are *different companies* that legitimately
 * own those names, and parking services answer for many others. A wrong domain is
 * worse than an empty field, because it sends the operator to research the wrong
 * business and then to write to the wrong CTO.
 *
 * So this resolver is deliberately conservative:
 *  - the guessed label must survive redirects (no rebrand hops, no parking)
 *  - the page's own identity markup (title / og:site_name) must name the company
 *  - the company name must be distinctive enough to be worth guessing at all
 *
 * Anything it does return is still surfaced in the UI as `auto-found` rather than
 * confirmed, because a same-name company in a different market can satisfy every
 * check above. Treat the output as a lead, not a fact.
 */

const CANDIDATE_TLDS = [".com", ".ai", ".io", ".dev", ".co"];
const FETCH_TIMEOUT_MS = 4_000;
const MAX_HTML_BYTES = 120_000;

/**
 * Names too generic to guess a domain for. A single dictionary word plus a TLD
 * lands on an unrelated business far too often to be useful.
 */
const GENERIC_NAME_WORDS = new Set([
  "people", "dust", "mosaic", "fuse", "vendo", "pivot", "jump", "aligned",
  "canvas", "orbit", "signal", "layer", "base", "scale", "shape", "form",
  "flow", "loop", "stack", "cloud", "data", "logic", "vector", "atlas",
  "north", "delta", "echo", "nova", "prism", "quanta", "relay", "spark",
]);

function isDistinctiveName(companyName: string) {
  const slug = toDomainSlug(companyName);
  if (slug.length < 5) return false;
  // "Mosaic AI" -> "mosaic": a bare common word is not distinctive enough.
  const bare = toDomainSlug(companyName.replace(/\bai\b/gi, ""));
  return !GENERIC_NAME_WORDS.has(bare);
}

/** Words dropped when turning a company name into a domain guess. */
const NOISE = /\b(inc|llc|corp|corporation|company|technologies|technology|labs|the)\b/gi;

export function toDomainSlug(companyName: string) {
  return companyName
    .replace(NOISE, " ")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "");
}

/** "Mosaic AI" -> ["mosaicai", "mosaic"] so both mosaicai.com and mosaic.ai get tried. */
function nameVariants(companyName: string) {
  const full = toDomainSlug(companyName);
  const withoutAi = toDomainSlug(companyName.replace(/\bai\b/gi, ""));
  return Array.from(new Set([full, withoutAi].filter((value) => value.length >= 3)));
}

function buildCandidateDomains(companyName: string) {
  const domains: string[] = [];
  for (const variant of nameVariants(companyName)) {
    for (const tld of CANDIDATE_TLDS) {
      domains.push(`${variant}${tld}`);
    }
  }
  return Array.from(new Set(domains));
}

async function readLimitedText(response: Response, maxBytes: number) {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let received = 0;
  let text = "";
  try {
    while (received < maxBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      text += decoder.decode(value, { stream: true });
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  return text;
}

/**
 * A domain counts as confirmed only when the company name appears in a place
 * that identifies the site's owner - the <title>, og:site_name, or a logo alt.
 *
 * Body text is deliberately NOT enough: "people" appears in ordinary marketing
 * copy on countless sites, so matching body text would confirm the wrong
 * company. Prefer returning nothing over returning a plausible-but-wrong domain,
 * because a wrong domain sends the operator to research a different business.
 */
function pageIdentifiesCompany(html: string, companyName: string) {
  const head = html.slice(0, MAX_HTML_BYTES);
  const variants = nameVariants(companyName);

  const identityStrings = [
    ...Array.from(head.matchAll(/<title[^>]*>([\s\S]{0,200}?)<\/title>/gi)).map((m) => m[1]),
    ...Array.from(
      head.matchAll(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']{0,120})["']/gi)
    ).map((m) => m[1]),
    ...Array.from(
      head.matchAll(/<meta[^>]+name=["']application-name["'][^>]+content=["']([^"']{0,120})["']/gi)
    ).map((m) => m[1]),
  ];
  if (identityStrings.length === 0) return false;

  const normalizedIdentity = identityStrings
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  return variants.some(
    (variant) => variant.length >= 3 && normalizedIdentity.includes(variant)
  );
}

async function tryDomain(domain: string, companyName: string) {
  const url = `https://${domain}`;
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { accept: "text/html,application/xhtml+xml" },
    });
    if (!response.ok) return "";

    // The domain we guessed must survive redirects. people.ai forwards to
    // backstory.ai after a rebrand, and noproduct.co.uk parks unrelated names -
    // both are wrong answers, so a redirect away from the guessed name is a
    // rejection rather than a discovery.
    const finalHost = new URL(response.url).hostname.replace(/^www\./, "");
    const finalSlug = normalizeHostSlug(finalHost);
    if (!nameVariants(companyName).includes(finalSlug)) return "";

    const html = await readLimitedText(response, MAX_HTML_BYTES);
    if (!pageIdentifiesCompany(html, companyName)) return "";

    return new URL(response.url).origin;
  } catch {
    return "";
  }
}

/** "www.distyl.ai" -> "distyl" (registrable label, minus a trailing "ai"). */
function normalizeHostSlug(hostname: string) {
  const label = hostname.replace(/^www\./, "").split(".")[0];
  return label.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

/**
 * Returns a confirmed origin (e.g. "https://dust.tt") or "" when nothing could
 * be verified. Never guesses.
 */
export async function resolveOfficialWebsite(companyName: string): Promise<string> {
  // Generic single-word names resolve to unrelated businesses too often.
  if (!isDistinctiveName(companyName)) return "";

  const domains = buildCandidateDomains(companyName);
  if (domains.length === 0) return "";

  // Probe in small batches so one slow host cannot stall the whole discovery run.
  const BATCH = 5;
  for (let index = 0; index < domains.length; index += BATCH) {
    const batch = domains.slice(index, index + BATCH);
    const results = await Promise.all(
      batch.map((domain) => tryDomain(domain, companyName))
    );
    const hit = results.find(Boolean);
    if (hit) return hit;
  }
  return "";
}

/** Resolves several companies concurrently, leaving already-known sites alone. */
export async function resolveMissingWebsites<T extends { name: string; website: string }>(
  companies: T[]
): Promise<T[]> {
  const resolved = await Promise.all(
    companies.map(async (company) => {
      if (company.website) return company;
      const website = await resolveOfficialWebsite(company.name).catch(() => "");
      return website ? { ...company, website } : company;
    })
  );
  return resolved;
}
