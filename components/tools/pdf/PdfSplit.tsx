// Split PDF: keeps only the pages or ranges typed by the user, and saves them as a new PDF.
"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { PDFDocument } from "pdf-lib";
import { ErrorNote, Field, inputClass, primaryButtonClass } from "../ui.tsx";
import { MAX_PDF_BYTES, isPdfFile, parsePageRanges } from "../../../lib/tools/pdf.ts";
import { formatBytes } from "../../../lib/tools/image.ts";

interface Result {
  url: string;
  name: string;
  size: number;
  pages: number;
}

export function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

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

  async function extract() {
    if (!file) return;
    const parsed = parsePageRanges(ranges, pageCount);
    if (!parsed.ok) {
      setError(parsed.message);
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, parsed.pages.map((p) => p - 1));
      pages.forEach((page) => out.addPage(page));
      const bytes = await out.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      const base = file.name.replace(/\.pdf$/i, "") || "document";
      setResult({ url: URL.createObjectURL(blob), name: `${base}-pages.pdf`, size: blob.size, pages: parsed.pages.length });
    } catch {
      setError("The pages could not be extracted. Try again with a smaller file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Field id="split-file" label="Choose a PDF file" hint="Up to 50 MB. The file is processed in your browser and never uploaded.">
        <input
          id="split-file"
          type="file"
          accept="application/pdf"
          onChange={onFile}
          className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:font-medium file:text-ink"
        />
      </Field>

      {file ? (
        <div className="space-y-4 rounded-[var(--radius-card)] border border-line p-4">
          <p className="text-sm text-muted">{file.name} · {pageCount} pages · {formatBytes(file.size)}</p>
          <Field id="split-ranges" label="Pages to keep" hint={`Use numbers and ranges from 1 to ${pageCount}, such as 1-3, 5, 8-9.`}>
            <input id="split-ranges" type="text" value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="1-3, 5" className={inputClass} />
          </Field>
          <button type="button" onClick={extract} disabled={busy} className={primaryButtonClass}>
            {busy ? "Working…" : "Extract pages"}
          </button>
        </div>
      ) : null}

      <ErrorNote message={error} />

      {result ? (
        <div className="space-y-3 rounded-[var(--radius-card)] bg-secondary p-4">
          <p className="text-sm">Extracted {result.pages} {result.pages === 1 ? "page" : "pages"} ({formatBytes(result.size)}).</p>
          <a href={result.url} download={result.name} className={primaryButtonClass}>Download {result.name}</a>
        </div>
      ) : null}
    </div>
  );
}
