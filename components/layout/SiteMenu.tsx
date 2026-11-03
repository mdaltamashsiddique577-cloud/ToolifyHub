import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { CONVERT_MENU, TOOL_MENU, type MenuGroup } from "../../lib/menu.ts";
import { getTool } from "../../lib/registry.ts";
import { FALLBACK_ICON, ICONS, TOOL_TONE } from "../../lib/icons.ts";

function Groups({ groups, columns }: { groups: MenuGroup[]; columns: string }) {
  return (
    <div className={`grid gap-x-8 gap-y-6 ${columns}`}>
      {groups.map((group) => (
        <section key={group.title} aria-label={group.title}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{group.title}</h3>
          <ul className="mt-3 space-y-1">
            {group.slugs.map((slug) => {
              const tool = getTool(slug);
              if (!tool || !tool.live) return null;
              const Icon = ICONS[slug] ?? FALLBACK_ICON;
              return (
                <li key={slug}>
                  <Link href={`/tools/${slug}`} className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-ink hover:bg-secondary">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${TOOL_TONE[slug] ?? "bg-secondary text-primary-text"}`}>
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    {tool.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

// Plain <details> menus: they open on click, need no JavaScript, and work on phones.
const SUMMARY =
  "flex cursor-pointer list-none items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-ink hover:bg-secondary [&::-webkit-details-marker]:hidden";

export function SiteMenu() {
  return (
    <>
      <details className="group">
        <summary className={SUMMARY}>
          All tools
          <ChevronDown aria-hidden="true" className="h-4 w-4 transition group-open:rotate-180" />
        </summary>
        <div className="absolute inset-x-0 top-full z-30 max-h-[70vh] overflow-y-auto border-t border-line bg-white shadow-xl">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <Groups groups={TOOL_MENU} columns="sm:grid-cols-2 lg:grid-cols-4" />
          </div>
        </div>
      </details>

      <details className="group relative">
        <summary className={SUMMARY}>
          Convert
          <ChevronDown aria-hidden="true" className="h-4 w-4 transition group-open:rotate-180" />
        </summary>
        <div className="absolute left-0 top-full z-30 mt-2 w-[min(92vw,46rem)] rounded-2xl border border-line bg-white p-6 shadow-xl">
          <Groups groups={CONVERT_MENU} columns="sm:grid-cols-2" />
        </div>
      </details>
    </>
  );
}
