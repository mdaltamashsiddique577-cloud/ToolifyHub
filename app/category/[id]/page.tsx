import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, getCategory, liveTools } from "../../../lib/registry.ts";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const category = getCategory(id);
  if (!category) return {};
  return {
    title: `${category.name}, Free Online`,
    description: `${category.description} Free, no login, and files stay on your device.`,
    alternates: { canonical: `/category/${category.id}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = getCategory(id);
  if (!category) notFound();

  const tools = liveTools().filter((t) => t.category === category.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/" className="hover:text-ink">Home</Link> / <span className="text-ink">{category.name}</span>
      </nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{category.name}</h1>
      <p className="mt-2 text-muted">{category.description}</p>

      {tools.length === 0 ? (
        <p className="mt-8 rounded-[var(--radius-card)] bg-secondary p-6 text-muted">
          No tools in this category are ready yet.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}`}
                className="block h-full rounded-[var(--radius-card)] border border-line bg-white p-5 transition hover:border-primary"
              >
                <h2 className="text-lg font-semibold">{tool.name}</h2>
                <p className="mt-1 text-sm text-muted">{tool.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
