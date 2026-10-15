import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as data from "./portfolio-data";

const { layoutFlapRows } = data;

/** Every string the portfolio renders, flattened. */
function visibleStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(visibleStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(visibleStrings);
  return [];
}

describe("layoutFlapRows", () => {
  it("wraps by word and never exceeds the board width", () => {
    expect(layoutFlapRows(["Senior AI Solution Architect"], 16)).toEqual([
      "SENIOR AI",
      "SOLUTION",
      "ARCHITECT",
    ]);
    expect(layoutFlapRows(["Yenson Umaña"], 10)).toEqual(["YENSON", "UMAÑA"]);
    for (const row of layoutFlapRows(["Senior AI Solution Architect"], 10)) {
      expect(row.length).toBeLessThanOrEqual(10);
    }
  });

  it("hard-splits a word longer than the row", () => {
    expect(layoutFlapRows(["Productionization"], 8)).toEqual(["PRODUCTI", "ONIZATIO", "N"]);
  });
});

describe("portfolio copy", () => {
  const strings = visibleStrings(Object.values(data).filter((v) => typeof v !== "function"));

  it("uses no em or en dashes", () => {
    expect(strings.filter((s) => /[–—]/.test(s))).toEqual([]);
  });

  it("uses the employment dates Yenson confirmed and claims neither role as current", () => {
    const byOrg = Object.fromEntries(data.experience.map((r) => [r.org, r.dates]));
    expect(byOrg["Microsoft (via Accenture)"]).toBe("May 2024 - Oct 2026");
    expect(byOrg["Wind River"]).toBe("Oct 2024 - Jun 2026");
    expect(data.heroLine).not.toMatch(/\b(lead|leading|currently)\b/i);
    expect(data.summary).toMatch(/Former AI advisor for Microsoft for Startups/);
  });

  it("publishes no unsupported counts or outcomes", () => {
    const joined = strings.join("\n");
    expect(joined).not.toMatch(/60\+|sixty|zero downtime|0 min|testimonial/i);
  });
});

describe("public CV file", () => {
  it("is the corrected derivative, not the outdated supplied original", () => {
    const pdf = readFileSync(path.join(process.cwd(), "public", "yenson-ai-resume.pdf"));
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(createHash("sha256").update(pdf).digest("hex")).not.toBe(
      "9c4aa874e1cecec0c6f14ee44c705ab8038b6036a24f434df2742daa6407a473"
    );
  });
});
