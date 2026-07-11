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
    ];
  },
  experimental: {
    // Optimize for solo-founder loop speed.
    typedRoutes: false,
  },
};

export default nextConfig;
