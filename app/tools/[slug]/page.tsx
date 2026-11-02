import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTool, getCategory, liveTools } from "../../../lib/registry.ts";
import { WordCounter } from "../../../components/tools/WordCounter.tsx";

// Only live tools get a page. Tools not yet built return 404, never a fake page.
const COMPONENTS: Record<string, React.ComponentType> = {
  "word-counter": WordCounter,
};

export function generateStaticParams() {
  return liveTools().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool || !tool.live) return {};
  return {
    title: `${tool.name} Online, Free`,
    description: `${tool.summary} Free, no login. Runs in your browser.`,
    alternates: { canonical: `/tools/${tool.slug}` },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  const Component = COMPONENTS[slug];
  if (!tool || !tool.live || !Component) notFound();

  const category = getCategory(tool.category);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/category/${tool.category}`} className="hover:text-ink">{category?.name}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">{tool.name}</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-3xl font-bold tracking-tight">{tool.name}</h1>
      <p className="mt-2 text-muted">{tool.summary}</p>

      <div className="mt-8">
        <Component />
      </div>
    </article>
  );
}
