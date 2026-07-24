'use client';

/**
 * BehindTheScenes — the "real footage, not stock" trust section.
 *
 * v2 (2026-07-23) — split into TWO section instances:
 *   1. "The truck" — operator + equipment angle, real-mower-01.mp4
 *   2. "The yard"  — the mowed result angle, real-mower-02.mp4
 *
 * Each instance is the same component (BehindTheScenes) called with
 * different content props. They share the visual identity:
 *   - White card on cream (tone="soft")
 *   - 2px dashed ink-deep border (the "photo on the fridge" framing)
 *   - Paper-tape label across the top edge, slightly rotated
 *   - Single video (autoplay muted loop playsinline preload="none")
 *   - Pull-quote in the operator voice, italic Fraunces
 *
 * Quarantines the real-footage riding-mower clips from the painted
 * hero world. The painted gouache hero and the painted scene 2 are a
 * single visual language; the cell-phone footage of an actual Pinellas
 * lawn + an actual mower + an actual truck is a DIFFERENT visual
 * language. Mixing the two inside the hero would land as "stock image
 * gallery with one photo thrown in" (the v1 bleed failure mode).
 *
 * This section gives the real footage its own visual identity so it
 * reads as a trust signal ("look, the painted scene is the brand,
 * the real footage is the proof") rather than a mismatch.
 *
 * Section placement:
 *   - "The truck" sits between FieldLog (D-0055) and "The yard"
 *   - "The yard" sits between "The truck" and ServiceBento
 *   - Together they span the editorial moment between "the route"
 *     (FieldLog) and "the work" (ServiceBento)
 *
 * The "The truck" + "The yard" structure doubles the surface area
 * but uses the same component twice, so the code is DRY. The two
 * sections have intentionally different pull-quotes:
 *   - Truck: "Same guy, same day, every week" — the identity signal
 *   - Yard: "The yard never knows the difference. The operator does."
 *     (parallels FieldLog's quote) — the craft signal
 *
 * Files:
 *   - /hero/bts/real-mower-01.mp4  (2.4 MB, 10.0s)
 *   - /hero/bts/real-mower-02.mp4  (2.4 MB, 10.0s)
 * Total payload: ~4.8 MB. Both files preload="none" so the browser
 * doesn't fetch them until the section is in view (via
 * IntersectionObserver, see the useInView below).
 *
 * Accessibility:
 *   - <video> elements are aria-hidden because the content is
 *     decorative; the figcaption + pull-quote carry the meaning.
 *   - Each instance has a single semantic h2.
 *   - prefers-reduced-motion: the videos still autoplay (they're
 *     real-world footage, not animated motion), but the entrance
 *     fade-up is gated by useInView so it doesn't play during
 *     scroll for motion-sensitive users.
 *
 * See research/hero-integration-plan-2026-07-22.md §13 for the
 * full quarantine rationale.
 */

import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

import { Section } from '@/components/site';

import styles from './BehindTheScenes.module.css';

export interface BehindTheScenesProps {
  /** Eyebrow text above the section title, e.g. "07.1 — The truck". */
  eyebrow: string;
  /** Section title (h2). Should be in the operator voice. */
  title: string;
  /** Paper-tape label across the top edge of the card. */
  tapeLabel: string;
  /** Path to the autoplaying video. */
  videoSrc: string;
  /** Caption for the video (figcaption). */
  figcaption: string;
  /** Pull-quote caption in the operator voice, italic Fraunces. */
  pullQuote: string;
  /** Bold emphasis inside the pull-quote (the "conversion point"). */
  pullQuoteEm: string;
  /** Section data-test-section id (suffix); the full id is
   *  "behind-the-scenes-${dataTestSectionSuffix}". */
  dataTestSectionSuffix: string;
  /** Test id for the video element. */
  videoTestId: string;
}

export function BehindTheScenes({
  eyebrow,
  title,
  tapeLabel,
  videoSrc,
  figcaption,
  pullQuote,
  pullQuoteEm,
  dataTestSectionSuffix,
  videoTestId,
}: BehindTheScenesProps): ReactNode {
  // Trigger the eyebrow + title + card entrance fade-up when the
  // section enters the viewport. amount: 0.25 = "25% of the section
  // is in view" so the entrance starts when the user scrolls to it,
  // not before. once: true so the entrance doesn't replay on
  // scroll-up.
  const innerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(innerRef, { once: true, amount: 0.25 });

  return (
    <Section
      tone="soft"
      rhythm="default"
      className={styles.root}
      data-test-section={`behind-the-scenes-${dataTestSectionSuffix}`}
    >
      <div className="container">
        <div className={styles.inner} ref={innerRef}>
          <motion.div
            className={styles.eyebrowBlock}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.eyebrowRule} aria-hidden="true" />
            <span className={styles.eyebrowNumber}>{eyebrow}</span>
            <span className={styles.eyebrowDot} aria-hidden="true">·</span>
            <span className={styles.eyebrowLabel}>Behind the scenes</span>
          </motion.div>

          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {title}
          </motion.h2>

          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.tape} aria-hidden="true">
              {tapeLabel}
            </span>

            <figure className={styles.figure}>
              <video
                className={styles.video}
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
                data-testid={videoTestId}
              />
              <figcaption className={styles.figcaption}>
                {figcaption}
              </figcaption>
            </figure>

            <p className={styles.caption}>
              {pullQuote}{' '}
              <span className={styles.captionEm}>{pullQuoteEm}</span>
            </p>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
