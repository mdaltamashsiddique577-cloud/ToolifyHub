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

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CropResult = { ok: true; rect: CropRect } | { ok: false; message: string };

// Check a crop box against the source size. Every value must be a whole number,
// and the box must stay inside the image.
export function checkCrop(srcW: number, srcH: number, rect: Partial<CropRect>): CropResult {
  const { x, y, width, height } = rect;
  if (x === undefined || y === undefined || width === undefined || height === undefined) {
    return { ok: false, message: "Enter the X, Y, width and height of the crop." };
  }
  const values = [x, y, width, height];
  if (values.some((v) => !Number.isInteger(v))) {
    return { ok: false, message: "Crop values must be whole numbers." };
  }
  if (x < 0 || y < 0 || width < 1 || height < 1) {
    return { ok: false, message: "X and Y cannot be negative, and the width and height must be at least 1." };
  }
  if (x + width > srcW || y + height > srcH) {
    return { ok: false, message: `The crop must stay inside the image (${srcW} × ${srcH} px).` };
  }
  return { ok: true, rect: { x, y, width, height } };
}

// The largest centred box with the given width-to-height ratio. ratio 0 means free, so the whole image.
export function cropForRatio(srcW: number, srcH: number, ratio: number): CropRect {
  if (ratio <= 0) return { x: 0, y: 0, width: srcW, height: srcH };
  let width = srcW;
  let height = Math.round(width / ratio);
  if (height > srcH) {
    height = srcH;
    width = Math.round(height * ratio);
  }
  return {
    x: Math.round((srcW - width) / 2),
    y: Math.round((srcH - height) / 2),
    width: Math.max(1, width),
    height: Math.max(1, height),
  };
}
