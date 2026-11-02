import Link from "next/link";
import { CATEGORIES, liveTools, getCategory } from "../lib/registry.ts";

export default function HomePage() {
  const live = liveTools();

  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 pb-10 pt-14 text-center sm:px-6">
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          All Your Tools. One Simple Place.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-muted">
          Free tools that work in your browser. No login, no signup, and your files stay on your device.
        </p>
      </section>

      <section aria-labelledby="all-tools" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="all-tools" className="text-2xl font-semibold tracking-tight">
            Tools
          </h2>
          <p className="text-sm text-muted">{live.length} tools available now</p>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {live.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}`}
                className="block h-full rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-sm transition hover:border-primary"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-text">
                  {getCategory(tool.category)?.name}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{tool.name}</h3>
                <p className="mt-1 text-sm text-muted">{tool.summary}</p>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-2xl font-semibold tracking-tight">Categories</h2>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link
                href={`/category/${c.id}`}
                className="block h-full rounded-[var(--radius-card)] bg-secondary p-5 transition hover:bg-[#e9e4ff]"
              >
                <h3 className="font-semibold text-ink">{c.name}</h3>
                <p className="mt-1 text-sm text-muted">{c.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
