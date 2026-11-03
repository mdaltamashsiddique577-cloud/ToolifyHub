// Tool page (/tools/<slug>). Finds the tool in lib/registry.ts, shows its breadcrumb, icon,
// name and summary, then renders the tool component from the COMPONENTS map.
// To add a tool: 1) add it to lib/registry.ts with live: true, 2) add its component to COMPONENTS here,
// 3) add an icon and colour in lib/icons.ts, 4) add it to a menu group in lib/menu.ts.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FALLBACK_ICON, ICONS, TOOL_TONE } from "../../../lib/icons.ts";
import Link from "next/link";
import { getTool, getCategory, liveTools } from "../../../lib/registry.ts";
import { WordCounter } from "../../../components/tools/text/WordCounter.tsx";
import { CharacterCounter } from "../../../components/tools/text/CharacterCounter.tsx";
import { CaseConverter } from "../../../components/tools/text/CaseConverter.tsx";
import { RemoveExtraSpaces } from "../../../components/tools/text/RemoveExtraSpaces.tsx";
import { AgeCalculator } from "../../../components/tools/calculators/AgeCalculator.tsx";
import { BmiCalculator } from "../../../components/tools/calculators/BmiCalculator.tsx";
import { EmiCalculator } from "../../../components/tools/calculators/EmiCalculator.tsx";
import { PercentageCalculator } from "../../../components/tools/calculators/PercentageCalculator.tsx";
import { GstCalculator } from "../../../components/tools/calculators/GstCalculator.tsx";
import { JsonFormatter } from "../../../components/tools/developer/JsonFormatter.tsx";
import { Base64Tool } from "../../../components/tools/developer/Base64Tool.tsx";
import { ImageTool } from "../../../components/tools/image/ImageTool.tsx";
import { PdfMerge } from "../../../components/tools/pdf/PdfMerge.tsx";
import { PdfSplit } from "../../../components/tools/pdf/PdfSplit.tsx";
import { ImagesToPdf } from "../../../components/tools/pdf/ImagesToPdf.tsx";
import { TextToPdf } from "../../../components/tools/pdf/TextToPdf.tsx";
import { PdfToImage } from "../../../components/tools/pdf/PdfToImage.tsx";
import { PdfEdit } from "../../../components/tools/pdf/PdfEdit.tsx";
import { SignPdf } from "../../../components/tools/pdf/SignPdf.tsx";
import { OrganizePdf } from "../../../components/tools/pdf/OrganizePdf.tsx";
import { CompressPdf } from "../../../components/tools/pdf/CompressPdf.tsx";

// Only live tools get a page. Tools not yet built return 404, never a fake page.
const COMPONENTS: Record<string, React.ComponentType> = {
  "word-counter": WordCounter,
  "character-counter": CharacterCounter,
  "case-converter": CaseConverter,
  "remove-extra-spaces": RemoveExtraSpaces,
  "age-calculator": AgeCalculator,
  "bmi-calculator": BmiCalculator,
  "emi-calculator": EmiCalculator,
  "percentage-calculator": PercentageCalculator,
  "gst-calculator": GstCalculator,
  "json-formatter": JsonFormatter,
  "base64-encoder": Base64Tool,
  "image-compressor": () => <ImageTool mode="compress" />,
  "image-resizer": () => <ImageTool mode="resize" />,
  "png-to-jpg": () => <ImageTool mode="convert" target="image/jpeg" />,
  "jpg-to-png": () => <ImageTool mode="convert" target="image/png" />,
  "webp-converter": () => <ImageTool mode="convert" target="image/webp" />,
  "image-cropper": () => <ImageTool mode="crop" />,
  "merge-pdf": PdfMerge,
  "split-pdf": PdfSplit,
  "jpg-to-pdf": ImagesToPdf,
  "text-to-pdf": TextToPdf,
  "pdf-to-jpg": PdfToImage,
  "rotate-pdf": () => <PdfEdit mode="rotate" />,
  "add-page-numbers": () => <PdfEdit mode="page-numbers" />,
  "add-watermark": () => <PdfEdit mode="watermark" />,
  "remove-pages": () => <PdfEdit mode="remove-pages" />,
  "crop-pdf": () => <PdfEdit mode="crop" />,
  "sign-pdf": SignPdf,
  "organize-pdf": OrganizePdf,
  "compress-pdf": CompressPdf,
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

  const Icon = ICONS[slug] ?? FALLBACK_ICON;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-secondary to-white">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <ol className="flex flex-wrap items-center justify-center gap-2">
              <li><Link href="/" className="hover:text-ink">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href={`/category/${tool.category}`} className="hover:text-ink">{category?.name}</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">{tool.name}</li>
            </ol>
          </nav>
          <span className={`mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-2xl ${TOOL_TONE[slug] ?? "bg-white text-primary-text"}`}>
            <Icon aria-hidden="true" className="h-8 w-8" />
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">{tool.name}</h1>
          <p className="mx-auto mt-2 max-w-xl text-pretty text-muted">{tool.summary}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-8">
          <Component />
        </div>
      </div>
    </>
  );
}
