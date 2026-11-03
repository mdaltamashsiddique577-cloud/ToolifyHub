# ToolifyHub

Free online PDF, image, text, calculator and developer tools. No login. Files are processed in the
browser and are never uploaded.

## Run it

```bash
npm install
npm run dev          # local development server
npm test             # unit tests (Node test runner, runs the .ts files directly)
npm run build        # production build
PAGES_EXPORT=1 npx next build   # static export for GitHub Pages (output in out/)
```

Node 22.6 or newer is needed (the tests run TypeScript directly).

## Project map

| Folder | What is inside |
| --- | --- |
| `app/` | Pages and routes (Next.js App Router). `page.tsx` is the homepage, `tools/[slug]/page.tsx` is every tool page. |
| `components/home/` | Homepage tool grid with search. |
| `components/layout/` | Header menus (All tools, Convert). |
| `components/legal/` | Shared layout for the legal and info pages. |
| `components/tools/` | Shared form pieces (`ui.tsx`) and one folder per tool category. |
| `components/tools/text/` | Word Counter, Character Counter, Case Converter, Remove Extra Spaces. |
| `components/tools/calculators/` | Age, BMI, EMI, Percentage and GST calculators. |
| `components/tools/developer/` | JSON Formatter, Base64 Encoder/Decoder. |
| `components/tools/image/` | Image tools: compressor, resizer, cropper and format converters. |
| `components/tools/pdf/` | PDF tools, plus `pdfjs.ts` (the PDF.js loader). |
| `lib/registry.ts` | The list of tools and categories. The single source of truth. |
| `lib/menu.ts` | Menu groups for the header. |
| `lib/icons.ts` | Icon and colour for each tool. |
| `lib/tools/` | Pure logic with no UI code: `text.ts`, `calc.ts`, `dev.ts`, `image.ts`, `pdf.ts`. These are unit tested. |
| `tests/` | Unit tests for the logic, the registry, menus and the tool page map. |
| `types/` | Type declaration for pdfjs-dist. |
| `.github/workflows/ci.yml` | CI: test, build, static export, screenshots and deploy to GitHub Pages. |

## How a tool is built

Each tool follows the same pattern:

1. **Logic** goes in `lib/tools/` as plain functions. Keep it free of React and browser APIs, and add tests in `tests/`.
2. **UI** goes in the matching folder under `components/tools/`. It calls the logic and handles file input, errors and downloads.
3. **Register** the tool in `lib/registry.ts` with `live: true`.
4. **Page**: add the component to the `COMPONENTS` map in `app/tools/[slug]/page.tsx`.
5. **Icon**: add an icon and colour for the slug in `lib/icons.ts`.
6. **Menu**: add the slug to a group in `lib/menu.ts`.

`tests/pages.test.ts`, `tests/menu.test.ts` and `tests/registry.test.ts` fail if any of these steps is missing.

## Rules the project follows

- **No login, no accounts, no OTP, no email collection.** Do not add them.
- **Files stay on the device.** PDF and image tools run in the browser. The only tool that sends text to a server is the AI summarizer (not built yet).
- **Brand**: primary colour `#6C5CE7`, font Inter, logo is the "T" mark in `app/layout.tsx`.
- **Legal pages** contain `ToFill` placeholders (owner, contact, AI provider, log retention, jurisdiction, launch date). Fill them in before launch.

## Tools (30 live)

- **Image (6):** Image Compressor, Image Cropper, Image Resizer, PNG to JPG, JPG to PNG, WebP Converter
- **PDF (14):** JPG to PDF, Text to PDF, PDF to JPG, Merge PDF, Split PDF, Organize PDF, Compress PDF, Rotate PDF, Add Page Numbers, Add Watermark, Remove Pages, Crop PDF, Sign PDF
- **Text (4):** Word Counter, Character Counter, Case Converter, Remove Extra Spaces
- **Calculators (5):** Age, BMI, EMI, Percentage, GST
- **Developer (2):** JSON Formatter, Base64 Encoder/Decoder

Not planned for the browser: Word, Excel and PowerPoint conversions, Protect and Unlock PDF, OCR, HTML to PDF, PDF/A, Redact, Compare, Edit PDF, PDF Forms, AI summarizer, translate and Markdown. These need a server or AI.

## Deployment

Pushes to `main` run CI. CI tests and builds the site, exports it to `out/`, and publishes it to the `gh-pages` branch. In repository Settings → Pages, the source must be **Deploy from a branch → gh-pages / (root)**.
