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
