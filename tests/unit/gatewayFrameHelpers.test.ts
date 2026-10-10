import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { resOk, resErr, randomId } = require("../../server/lib/gateway-frames.js");
const hermesAdapter = require("../../server/hermes-gateway-adapter.js");

describe("shared gateway frame helpers (server/lib/gateway-frames.js)", () => {
  it("resOk builds a success response frame with default empty payload", () => {
    expect(resOk("a1", { x: 1 })).toEqual({ type: "res", id: "a1", ok: true, payload: { x: 1 } });
    expect(resOk("a2")).toEqual({ type: "res", id: "a2", ok: true, payload: {} });
  });

  it("resErr builds an error response frame with code and message", () => {
    expect(resErr("b1", "bad", "nope")).toEqual({
      type: "res",
      id: "b1",
      ok: false,
      error: { code: "bad", message: "nope" },
    });
  });

  it("randomId returns 16 lowercase hex chars and is unlikely to repeat", () => {
    const ids = new Set(Array.from({ length: 200 }, () => randomId()));
    expect(ids.size).toBe(200);
    for (const id of ids) expect(id).toMatch(/^[0-9a-f]{16}$/);
  });

  it("hermes adapter uses the shared helpers (no local copies remain)", () => {
    // The adapter must not re-declare these helpers; the shared module is the single source.
    const fs = require("node:fs");
    const path = require("node:path");
    const src = fs.readFileSync(path.resolve(__dirname, "../../server/hermes-gateway-adapter.js"), "utf8");
    expect(src).toMatch(/require\("\.\/lib\/gateway-frames"\)/);
    expect(src).not.toMatch(/^function (resOk|resErr|randomId)\(/m);
    expect(typeof hermesAdapter).toBe("object");
  });
});
