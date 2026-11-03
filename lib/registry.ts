// Single source of truth for every tool and category.
// Routes, search, sitemap and the homepage are all built from this list.
// A tool is marked live only when its page and logic are finished and tested.

export type CategoryId = "text" | "calculators" | "developer" | "image" | "pdf" | "ai";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
}

export interface ToolMeta {
  slug: string;
  name: string;
  category: CategoryId;
  summary: string;
  keywords: string[];
  live: boolean;
}

export const CATEGORIES: Category[] = [
  { id: "text", name: "Text tools", description: "Count, convert and clean up text." },
  { id: "calculators", name: "Calculators", description: "Age, BMI, loans, percentages and GST." },
  { id: "developer", name: "Developer tools", description: "Format JSON and encode Base64." },
  { id: "image", name: "Image tools", description: "Compress, resize and convert images in your browser." },
  { id: "pdf", name: "PDF tools", description: "Merge, split, convert and edit PDFs in your browser." },
  { id: "ai", name: "AI tools", description: "Summarize long text with an AI model." },
];

export const TOOLS: ToolMeta[] = [

  {
    slug: "image-compressor",
    name: "Image Compressor",
    category: "image",
    summary: "Make JPG, PNG and WebP files smaller, right in your browser.",
    keywords: ["compress image", "reduce image size", "shrink photo"],
    live: true,
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    category: "image",
    summary: "Cut out part of a JPG, PNG or WebP image, with fixed shapes.",
    keywords: ["crop image", "cut photo", "square crop"],
    live: true,
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    category: "image",
    summary: "Change the width and height of a JPG, PNG or WebP image.",
    keywords: ["resize image", "image dimensions", "scale photo"],
    live: true,
  },
  {
    slug: "png-to-jpg",
    name: "PNG to JPG",
    category: "image",
    summary: "Convert a PNG to JPG. Transparent areas turn white.",
    keywords: ["png to jpg", "convert png", "jpeg"],
    live: true,
  },
  {
    slug: "jpg-to-png",
    name: "JPG to PNG",
    category: "image",
    summary: "Convert a JPG to PNG, a lossless format.",
    keywords: ["jpg to png", "convert jpeg", "lossless"],
    live: true,
  },
  {
    slug: "webp-converter",
    name: "WebP Converter",
    category: "image",
    summary: "Convert JPG or PNG images to WebP for smaller web files.",
    keywords: ["webp", "convert webp", "web image"],
    live: true,
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    category: "pdf",
    summary: "Put JPG or PNG images into one PDF, one image per page.",
    keywords: ["jpg to pdf", "image to pdf", "photo to pdf"],
    live: true,
  },
  {
    slug: "text-to-pdf",
    name: "Text to PDF",
    category: "pdf",
    summary: "Turn typed or pasted text into a PDF file.",
    keywords: ["text to pdf", "txt to pdf", "make pdf"],
    live: true,
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    category: "pdf",
    summary: "Save PDF pages as JPG or PNG images, right in your browser.",
    keywords: ["pdf to jpg", "pdf to png", "pdf to image"],
    live: true,
  },
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    category: "pdf",
    summary: "Join several PDF files into one, in the order you choose.",
    keywords: ["merge pdf", "combine pdf", "join pdf"],
    live: true,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    category: "pdf",
    summary: "Pull chosen pages or ranges out of a PDF into a new file.",
    keywords: ["split pdf", "extract pages", "separate pdf pages"],
    live: true,
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    category: "pdf",
    summary: "Turn every page of a PDF by 90, 180 or 270 degrees.",
    keywords: ["rotate pdf", "turn pdf"],
    live: true,
  },
  {
    slug: "add-page-numbers",
    name: "Add Page Numbers",
    category: "pdf",
    summary: "Put page numbers such as 2 / 5 on every page of a PDF.",
    keywords: ["page numbers", "number pdf pages"],
    live: true,
  },
  {
    slug: "add-watermark",
    name: "Add Watermark",
    category: "pdf",
    summary: "Stamp a diagonal text watermark on every page of a PDF.",
    keywords: ["watermark pdf", "stamp pdf"],
    live: true,
  },
  {
    slug: "remove-pages",
    name: "Remove Pages",
    category: "pdf",
    summary: "Delete chosen pages from a PDF and keep the rest.",
    keywords: ["remove pages", "delete pdf pages"],
    live: true,
  },
  {
    slug: "crop-pdf",
    name: "Crop PDF",
    category: "pdf",
    summary: "Trim the edges of every page in a PDF by the margin you choose.",
    keywords: ["crop pdf", "trim pdf margins"],
    live: true,
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    category: "text",
    summary: "Count words, characters, sentences and reading time.",
    keywords: ["word count", "character count", "reading time"],
    live: true,
  },
  {
    slug: "character-counter",
    name: "Character Counter",
    category: "text",
    summary: "Count characters with and without spaces.",
    keywords: ["character count", "sms", "tweet length"],
    live: true,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "text",
    summary: "Change text to upper, lower, title or sentence case.",
    keywords: ["uppercase", "lowercase", "title case"],
    live: true,
  },
  {
    slug: "remove-extra-spaces",
    name: "Remove Extra Spaces",
    category: "text",
    summary: "Collapse repeated spaces and clean up blank lines.",
    keywords: ["trim", "whitespace", "clean text"],
    live: true,
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "calculators",
    summary: "Work out age in years, months, days and total days.",
    keywords: ["age", "birthday", "date difference"],
    live: true,
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "calculators",
    summary: "Calculate body mass index and its category.",
    keywords: ["bmi", "body mass index", "weight"],
    live: true,
  },
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    category: "calculators",
    summary: "Monthly loan EMI, total interest and a payment schedule.",
    keywords: ["loan", "emi", "interest"],
    live: true,
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "calculators",
    summary: "Find percentages, percentage change and add or subtract a percent.",
    keywords: ["percent", "percentage change"],
    live: true,
  },
  {
    slug: "gst-calculator",
    name: "GST Calculator",
    category: "calculators",
    summary: "Add or remove GST and see the CGST and SGST split.",
    keywords: ["gst", "tax", "cgst", "sgst"],
    live: true,
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "developer",
    summary: "Format, minify and validate JSON with error locations.",
    keywords: ["json", "pretty print", "validate json"],
    live: true,
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder/Decoder",
    category: "developer",
    summary: "Encode and decode Base64 text, including Hindi and emoji.",
    keywords: ["base64", "encode", "decode"],
    live: true,
  },
];

export function getTool(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function liveTools(): ToolMeta[] {
  return TOOLS.filter((t) => t.live);
}

export function toolsIn(category: CategoryId): ToolMeta[] {
  return TOOLS.filter((t) => t.category === category);
}
