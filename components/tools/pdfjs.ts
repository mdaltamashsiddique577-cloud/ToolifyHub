// Shared PDF.js loader for the tools that draw PDF pages. The worker is pinned on cdnjs.
export interface PdfPage {
  getViewport(o: { scale: number }): { width: number; height: number };
  render(o: { canvasContext: CanvasRenderingContext2D; viewport: unknown }): { promise: Promise<void> };
}
export interface PdfDoc {
  numPages: number;
  getPage(n: number): Promise<PdfPage>;
  destroy(): void;
}
interface PdfLib {
  getDocument(o: { data: ArrayBuffer }): { promise: Promise<PdfDoc> };
  GlobalWorkerOptions: { workerSrc: string };
}

const WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

export async function loadPdfJs(): Promise<PdfLib> {
  const lib = (await import("pdfjs-dist")) as unknown as PdfLib;
  lib.GlobalWorkerOptions.workerSrc = WORKER_URL;
  return lib;
}
