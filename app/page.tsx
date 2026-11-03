import Link from "next/link";
import { CATEGORIES, liveTools, getCategory } from "../lib/registry.ts";
import { ToolGrid, type GridTool } from "../components/home/ToolGrid.tsx";

const FAQ = [
  {
    q: "Do I need an account to use ToolifyHub?",
    a: "No. There is no login, signup, OTP or email collection. You can use every tool straight away.",
  },
  {
    q: "Are my files uploaded to your servers?",
    a: "No. PDF and image tools process your files in your browser, and the files are not sent to us. The AI summarizer is the only tool that sends text to a server.",
  },
  {
    q: "Is ToolifyHub free?",
    a: "Yes. Every tool on the site is free to use.",
  },
  {
    q: "Why does the EMI calculator give a slightly different figure from my bank?",
    a: "Banks round differently and add their own fees. The calculator uses the standard reducing-balance formula. Use it as an estimate and check the figure with your lender.",
  },
  {
    q: "Are the GST rates on the calculator current?",
    a: "The calculator lets you pick the rate, so you can use the one that applies to your goods or services. Check the official GST portal for current rates, because they change.",
  },
  {
    q: "Does ToolifyHub store what I type?",
    a: "Text stays in your browser. We keep only the names of the six tools you used most recently, in your browser's local storage, and you can clear it at any time.",
  },
];

export default function HomePage() {
  const tools: GridTool[] = liveTools().map((t) => ({
    slug: t.slug,
    name: t.name,
    summary: t.summary,
    keywords: t.keywords,
    category: t.category,
    categoryName: getCategory(t.category)?.name ?? "",
  }));

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-secondary to-white">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-40 -z-10 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="mx-auto max-w-4xl px-4 pb-10 pt-12 text-center sm:px-6 sm:pt-16">
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
          Every PDF and image tool, free in your browser
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-muted sm:text-lg">
          Merge, split, compress, convert and edit. No login, and your files never leave your device.
        </p>
        <nav aria-label="Tool categories" className="mt-6 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.id}`}
              className="rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-ink hover:bg-[#e9e4ff]"
            >
              {c.name}
            </Link>
          ))}
        </nav>
        </div>
      </section>

      <section aria-labelledby="all-tools" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 id="all-tools" className="sr-only">All tools</h2>
        <ToolGrid tools={tools} />
      </section>

      <section aria-labelledby="why" className="border-t border-line bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 id="why" className="text-2xl font-semibold tracking-tight">Why choose ToolifyHub</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            <li className="rounded-[var(--radius-card)] bg-white p-5">
              <h3 className="font-semibold">Free, with no login</h3>
              <p className="mt-1 text-sm text-muted">Use every tool without signing up or giving an email address.</p>
            </li>
            <li className="rounded-[var(--radius-card)] bg-white p-5">
              <h3 className="font-semibold">Files stay on your device</h3>
              <p className="mt-1 text-sm text-muted">PDF and image tools run in your browser. Nothing is uploaded to us.</p>
            </li>
            <li className="rounded-[var(--radius-card)] bg-white p-5">
              <h3 className="font-semibold">Fast and light</h3>
              <p className="mt-1 text-sm text-muted">Pages are small and load quickly, even on a slow mobile connection.</p>
            </li>
            <li className="rounded-[var(--radius-card)] bg-white p-5">
              <h3 className="font-semibold">Works on your phone</h3>
              <p className="mt-1 text-sm text-muted">Every tool is designed to work on a small screen. The AI summarizer is the one exception that sends text to a server, and the page says so.</p>
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 id="faq" className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none font-medium">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span aria-hidden="true" className="text-primary transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
