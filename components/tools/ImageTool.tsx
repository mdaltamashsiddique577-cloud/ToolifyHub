"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import {
  MAX_IMAGE_BYTES,
  extensionFor,
  fitSize,
  formatBytes,
  isInputType,
  isLossy,
  percentSaved,
  type ImageType,
} from "../../lib/tools/image.ts";
import { ErrorNote, Field, inputClass, primaryButtonClass, buttonClass } from "./ui.tsx";

export type ImageMode = "compress" | "resize" | "convert";

interface Source {
  file: File;
  url: string;
  width: number;
  height: number;
}

interface Result {
  url: string;
  blob: Blob;
  name: string;
  width: number;
  height: number;
}

const LABEL: Record<ImageType, string> = { "image/jpeg": "JPG", "image/png": "PNG", "image/webp": "WebP" };
const SUFFIX: Record<ImageMode, string> = { compress: "compressed", resize: "resized", convert: "converted" };

function toBlob(canvas: HTMLCanvasElement, type: ImageType, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
}

function toWholeNumber(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  return Number(value);
}

export function ImageTool({ mode, target }: { mode: ImageMode; target?: ImageType }) {
  const [source, setSource] = useState<Source | null>(null);
  const [output, setOutput] = useState<ImageType>(target ?? "image/jpeg");
  const [quality, setQuality] = useState(80);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [keepRatio, setKeepRatio] = useState(true);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Free the object URLs when they are replaced or the page unmounts.
  useEffect(() => () => { if (source) URL.revokeObjectURL(source.url); }, [source]);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setResult(null);
    setError(null);
    setSource(null);
    if (!file) return;
    if (!isInputType(file.type)) {
      setError("Choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("This image is larger than 25 MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    try {
      await img.decode();
    } catch {
      URL.revokeObjectURL(url);
      setError("This image could not be read. Try a different file.");
      return;
    }
    setSource({ file, url, width: img.naturalWidth, height: img.naturalHeight });
    setWidth(String(img.naturalWidth));
    setHeight(String(img.naturalHeight));
    if (mode !== "convert") setOutput(file.type as ImageType);
  }

  // With proportions kept, changing one side updates the other so the two boxes always agree.
  function changeWidth(value: string) {
    setWidth(value);
    const n = toWholeNumber(value);
    if (keepRatio && source && n && n > 0) setHeight(String(Math.round((source.height * n) / source.width)));
  }
  function changeHeight(value: string) {
    setHeight(value);
    const n = toWholeNumber(value);
    if (keepRatio && source && n && n > 0) setWidth(String(Math.round((source.width * n) / source.height)));
  }

  async function run() {
    if (!source) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      let w = source.width;
      let h = source.height;
      if (mode === "resize") {
        const fit = fitSize(source.width, source.height, {
          width: toWholeNumber(width),
          height: toWholeNumber(height),
          keepRatio,
        });
        if (!fit.ok) {
          setError(fit.message);
          return;
        }
        w = fit.width;
        h = fit.height;
      }

      const img = new Image();
      img.src = source.url;
      await img.decode();

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no canvas");
      // JPG has no transparency, so fill transparent areas white first.
      if (output === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);

      const blob = await toBlob(canvas, output, isLossy(output) ? quality / 100 : 1);
      // Browsers that cannot write a format silently return PNG, so check the type.
      if (!blob || blob.type !== output) {
        setError(`Your browser cannot save ${LABEL[output]} files. Try another format.`);
        return;
      }
      const base = source.file.name.replace(/\.[^.]+$/, "") || "image";
      setResult({
        url: URL.createObjectURL(blob),
        blob,
        name: `${base}-${SUFFIX[mode]}.${extensionFor(output)}`,
        width: w,
        height: h,
      });
    } catch {
      setError("Something went wrong while processing this image. Try a smaller file.");
    } finally {
      setBusy(false);
    }
  }

  const showFormat = mode !== "convert";
  const showQuality = isLossy(output);
  const saved = result && source ? percentSaved(source.file.size, result.blob.size) : 0;
  const buttonLabel = mode === "compress" ? "Compress image" : mode === "resize" ? "Resize image" : `Convert to ${LABEL[output]}`;

  return (
    <div className="space-y-6">
      <Field id="image-file" label="Choose an image" hint="JPG, PNG or WebP, up to 25 MB. The image is processed in your browser and never uploaded.">
        <input
          id="image-file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onFile}
          className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:font-medium file:text-ink"
        />
      </Field>

      {source ? (
        <div className="space-y-4 rounded-[var(--radius-card)] border border-line p-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- blob URL preview */}
          <img src={source.url} alt="Preview of the selected image" className="mx-auto max-h-64 max-w-full rounded-[var(--radius-control)] object-contain" />
          <p className="text-center text-sm text-muted">
            {source.file.name} · {source.width} × {source.height} px · {formatBytes(source.file.size)}
          </p>

          {mode === "resize" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="image-width" label="Width (px)">
                <input id="image-width" type="number" inputMode="numeric" min={1} value={width} onChange={(e) => changeWidth(e.target.value)} className={inputClass} />
              </Field>
              <Field id="image-height" label="Height (px)">
                <input id="image-height" type="number" inputMode="numeric" min={1} value={height} onChange={(e) => changeHeight(e.target.value)} className={inputClass} />
              </Field>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} />
                Keep proportions
              </label>
            </div>
          ) : null}

          {showFormat ? (
            <Field id="image-format" label="Output format">
              <select id="image-format" value={output} onChange={(e) => setOutput(e.target.value as ImageType)} className={inputClass}>
                {(Object.keys(LABEL) as ImageType[]).map((t) => (
                  <option key={t} value={t}>{LABEL[t]}</option>
                ))}
              </select>
            </Field>
          ) : null}

          {showQuality ? (
            <Field id="image-quality" label={`Quality: ${quality}`} hint="Lower quality makes a smaller file.">
              <input id="image-quality" type="range" min={40} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-[var(--color-primary)]" />
            </Field>
          ) : null}

          <button type="button" onClick={run} disabled={busy} className={primaryButtonClass}>
            {busy ? "Working…" : buttonLabel}
          </button>
        </div>
      ) : null}

      <ErrorNote message={error} />

      {result && source ? (
        <div className="space-y-4 rounded-[var(--radius-card)] bg-secondary p-4">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div><dt className="text-xs text-muted">Original</dt><dd className="font-semibold tabular-nums">{formatBytes(source.file.size)}</dd></div>
            <div><dt className="text-xs text-muted">New file</dt><dd className="font-semibold tabular-nums">{formatBytes(result.blob.size)}</dd></div>
            <div><dt className="text-xs text-muted">Change</dt><dd className="font-semibold tabular-nums">{saved >= 0 ? `${saved}% smaller` : `${-saved}% larger`}</dd></div>
            <div><dt className="text-xs text-muted">Size</dt><dd className="font-semibold tabular-nums">{result.width} × {result.height} px</dd></div>
          </dl>
          {result.blob.size > source.file.size && mode === "compress" ? (
            <p className="text-sm text-muted">This file is larger than the original. Try a lower quality, or keep the original file.</p>
          ) : null}
          <a href={result.url} download={result.name} className={buttonClass + " bg-primary text-primary-fg border-transparent"}>
            Download {result.name}
          </a>
        </div>
      ) : null}
    </div>
  );
}
