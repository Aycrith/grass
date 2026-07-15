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

import { Button, Illustration } from '@/components/ui';
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
          <span className={styles.eyebrow}>{eyebrow ?? 'Ready when you are'}</span>
          {/* D-0011 — opening quote-mark ornament, v3 painted storybook.
           * Pairs with the painted v3 logo mark + Fraunces wordmark in
           * the SiteHeader so the page closer joins the painted storybook
           * language that the rest of the homepage already uses. The
           * original v1 quote-mark.svg remains on disk as a fallback
           * variant (see LogoMark.tsx comment). */}
          <Illustration
            src="/illustrations/quote-mark-v3-56.webp"
            alt=""
            width={56}
            height={45}
            className={styles.openingMark}
          />
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
