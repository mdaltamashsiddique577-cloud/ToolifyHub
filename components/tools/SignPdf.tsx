"use client";

import { useEffect, useRef, useState, type ChangeEvent, type PointerEvent } from "react";
import { PDFDocument } from "pdf-lib";
import { ErrorNote, Field, buttonClass, inputClass, primaryButtonClass } from "./ui.tsx";
import { MAX_PDF_BYTES, isPdfFile } from "../../lib/tools/pdf.ts";
import { formatBytes } from "../../lib/tools/image.ts";

const PAD_W = 560;
const PAD_H = 200;

export function SignPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasInk, setHasInk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string; size: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

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
      setPage(1);
      setFile(chosen);
    } catch {
      setError("This PDF could not be opened. It may be password-protected or damaged.");
    }
  }

  function pointAt(e: PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * PAD_W,
      y: ((e.clientY - rect.top) / rect.height) * PAD_H,
    };
  }

  function start(e: PointerEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = pointAt(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function move(e: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = pointAt(e);
    ctx.lineTo(p.x, p.y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#172033";
    ctx.stroke();
    setHasInk(true);
  }

  function stop() {
    drawing.current = false;
  }

  function clearPad() {
    canvasRef.current?.getContext("2d")?.clearRect(0, 0, PAD_W, PAD_H);
    setHasInk(false);
  }

  async function sign() {
    if (!file) return;
    if (!hasInk || !canvasRef.current) {
      setError("Draw your signature first.");
      return;
    }
    if (!Number.isInteger(page) || page < 1 || page > pageCount) {
      setError(`Choose a page from 1 to ${pageCount}.`);
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const pngBlob = await new Promise<Blob | null>((resolve) => {
        const canvas = canvasRef.current;
        if (!canvas) {
          resolve(null);
          return;
        }
        canvas.toBlob((b) => resolve(b), "image/png");
      });
      if (!pngBlob) throw new Error("no signature image");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const img = await doc.embedPng(await pngBlob.arrayBuffer());
      const target = doc.getPage(page - 1);
      const { width, height } = target.getSize();
      // The signature sits at the bottom right, 160 points wide, with a margin.
      const w = 160;
      const h = (w * img.height) / img.width;
      target.drawImage(img, { x: width - w - 48, y: 48, width: w, height: h });
      const out = await doc.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      const base = file.name.replace(/\.pdf$/i, "") || "document";
      setResult({ url: URL.createObjectURL(blob), name: `${base}-signed.pdf`, size: blob.size });
    } catch {
      setError("The signature could not be added. Try again with a different file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Field id="sign-file" label="Choose a PDF file" hint="Up to 50 MB. The file is signed in your browser and never uploaded.">
        <input id="sign-file" type="file" accept="application/pdf" onChange={onFile} />
      </Field>

      {file ? (
        <div className="space-y-5">
          <p className="text-sm text-muted">{file.name} · {pageCount} pages · {formatBytes(file.size)}</p>

          <div className="space-y-2">
            <p className="text-sm font-medium">Draw your signature</p>
            <canvas
              ref={canvasRef}
              width={PAD_W}
              height={PAD_H}
              onPointerDown={start}
              onPointerMove={move}
              onPointerUp={stop}
              onPointerLeave={stop}
              aria-label="Signature pad. Draw your signature with a mouse, finger or pen."
              className="block w-full touch-none rounded-[var(--radius-card)] border-2 border-dashed border-primary bg-white"
              style={{ aspectRatio: `${PAD_W} / ${PAD_H}` }}
            />
            <button type="button" onClick={clearPad} className={buttonClass}>Clear signature</button>
          </div>

          <Field id="sign-page" label="Page to sign" hint="The signature goes at the bottom right of this page.">
            <input id="sign-page" type="number" inputMode="numeric" min={1} max={pageCount} value={page} onChange={(e) => setPage(Number(e.target.value))} className={inputClass} />
          </Field>

          <button type="button" onClick={sign} disabled={busy} className={primaryButtonClass}>
            {busy ? "Signing…" : "Sign PDF"}
          </button>
        </div>
      ) : null}

      <ErrorNote message={error} />

      {result ? (
        <div className="space-y-3 rounded-[var(--radius-card)] bg-secondary p-4">
          <p className="text-sm">Signed. The new file is {formatBytes(result.size)}.</p>
          <a href={result.url} download={result.name} className={primaryButtonClass}>Download {result.name}</a>
        </div>
      ) : null}
    </div>
  );
}
