/**
 * Next.js 15 config — Mission 1 web app.
 *
 * Marketing site + lead-capture form. SEO-critical (organic impressions KPI).
 * Image domains allow Google profile photos via GBP embed.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Defense-in-depth: explicit even though `false` is the default.
    // SVGs are statically served from /public; we never accept
    // remote SVGs (XSS vector via <script> in <foreignObject>).
    dangerouslyAllowSVG: false,
    // Prefer modern formats. Next.js defaults already include
    // image/webp; declaring `image/avif` first enables smaller
    // payloads where the browser supports it.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      // Service-area consolidation: /areas/belleair → /areas/33770
      { source: '/areas/belleair', destination: '/areas/33770', permanent: true },
      { source: '/areas/harbor-bluffs', destination: '/areas/33756', permanent: true },
      { source: '/areas/ridgecrest', destination: '/areas/33774', permanent: true },
      // Legacy favicon.ico requests (some SEO scrapers ignore <link rel="icon">).
      { source: '/favicon.ico', destination: '/icon.svg', permanent: true },
    ];
  },
  // typedRoutes was promoted out of `experimental` in Next.js 15.5.
  // Setting false to opt out (default is false anyway) — we don't yet
  // have a routes-only import surface, so enabling this would just
  // cause friction.
  typedRoutes: false,
};

export default nextConfig;
