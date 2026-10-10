/* eslint-disable @typescript-eslint/no-require-imports */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(__dirname, "../..");

const {
  isCamoufoxAvailable,
  listAgentProfiles,
  getAgentProfileDir,
  fetchIsolatedPage,
} = require("../../server/research/browser-service");

describe("Camoufox Browser Service & Gateway RPC Integration", () => {
  it("exports browser capabilities correctly", () => {
    expect(typeof isCamoufoxAvailable).toBe("function");
    expect(typeof listAgentProfiles).toBe("function");
    expect(typeof getAgentProfileDir).toBe("function");
    expect(typeof fetchIsolatedPage).toBe("function");
  });

  it("probes Camoufox availability and returns boolean status", () => {
    const available = isCamoufoxAvailable();
    expect(typeof available).toBe("boolean");
  });

  it("default install has no camoufox package (opt-in only)", () => {
    expect(fs.existsSync(path.join(repoRoot, "node_modules", "camoufox"))).toBe(false);
    expect(isCamoufoxAvailable()).toBe(false);
  });

  it("package.json does not declare camoufox or playwright-core as runtime dependencies", () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
    expect(pkg.dependencies.camoufox).toBeUndefined();
    expect(pkg.dependencies["playwright-core"]).toBeUndefined();
  });

  it("Dockerfile defaults INSTALL_CAMOUFOX to false and gates the Firefox install on it", () => {
    const df = fs.readFileSync(path.join(repoRoot, "Dockerfile"), "utf8");
    expect(df).toMatch(/^ARG INSTALL_CAMOUFOX=false\r?$/m);
    const optIn = df.slice(df.indexOf('if [ "$INSTALL_CAMOUFOX" = "true" ]; then'));
    expect(optIn).toMatch(/xvfb/);
    expect(optIn).toMatch(/camoufox fetch/);
  });

  it("handles agent browser profile directories idempotently", () => {
    const dir1 = getAgentProfileDir("agent-researcher-alpha");
    const dir2 = getAgentProfileDir("agent-researcher-alpha");
    expect(dir1).toBe(dir2);
    expect(dir1).toContain("agent-researcher-alpha");
  });

  it("rejects unauthorized navigation gracefully", async () => {
    const res = await fetchIsolatedPage("https://untrusted-unapproved-site.top/secret", ["wikipedia.org"]);
    expect(res.ok).toBe(false);
    expect(res.error).toBeDefined();
  });
});
