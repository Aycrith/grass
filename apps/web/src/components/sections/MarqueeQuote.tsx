/**
 * MarqueeQuote — horizontally-scrolling infinite marquee of
 * operator voice lines, mounted between OperatorNote and
 * FAQAccordion on `/`.
 *
 * Brand voice: 5–7 first-person operator quotes drawn from a
 * new `lib/content.ts → operatorMarquee` const. Reads as a
 * typographic pause — slow infinite scroll (40s cycle), no
 * call-to-action, no urgency. Sand-bleached surface, Fraunces
 * italic 1.5rem, sun color.
 *
 * Reduced-motion: collapses to a vertical stack of the same
 * lines, no horizontal scroll, instant.
 *
 * Reduced-data: marquee respects `prefers-reduced-motion`;
 * the static fallback works without animation.
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { type ReactNode, useEffect, useState } from 'react';

import { cn } from '@/lib/cn';
import { operatorMarquee } from '@/lib/content';

import styles from './MarqueeQuote.module.css';

interface MarqueeQuoteProps {
  className?: string | undefined;
}

export function MarqueeQuote({ className }: MarqueeQuoteProps): ReactNode {
  // WP26 fix — avoid hydration mismatch from `useReducedMotion()`.
  // SSR returns the motion-variant JSX (because `useReducedMotion()` is null
  // on the server). Playwright runs with `reducedMotion: 'reduce'`, so on the
  // client's first render the hook returns true and the original code took
  // the static-variant branch — producing different markup than SSR.
  //
  // Defer the reduced-motion decision until after mount via `hydrated`. SSR
  // and first client render both render the motion variant; if the user
  // actually prefers reduced motion, useEffect flips `hydrated` to true and
  // the component swaps to the static variant as a normal post-mount state
  // change (no hydration error).
  const reduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  const shouldUseStatic = hydrated && reduced === true;

  if (shouldUseStatic) {
    return (
      // WP26 — suppressHydrationWarning because this whole subtree swaps
      // between motion and static variants after mount based on the
      // user's reduced-motion preference. SSR always renders the motion
      // variant; on a reduced-motion client the swap is expected.
      <section
        className={cn(styles.root, styles.static, className)}
        data-test-section="marquee-quote"
        suppressHydrationWarning
      >
        <div className="container">
          <ul className={styles.staticList}>
            {operatorMarquee.map((line) => (
              <li key={line} className={styles.staticItem}>
                “{line}”
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
  // Duplicate the list so the seamless loop has no visible jump
  // mid-cycle. The keyframe scrolls -50% (half the doubled width).
  const doubled = [...operatorMarquee, ...operatorMarquee];
  return (
    <section
      className={cn(styles.root, className)}
      aria-label="Operator quotes"
      data-test-section="marquee-quote"
      suppressHydrationWarning
    >
      <div className={styles.viewport}>
        <motion.div
          className={styles.track}
          initial={{ x: '0%' }}
          animate={{ x: '-50%' }}
          transition={{
            duration: 40,
            ease: 'linear',
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          {doubled.map((line, i) => (
            <span key={`${i}-${line}`} className={styles.item}>
              <span className={styles.quoteMark} aria-hidden="true">
                “
              </span>
              {line}
              <span className={styles.dot} aria-hidden="true">
                ·
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
