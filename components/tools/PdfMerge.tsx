"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { PDFDocument } from "pdf-lib";
import { ErrorNote, buttonClass, primaryButtonClass } from "./ui.tsx";
import { MAX_PDF_BYTES, isPdfFile } from "../../lib/tools/pdf.ts";
import { formatBytes } from "../../lib/tools/image.ts";

interface Item {
  id: number;
  file: File;
}

interface Result {
  url: string;
  size: number;
  pages: number;
}

export function PdfMerge() {
  const [items, setItems] = useState<Item[]>([]);
  const [nextId, setNextId] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  function addFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    setResult(null);
    const added: Item[] = [];
    let id = nextId;
    for (const file of files) {
      if (!isPdfFile(file)) {
        setError(`${file.name} is not a PDF file.`);
        return;
      }
      if (file.size > MAX_PDF_BYTES) {
        setError(`${file.name} is larger than 50 MB.`);
        return;
      }
      added.push({ id: id++, file });
    }
    setNextId(id);
    setItems((prev) => [...prev, ...added]);
    setError(null);
  }

  function move(index: number, by: -1 | 1) {
    setResult(null);
    setItems((prev) => {
      const target = index + by;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(id: number) {
    setResult(null);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function merge() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const out = await PDFDocument.create();
      for (const item of items) {
        let src: PDFDocument;
        try {
          src = await PDFDocument.load(await item.file.arrayBuffer());
        } catch {
          setError(`${item.file.name} could not be opened. It may be password-protected or damaged.`);
          return;
        }
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((page) => out.addPage(page));
      }
      const bytes = await out.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      setResult({ url: URL.createObjectURL(blob), size: blob.size, pages: out.getPageCount() });
    } catch {
      setError("The PDFs could not be merged. Try again with fewer or smaller files.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="pdf-files" className="block text-sm font-medium">Choose PDF files</label>
        <input
          id="pdf-files"
          type="file"
          accept="application/pdf"
          multiple
          onChange={addFiles}
          className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:font-medium file:text-ink"
        />
        <p className="text-xs text-muted">The files are merged in your browser in the order shown below. Each file can be up to 50 MB.</p>
      </div>

      {items.length > 0 ? (
        <ol className="space-y-2" aria-label="Files in merge order">
          {items.map((item, index) => (
            <li key={item.id} className="flex flex-wrap items-center gap-2 rounded-[var(--radius-control)] border border-line p-3">
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{index + 1}. {item.file.name}</span>
              <span className="text-xs text-muted tabular-nums">{formatBytes(item.file.size)}</span>
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className={buttonClass} aria-label={`Move ${item.file.name} up`}>Up</button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} className={buttonClass} aria-label={`Move ${item.file.name} down`}>Down</button>
              <button type="button" onClick={() => remove(item.id)} className={buttonClass} aria-label={`Remove ${item.file.name}`}>Remove</button>
            </li>
          ))}
        </ol>
      ) : null}

      <button type="button" onClick={merge} disabled={busy || items.length < 2} className={primaryButtonClass}>
        {busy ? "Merging…" : "Merge PDFs"}
      </button>
      {items.length === 1 ? <p className="text-sm text-muted">Add at least one more file to merge.</p> : null}

      <ErrorNote message={error} />

      {result ? (
        <div className="space-y-3 rounded-[var(--radius-card)] bg-secondary p-4">
          <p className="text-sm">Merged {items.length} files into one PDF with {result.pages} pages ({formatBytes(result.size)}).</p>
          <a href={result.url} download="merged.pdf" className={primaryButtonClass}>Download merged.pdf</a>
        </div>
      ) : null}
    </div>
  );
}
