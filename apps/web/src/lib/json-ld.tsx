/**
 * JSON-LD helpers — Mission 1
 *
 * The `BreadcrumbList` schema.org block is emitted on every detail
 * page (/services/[slug], /areas/[zip], future /blog/[slug] once
 * the blog ships). Each detail page had its own 22-line copy of
 * the same @context/@type/itemListElement scaffolding. The
 * `breadcrumbJsonLd` helper below is the single source of truth.
 *
 * The `<JsonLd>` component encapsulates the
 * `<script type="application/ld+json" dangerouslySetInnerHTML=...>`
 * tag + the per-call biome-ignore directive into a single
 * primitive, so route files don't each carry their own copy of
 * the lint suppression.
 *
 * Satori / Next.js ImageResponse do NOT use this — those render
 * PNGs, not HTML, and the JSON-LD doesn't apply.
 */

import type { ReactElement } from 'react';

import { BUSINESS } from '@/lib/business';

const SITE_URL = BUSINESS.url;

/**
 * Build a `BreadcrumbList` JSON-LD object for a detail page.
 *
 * @param trail - the breadcrumb trail from root → current. The
 *   first item MUST be Home. The last item is the current page
 *   (its `item` is the canonical URL).
 * @returns a plain object suitable for `JSON.stringify(...)` and
 *   then passing to <JsonLd data={...} />.
 */
export function breadcrumbJsonLd(
  trail: ReadonlyArray<{ name: string; href: string }>,
): {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: ReadonlyArray<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
} {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, i) => ({
      '@type': 'ListItem' as const,
      position: i + 1,
      name: step.name,
      // Trailing-slash normalize on the root to match canonical URLs.
      item: step.href === '/' ? `${SITE_URL}/` : `${SITE_URL}${step.href}`,
    })),
  };
}

/**
 * Shorthand for the typical 3-step detail-page breadcrumb
 * (Home > Parent > Current). Each detail route calls this with
 * its own parent label + href + current label/href.
 */
export function detailBreadcrumb(args: {
  parentLabel: string;
  parentHref: string;
  currentLabel: string;
  currentHref: string;
}) {
  return breadcrumbJsonLd([
    { name: 'Home', href: '/' },
    { name: args.parentLabel, href: args.parentHref },
    { name: args.currentLabel, href: args.currentHref },
  ]);
}

/**
 * `<JsonLd>` — render a schema.org JSON-LD block as a
 * <script type="application/ld+json"> tag. Encapsulates the
 * per-call `dangerouslySetInnerHTML` so the route files
 * don't each carry their own biome-ignore directive.
 *
 * The data is JSON-serialized at render time (so the route
 * composes the object via the breadcrumbJsonLd / detailBreadcrumb
 * helpers above, then passes it here). Satori / ImageResponse
 * pages do NOT use this — see note at top of file.
 */
export function JsonLd({ data }: { data: object }): ReactElement {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: SEO JSON-LD
      // (this whole primitive exists so the biome-ignore lives in
      // one place rather than being copy-pasted to every route)
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
