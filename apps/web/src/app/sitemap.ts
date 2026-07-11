/**
 * sitemap.xml — auto-generated from BUSINESS.service_area_zips + service slugs.
 *
 * 18 routes: 1 home + 1 services index + 6 service detail + 1 areas index
 * + 6 area detail + 1 pricing + 1 about + 1 contact = 18.
 *
 * The /gbp page is excluded (noindex,follow), and /privacy + /terms are
 * included as legal documentation but with lower priority.
 *
 * Charter binding: this is the single source of truth for the URL set
 * that we ask Google to crawl. Re-runs on every deploy via Next.js
 * generateSitemaps hook.
 */

import { BUSINESS } from '@/lib/business';
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
  const base = 'https://largolandscape.pro';
  const lastmod = new Date();
  return [
    // --- Top-level pages ---
    { url: `${base}/`, lastModified: lastmod, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/services`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pricing`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/about`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/areas`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/privacy`, lastModified: lastmod, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, lastModified: lastmod, changeFrequency: 'yearly', priority: 0.2 },

    // --- 6 service detail pages ---
    ...SERVICE_SLUGS.map((slug) => ({
      url: `${base}/services/${slug}`,
      lastModified: lastmod,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),

    // --- 6 service-area ZIP pages ---
    ...BUSINESS.service_area_zips.map((zip: string) => ({
      url: `${base}/areas/${zip}`,
      lastModified: lastmod,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
