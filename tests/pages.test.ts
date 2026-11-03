// Checks that the tool page's COMPONENTS map has exactly the live tools from the registry.
// This stops a tool from going live without its page, and a page from staying after its tool is removed.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { liveTools } from "../lib/registry.ts";

// Every live tool must have a page component, and every component key must be a live tool.
// Checked from source text because the page is JSX, which Node cannot import directly.
const source = readFileSync(new URL("../app/tools/[slug]/page.tsx", import.meta.url), "utf8");
const mapBody = /const COMPONENTS[^{]*\{([\s\S]*?)\n\};/.exec(source);

test("component map exists in the tool page", () => {
  assert.ok(mapBody, "COMPONENTS map not found");
});

test("every live tool has a component, and no component is for a non-live tool", () => {
  const keys = [...mapBody![1].matchAll(/"([a-z0-9-]+)":/g)].map((m) => m[1]);
  const live = liveTools().map((t) => t.slug);
  for (const slug of live) assert.ok(keys.includes(slug), `missing component for ${slug}`);
  for (const key of keys) assert.ok(live.includes(key), `component for non-live tool ${key}`);
});
