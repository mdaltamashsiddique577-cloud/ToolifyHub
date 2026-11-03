// Unit tests for the text, calculator and developer logic in lib/tools.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  countWords, countCharacters, countSentences, countParagraphs, readingTimeSeconds,
  convertCase, removeExtraSpaces,
} from "../lib/tools/text.ts";
import { ageBetween, bmi, emi, emiSchedule, percentage, gst, round2 } from "../lib/tools/calc.ts";
import { formatJson, parseJson, base64Encode, base64Decode } from "../lib/tools/dev.ts";

// ---------- Word and character counter ----------

test("word count ignores extra whitespace and handles empty text", () => {
  assert.equal(countWords("  hello   world \n again "), 3);
  assert.equal(countWords("   "), 0);
  assert.equal(countWords(""), 0);
});

test("character count treats an emoji as one character", () => {
  assert.equal(countCharacters("hi 👍🏽"), 4);
  assert.equal(countCharacters("👨‍👩‍👧"), 1);
  assert.equal(countCharacters("a b c", false), 3);
  assert.equal(countCharacters("a b c", true), 5);
});

test("sentences, paragraphs and reading time", () => {
  assert.equal(countSentences("One. Two! Three? Four"), 4);
  assert.equal(countParagraphs("First para.\n\nSecond para.\n\n\nThird."), 3);
  assert.equal(readingTimeSeconds(200), 60);
});

// ---------- Case converter ----------

test("case modes", () => {
  assert.equal(convertCase("hello World", "upper"), "HELLO WORLD");
  assert.equal(convertCase("Hello WORLD", "lower"), "hello world");
  assert.equal(convertCase("the lord of the rings", "title"), "The Lord of the Rings");
  assert.equal(convertCase("HELLO there. how ARE you! ok", "sentence"), "Hello there. How are you! Ok");
  assert.equal(convertCase("hello big world", "camel"), "helloBigWorld");
  assert.equal(convertCase("Hello Big-World", "snake"), "hello_big_world");
  assert.equal(convertCase("Hello Big_World", "kebab"), "hello-big-world");
});

// ---------- Remove extra spaces ----------

test("removes extra spaces, trims lines and optionally drops blank lines", () => {
  const input = "  a    b  \n\n\n  c\t\td  ";
  assert.equal(removeExtraSpaces(input), "a b\n\n\nc d");
  assert.equal(
    removeExtraSpaces(input, { collapseSpaces: true, trimLines: true, removeBlankLines: true }),
    "a b\nc d",
  );
});

// ---------- Age ----------

test("age between two dates, with month borrowing", () => {
  assert.deepEqual(ageBetween("1990-05-20", "2026-11-02"), {
    years: 36, months: 5, days: 13, totalDays: 13315,
  });
  // 31 Jan to 1 Mar 2025: the monthiversary falls on 28 Feb, so 1 month and 1 day
  assert.deepEqual(ageBetween("2025-01-31", "2025-03-01"), { years: 0, months: 1, days: 1, totalDays: 29 });
  // Same day, exact years
  assert.deepEqual(ageBetween("2000-02-29", "2024-02-29"), { years: 24, months: 0, days: 0, totalDays: 8766 });
});

test("age rejects bad input", () => {
  assert.throws(() => ageBetween("2030-01-01", "2026-01-01"), /cannot be after/);
  assert.throws(() => ageBetween("hello", "2026-01-01"), /Enter both dates/);
});

// ---------- BMI ----------

test("BMI value and category", () => {
  assert.deepEqual(bmi(70, 175), { bmi: 22.9, category: "Normal" });
  assert.equal(bmi(50, 175).category, "Underweight");
  assert.equal(bmi(85, 175).category, "Overweight");
  assert.equal(bmi(110, 175).category, "Obese");
});

test("BMI rejects out-of-range values", () => {
  assert.throws(() => bmi(70, 20), /Height/);
  assert.throws(() => bmi(5, 170), /Weight/);
});

// ---------- EMI ----------

