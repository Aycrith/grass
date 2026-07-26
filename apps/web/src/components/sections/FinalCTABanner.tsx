'use client';

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

import { FadeUp } from '@/components/motion';
import { Container } from '@/components/site';
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
    <section className={cn(styles.root, className)} id="final-cta" data-test-section="final-cta-banner">
      <Container>
        <FadeUp as="div" className={styles.inner}>
          <span className={styles.eyebrow}>{eyebrow ?? 'Ready when you are'}</span>
          {/* D-0059 rev4 — quote-mark illustration REMOVED.
           * The 56x45 v3 quote-mark ornament between eyebrow and
           * headline read as "two yellow head silhouettes" at the
           * small render size — the stylized double-curl of a
           * typographic opening quote has the same silhouette as
           * two profile heads against the palm-shadow bg, and the
           * reader's eye was reading it as a face/avatar rather
           * than a typographic ornament. Removed entirely. The
           * eyebrow + headline + micro + CTA stack reads as one
           * closing beat without it. The illustration asset stays
           * on disk in case a future section wants the mark at a
           * larger render size where the quote-curl reads as
           * intent. */}
          <h2 className={styles.headline}>{finalCta.headline}</h2>
          <p className={styles.micro}>{finalCta.micro}</p>
          <div className={styles.actions}>
            <Button as="link" href={href ?? finalCta.cta.href} variant="sun" size="lg">
              {finalCta.cta.label}
            </Button>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
