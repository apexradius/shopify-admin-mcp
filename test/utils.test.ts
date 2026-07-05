import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_LIMIT, formatResponse } from "../src/utils.js";

test("DEFAULT_LIMIT is 50", () => {
  assert.equal(DEFAULT_LIMIT, 50);
});

test("formatResponse wraps data as MCP text content", () => {
  const out = formatResponse({ hello: "world" });
  assert.equal(out.content.length, 1);
  assert.equal(out.content[0].type, "text");
  assert.deepEqual(JSON.parse(out.content[0].text), { hello: "world" });
});