test("EMI matches the standard formula", () => {
  // 10 lakh at 10% for 12 months: 87,915.89 a month (checked independently in Python)
  const r = emi(1_000_000, 10, 12);
  assert.equal(r.emi, 87915.89);
  assert.ok(Math.abs(r.totalPayment - r.emi * 12) < 0.05);
  assert.ok(Math.abs(r.totalInterest - (r.totalPayment - 1_000_000)) < 0.01);
});

test("EMI with 0 percent interest is principal divided by months", () => {
  assert.equal(emi(120000, 0, 12).emi, 10000);
  assert.equal(emi(120000, 0, 12).totalInterest, 0);
});

test("EMI schedule ends at zero balance and totals match", () => {
  const rows = emiSchedule(500000, 9.5, 60);
  assert.equal(rows.length, 60);
  assert.equal(rows[rows.length - 1].balance, 0);
  const principalPaid = round2(rows.reduce((s, r) => s + r.principal, 0));
  assert.equal(principalPaid, 500000);
});

test("EMI rejects bad input", () => {
  assert.throws(() => emi(0, 10, 12), /more than 0/);
  assert.throws(() => emi(1000, 60, 12), /between 0 and 50/);
  assert.throws(() => emi(1000, 10, 0), /1 to 480/);
  assert.throws(() => emi(1000, 10, 12.5), /whole number/);
});

// ---------- Percentage ----------

test("percentage modes", () => {
  assert.equal(percentage("of", 20, 150), 30);
  assert.equal(percentage("isWhat", 30, 150), 20);
  assert.equal(percentage("change", 100, 125), 25);
  assert.equal(percentage("change", 200, 150), -25);
  assert.equal(percentage("add", 200, 10), 220);
  assert.equal(percentage("subtract", 200, 10), 180);
});

test("percentage refuses division by zero", () => {
  assert.throws(() => percentage("isWhat", 5, 0), /cannot be 0/);
  assert.throws(() => percentage("change", 0, 5), /cannot be 0/);
});

// ---------- GST ----------

test("GST add and remove, with CGST and SGST split", () => {
  assert.deepEqual(gst(1000, 18, "add"), { base: 1000, tax: 180, total: 1180, cgst: 90, sgst: 90 });
  assert.deepEqual(gst(1180, 18, "remove"), { base: 1000, tax: 180, total: 1180, cgst: 90, sgst: 90 });
});

test("GST rejects bad input", () => {
  assert.throws(() => gst(-1, 18, "add"), /0 or more/);
  assert.throws(() => gst(100, 150, "add"), /between 0 and 100/);
});

// ---------- JSON formatter ----------

test("JSON formats and minifies", () => {
  const pretty = formatJson('{"a":1,"b":[2,3]}', 2);
  assert.ok(pretty.ok);
  assert.equal(pretty.output, '{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}');
  const mini = formatJson('{ "a" : 1 }', "minify");
  assert.ok(mini.ok);
  assert.equal(mini.output, '{"a":1}');
});

test("JSON errors report line and column", () => {
  const bad = parseJson('{\n  "a": 1,\n  "b": }');
  assert.equal(bad.ok, false);
  if (!bad.ok) {
    assert.equal(bad.error.line, 3);
    assert.ok(bad.error.message.includes("line 3"));
  }
});

// ---------- Base64 ----------

test("Base64 encodes and decodes UTF-8 text, including Hindi and emoji", () => {
  const text = "नमस्ते 👋 hello";
  const encoded = base64Encode(text);
  const decoded = base64Decode(encoded);
  assert.ok(decoded.ok);
  if (decoded.ok) assert.equal(decoded.text, text);
});

test("Base64 known value and URL-safe mode", () => {
  assert.equal(base64Encode("hello"), "aGVsbG8=");
  assert.equal(base64Encode("??>>", true), "Pz8-Pg");
  const back = base64Decode("Pz8-Pg");
  assert.ok(back.ok);
  if (back.ok) assert.equal(back.text, "??>>");
});

test("Base64 decode rejects invalid input", () => {
  const bad = base64Decode("not base64!!");
  assert.equal(bad.ok, false);
});
