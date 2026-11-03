"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import { ErrorNote, Field, inputClass, primaryButtonClass } from "./ui.tsx";
import { MAX_PDF_BYTES, isPdfFile, pagesToKeep, parsePageRanges } from "../../lib/tools/pdf.ts";
import { formatBytes } from "../../lib/tools/image.ts";

export type PdfEditMode = "rotate" | "page-numbers" | "watermark" | "remove-pages";

const TITLES: Record<PdfEditMode, string> = {
  rotate: "Rotate PDF",
  "page-numbers": "Add page numbers",
  watermark: "Add watermark",
  "remove-pages": "Remove pages",
};

const SUFFIX: Record<PdfEditMode, string> = {
  rotate: "rotated",
  "page-numbers": "numbered",
  watermark: "watermarked",
  "remove-pages": "removed-pages",
};

export function PdfEdit({ mode }: { mode: PdfEditMode }) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [turn, setTurn] = useState<90 | 180 | 270>(90);
  const [watermark, setWatermark] = useState("DRAFT");
  const [pagesText, setPagesText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string; size: number; pages: number } | null>(null);

  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const chosen = e.target.files?.[0] ?? null;
    setResult(null);
    setError(null);
    setFile(null);
    setPageCount(0);
    if (!chosen) return;
    if (!isPdfFile(chosen)) {
      setError("Choose a PDF file.");
      return;
    }
    if (chosen.size > MAX_PDF_BYTES) {
      setError("This file is larger than 50 MB.");
      return;
    }
    try {
      const doc = await PDFDocument.load(await chosen.arrayBuffer());
      setPageCount(doc.getPageCount());
      setFile(chosen);
    } catch {
      setError("This PDF could not be opened. It may be password-protected or damaged.");
    }
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      let out: PDFDocument = src;

      if (mode === "rotate") {
        for (const page of src.getPages()) {
          page.setRotation(degrees((page.getRotation().angle + turn) % 360));
        }
      }

      if (mode === "page-numbers") {
        const font = await src.embedFont(StandardFonts.Helvetica);
        const total = src.getPageCount();
        src.getPages().forEach((page, i) => {
          const label = `${i + 1} / ${total}`;
          const w = font.widthOfTextAtSize(label, 10);
          page.drawText(label, { x: (page.getWidth() - w) / 2, y: 24, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
        });
      }

      if (mode === "watermark") {
        const text = watermark.trim();
        if (text === "") {
          setError("Type the watermark text first.");
          return;
        }
        const font = await src.embedFont(StandardFonts.HelveticaBold);
        let size = 48;
        try {
          font.widthOfTextAtSize(text, size);
        } catch {
          setError("The watermark can only use Latin letters, numbers and common symbols.");
          return;
        }
        const angle = Math.PI / 4;
        for (const page of src.getPages()) {
          const { width, height } = page.getSize();
          const tw = font.widthOfTextAtSize(text, size);
          // Rotation turns the text around its start point, so move the start back to centre the text.
          const x = width / 2 - (tw / 2) * Math.cos(angle);
          const y = height / 2 - (tw / 2) * Math.sin(angle);
          page.drawText(text, { x, y, size, font, color: rgb(0.5, 0.5, 0.5), opacity: 0.3, rotate: degrees(45) });
        }
      }

      if (mode === "remove-pages") {
        const parsed = parsePageRanges(pagesText, src.getPageCount());
        if (!parsed.ok) {
          setError(parsed.message);
          return;
        }
        const keep = pagesToKeep(src.getPageCount(), parsed.pages);
        if (keep.length === 0) {
          setError("You cannot remove every page. Leave at least one.");
          return;
        }
        out = await PDFDocument.create();
        const copied = await out.copyPages(src, keep.map((p) => p - 1));
        copied.forEach((page) => out.addPage(page));
      }

      const bytes = await out.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      const base = file.name.replace(/\.pdf$/i, "") || "document";
      setResult({
        url: URL.createObjectURL(blob),
        name: `${base}-${SUFFIX[mode]}.pdf`,
        size: blob.size,
        pages: out.getPageCount(),
      });
    } catch {
      setError("The PDF could not be changed. Try again with a different file.");
    } finally {
      setBusy(false);
    }
  }

  const buttonLabel = mode === "remove-pages" ? "Remove pages" : TITLES[mode];

  return (
    <div className="space-y-6">
      <Field id="pdf-edit-file" label="Choose a PDF file" hint="Up to 50 MB. The file is changed in your browser and never uploaded.">
        <input
          id="pdf-edit-file"
          type="file"
          accept="application/pdf"
          onChange={onFile}
          className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:font-medium file:text-ink"
        />
      </Field>

      {file ? (
        <div className="space-y-4 rounded-[var(--radius-card)] border border-line p-4">
          <p className="text-sm text-muted">{file.name} · {pageCount} pages · {formatBytes(file.size)}</p>

          {mode === "rotate" ? (
            <Field id="pdf-turn" label="Turn every page">
              <select id="pdf-turn" value={turn} onChange={(e) => setTurn(Number(e.target.value) as 90 | 180 | 270)} className={inputClass}>
                <option value={90}>90° clockwise</option>
                <option value={180}>180°</option>
                <option value={270}>90° counter-clockwise</option>
              </select>
            </Field>
          ) : null}

          {mode === "page-numbers" ? (
            <p className="text-sm text-muted">Adds a label such as "2 / 5" at the bottom centre of every page.</p>
          ) : null}

          {mode === "watermark" ? (
            <Field id="pdf-watermark" label="Watermark text" hint="Shown diagonally, in light grey, on every page.">
              <input id="pdf-watermark" type="text" value={watermark} onChange={(e) => setWatermark(e.target.value)} className={inputClass} />
            </Field>
          ) : null}

          {mode === "remove-pages" ? (
            <Field id="pdf-remove" label="Pages to remove" hint={`Numbers and ranges from 1 to ${pageCount}, such as 2, 4-6.`}>
              <input id="pdf-remove" type="text" value={pagesText} onChange={(e) => setPagesText(e.target.value)} placeholder="2, 4-6" className={inputClass} />
            </Field>
          ) : null}

          <button type="button" onClick={run} disabled={busy} className={primaryButtonClass}>
            {busy ? "Working…" : buttonLabel}
          </button>
        </div>
      ) : null}

      <ErrorNote message={error} />

      {result ? (
        <div className="space-y-3 rounded-[var(--radius-card)] bg-secondary p-4">
          <p className="text-sm">Done. The new PDF has {result.pages} {result.pages === 1 ? "page" : "pages"} ({formatBytes(result.size)}).</p>
          <a href={result.url} download={result.name} className={primaryButtonClass}>Download {result.name}</a>
        </div>
      ) : null}
    </div>
  );
}
