/**
 * sitemap.xml — auto-generated from service slugs.
 *
 * 11 routes: 1 home + 1 services index + 6 service detail + 1 pricing
 * + 1 about + 1 contact + 2 legal = 11. (D-0033: per-area ZIP pages
 * removed — the form on the homepage is the single service-area
 * surface; no per-ZIP SEO placeholder pages.)
 *
 * The /gbp page is excluded (noindex,follow), and /privacy + /terms are
 * included as legal documentation but with lower priority.
 *
 * Charter binding: this is the single source of truth for the URL set
 * that we ask Google to crawl. Re-runs on every deploy via Next.js
 * generateSitemaps hook.
 */

import type { MetadataRoute } from 'next';

const SERVICE_SLUGS = [
  'mowing',
  'edging',
  'mulching',
  'hedge-trimming',
  'hurricane-prep',
  'seasonal-cleanup',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://largolawn.pro';
  const lastmod = new Date();
  return [
    // --- Top-level pages ---
    { url: `${base}/`, lastModified: lastmod, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/services`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pricing`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/about`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/privacy`, lastModified: lastmod, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, lastModified: lastmod, changeFrequency: 'yearly', priority: 0.2 },

    // --- 6 service detail pages ---
    ...SERVICE_SLUGS.map((slug) => ({
      url: `${base}/services/${slug}`,
      lastModified: lastmod,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
  ];
}
