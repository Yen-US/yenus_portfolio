import { describe, expect, it } from "vitest";
import * as sheet from "./sheet-data";

/** Every string the sheet renders, flattened. */
function visibleStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(visibleStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(visibleStrings);
  return [];
}

const copy = visibleStrings(
  Object.fromEntries(Object.entries(sheet).filter(([, v]) => typeof v !== "function"))
);

describe("monthIndex", () => {
  it("counts months from Jan 2021", () => {
    expect(sheet.monthIndex("Jan 2021")).toBe(0);
    expect(sheet.monthIndex("Feb 2022")).toBe(13);
    expect(sheet.monthIndex("May 2024")).toBe(40);
    expect(sheet.monthIndex("2025")).toBe(48);
    expect(sheet.monthIndex("Present")).toBe(sheet.monthIndex(sheet.revision));
  });
  it("rejects labels it cannot read", () => {
    expect(() => sheet.monthIndex("Spring 2024")).toThrow();
  });
});

describe("career chain", () => {
  const byTitle = Object.fromEntries(sheet.chain.map((r) => [r.title, r]));

  it("carries the eight roles published at /career, in order", () => {
    expect(sheet.chain.map((r) => `${r.title} @ ${r.org}`)).toEqual([
      "Senior AI Solution Architect @ Microsoft (via Accenture)",
      "Founder @ Presencia Studio",
      "Full Stack Software Engineer @ Wind River",
      "Junior Software Tools Engineer @ Wind River",
      "Software Developer Intern @ Wind River",
      "Solutions Development Engineer @ OneReach.ai",
      "Advanced Technical Support Engineer @ Wrike (part of Citrix)",
      "Tier 2 Support Engineer & SME @ DocuSign (via Sitel)",
    ]);
  });

  it("uses the dates Yenson confirmed and marks only Presencia as current", () => {
    expect(byTitle["Senior AI Solution Architect"].dates).toBe("May 2024 - Oct 2026");
    expect(byTitle["Full Stack Software Engineer"].dates).toBe("Oct 2024 - Jun 2026");
    expect(sheet.chain.filter((r) => r.current).map((r) => r.org)).toEqual(["Presencia Studio"]);
  });

  it("keeps every bar inside the axis and in month order", () => {
    for (const role of sheet.chain) {
      expect(role.start).toBeGreaterThanOrEqual(0);
      expect(role.end).toBeGreaterThan(role.start);
      expect(role.end).toBeLessThanOrEqual(sheet.chainEnd);
    }
    expect(byTitle["Tier 2 Support Engineer & SME"].start).toBe(0);
  });

  it("only carries CV bullets for roles that are on the CV", () => {
    expect(byTitle["Senior AI Solution Architect"].points.length).toBeGreaterThan(0);
    expect(byTitle["Advanced Technical Support Engineer"].points).toEqual([]);
    expect(byTitle["Software Developer Intern"].points).toEqual([]);
  });
});

describe("sheet copy", () => {
  it("uses no em or en dashes", () => {
    expect(copy.filter((s) => /[–—]/.test(s))).toEqual([]);
  });

  it("claims no current employment at Microsoft or Wind River", () => {
    const joined = copy.join("\n");
    expect(joined).not.toMatch(/currently (advising|at Microsoft|at Wind River)/i);
    expect(sheet.hero.lede).toMatch(/from 2024 to 2026/);
  });

  it("publishes no unsupported counts, outcomes, or superlatives", () => {
    const joined = copy.join("\n");
    expect(joined).not.toMatch(/60\+|sixty|zero downtime|0 min|testimonial/i);
    expect(joined).not.toMatch(/\bYC\b|Y Combinator/);
    expect(joined).not.toMatch(/most senior|worldwide|decision authority|promotions?\b/i);
    expect(joined).not.toMatch(/\b\d+ years? \d+ months?\b/);
  });

  it("states the dates it draws the experience title from", () => {
    expect(sheet.experienceTitle).toMatch(/January 2021/);
    expect(sheet.experienceTitle).toMatch(/May 2024/);
  });
});
