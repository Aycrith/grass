/**
 * sitemap.xml — auto-generated from service slugs + area ZIPs.
 *
 * 20 routes: 1 home + 1 services index + 6 service detail + 1 pricing
 * + 1 about + 1 contact + 1 areas index + 6 area detail + 1 faq + 2 legal = 20.
 * (D-0034: per-area ZIP pages re-included. D-0033 had removed them;
 * D-0034 restores them with substantive local content + 6 painted
 * storybook illustrations. The form on the homepage is still the
 * primary service-area surface; the /areas routes are the secondary
 * "explore the neighborhoods" surface for users who want to dig in.)
 *
 * The /gbp page is excluded (noindex,follow), and /privacy + /terms are
 * included as legal documentation but with lower priority.
 *
 * Charter binding: this is the single source of truth for the URL set
 * that we ask Google to crawl. Re-runs on every deploy via Next.js
 * generateSitemaps hook.
 */

import type { MetadataRoute } from 'next';

import { BUSINESS } from '@/lib/business';

const SERVICE_SLUGS = [
  'mowing',
  'edging',
  'mulching',
  'hedge-trimming',
  'hurricane-prep',
  'seasonal-cleanup',
] as const;

// D-0034: 6 area ZIPs (matches the 6 home-area ZIPs in
// `BUSINESS.service_area_zips` + the `areaDetail` keys).
const AREA_ZIPS = ['33756', '33770', '33771', '33773', '33774', '33778'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = BUSINESS.url;
  const lastmod = new Date();
  return [
    // --- Top-level pages ---
    { url: `${base}/`, lastModified: lastmod, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/services`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pricing`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/about`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/areas`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/faq`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacy`, lastModified: lastmod, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, lastModified: lastmod, changeFrequency: 'yearly', priority: 0.2 },

    // --- 6 service detail pages ---
    ...SERVICE_SLUGS.map((slug) => ({
      url: `${base}/services/${slug}`,
      lastModified: lastmod,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),

    // --- 6 area detail pages (D-0034 re-introduction) ---
    ...AREA_ZIPS.map((zip) => ({
      url: `${base}/areas/${zip}`,
      lastModified: lastmod,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ];
}
