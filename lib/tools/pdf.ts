// Pure helpers for the PDF tools. PDF reading and writing live in the components.

export const MAX_PDF_BYTES = 50 * 1024 * 1024;

export function isPdfFile(file: { name: string; type: string }): boolean {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

export type RangeResult = { ok: true; pages: number[] } | { ok: false; message: string };

// Turn "1-3, 5, 8-9" into page numbers (1-based), in the order given, without repeats.
export function parsePageRanges(input: string, pageCount: number): RangeResult {
  const parts = input.split(",").map((p) => p.trim()).filter((p) => p.length > 0);
  if (parts.length === 0) return { ok: false, message: "Enter the pages to keep, such as 1-3, 5." };

  const pages: number[] = [];
  for (const part of parts) {
    const match = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(part);
    if (!match) return { ok: false, message: `"${part}" is not a page or a range such as 2 or 4-6.` };
    const from = Number(match[1]);
    const to = match[2] === undefined ? from : Number(match[2]);
    if (from < 1 || to > pageCount || from > to) {
      return { ok: false, message: `Pages must be between 1 and ${pageCount}, and a range must go from the smaller number to the larger.` };
    }
    for (let p = from; p <= to; p++) if (!pages.includes(p)) pages.push(p);
  }
  return { ok: true, pages };
}

// Word-wrap plain text to a maximum width. measure() returns the width of a string.
// Existing line breaks are kept, and a single word wider than the line is split.
export function wrapLines(text: string, maxWidth: number, measure: (s: string) => number): string[] {
  const out: string[] = [];
  for (const paragraph of text.replace(/\r\n?/g, "\n").split("\n")) {
    if (paragraph.trim() === "") {
      out.push("");
      continue;
    }
    let line = "";
    for (const word of paragraph.split(/\s+/).filter((w) => w.length > 0)) {
      const candidate = line === "" ? word : `${line} ${word}`;
      if (measure(candidate) <= maxWidth) {
        line = candidate;
        continue;
      }
      if (line !== "") out.push(line);
      // Split a word that is too long for a whole line.
      let piece = "";
      for (const ch of word) {
        if (measure(piece + ch) > maxWidth && piece !== "") {
          out.push(piece);
          piece = ch;
        } else {
          piece += ch;
        }
      }
      line = piece;
    }
    out.push(line);
  }
  return out;
}

// Pages left after removing some. Pages are 1-based and returned in order.
export function pagesToKeep(pageCount: number, remove: number[]): number[] {
  const drop = new Set(remove);
  const keep: number[] = [];
  for (let p = 1; p <= pageCount; p++) if (!drop.has(p)) keep.push(p);
  return keep;
}
