// Pure helpers for the image tools. Canvas and file handling live in the component.

export const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
export const MAX_IMAGE_SIDE = 8000;

export const INPUT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type ImageType = (typeof INPUT_TYPES)[number];

export function isInputType(type: string): type is ImageType {
  return (INPUT_TYPES as readonly string[]).includes(type);
}

// JPG and WebP lose detail when saved, so they take a quality setting. PNG does not.
export function isLossy(type: ImageType): boolean {
  return type === "image/jpeg" || type === "image/webp";
}

export function extensionFor(type: ImageType): string {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  return "webp";
}

export type FitResult = { ok: true; width: number; height: number } | { ok: false; message: string };

export interface FitOptions {
  width?: number;
  height?: number;
  keepRatio: boolean;
}

// Work out the output size. With keepRatio, a single value scales the other side,
// and two values make the image fit inside that box.
export function fitSize(srcW: number, srcH: number, opts: FitOptions): FitResult {
  if (!(srcW > 0 && srcH > 0)) return { ok: false, message: "This image has no size." };
  const { width, height, keepRatio } = opts;
  if (width === undefined && height === undefined) {
    return { ok: false, message: "Enter a width, a height or both." };
  }
  for (const v of [width, height]) {
    if (v !== undefined && (!Number.isInteger(v) || v < 1 || v > MAX_IMAGE_SIDE)) {
      return { ok: false, message: `Sizes must be whole numbers from 1 to ${MAX_IMAGE_SIDE} pixels.` };
    }
  }

  let w = width ?? srcW;
  let h = height ?? srcH;
  if (keepRatio) {
    if (width !== undefined && height !== undefined) {
      const scale = Math.min(width / srcW, height / srcH);
      w = Math.round(srcW * scale);
      h = Math.round(srcH * scale);
    } else if (width !== undefined) {
      h = Math.round((srcH * width) / srcW);
    } else if (height !== undefined) {
      w = Math.round((srcW * height) / srcH);
    }
  }
  return { ok: true, width: Math.max(1, w), height: Math.max(1, h) };
}

// Positive when the new file is smaller.
export function percentSaved(original: number, next: number): number {
  if (original <= 0) return 0;
  return Math.round((1 - next / original) * 100);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
