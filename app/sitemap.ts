import type { MetadataRoute } from "next";
import { CATEGORIES, liveTools } from "../lib/registry.ts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolifyhub.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now },
    { url: `${SITE_URL}/tools`, lastModified: now },
    ...CATEGORIES.map((c) => ({ url: `${SITE_URL}/category/${c.id}`, lastModified: now })),
    ...liveTools().map((t) => ({ url: `${SITE_URL}/tools/${t.slug}`, lastModified: now })),
  ];
}
