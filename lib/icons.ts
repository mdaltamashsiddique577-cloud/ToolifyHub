// Icon for each tool, keyed by slug. The homepage grid falls back to FALLBACK_ICON for any tool without one.
import {
  AlignLeft, ArrowRightLeft, Binary, Braces, CalendarDays, Calculator, Coins, Crop, CaseSensitive,
  Eraser, Files, FileImage, FileText, FileX, Hash, Image as ImageIcon, Maximize2, Minimize2, Percent,
  Receipt, RotateCw, Scale, Scissors, Stamp, Type, type LucideIcon,
} from "lucide-react";

export const FALLBACK_ICON: LucideIcon = Calculator;

export const ICONS: Record<string, LucideIcon> = {
  "image-compressor": Minimize2,
  "image-cropper": Crop,
  "image-resizer": Maximize2,
  "png-to-jpg": ArrowRightLeft,
  "jpg-to-png": ArrowRightLeft,
  "webp-converter": ArrowRightLeft,
  "jpg-to-pdf": FileImage,
  "text-to-pdf": FileText,
  "pdf-to-jpg": ImageIcon,
  "merge-pdf": Files,
  "split-pdf": Scissors,
  "rotate-pdf": RotateCw,
  "add-page-numbers": Hash,
  "add-watermark": Stamp,
  "remove-pages": FileX,
  "crop-pdf": Crop,
  "word-counter": AlignLeft,
  "character-counter": Type,
  "case-converter": CaseSensitive,
  "remove-extra-spaces": Eraser,
  "age-calculator": CalendarDays,
  "bmi-calculator": Scale,
  "emi-calculator": Coins,
  "percentage-calculator": Percent,
  "gst-calculator": Receipt,
  "json-formatter": Braces,
  "base64-encoder": Binary,
};

// Tint for each category's icon tile. Full class names so the build keeps them.
export const CATEGORY_TONE: Record<string, string> = {
  image: "bg-sky-50 text-sky-700",
  pdf: "bg-rose-50 text-rose-700",
  text: "bg-violet-50 text-violet-700",
  calculators: "bg-emerald-50 text-emerald-700",
  developer: "bg-amber-50 text-amber-800",
};
