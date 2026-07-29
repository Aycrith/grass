/**
 * sitemap.xml — auto-generated from service slugs + area ZIPs.
 *
 * 25 routes: 1 home + 1 services index + 6 service detail + 1 pricing
 * + 1 about + 1 contact + 1 areas index + 6 area detail + 1 faq +
 * 1 hurricane-prep + 1 process + 1 reviews + 1 areas-near-me +
 * 1 door-hanger + 2 legal = 25.
 *
 * Topical /editorial hubs (high SEO value, distinct from the
 * service-card / per-ZIP surfaces):
 *   - /hurricane-prep    — deep-dive hub for the most differentiated
 *     service offering (pre-storm sweep + post-storm haul +
 *     insurance paperwork). 96-hour timeline, in-scope / not-in-
 *     scope, 8-question FAQ. 0.85 priority.
 *   - /process           — 6-step long-form version of the homepage
 *     ProcessSteps section. HowTo JSON-LD + 4 differentiators.
 *     0.7 priority.
 *   - /reviews           — canonical customer-review surface.
 *     Currently noindex,follow while `social.proof[]` is empty;
 *     flips to index,follow when the first real review lands.
 *     0.6 priority (low until populated).
 *   - /areas-near-me     — long-tail SEO for adjacent-ZIP searches
 *     (33760 / 33762 / 33764 / 33765 / 33777 / 33779 / 33780 /
 *     33781 / 34695). Maps each to closest route ZIP. 0.6 priority.
 *
 * The /gbp page is excluded (noindex,follow), and /privacy + /terms
 * are included as legal documentation but with lower priority.
 *
 * Charter binding: this is the single source of truth for the URL
 * set that we ask Google to crawl. Re-runs on every deploy via
 * Next.js generateSitemaps hook.
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
    { url: `${base}/hurricane-prep`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/process`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/reviews`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/areas-near-me`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/door-hanger`, lastModified: lastmod, changeFrequency: 'yearly', priority: 0.1 },
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
