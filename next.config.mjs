// Next.js config. Two modes: a normal build with security headers, or PAGES_EXPORT=1 for the static
// GitHub Pages export (basePath /ToolifyHub). Also sets the Node-only "canvas" module to false so pdf.js works in the browser.
// Two modes:
// - normal: a Next.js server build with security headers (for a Node host later)
// - PAGES_EXPORT=1: a static site for GitHub Pages, served at /ToolifyHub
const exporting = process.env.PAGES_EXPORT === "1";

// Security headers from the plan. Only the server build can send headers.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; script-src 'self' 'unsafe-inline'; worker-src 'self' blob: https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // pdf.js optionally loads the Node-only "canvas" package. The browser never needs it.
  webpack(config) {
    config.resolve.alias = { ...config.resolve.alias, canvas: false };
    return config;
  },
  ...(exporting
    ? { output: "export", trailingSlash: true, basePath: "/ToolifyHub" }
    : {
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
