// PDF to JPG/PNG: renders each chosen page with PDF.js onto a canvas and saves it as an image.
// Limited to 30 pages per run to keep memory low.
"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { ErrorNote, Field, inputClass, primaryButtonClass } from "../ui.tsx";
import { MAX_PDF_BYTES, isPdfFile, parsePageRanges } from "../../../lib/tools/pdf.ts";
import { formatBytes } from "../../../lib/tools/image.ts";

// The slice of the PDF.js API this tool uses.
interface PdfPage {
  getViewport(o: { scale: number }): { width: number; height: number };
  render(o: { canvasContext: CanvasRenderingContext2D; viewport: unknown }): { promise: Promise<void> };
}
interface PdfDoc {
  numPages: number;
  getPage(n: number): Promise<PdfPage>;
  destroy(): void;
}
interface PdfLib {
  getDocument(o: { data: ArrayBuffer }): { promise: Promise<PdfDoc> };
  GlobalWorkerOptions: { workerSrc: string };
}

// The worker runs from the same pinned version on cdnjs, so the main bundle stays small.
const WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const MAX_PAGES_PER_RUN = 30;

async function loadPdfJs(): Promise<PdfLib> {
  const lib = (await import("pdfjs-dist")) as unknown as PdfLib;
  lib.GlobalWorkerOptions.workerSrc = WORKER_URL;
  return lib;
}

interface Out {
  url: string;
  name: string;
  size: number;
  page: number;
}

export function PdfToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState("");
  const [format, setFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const [scale, setScale] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [outputs, setOutputs] = useState<Out[]>([]);

  useEffect(() => () => { outputs.forEach((o) => URL.revokeObjectURL(o.url)); }, [outputs]);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const chosen = e.target.files?.[0] ?? null;
    setOutputs([]);
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
      setPages(doc.numPages === 1 ? "1" : `1-${Math.min(doc.numPages, MAX_PAGES_PER_RUN)}`);
      doc.destroy();
      setFile(chosen);
    } catch {
      setError("This PDF could not be opened. It may be password-protected or damaged.");
    }
  }

  async function convert() {
    if (!file) return;
    const parsed = parsePageRanges(pages, pageCount);
    if (!parsed.ok) {
      setError(parsed.message);
      return;
    }
    if (parsed.pages.length > MAX_PAGES_PER_RUN) {
      setError(`Convert up to ${MAX_PAGES_PER_RUN} pages at a time.`);
      return;
    }
    setBusy(true);
    setError(null);
    setOutputs([]);
    let doc: PdfDoc | null = null;
    try {
      const lib = await loadPdfJs();
      doc = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
      const ext = format === "image/png" ? "png" : "jpg";
      const base = file.name.replace(/\.pdf$/i, "") || "page";
      const made: Out[] = [];
      for (const [i, n] of parsed.pages.entries()) {
        setProgress(`Page ${n} (${i + 1} of ${parsed.pages.length})`);
        const page = await doc.getPage(n);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no canvas");
        // A transparent PDF background would turn black in JPG, so paint white first.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), format, 0.92));
        if (!blob) throw new Error("no blob");
        made.push({ url: URL.createObjectURL(blob), name: `${base}-page-${n}.${ext}`, size: blob.size, page: n });
      }
      setOutputs(made);
    } catch {
      setError("A page could not be converted. Try a lower scale, or fewer pages.");
    } finally {
      doc?.destroy();
      setBusy(false);
      setProgress("");
    }
  }

  return (
    <div className="space-y-6">
      <Field id="pdf-image-file" label="Choose a PDF file" hint="Up to 50 MB. Pages are drawn in your browser and never uploaded.">
        <input
          id="pdf-image-file"
          type="file"
          accept="application/pdf"
          onChange={onFile}
          className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:font-medium file:text-ink"
        />
      </Field>

      {file ? (
        <div className="space-y-4 rounded-[var(--radius-card)] border border-line p-4">
          <p className="text-sm text-muted">{file.name} · {pageCount} pages · {formatBytes(file.size)}</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field id="pdf-image-pages" label="Pages" hint={`Up to ${MAX_PAGES_PER_RUN} at a time.`}>
              <input id="pdf-image-pages" type="text" value={pages} onChange={(e) => setPages(e.target.value)} className={inputClass} />
            </Field>
            <Field id="pdf-image-format" label="Image format">
              <select id="pdf-image-format" value={format} onChange={(e) => setFormat(e.target.value as "image/jpeg" | "image/png")} className={inputClass}>
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
              </select>
            </Field>
            <Field id="pdf-image-scale" label="Size">
              <select id="pdf-image-scale" value={scale} onChange={(e) => setScale(Number(e.target.value))} className={inputClass}>
                <option value={1}>Standard (72 dpi)</option>
                <option value={2}>Sharp (144 dpi)</option>
                <option value={3}>Print (216 dpi)</option>
              </select>
            </Field>
          </div>
          <button type="button" onClick={convert} disabled={busy} className={primaryButtonClass}>
            {busy ? `Converting… ${progress}` : "Convert to images"}
          </button>
        </div>
      ) : null}

      <ErrorNote message={error} />

      {outputs.length > 0 ? (
        <div className="space-y-3 rounded-[var(--radius-card)] bg-secondary p-4">
          <p className="text-sm">Made {outputs.length} {outputs.length === 1 ? "image" : "images"}.</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {outputs.map((o) => (
              <li key={o.page}>
                <a href={o.url} download={o.name} className="flex items-center justify-between gap-3 rounded-[var(--radius-control)] bg-white px-4 py-2.5 text-sm font-medium text-ink">
                  <span className="truncate">{o.name}</span>
                  <span className="shrink-0 text-xs text-muted tabular-nums">{formatBytes(o.size)}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
