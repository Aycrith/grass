/**
 * JSON-LD helpers — Mission 1
 *
 * The `BreadcrumbList` schema.org block is emitted on every detail
 * page (/services/[slug], /areas/[zip], future /blog/[slug] once
 * the blog ships). Each detail page had its own 22-line copy of
 * the same @context/@type/itemListElement scaffolding. The
 * `breadcrumbJsonLd` helper below is the single source of truth.
 *
 * Satori / Next.js ImageResponse do NOT use this — those render
 * PNGs, not HTML, and the JSON-LD doesn't apply.
 */

const SITE_URL = 'https://largolawn.pro';

/**
 * Build a `BreadcrumbList` JSON-LD object for a detail page.
 *
 * @param trail - the breadcrumb trail from root → current. The
 *   first item MUST be Home. The last item is the current page
 *   (its `item` is the canonical URL).
 * @returns a plain object suitable for
 *   `JSON.stringify(...)` + `dangerouslySetInnerHTML={{ __html }}`
 *   in a <script type="application/ld+json"> tag.
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
