import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { SiteMenu } from "../components/layout/SiteMenu.tsx";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolifyhub.example";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ToolifyHub: Free Online Tools",
    template: "%s | ToolifyHub",
  },
  description:
    "Free online tools in one place: word counter, calculators, JSON formatter and more. No login, no signup. Your files stay on your device.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "ToolifyHub",
    title: "ToolifyHub: All Your Tools. One Simple Place.",
    description: "Free online tools with no login. Files stay on your device.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6c5ce7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
            <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="ToolifyHub home">
              <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-fg">T</span>
              <span className="text-lg font-bold tracking-tight text-ink">ToolifyHub</span>
            </Link>
            <nav aria-label="Main" className="flex min-w-0 items-center gap-1">
              <SiteMenu />
            </nav>
            <span className="ml-auto hidden rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-primary-text sm:inline-block">
              No login needed
            </span>
          </div>
        </header>

        <main className="min-h-[70vh]">{children}</main>

        <footer className="mt-16 border-t border-line bg-secondary">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:grid-cols-3 sm:px-6">
            <div>
              <p className="font-semibold">ToolifyHub</p>
              <p className="mt-2 text-muted">All your tools. One simple place.</p>
            </div>
            <nav aria-label="Footer" className="flex flex-col gap-2">
              <Link href="/about" className="text-muted hover:text-ink">About us</Link>
              <Link href="/contact" className="text-muted hover:text-ink">Contact us</Link>
              <Link href="/privacy-policy" className="text-muted hover:text-ink">Privacy policy</Link>
              <Link href="/terms" className="text-muted hover:text-ink">Terms and conditions</Link>
              <Link href="/disclaimer" className="text-muted hover:text-ink">Disclaimer</Link>
            </nav>
            <p className="text-muted">© {new Date().getFullYear()} ToolifyHub. Tools run in your browser where possible.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
