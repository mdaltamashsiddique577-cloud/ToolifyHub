// Icon for each tool, keyed by slug. The homepage grid falls back to FALLBACK_ICON for any tool without one.
import {
  AlignLeft, ArrowRightLeft, Binary, Braces, CalendarDays, Calculator, Coins, Crop, CaseSensitive,
  Eraser, Files, FileImage, FileText, FileX, Hash, Image as ImageIcon, Maximize2, Minimize2, Percent,
  PenTool, Receipt, RotateCw, Scale, Scissors, Stamp, Type, type LucideIcon,
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
  "sign-pdf": PenTool,
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

// Tint for each tool's icon tile. Tools that do similar work share a colour, as on the big PDF sites.
export const TOOL_TONE: Record<string, string> = {
  "merge-pdf": "bg-rose-50 text-rose-600",
  "split-pdf": "bg-rose-50 text-rose-600",
  "remove-pages": "bg-rose-50 text-rose-600",
  "crop-pdf": "bg-rose-50 text-rose-600",
  "sign-pdf": "bg-violet-50 text-violet-600",
  "rotate-pdf": "bg-violet-50 text-violet-600",
  "add-page-numbers": "bg-violet-50 text-violet-600",
  "add-watermark": "bg-violet-50 text-violet-600",
  "jpg-to-pdf": "bg-amber-50 text-amber-600",
  "text-to-pdf": "bg-amber-50 text-amber-600",
  "pdf-to-jpg": "bg-sky-50 text-sky-600",
  "image-compressor": "bg-teal-50 text-teal-600",
  "image-cropper": "bg-teal-50 text-teal-600",
  "image-resizer": "bg-teal-50 text-teal-600",
  "png-to-jpg": "bg-teal-50 text-teal-600",
  "jpg-to-png": "bg-teal-50 text-teal-600",
  "webp-converter": "bg-teal-50 text-teal-600",
  "word-counter": "bg-indigo-50 text-indigo-600",
  "character-counter": "bg-indigo-50 text-indigo-600",
  "case-converter": "bg-indigo-50 text-indigo-600",
  "remove-extra-spaces": "bg-indigo-50 text-indigo-600",
  "age-calculator": "bg-emerald-50 text-emerald-600",
  "bmi-calculator": "bg-emerald-50 text-emerald-600",
  "emi-calculator": "bg-emerald-50 text-emerald-600",
  "percentage-calculator": "bg-emerald-50 text-emerald-600",
  "gst-calculator": "bg-emerald-50 text-emerald-600",
  "json-formatter": "bg-slate-100 text-slate-700",
  "base64-encoder": "bg-slate-100 text-slate-700",
};
