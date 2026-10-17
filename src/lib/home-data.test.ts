import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as home from "./home-data";

function visibleStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(visibleStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(visibleStrings);
  return [];
}

const copy = visibleStrings(Object.fromEntries(Object.entries(home).filter(([, v]) => typeof v !== "function")));
const joined = copy.join("\n");

describe("homepage copy", () => {
  it("keeps education and certifications off the homepage", () => {
    expect(joined).not.toMatch(/education|licentiate|tecnol[oó]gico|on hold|degree|AI-102|AZ-204|certif/i);
  });

  it("uses no em or en dashes", () => {
    expect(copy.filter((s) => /[–—]/.test(s))).toEqual([]);
  });

  it("claims no current employment at Microsoft or Wind River", () => {
    const byOrg = Object.fromEntries(home.roles.map((r) => [r.org, r.dates]));
    expect(byOrg["Microsoft (via Accenture)"]).toBe("May 2024 - Oct 2026");
    expect(byOrg["Wind River"]).toBe("Oct 2024 - Jun 2026");
    expect(home.roles.map((r) => r.org)).not.toContain("Presencia Studio");
  });

  it("publishes no traction, outcomes, or superlatives", () => {
    expect(joined).not.toMatch(/\b\d+\+? (customers|clients|users|merchants|providers|teams)\b/i);
    expect(joined).not.toMatch(/60\+|revenue|profitable|zero downtime|most senior|worldwide|YC\b|Y Combinator|promotion/i);
  });

  it("links the two products to their live domains and ships every screen it references", () => {
    expect(home.products.map((p) => p.url)).toEqual(["https://www.presencia.studio", "https://usalisto.com"]);
    for (const p of home.products) {
      expect(p.screens.length).toBeGreaterThanOrEqual(3);
      for (const s of [...p.screens, p.desktop]) {
        expect(existsSync(path.join(process.cwd(), "public", s.src))).toBe(true);
      }
    }
  });
});
