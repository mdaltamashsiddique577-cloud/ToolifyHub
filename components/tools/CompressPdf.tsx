"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { PDFDocument } from "pdf-lib";
import { ErrorNote, Field, inputClass, primaryButtonClass } from "./ui.tsx";
import { MAX_PDF_BYTES, isPdfFile } from "../../lib/tools/pdf.ts";
import { formatBytes, percentSaved } from "../../lib/tools/image.ts";
import { loadPdfJs, type PdfDoc } from "./pdfjs.ts";

const MAX_PAGES = 60;

const LEVELS: Record<string, { label: string; scale: number; quality: number }> = {
  light: { label: "Light: sharper pages, smaller saving", scale: 1.5, quality: 0.85 },
  medium: { label: "Medium: good balance", scale: 1.25, quality: 0.7 },
  strong: { label: "Strong: smallest file, lowest detail", scale: 1, quality: 0.5 },
};

export function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [level, setLevel] = useState("medium");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState<{ url: string; name: string; before: number; after: number } | null>(null);

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
      const lib = await loadPdfJs();
      const doc = await lib.getDocument({ data: await chosen.arrayBuffer() }).promise;
      setPageCount(doc.numPages);
      doc.destroy();
      setFile(chosen);
    } catch {
      setError("This PDF could not be opened. It may be password-protected or damaged.");
    }
  }

  async function compress() {
    if (!file) return;
    if (pageCount > MAX_PAGES) {
      setError(`Compress up to ${MAX_PAGES} pages at a time.`);
      return;
    }
    const opts = LEVELS[level];
    setBusy(true);
    setError(null);
    setResult(null);
    let doc: PdfDoc | null = null;
    try {
      const lib = await loadPdfJs();
      doc = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
      const out = await PDFDocument.create();
      for (let n = 1; n <= doc.numPages; n++) {
        setProgress(`Page ${n} of ${doc.numPages}`);
        const page = await doc.getPage(n);
        const size = page.getViewport({ scale: 1 });
        const view = page.getViewport({ scale: opts.scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(view.width);
        canvas.height = Math.round(view.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no canvas");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport: view }).promise;
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), "image/jpeg", opts.quality));
        if (!blob) throw new Error("no image");
        const img = await out.embedJpg(await blob.arrayBuffer());
        const pdfPage = out.addPage([size.width, size.height]);
        pdfPage.drawImage(img, { x: 0, y: 0, width: size.width, height: size.height });
      }
      const bytes = await out.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      const base = file.name.replace(/\.pdf$/i, "") || "document";
      setResult({ url: URL.createObjectURL(blob), name: `${base}-compressed.pdf`, before: file.size, after: blob.size });
    } catch {
      setError("The PDF could not be compressed. Try a lighter level, or a smaller file.");
    } finally {
      doc?.destroy();
      setBusy(false);
      setProgress("");
    }
  }

  const saved = result ? percentSaved(result.before, result.after) : 0;

  return (
    <div className="space-y-6">
      <Field id="compress-file" label="Choose a PDF file" hint="Up to 50 MB. Pages are compressed in your browser and never uploaded.">
        <input id="compress-file" type="file" accept="application/pdf" onChange={onFile} />
      </Field>

      {file ? (
        <div className="space-y-4">
          <p className="text-sm text-muted">{file.name} · {pageCount} pages · {formatBytes(file.size)}</p>
          <Field id="compress-level" label="Compression level" hint="Each page is saved as an image, so text in the new file cannot be selected.">
            <select id="compress-level" value={level} onChange={(e) => setLevel(e.target.value)} className={inputClass}>
              {Object.entries(LEVELS).map(([key, v]) => (
                <option key={key} value={key}>{v.label}</option>
              ))}
            </select>
          </Field>
          <button type="button" onClick={compress} disabled={busy} className={primaryButtonClass}>
            {busy ? `Compressing… ${progress}` : "Compress PDF"}
          </button>
        </div>
      ) : null}

      <ErrorNote message={error} />

      {result ? (
        <div className="space-y-3 rounded-[var(--radius-card)] bg-secondary p-4">
          <dl className="grid grid-cols-3 gap-3">
            <div><dt className="text-xs text-muted">Before</dt><dd className="font-semibold tabular-nums">{formatBytes(result.before)}</dd></div>
            <div><dt className="text-xs text-muted">After</dt><dd className="font-semibold tabular-nums">{formatBytes(result.after)}</dd></div>
            <div><dt className="text-xs text-muted">Change</dt><dd className="font-semibold tabular-nums">{saved >= 0 ? `${saved}% smaller` : `${-saved}% larger`}</dd></div>
          </dl>
          {saved < 0 ? <p className="text-sm text-muted">This file got bigger. Try Strong, or keep the original.</p> : null}
          <a href={result.url} download={result.name} className={primaryButtonClass}>Download {result.name}</a>
        </div>
      ) : null}
    </div>
  );
}
