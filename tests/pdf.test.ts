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
