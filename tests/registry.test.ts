import { test } from "node:test";
import assert from "node:assert/strict";
import { TOOLS, CATEGORIES, liveTools, getTool } from "../lib/registry.ts";

test("every tool slug is unique and URL-safe", () => {
  const slugs = TOOLS.map((t) => t.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  for (const s of slugs) assert.match(s, /^[a-z0-9]+(-[a-z0-9]+)*$/, s);
});

test("every tool belongs to a known category", () => {
  const ids = new Set(CATEGORIES.map((c) => c.id));
  for (const t of TOOLS) assert.ok(ids.has(t.category), t.slug);
});

test("titles and summaries are present and within search-friendly lengths", () => {
  for (const t of TOOLS) {
    assert.ok(t.name.length > 0, t.slug);
    assert.ok(t.summary.length > 10 && t.summary.length <= 120, t.slug);
  }
});

test("live tools are the only ones shown on the homepage", () => {
  const live = liveTools();
  assert.ok(live.length >= 1);
  assert.ok(live.every((t) => t.live));
});

test("getTool finds by slug and returns undefined otherwise", () => {
  assert.equal(getTool("word-counter")?.name, "Word Counter");
  assert.equal(getTool("nope"), undefined);
});
