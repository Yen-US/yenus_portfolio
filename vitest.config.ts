import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Unit tests for pure logic only — funnel derivation, business-day arithmetic,
 * and metric semantics. No DOM environment and no component tests: the value
 * here is in the date math and the stage rules, which are the parts that fail
 * silently rather than visibly.
 */
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
