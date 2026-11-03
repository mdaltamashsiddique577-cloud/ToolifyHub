// Pure text logic for the text tools: word, character, sentence and paragraph counts, reading time,
// case conversion and space cleanup. No UI code, so the functions are unit tested in tests/tools.test.ts.
// Text tools: pure functions, no DOM, so they can be unit tested in Node.

export type CaseMode = "upper" | "lower" | "title" | "sentence" | "camel" | "snake" | "kebab";

export const MAX_TEXT_CHARS = 500_000;

export function assertTextLength(text: string): void {
  if (text.length > MAX_TEXT_CHARS) {
    throw new Error("Text is longer than 500,000 characters. Split it into smaller parts.");
  }
}

export function countWords(text: string): number {
  const t = text.trim();
  if (t === "") return 0;
  return t.split(/\s+/).length;
}

// Counts user-perceived characters (graphemes), so an emoji counts as one.
export function countCharacters(text: string, includeSpaces = true): number {
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  let count = 0;
  for (const { segment } of segmenter.segment(text)) {
    if (!includeSpaces && /^\s+$/.test(segment)) continue;
    count++;
  }
  return count;
}

export function countSentences(text: string): number {
  const parts = text.split(/[.!?]+(?=\s|$)/).filter((s) => s.trim() !== "");
  return parts.length;
}

export function countParagraphs(text: string): number {
  return text.split(/\n\s*\n/).filter((p) => p.trim() !== "").length;
}

// 200 words per minute, the common adult reading speed used by most word counters.
export function readingTimeSeconds(words: number): number {
  return Math.round((words / 200) * 60);
}

const SMALL_WORDS = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "in", "of", "on", "or", "the", "to"]);

function splitWords(text: string): string[] {
  return text
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w !== "");
}

function capitalize(word: string): string {
  if (word === "") return word;
  const first = word.charAt(0).toUpperCase();
  return first + word.slice(1).toLowerCase();
}

export function convertCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      // Small English words stay lowercase, except at the start.
      return text
        .toLowerCase()
        .replace(/\p{L}[\p{L}'’]*/gu, (word, offset: number) => {
          if (offset > 0 && SMALL_WORDS.has(word)) return word;
          return capitalize(word);
        });
    case "sentence":
      return text
        .toLowerCase()
        .replace(/(^\s*|[.!?]\s+)(\p{Ll})/gu, (_m, lead: string, ch: string) => lead + ch.toUpperCase());
    case "camel": {
      const words = splitWords(text).map((w) => w.toLowerCase());
      return words
        .map((w, i) => (i === 0 ? w : capitalize(w)))
        .join("");
    }
    case "snake":
      return splitWords(text).map((w) => w.toLowerCase()).join("_");
    case "kebab":
      return splitWords(text).map((w) => w.toLowerCase()).join("-");
  }
}

export interface SpaceOptions {
  collapseSpaces: boolean;
  trimLines: boolean;
  removeBlankLines: boolean;
}

export const DEFAULT_SPACE_OPTIONS: SpaceOptions = {
  collapseSpaces: true,
  trimLines: true,
  removeBlankLines: false,
};

export function removeExtraSpaces(text: string, options: SpaceOptions = DEFAULT_SPACE_OPTIONS): string {
  let lines = text.split(/\r?\n/);
  if (options.trimLines) lines = lines.map((line) => line.trim());
  if (options.collapseSpaces) lines = lines.map((line) => line.replace(/[ \t]+/g, " "));
  if (options.removeBlankLines) lines = lines.filter((line) => line.trim() !== "");
  return lines.join("\n");
}
