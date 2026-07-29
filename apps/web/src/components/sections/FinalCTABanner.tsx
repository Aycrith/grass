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
 *
 * WP39 (2026-07-26) — 4 trust-signal guarantee chips added below
 * the CTA. The 4 chips ("Free quote in 24h" / "No contract" /
 * "$1M liability" / "Serving 33771 since 2020") sit as a quiet
 * row above the micro line; they read as "what you can count on"
 * without becoming a separate section. Per the design constraint
 * to not add new homepage sections, the chips live INSIDE the
 * existing FinalCTABanner — they cost zero vertical real estate
 * because the band already had 64px top + 64px bottom padding,
 * and they make the closer feel like a confirmation, not a
 * question. The chips share the sun-color border + sand-bleached
 * text idiom with the rest of the band.
 */

import { CheckCircle2, Clock, FileCheck2, Shield } from 'lucide-react';
import type { ReactNode } from 'react';

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

// 4 trust-signal chips, anchored to the same shape used by the
// ServiceAreaMap success rail. The data lives here (not in
// lib/content) because the chips are a presentation concern of
// the closer band, not a copy-edit concern.
const GUARANTEES: ReadonlyArray<{ icon: typeof CheckCircle2; text: string }> = [
  { icon: Clock, text: 'Free quote in 24h' },
  { icon: FileCheck2, text: 'No contract' },
  { icon: Shield, text: '$1M liability insured' },
  { icon: CheckCircle2, text: 'Serving 33771 since 2020' },
];

export function FinalCTABanner({ className, eyebrow, href }: FinalCTABannerProps): ReactNode {
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
          {/* WP39 — 4 guarantee chips below the CTA. Trust signals
           * that are visible to every visitor who reaches the closer
           * (homepage + every per-service + per-area + /pricing +
           * /about page), without adding a new section. The chips
           * use existing icons from lucide-react (no new assets). */}
          <ul className={styles.guarantees} aria-label="Service guarantees">
            {GUARANTEES.map(({ icon: Icon, text }) => (
              <li key={text} className={styles.guarantee}>
                <Icon size={14} aria-hidden="true" className={styles.guaranteeIcon} />
                <span className={styles.guaranteeText}>{text}</span>
              </li>
            ))}
          </ul>
        </FadeUp>
      </Container>
    </section>
  );
}
