import Link from "next/link";
import { CATEGORIES, liveTools, getCategory } from "../lib/registry.ts";

const FAQ = [
  {
    q: "Do I need an account to use ToolifyHub?",
    a: "No. There is no login, signup, OTP or email collection. You can use every tool straight away.",
  },
  {
    q: "Are my files uploaded to your servers?",
    a: "Tools that work with files, such as images and PDFs, process them in your browser. The files are not sent to us. The AI summarizer is the only tool that sends text to a server.",
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
              <p className="mt-1 text-sm text-muted">Tools that work with files run in your browser. Nothing is uploaded to us.</p>
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
