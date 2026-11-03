import type { ReactNode } from "react";
import Link from "next/link";

// Shared layout for the About, Contact and legal pages.
export function LegalPage({ title, updated, children }: { title: string; updated?: ReactNode; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/" className="hover:text-ink">Home</Link> / <span className="text-ink">{title}</span>
      </nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{title}</h1>
      {updated ? <p className="mt-2 text-sm text-muted">Last updated: {updated}</p> : null}
      <div className="mt-8 space-y-4 leading-relaxed [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
        {children}
      </div>
    </article>
  );
}

// Text the owner must replace before launch. Shown in bold so it cannot be missed.
export function ToFill({ children }: { children: ReactNode }) {
  return <strong className="rounded bg-yellow-100 px-1 text-ink">[{children}]</strong>;
}
