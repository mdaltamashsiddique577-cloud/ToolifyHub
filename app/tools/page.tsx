// All tools page (/tools). Lists every live tool, grouped by category, from lib/registry.ts.
import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, liveTools, getCategory } from "../../lib/registry.ts";

export const metadata: Metadata = {
  title: "All Free Online Tools",
  description: "Every ToolifyHub tool in one list. Free, no login, and files stay on your device.",
  alternates: { canonical: "/tools" },
};

export default function AllToolsPage() {
  const live = liveTools();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">All tools</h1>
      <p className="mt-2 text-muted">{live.length} tools available now.</p>
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {live.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tools/${tool.slug}`}
              className="block h-full rounded-[var(--radius-card)] border border-line bg-white p-5 transition hover:border-primary"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-text">
                {getCategory(tool.category)?.name}
              </p>
              <h2 className="mt-2 text-lg font-semibold">{tool.name}</h2>
              <p className="mt-1 text-sm text-muted">{tool.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-sm text-muted">
        Categories: {CATEGORIES.map((c, i) => (
          <span key={c.id}>
            {i > 0 && ", "}
            <Link href={`/category/${c.id}`} className="underline hover:text-ink">{c.name}</Link>
          </span>
        ))}
      </p>
    </div>
  );
}
