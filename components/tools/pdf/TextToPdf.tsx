// Text to PDF: wraps text to A4 pages with the standard Helvetica font. Only Latin text works, because that font has no other scripts.
"use client";

import { useEffect, useState } from "react";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { ErrorNote, Field, primaryButtonClass } from "../ui.tsx";
import { wrapLines } from "../../../lib/tools/pdf.ts";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 56;
const SIZE = 12;
const LINE = 16;

export function TextToPdf() {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url: string; pages: number } | null>(null);

  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  async function build() {
    if (text.trim() === "") {
      setError("Type or paste some text first.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      let lines: string[];
      try {
        lines = wrapLines(text, PAGE_W - 2 * MARGIN, (s) => font.widthOfTextAtSize(s, SIZE));
      } catch {
        setError("This text has characters the standard font cannot write, such as Hindi script or emoji. Use Latin letters, numbers and common symbols.");
        return;
      }
      let page = doc.addPage([PAGE_W, PAGE_H]);
      let y = PAGE_H - MARGIN;
      for (const line of lines) {
        if (y < MARGIN) {
          page = doc.addPage([PAGE_W, PAGE_H]);
          y = PAGE_H - MARGIN;
        }
        if (line) page.drawText(line, { x: MARGIN, y: y - SIZE, size: SIZE, font });
        y -= LINE;
      }
      const out = await doc.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      setResult({ url: URL.createObjectURL(blob), pages: doc.getPageCount() });
    } catch {
      setError("The PDF could not be made. Try shorter text.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Field id="pdf-text" label="Text" hint="Uses a standard font, so it works with Latin letters, numbers and common symbols. Other scripts and emoji are not supported yet.">
        <textarea
          id="pdf-text"
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-[var(--radius-control)] border border-line bg-white px-3.5 py-2.5 text-base"
        />
      </Field>
      <button type="button" onClick={build} disabled={busy} className={primaryButtonClass}>
        {busy ? "Making PDF…" : "Make PDF"}
      </button>
      <ErrorNote message={error} />
      {result ? (
        <div className="space-y-3 rounded-[var(--radius-card)] bg-secondary p-4">
          <p className="text-sm">Made a PDF with {result.pages} {result.pages === 1 ? "page" : "pages"}.</p>
          <a href={result.url} download="text.pdf" className={primaryButtonClass}>Download text.pdf</a>
        </div>
      ) : null}
    </div>
  );
}
