// Searchable grid of tool cards used on the homepage. Filters tools by name, summary,
// category and keywords as the user types. Each card's colour comes from lib/icons.ts.
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { FALLBACK_ICON, ICONS, TOOL_TONE } from "../../lib/icons.ts";

export interface GridTool {
  slug: string;
  name: string;
  summary: string;
  keywords: string[];
  category: string;
  categoryName: string;
}

export function ToolGrid({ tools }: { tools: GridTool[] }) {
  const [query, setQuery] = useState("");
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return tools;
    return tools.filter((t) =>
      [t.name, t.summary, t.categoryName, ...t.keywords].join(" ").toLowerCase().includes(needle),
    );
  }, [query, tools]);

  return (
    <div>
      <label htmlFor="tool-search" className="sr-only">Search tools</label>
      <div className="relative mx-auto max-w-xl">
        <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          id="tool-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a tool, such as merge or compress"
          className="w-full rounded-full border border-line bg-white py-3.5 pl-12 pr-5 text-base shadow-sm outline-none focus-visible:border-primary"
        />
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 text-center text-muted">No tool matches “{query}”. Try a shorter word.</p>
      ) : null}

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {shown.map((t) => {
          const Icon = ICONS[t.slug] ?? FALLBACK_ICON;
          return (
            <li key={t.slug}>
              <Link
                href={`/tools/${t.slug}`}
                className="group flex h-full flex-col items-center rounded-2xl border border-line bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
              >
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${TOOL_TONE[t.slug] ?? "bg-secondary text-primary-text"}`}>
                  <Icon aria-hidden="true" className="h-7 w-7" />
                </span>
                <span className="mt-3 text-sm font-semibold leading-snug">{t.name}</span>
                <span className="mt-1 text-xs text-muted">{t.categoryName}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
