// Pure developer-tool logic: JSON parse and format with line and column for errors, and Base64
// encode and decode with UTF-8 support. Input size is capped at MAX_DEV_BYTES.
// Developer tools: JSON formatting and Base64 (UTF-8 safe). Pure functions.

export const MAX_DEV_BYTES = 5 * 1024 * 1024;

export interface JsonError {
  message: string;
  line: number;
  column: number;
}

function positionToLineColumn(text: string, position: number): { line: number; column: number } {
  const before = text.slice(0, position);
  const lines = before.split("\n");
  return { line: lines.length, column: lines[lines.length - 1].length + 1 };
}

// Finds the first occurrence of a character outside a JSON string.
// Used when the engine's message names the bad token but not its position.
function firstUnquotedIndex(text: string, ch: string): number {
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inString) {
      if (c === "\\") i++;
      else if (c === '"') inString = false;
    } else if (c === '"') {
      inString = true;
    } else if (c === ch) {
      return i;
    }
  }
  return -1;
}

// Works out where a JSON.parse failure happened, across engine message formats.
function errorPosition(text: string, message: string): number {
  const atPosition = /position (\d+)/.exec(message);
  if (atPosition) return Number(atPosition[1]);
  if (/end of JSON input/i.test(message)) return text.length;
  const token = /Unexpected token '(.)'/.exec(message);
  if (token) {
    const index = firstUnquotedIndex(text, token[1]);
    if (index >= 0) return index;
  }
  return 0;
}

// Returns the parsed value, or a JsonError with the line and column of the problem.
export function parseJson(text: string): { ok: true; value: unknown } | { ok: false; error: JsonError } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid JSON";
    const { line, column } = positionToLineColumn(text, errorPosition(text, message));
    return { ok: false, error: { message: "Invalid JSON. Check line " + line + ", column " + column + ".", line, column } };
  }
}

export type JsonIndent = 2 | 4 | "tab" | "minify";

export function formatJson(text: string, indent: JsonIndent): { ok: true; output: string } | { ok: false; error: JsonError } {
  const parsed = parseJson(text);
  if (!parsed.ok) return parsed;
  if (indent === "minify") return { ok: true, output: JSON.stringify(parsed.value) };
  const space = indent === "tab" ? "\t" : indent;
  return { ok: true, output: JSON.stringify(parsed.value, null, space) };
}

function bytesToBinary(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return s;
}

function binaryToBytes(binary: string): Uint8Array {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function base64Encode(text: string, urlSafe = false): string {
  const bytes = new TextEncoder().encode(text);
  let out = btoa(bytesToBinary(bytes));
  if (urlSafe) out = out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return out;
}

export function base64Decode(input: string): { ok: true; text: string } | { ok: false; message: string } {
  let s = input.trim().replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4 !== 0) s += "=";
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s)) {
    return { ok: false, message: "This is not valid Base64. Check for stray characters." };
  }
  try {
    const bytes = binaryToBytes(atob(s));
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return { ok: true, text };
  } catch {
    return { ok: false, message: "The Base64 decodes to bytes that are not valid UTF-8 text." };
  }
}
