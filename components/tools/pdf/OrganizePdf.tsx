// Organize PDF: reorder pages with up and down buttons, remove or keep pages, and save a new PDF. Uses pdf-lib.
// Pages have no thumbnails yet.
"use client";

import { useState, type ChangeEvent } from "react";
import { PDFDocument } from "pdf-lib";
import { ErrorNote, Field, buttonClass, primaryButtonClass } from "../ui.tsx";
import { MAX_PDF_BYTES, isPdfFile } from "../../../lib/tools/pdf.ts";
import { formatBytes } from "../../../lib/tools/image.ts";

interface PageRow {
  from: number; // original page number, 1-based
  keep: boolean;
}

export function OrganizePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<PageRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string; pages: number } | null>(null);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const chosen = e.target.files?.[0] ?? null;
    setResult(null);
    setError(null);
    setFile(null);
    setRows([]);
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
      setRows(Array.from({ length: doc.getPageCount() }, (_, i) => ({ from: i + 1, keep: true })));
      setFile(chosen);
    } catch {
      setError("This PDF could not be opened. It may be password-protected or damaged.");
    }
  }

  function move(index: number, by: -1 | 1) {
    setResult(null);
    setRows((prev) => {
      const target = index + by;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function toggle(index: number) {
    setResult(null);
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, keep: !r.keep } : r)));
  }

  async function save() {
    if (!file) return;
    const kept = rows.filter((r) => r.keep).map((r) => r.from);
    if (kept.length === 0) {
      setError("Keep at least one page.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, kept.map((n) => n - 1));
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      const base = file.name.replace(/\.pdf$/i, "") || "document";
      setResult({ url: URL.createObjectURL(blob), name: `${base}-organized.pdf`, pages: kept.length });
    } catch {
      setError("The pages could not be saved. Try again with a different file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Field id="organize-file" label="Choose a PDF file" hint="Up to 50 MB. Pages are reordered in your browser and never uploaded.">
        <input id="organize-file" type="file" accept="application/pdf" onChange={onFile} />
      </Field>

      {file ? (
        <div className="space-y-4">
          <p className="text-sm text-muted">{file.name} · {rows.length} pages · {formatBytes(file.size)}</p>
          <ol className="space-y-2" aria-label="Pages in their new order">
            {rows.map((row, index) => (
              <li key={row.from} className={`flex flex-wrap items-center gap-3 rounded-[var(--radius-control)] border border-line p-3 ${row.keep ? "" : "opacity-50"}`}>
                <span className="min-w-[5.5rem] text-sm font-medium tabular-nums">Page {row.from}</span>
                <span className="text-xs text-muted">Position {index + 1}</span>
                <div className="ml-auto flex items-center gap-2">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className={buttonClass} aria-label={`Move page ${row.from} up`}>Up</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === rows.length - 1} className={buttonClass} aria-label={`Move page ${row.from} down`}>Down</button>
                  <button type="button" onClick={() => toggle(index)} className={buttonClass} aria-pressed={!row.keep}>
                    {row.keep ? "Remove" : "Keep"}
                  </button>
                </div>
              </li>
            ))}
          </ol>
          <button type="button" onClick={save} disabled={busy} className={primaryButtonClass}>
            {busy ? "Saving…" : "Save new PDF"}
          </button>
        </div>
      ) : null}

      <ErrorNote message={error} />

      {result ? (
        <div className="space-y-3 rounded-[var(--radius-card)] bg-secondary p-4">
          <p className="text-sm">Saved a PDF with {result.pages} {result.pages === 1 ? "page" : "pages"}.</p>
          <a href={result.url} download={result.name} className={primaryButtonClass}>Download {result.name}</a>
        </div>
      ) : null}
    </div>
  );
}
