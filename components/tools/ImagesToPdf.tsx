"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { PDFDocument, type PDFImage } from "pdf-lib";
import { ErrorNote, primaryButtonClass } from "./ui.tsx";
import { MAX_PDF_BYTES } from "../../lib/tools/pdf.ts";
import { MAX_IMAGE_BYTES, formatBytes } from "../../lib/tools/image.ts";

// A4 in points, with a margin around each picture.
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 36;

export function ImagesToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url: string; size: number; pages: number } | null>(null);

  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  function addFiles(e: ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(e.target.files ?? []);
    e.target.value = "";
    setResult(null);
    for (const file of chosen) {
      const ok = file.type === "image/jpeg" || file.type === "image/png" || /\.(jpe?g|png)$/i.test(file.name);
      if (!ok) {
        setError(`${file.name} is not a JPG or PNG image.`);
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError(`${file.name} is larger than 25 MB.`);
        return;
      }
    }
    setError(null);
    setFiles((prev) => [...prev, ...chosen]);
  }

  async function build() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const doc = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        let img: PDFImage;
        try {
          img = file.type === "image/png" || /\.png$/i.test(file.name) ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
        } catch {
          setError(`${file.name} could not be read. Try saving it again as a standard JPG or PNG.`);
          return;
        }
        // Fit each picture inside the page without enlarging it.
        const scale = Math.min(1, (PAGE_W - 2 * MARGIN) / img.width, (PAGE_H - 2 * MARGIN) / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const page = doc.addPage([PAGE_W, PAGE_H]);
        page.drawImage(img, { x: (PAGE_W - w) / 2, y: (PAGE_H - h) / 2, width: w, height: h });
      }
      const out = await doc.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      setResult({ url: URL.createObjectURL(blob), size: blob.size, pages: doc.getPageCount() });
    } catch {
      setError("The PDF could not be made. Try again with fewer or smaller images.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="image-pdf-files" className="block text-sm font-medium">Choose JPG or PNG images</label>
        <input
          id="image-pdf-files"
          type="file"
          accept="image/jpeg,image/png"
          multiple
          onChange={addFiles}
          className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:font-medium file:text-ink"
        />
        <p className="text-xs text-muted">Each image becomes one A4 page, in the order listed. Images are never uploaded.</p>
      </div>

      {files.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">{files.length} {files.length === 1 ? "image" : "images"} · {formatBytes(files.reduce((n, f) => n + f.size, 0))}</p>
          <button type="button" onClick={() => { setFiles([]); setResult(null); }} className="text-sm font-medium text-primary-text underline">Clear all</button>
        </div>
      ) : null}

      <button type="button" onClick={build} disabled={busy || files.length === 0} className={primaryButtonClass}>
        {busy ? "Making PDF…" : "Make PDF"}
      </button>

      <ErrorNote message={error} />

      {result ? (
        <div className="space-y-3 rounded-[var(--radius-card)] bg-secondary p-4">
          <p className="text-sm">Made a PDF with {result.pages} {result.pages === 1 ? "page" : "pages"} ({formatBytes(result.size)}).</p>
          <a href={result.url} download="images.pdf" className={primaryButtonClass}>Download images.pdf</a>
        </div>
      ) : null}
    </div>
  );
}
