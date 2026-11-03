import { test } from "node:test";
import assert from "node:assert/strict";
import { TOOL_MENU, CONVERT_MENU } from "../lib/menu.ts";
import { TOOLS, liveTools } from "../lib/registry.ts";

test("every menu entry is a live tool", () => {
  const live = new Set(liveTools().map((t) => t.slug));
  for (const group of [...TOOL_MENU, ...CONVERT_MENU]) {
    for (const slug of group.slugs) assert.ok(live.has(slug), `${group.title}: ${slug} is not live`);
  }
});

test("every live tool appears in the all-tools menu", () => {
  const inMenu = new Set(TOOL_MENU.flatMap((g) => g.slugs));
  for (const t of liveTools()) assert.ok(inMenu.has(t.slug), `${t.slug} is missing from the menu`);
  assert.ok(TOOLS.length >= liveTools().length);
});
