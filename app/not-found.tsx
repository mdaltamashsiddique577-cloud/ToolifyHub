// Page shown for any address that does not exist (404). Links back to the homepage and the tool list.
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold text-primary-text">Error 404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">This page does not exist</h1>
      <p className="mt-3 text-muted">The link may be old, or the address may have a typo. Pick a tool to continue.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg hover:brightness-110">Go to homepage</Link>
        <Link href="/tools" className="rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:border-primary">All tools</Link>
      </div>
    </section>
  );
}
