// Menu groups for the header. Each entry is a tool slug. Tests check that every slug is live.

export interface MenuGroup {
  title: string;
  slugs: string[];
}

export const TOOL_MENU: MenuGroup[] = [
  { title: "Organize PDF", slugs: ["merge-pdf", "split-pdf", "remove-pages", "organize-pdf", "compress-pdf"] },
  { title: "Edit PDF", slugs: ["rotate-pdf", "add-page-numbers", "add-watermark", "crop-pdf", "sign-pdf"] },
  { title: "Convert to PDF", slugs: ["jpg-to-pdf", "text-to-pdf"] },
  { title: "Convert from PDF", slugs: ["pdf-to-jpg"] },
  { title: "Image tools", slugs: ["image-compressor", "image-resizer", "image-cropper", "png-to-jpg", "jpg-to-png", "webp-converter"] },
  { title: "Text tools", slugs: ["word-counter", "character-counter", "case-converter", "remove-extra-spaces"] },
  { title: "Calculators", slugs: ["age-calculator", "bmi-calculator", "emi-calculator", "percentage-calculator", "gst-calculator"] },
  { title: "Developer tools", slugs: ["json-formatter", "base64-encoder"] },
];

export const CONVERT_MENU: MenuGroup[] = [
  { title: "Convert to PDF", slugs: ["jpg-to-pdf", "text-to-pdf"] },
  { title: "Convert from PDF", slugs: ["pdf-to-jpg"] },
  { title: "Convert images", slugs: ["png-to-jpg", "jpg-to-png", "webp-converter"] },
];
