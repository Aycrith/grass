/**
 * Card — Mission 1
 *
 * Variants: service | area | pricing | insight
 * Optional `featured` flag applies a sand accent (services bento)
 * or a sun accent (pricing tier).
 *
 * Used by:
 *   - ServiceBento (service variant)
 *   - ServiceAreaMap & areas index (area variant)
 *   - PricingTiers (pricing variant)
 *   - OperatorStrip, FAQAccordion, ProcessSteps (insight variant)
 */

import Link from 'next/link';
import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

import styles from './Card.module.css';

type CardVariant = 'service' | 'area' | 'pricing' | 'insight';

type ArticleOnlyProps = Omit<HTMLAttributes<HTMLElement>, 'title' | 'children' | 'className'>;

interface CardProps extends ArticleOnlyProps {
  variant?: CardVariant;
  featured?: boolean;
  href?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  summary?: ReactNode;
  imageAlt?: string;
  imageSlot?: string;
  /** Rendered if no real image is present. */
  imagePlaceholder?: ReactNode;
  /** Footer region (price, CTA link, etc). */
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function Card({
  variant = 'service',
  featured = false,
  href,
  eyebrow,
  title,
  summary,
  imageAlt,
  imageSlot,
  imagePlaceholder,
  footer,
  className,
  children,
  ...rest
}: CardProps) {
  const cls = cn(styles.root, styles[variant], featured && styles.featured, className);

  const hasImageRegion = variant === 'service' || variant === 'area';

  const inner = (
    <>
      {hasImageRegion && (
        <div className={styles.image}>
          {imageSlot ? (
            // Placeholder until steward-taken photos arrive — no next/image
            // dependency for these placeholders so we don't need explicit width/height.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageSlot} alt={imageAlt ?? ''} loading="lazy" />
          ) : (
            <div className={styles.imagePlaceholder}>{imagePlaceholder ?? '—'}</div>
          )}
        </div>
      )}
      <div className={styles.body}>
        {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
        {title && <h3 className={styles.title}>{title}</h3>}
        {summary && <p className={styles.summary}>{summary}</p>}
        {children}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </>
  );

  if (href !== undefined) {
    const safeHref: string = href;
    const anchorRest = rest as Record<string, unknown>;
    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(anchorRest)) {
      if (k === 'href') continue;
      if (v === undefined) continue;
      cleaned[k] = v;
    }
    return (
      <Link
        href={safeHref}
        className={cn(cls, styles.asLink)}
        {...cleaned}
      >
        {inner}
      </Link>
    );
  }

  return (
    <article className={cls} {...rest}>
      {inner}
    </article>
  );
}
