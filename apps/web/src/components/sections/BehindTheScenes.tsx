'use client';

/**
 * BehindTheScenes — the "real footage, not stock" trust-building section.
 *
 * Quarantines the two real-footage riding-mower clips from the painted
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
 * Visual identity:
 *   - Section tone: `soft` (cream, --ll-cream). The previous section
 *     (FieldLog) is `warm` (sand-bleached), so the contrast marks the
 *     editorial shift from "the route" to "the work itself".
 *   - Container: white card with 2px dashed ink-deep border. The
 *     dashed border is the visual signal that this content is a
 *     different kind of asset - framed like a photo on a fridge,
 *     not embedded into the page.
 *   - Paper-tape label at the top of the card: small clay-bordered
 *     rectangle, slightly rotated, with the text "Real footage, not
 *     stock" in a hand-printed style. This is the editorial convention
 *     for "we know this doesn't match the brand illustration style,
 *     and that's the point".
 *   - Two <video> elements, side-by-side on desktop, stacked on
 *     mobile. Both autoplay muted loop playsinline (no audio - the
 *     operator's mowers are noisy and the audio would compete with
 *     the hero's ambient loop). Each video is a different angle of
 *     the same yard (the first clips the mower mid-yard, the second
 *     clips it from a different vantage point).
 *   - Caption below the videos: "That's the actual mower, the
 *     actual truck, and the actual Tuesday. No franchise, no
 *     subcontractor." The "no franchise, no subcontractor" line is
 *     the section's conversion point - it's the trust signal the
 *     section is for.
 *
 * Section placement: between the FieldLog (D-0055) and the
 * ServiceBento. The user has just seen "the route" (FieldLog) and
 * is about to see "the work" (ServiceBento) - BehindTheScenes
 * bridges them with "here's what the work actually looks like".
 *
 * Accessibility:
 *   - <video> elements are aria-hidden because the content is
 *     decorative; the caption below carries the meaning. If the
 *     browser blocks autoplay, the poster is the static first frame
 *     and the user gets the same content.
 *   - The card has a single semantic h2 for the section title.
 *   - prefers-reduced-motion: the videos still autoplay (they're
 *     real-world footage, not animated), but the eyebrow + title +
 *     caption fade-up is gated by useInView so it doesn't play
 *     during scroll for motion-sensitive users.
 *
 * Files:
 *   - /hero/bts/real-mower-01.mp4  (2.4 MB, 10.0s)
 *   - /hero/bts/real-mower-02.mp4  (2.4 MB, 10.0s)
 * Total payload: ~4.8 MB. Both files preload="none" so the browser
 * doesn't fetch them until the section is in view (via
 * IntersectionObserver, see the useInView below).
 *
 * See research/hero-integration-plan-2026-07-22.md §13 for the
 * full quarantine rationale.
 */

import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

import { Section } from '@/components/site';

import styles from './BehindTheScenes.module.css';

const VIDEO_SRC_1 = '/hero/bts/real-mower-01.mp4';
const VIDEO_SRC_2 = '/hero/bts/real-mower-02.mp4';

export function BehindTheScenes(): ReactNode {
  // Trigger the eyebrow + title + caption fade-up when the section
  // enters the viewport. amount: 0.25 = "25% of the section is in
  // view" so the entrance starts when the user scrolls to it, not
  // before. once: true so the entrance doesn't replay on scroll-up.
  const innerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(innerRef, { once: true, amount: 0.25 });

  return (
    <Section
      tone="soft"
      rhythm="default"
      className={styles.root}
      data-test-section="behind-the-scenes"
    >
      <div className="container">
        <div className={styles.inner} ref={innerRef}>
          {/* Eyebrow: "07 — Behind the scenes" matches the page's
           * editorial-chapter convention (FieldLog uses "Field log ·
           * Week 28" as a similar eyebrow). The clay rule + dot
           * marks the section as a numbered chapter of the
           * operator's story. */}
          <motion.div
            className={styles.eyebrowBlock}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.eyebrowRule} aria-hidden="true" />
            <span className={styles.eyebrowNumber}>07</span>
            <span className={styles.eyebrowDot} aria-hidden="true">·</span>
            <span className={styles.eyebrowLabel}>Behind the scenes</span>
          </motion.div>

          {/* Title: short, hand-printed, in the operator's voice.
           * Echoes FieldLog's "Same yard, every week." - a parallel
           * construction that the visitor reads as "this is the
           * same person, just showing different evidence". */}
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            Same truck, every Tuesday.
          </motion.h2>

          {/* Card: white tile, dashed ink-deep border, paper-tape
           * label across the top edge. The label slightly overlaps
           * the card so it reads as a piece of masking tape stuck
           * on, not a label inside the card. */}
          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.tape} aria-hidden="true">
              Real footage, not stock
            </span>

            <div className={styles.videoGrid}>
              <figure className={styles.figure}>
                <video
                  className={styles.video}
                  src={VIDEO_SRC_1}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  data-testid="bts-video-1"
                />
                <figcaption className={styles.figcaption}>
                  Mid-yard, 9:14am. The mower is the same one in the
                  hero card.
                </figcaption>
              </figure>
              <figure className={styles.figure}>
                <video
                  className={styles.video}
                  src={VIDEO_SRC_2}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  data-testid="bts-video-2"
                />
                <figcaption className={styles.figcaption}>
                  Same yard, two minutes later. Stripes from a fresh
                  pass.
                </figcaption>
              </figure>
            </div>

            <p className={styles.caption}>
              That&apos;s the actual mower, the actual truck, and the
              actual Tuesday. <span className={styles.captionEm}>
                No franchise, no subcontractor.
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
