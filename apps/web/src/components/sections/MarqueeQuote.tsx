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
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { operatorMarquee } from '@/lib/content';

import styles from './MarqueeQuote.module.css';

interface MarqueeQuoteProps {
  className?: string | undefined;
}

export function MarqueeQuote({ className }: MarqueeQuoteProps): ReactNode {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <section className={cn(styles.root, styles.static, className)}>
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
    <section className={cn(styles.root, className)} aria-label="Operator quotes">
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
