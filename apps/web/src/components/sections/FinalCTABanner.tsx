/**
 * FinalCTABanner — full-bleed CTA band.
 *
 * Renders palm-shadow background + sand-bleached text + a single
 * sun CTA. Copy comes from `lib/content.ts → finalCta`. No parallax
 * (last section, no scroll-after); only a fade-in on entry.
 *
 * Optional `eyebrow` prop lets per-page contexts override the
 * default "09 — Ready when you are".
 */

import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';
import { finalCta } from '@/lib/content';

import styles from './FinalCTABanner.module.css';

interface FinalCTABannerProps {
  className?: string | undefined;
  eyebrow?: string | undefined;
  href?: string | undefined;
}

export function FinalCTABanner({ className, eyebrow, href }: FinalCTABannerProps): React.ReactNode {
  return (
    <section className={cn(styles.root, className)}>
      <div className="container">
        <div className={styles.inner}>
          <span className={styles.eyebrow}>{eyebrow ?? '09 — Ready when you are'}</span>
          <h2 className={styles.headline}>{finalCta.headline}</h2>
          <p className={styles.micro}>{finalCta.micro}</p>
          <div className={styles.actions}>
            <Button as="link" href={href ?? finalCta.cta.href} variant="sun" size="lg">
              {finalCta.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
