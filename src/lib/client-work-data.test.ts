import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as work from "./client-work-data";

function visibleStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(visibleStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(visibleStrings);
  return [];
}

const copy = visibleStrings(work);
const joined = copy.join("\n");

describe("client work copy", () => {
  it("publishes no performance, money or social-proof claims", () => {
    expect(joined).not.toMatch(/\b\d+ (leads?|inquiries|customers|clients|sales|followers|subscribers)\b/i);
    expect(joined).not.toMatch(/revenue|ROAS|conversion rate|lift|%|\$\s?\d|USD|budget|testimonial|award|minimum/i);
    expect(joined).not.toMatch(/sold|paying customer|closed deal/i);
  });

  it("keeps JR as the painter and Presencia as the builder", () => {
    const jr = work.cases.find((c) => c.id === "jr")!;
    expect(jr.role).toMatch(/The paintings are his/);
    expect(visibleStrings(jr).join("\n")).not.toMatch(/we paint|our paintings|painted by Presencia/i);
  });

  it("exposes no private identifiers", () => {
    expect(joined).not.toMatch(/act_\d|\b\d{15,}\b|sslip\.io|resend\.app|supabase|brand_id|[0-9a-f]{8}-[0-9a-f]{4}-/i);
    expect(joined).not.toMatch(/\+?506\s?\d{4}\s?\d{4}/);
  });

  it("uses no em or en dashes", () => {
    expect(copy.filter((s) => /[–—]/.test(s))).toEqual([]);
  });

  it("ships every image it references and links only public pages", () => {
    for (const c of work.cases) {
      for (const s of [...c.screens, ...c.gallery, c.logo]) {
        expect(existsSync(path.join(process.cwd(), "public", s.src))).toBe(true);
      }
      for (const l of [...c.links, { href: c.url }, c.altUrl ?? { href: c.url }]) {
        expect(l.href).toMatch(/^https:\/\/(www\.presencia\.studio\/|juniorrodriguezartgallery\.com|www\.instagram\.com\/)/);
      }
      expect(c.screens.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("dates every state claim", () => {
    for (const c of work.cases) expect(c.story.state).toMatch(/17 October 2026/);
  });
});
