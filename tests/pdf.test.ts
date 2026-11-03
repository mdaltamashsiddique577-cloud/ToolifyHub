// Unit tests for lib/tools/pdf.ts: page ranges, remaining pages, file checks and text wrapping.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePageRanges, isPdfFile } from "../lib/tools/pdf.ts";

test("single pages and ranges are expanded in order", () => {
  assert.deepEqual(parsePageRanges("1-3, 5, 8-9", 10), { ok: true, pages: [1, 2, 3, 5, 8, 9] });
});

test("repeated pages are kept once", () => {
  assert.deepEqual(parsePageRanges("2, 1-3", 5), { ok: true, pages: [2, 1, 3] });
});

test("empty input is refused", () => {
  assert.equal(parsePageRanges("  ,  ", 5).ok, false);
});

test("pages outside the document are refused", () => {
  assert.equal(parsePageRanges("0", 5).ok, false);
  assert.equal(parsePageRanges("6", 5).ok, false);
  assert.equal(parsePageRanges("4-7", 5).ok, false);
});

test("a backwards range is refused", () => {
  assert.equal(parsePageRanges("5-2", 10).ok, false);
});

test("text that is not a page number is refused", () => {
  assert.equal(parsePageRanges("one", 10).ok, false);
  assert.equal(parsePageRanges("1.5", 10).ok, false);
});

test("PDF files are recognised by type or name", () => {
  assert.equal(isPdfFile({ name: "report.pdf", type: "" }), true);
  assert.equal(isPdfFile({ name: "photo.jpg", type: "image/jpeg" }), false);
});

import { wrapLines } from "../lib/tools/pdf.ts";

const six = (s: string) => s.length * 6;

test("words wrap at the maximum width", () => {
  assert.deepEqual(wrapLines("one two three four", 60, six), ["one two", "three four"]);
});

test("existing line breaks and blank lines are kept", () => {
  assert.deepEqual(wrapLines("a\n\nb", 100, six), ["a", "", "b"]);
});

test("a word longer than the line is split", () => {
  assert.deepEqual(wrapLines("abcdefgh", 24, six), ["abcd", "efgh"]);
});

import { pagesToKeep } from "../lib/tools/pdf.ts";

test("pagesToKeep returns the pages that are not removed", () => {
  assert.deepEqual(pagesToKeep(5, [2, 4]), [1, 3, 5]);
  assert.deepEqual(pagesToKeep(3, []), [1, 2, 3]);
  assert.deepEqual(pagesToKeep(2, [1, 2]), []);
});
