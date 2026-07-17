'use client';

/**
 * ConversionRail — sticky bottom-bar CTA for the landing page.
 *
 * D-0037 — the conversion-first principle applied site-wide. The
 * rail mounts on the landing page, stays anchored at the bottom
 * of the viewport after the user scrolls past the hero, and
 * surfaces a single sun-colored "Get a free quote" CTA that is
 * always within reach.
 *
 * Behavior:
 *   - **Hidden** while the hero is in view (the hero already
 *     has its own "Get a free quote" CTA — showing both is
 *     redundant and noisy).
 *   - **Slides up** with a 240ms ease-out when the user scrolls
 *     past the hero. Reduced motion: instant (no transition).
 *   - **Hides** when the FinalCTABanner enters the viewport
 *     (the closer IS the conversion — the rail would compete).
 *   - **Pinned at bottom** on mobile and desktop. On mobile,
 *     full-width with a single primary CTA. On desktop, a thin
 *     pill anchored to the bottom-right corner so it doesn't
 *     fight with the site header.
 *
 * The rail is a client component that uses an IntersectionObserver
 * to track the hero and FinalCTA elements (queried by id). Both
 * ids are passed in by the parent (default: "hero" and "final-cta").
 *
 * Visual:
 *   - Desktop: small pill in the bottom-right corner with the
 *     sun-colored "Get a free quote" button + a tiny "Ready when
 *     you are" microcopy.
 *   - Mobile: full-width band at the bottom with the same copy
 *     and a full-width CTA.
 *
 * The rail does NOT appear on /quote, /contact, or any non-landing
 * page — it's mounted in the landing page tree only.
 */

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';

import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';

import styles from './ConversionRail.module.css';

interface ConversionRailProps {
  /** id of the hero element (rail stays hidden while it's in view). */
  heroId?: string;
  /** id of the final CTA element (rail hides when it scrolls in). */
  finalCtaId?: string;
  className?: string | undefined;
}

export function ConversionRail({
  heroId = 'hero',
  finalCtaId = 'final-cta',
  className,
}: ConversionRailProps): ReactNode {
  // Hidden while hero is in view OR while final CTA is in view.
  // Default to hidden on SSR; the effect flips it on mount.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hero = document.getElementById(heroId);
    const finalCta = document.getElementById(finalCtaId);
    if (!hero && !finalCta) {
      // Neither anchor found — default to visible so the rail
      // doesn't get trapped in a hidden state.
      setVisible(true);
      return;
    }

    // The rail is visible when:
    //   - hero is NOT intersecting (user has scrolled past it)
    //   - AND final CTA is NOT intersecting (user hasn't reached it yet)
    let heroInView = !!hero;
    let finalCtaInView = !!finalCta;

    const update = () => {
      setVisible(!heroInView && !finalCtaInView);
    };

    update();

    const heroObs = hero ? new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        heroInView = entry.isIntersecting;
        update();
      },
      { threshold: 0.05 },
    ) : null;
    const finalObs = finalCta ? new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        finalCtaInView = entry.isIntersecting;
        update();
      },
      { threshold: 0.05 },
    ) : null;

    if (heroObs && hero) heroObs.observe(hero);
    if (finalObs && finalCta) finalObs.observe(finalCta);

    return () => {
      heroObs?.disconnect();
      finalObs?.disconnect();
    };
  }, [heroId, finalCtaId]);

  return (
    <div
      className={cn(
        styles.root,
        visible ? styles.visible : styles.hidden,
        className,
      )}
      aria-hidden={!visible}
      data-test-rail="conversion"
    >
      <div className={styles.inner}>
        <span className={styles.copy}>Ready when you are.</span>
        <Button
          as="link"
          href="/quote"
          variant="sun"
          size="md"
          className={styles.cta}
        >
          <span>Get a free quote</span>
          <span className={styles.arrow} aria-hidden="true">
            &rarr;
          </span>
        </Button>
        <Link href="/areas" className={styles.altLink}>
          See service area
        </Link>
      </div>
    </div>
  );
}
