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
  { id: "image", name: "Image tools", description: "Compress, resize, crop and convert images in your browser." },
  { id: "pdf", name: "PDF tools", description: "Merge, split, convert and edit PDFs in your browser." },
  { id: "ai", name: "AI tools", description: "Summarize long text with an AI model." },
];

export const TOOLS: ToolMeta[] = [
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
    live: false,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "text",
    summary: "Change text to upper, lower, title or sentence case.",
    keywords: ["uppercase", "lowercase", "title case"],
    live: false,
  },
  {
    slug: "remove-extra-spaces",
    name: "Remove Extra Spaces",
    category: "text",
    summary: "Collapse repeated spaces and clean up blank lines.",
    keywords: ["trim", "whitespace", "clean text"],
    live: false,
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "calculators",
    summary: "Work out age in years, months, days and total days.",
    keywords: ["age", "birthday", "date difference"],
    live: false,
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "calculators",
    summary: "Calculate body mass index and its category.",
    keywords: ["bmi", "body mass index", "weight"],
    live: false,
  },
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    category: "calculators",
    summary: "Monthly loan EMI, total interest and a payment schedule.",
    keywords: ["loan", "emi", "interest"],
    live: false,
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "calculators",
    summary: "Find percentages, percentage change and add or subtract a percent.",
    keywords: ["percent", "percentage change"],
    live: false,
  },
  {
    slug: "gst-calculator",
    name: "GST Calculator",
    category: "calculators",
    summary: "Add or remove GST and see the CGST and SGST split.",
    keywords: ["gst", "tax", "cgst", "sgst"],
    live: false,
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "developer",
    summary: "Format, minify and validate JSON with error locations.",
    keywords: ["json", "pretty print", "validate json"],
    live: false,
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder/Decoder",
    category: "developer",
    summary: "Encode and decode Base64 text, including Hindi and emoji.",
    keywords: ["base64", "encode", "decode"],
    live: false,
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
