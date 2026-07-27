import "server-only";

import { isIP } from "node:net";
import { lookup } from "node:dns/promises";
import * as cheerio from "cheerio";

const MAX_BYTES = 1_000_000;
const MAX_CONTENT_CHARS = 16_000;
const MAX_REDIRECTS = 3;

export interface ExtractedPage {
  url: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string | null;
}

export async function extractPublicPage(inputUrl: string): Promise<ExtractedPage> {
  let currentUrl = await validatePublicUrl(inputUrl);

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      signal: AbortSignal.timeout(12_000),
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent":
          "Yenson-Signal-Room/1.0 (+https://yenus.dev; public research assistant)",
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location || redirectCount === MAX_REDIRECTS) {
        throw new Error("The page redirected too many times.");
      }
      currentUrl = await validatePublicUrl(new URL(location, currentUrl).toString());
      continue;
    }

    if (!response.ok) {
      throw new Error(`The page returned HTTP ${response.status}.`);
    }

    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new Error("Only public HTML pages can be extracted.");
    }

    const html = await readLimitedText(response, MAX_BYTES);
    return parsePage(currentUrl, html);
  }

  throw new Error("The page could not be extracted.");
}

async function validatePublicUrl(input: string) {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error("Enter a valid public URL.");
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }
  if (url.username || url.password) {
    throw new Error("URLs with embedded credentials are not supported.");
  }
  if (url.port && !["80", "443"].includes(url.port)) {
    throw new Error("Non-standard URL ports are not supported.");
  }

  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
  if (hostname === "linkedin.com" || hostname.endsWith(".linkedin.com")) {
    throw new Error("LinkedIn is manual-only. Paste relevant public text as context instead.");
  }
  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    throw new Error("Local URLs are not allowed.");
  }

  if (isIP(hostname)) {
    if (isPrivateAddress(hostname)) throw new Error("Private network URLs are not allowed.");
  } else {
    const addresses = await lookup(hostname, { all: true, verbatim: true });
    if (addresses.length === 0 || addresses.some(({ address }) => isPrivateAddress(address))) {
      throw new Error("The URL did not resolve to a public host.");
    }
  }

  url.hash = "";
  return url.toString();
}

function isPrivateAddress(address: string) {
  const normalized = address.toLowerCase();
  if (normalized === "::1" || normalized === "::" || normalized.startsWith("fe80:")) return true;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;

  const mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  const ipv4 = mapped ?? (isIP(normalized) === 4 ? normalized : null);
  if (!ipv4) return false;

  const octets = ipv4.split(".").map(Number);
  const [first, second] = octets;
  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    first >= 224 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    (first === 100 && second >= 64 && second <= 127)
  );
}

async function readLimitedText(response: Response, maxBytes: number) {
  const contentLength = Number(response.headers.get("content-length") ?? "0");
  if (contentLength > maxBytes) throw new Error("The page is too large to extract safely.");
  if (!response.body) return "";

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error("The page is too large to extract safely.");
    }
    chunks.push(value);
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(merged);
}

function parsePage(url: string, html: string): ExtractedPage {
  const $ = cheerio.load(html);
  const title =
    $('meta[property="og:title"]').attr("content")?.trim() ||
    $("title").first().text().trim() ||
    new URL(url).hostname;
  const description =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    "";
  const publishedAt =
    $('meta[property="article:published_time"]').attr("content") ||
    $("time[datetime]").first().attr("datetime") ||
    null;

  $("script, style, noscript, svg, form, nav, footer, iframe").remove();
  const root = $("article").first().length
    ? $("article").first()
    : $("main").first().length
      ? $("main").first()
      : $("body");
  const content = root.text().replace(/\s+/g, " ").trim().slice(0, MAX_CONTENT_CHARS);

  return { url, title, description, content, publishedAt };
}