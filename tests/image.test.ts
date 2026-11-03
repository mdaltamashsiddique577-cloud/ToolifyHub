import { test } from "node:test";
import assert from "node:assert/strict";
import {
  fitSize,
  percentSaved,
  formatBytes,
  isInputType,
  isLossy,
  extensionFor,
  MAX_IMAGE_SIDE,
} from "../lib/tools/image.ts";

test("width alone keeps the proportions", () => {
  assert.deepEqual(fitSize(4000, 3000, { width: 800, keepRatio: true }), { ok: true, width: 800, height: 600 });
});

test("height alone keeps the proportions", () => {
  assert.deepEqual(fitSize(4000, 3000, { height: 1500, keepRatio: true }), { ok: true, width: 2000, height: 1500 });
});

test("two values with keepRatio fit inside the box", () => {
  assert.deepEqual(fitSize(4000, 3000, { width: 1000, height: 1000, keepRatio: true }), { ok: true, width: 1000, height: 750 });
});

test("without keepRatio the exact size is used", () => {
  assert.deepEqual(fitSize(4000, 3000, { width: 500, height: 500, keepRatio: false }), { ok: true, width: 500, height: 500 });
});

test("missing size is refused", () => {
  const r = fitSize(4000, 3000, { keepRatio: true });
  assert.equal(r.ok, false);
});

test("non-integer, zero and oversized values are refused", () => {
  for (const width of [0, -5, 12.5, MAX_IMAGE_SIDE + 1, Number.NaN]) {
    assert.equal(fitSize(100, 100, { width, keepRatio: true }).ok, false, String(width));
  }
});

test("rounding never produces a zero side", () => {
  const r = fitSize(10000, 2, { width: 1, keepRatio: true });
  assert.ok(r.ok && r.height >= 1);
});

test("percentSaved reports reduction and growth", () => {
  assert.equal(percentSaved(1000, 250), 75);
  assert.equal(percentSaved(100, 150), -50);
  assert.equal(percentSaved(0, 5), 0);
});

test("formatBytes picks a readable unit", () => {
  assert.equal(formatBytes(512), "512 B");
  assert.equal(formatBytes(2048), "2.0 KB");
  assert.equal(formatBytes(5 * 1024 * 1024), "5.0 MB");
});

test("only JPG, PNG and WebP are accepted", () => {
  assert.equal(isInputType("image/png"), true);
  assert.equal(isInputType("image/gif"), false);
});

test("lossy formats and extensions are mapped", () => {
  assert.equal(isLossy("image/png"), false);
  assert.equal(isLossy("image/webp"), true);
  assert.equal(extensionFor("image/jpeg"), "jpg");
});
