/**
 * Breadcrumb — site navigation trail.
 *
 * Renders an accessible <nav aria-label="Breadcrumb"> with an <ol>
 * of items, the last of which is the current page (rendered as a
 * non-link span with aria-current="page"). Items before the last
 * are clickable <Link>s back up the trail.
 *
 * Used on /services/[slug] and /areas/[zip] so a deep visitor
 * can climb back to the index without hitting the browser back
 * button. Also helps search engines understand the URL
 * hierarchy for richer breadcrumbs in SERP snippets.
 *
 * Visual: small Inter caps, sand-bleached color, hairline
 * separator chevron between items. Sits comfortably above
 * <h1> in the page hero.
 *
 * Visual contrast / accessibility:
 *   - aria-label="Breadcrumb" so screen-reader users can
 *     distinguish it from the primary <nav> in the header
 *   - aria-current="page" on the last item (the page they're on)
 *   - separator is aria-hidden so it's not announced
 *   - links use the standard focus-visible outline
 *
 * Example:
 *   <Breadcrumb
 *     items={[
 *       { label: 'Home', href: '/' },
 *       { label: 'Services', href: '/services' },
 *       { label: 'Mowing' },
 *     ]}
 *   />
 */

import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

import styles from './Breadcrumb.module.css';

interface BreadcrumbItem {
  /** Display label. Required. */
  label: string;
  /** Link target. Omit on the last item (the current page). */
  href?: string;
}

interface BreadcrumbProps {
  items: ReadonlyArray<BreadcrumbItem>;
  /** Optional className passthrough for the <nav> element.
   *  Typed as `string | undefined` to match the rest of the
   *  design system (e.g. <Eyebrow>, <Section>). Callers
   *  commonly pass `styles.X` from a CSS module, which
   *  resolves to `string | undefined` under
   *  `noUncheckedIndexedAccess: true`. */
  className?: string | undefined;
  /** Tone variant. `dark` for use on dark/colorful hero
   *  backgrounds (sand-bleached text); `default` for light
   *  surfaces (palm-bark text). */
  tone?: 'default' | 'dark' | undefined;
}

export function Breadcrumb({
  items,
  className,
  tone = 'default',
}: BreadcrumbProps): ReactNode {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(styles.root, tone === 'dark' && styles.dark, className)}
    >
      <ol className={styles.list}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className={styles.item}>
              {isLast || !item.href ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              )}
              {!isLast ? (
                <span className={styles.sep} aria-hidden="true">
                  ›
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
