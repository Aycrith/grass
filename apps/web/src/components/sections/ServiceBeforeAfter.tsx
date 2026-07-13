/**
 * ServiceBeforeAfter — scroll-driven scrub reveal on each
 * `/services/[slug]` page.
 *
 * Mounted between ServiceIncludes and ServiceFAQ. Reads
 * `lib/content.ts → services[slug].beforeAfter`. If absent, the
 * section collapses to nothing (no placeholder) — keeps pages
 * clean until steward seeds real pairs.
 *
 * Mechanic (PinnedSection + clipPath):
 *   - PinnedSection pins the frame for ~2 viewport-heights of
 *     scroll.
 *   - Two stacked images (before / after). The "after" image is
 *     revealed via a vertical clip-path wipe whose progress is
 *     driven by the section's scroll progress (0% → 100%).
 *   - Caption above ("Same yard, four weeks apart.") italic
 *     Fraunces; attribution below ("Operator's first month in
 *     33771.") in Inter caption.
 *
 * Synthetic v1 (per WP10 plan): the steward can ship the section
 * today by reusing `imageSlot` for the "before" image and applying
 * a `filter: saturate(1.15) brightness(1.05) contrast(0.95)` to
 * the "after" image — i.e. same source, slightly punched up. When
 * real before/after webps land (ComfyUI batch from WP11), swap
 * `beforeAfter.beforeSrc` / `beforeAfter.afterSrc` and the
 * treatment overlay goes away.
 *
 * Reduced-motion: collapses to a static side-by-side compare grid
 * (no scrubbing, no scroll pinning).
 */

'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { type ReactNode, useRef } from 'react';

import { Eyebrow, Section } from '@/components/site';
import { cn } from '@/lib/cn';

import styles from './ServiceBeforeAfter.module.css';

interface BeforeAfterCopy {
  caption: string;
  attribution: string;
  /** Synthetic v1: same src reused; real v1: distinct webps. */
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}

interface ServiceBeforeAfterProps {
  copy: BeforeAfterCopy | undefined;
  className?: string | undefined;
}

export function ServiceBeforeAfter({ copy, className }: ServiceBeforeAfterProps): ReactNode | null {
  const reduced = useReducedMotion();

  if (!copy) {
    // No before/after copy registered yet — silently skip rather
    // than render an empty section.
    return null;
  }

  if (reduced) {
    return (
      <Section
        rhythm="loose"
        tone="default"
        className={cn(styles.root, styles.staticRoot, className)}
      >
        <div className="container">
          <Eyebrow tone="default" dot className={styles.eyebrow}>
            Before &amp; after
          </Eyebrow>
          <p className={styles.caption}>{copy.caption}</p>
          <div className={styles.staticGrid}>
            <figure className={styles.staticFigure}>
              <Image
                src={copy.beforeSrc}
                alt={copy.beforeAlt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className={styles.staticImage}
                loading="lazy"
                decoding="async"
              />
              <figcaption className={styles.staticLabel}>Before</figcaption>
            </figure>
            <figure className={styles.staticFigure}>
              <Image
                src={copy.afterSrc}
                alt={copy.afterAlt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className={styles.staticImage}
                loading="lazy"
                decoding="async"
              />
              <figcaption className={styles.staticLabel}>After</figcaption>
            </figure>
          </div>
          <p className={styles.attribution}>{copy.attribution}</p>
        </div>
      </Section>
    );
  }

  return (
    <Section rhythm="loose" tone="default" className={cn(styles.root, className)}>
      <div className="container">
        <Eyebrow tone="default" dot className={styles.eyebrow}>
          Before &amp; after
        </Eyebrow>
        <p className={styles.caption}>{copy.caption}</p>
      </div>

      <PinnedBeforeAfter
        beforeSrc={copy.beforeSrc}
        afterSrc={copy.afterSrc}
        beforeAlt={copy.beforeAlt}
        afterAlt={copy.afterAlt}
      />

      <div className="container">
        <p className={styles.attribution}>{copy.attribution}</p>
      </div>
    </Section>
  );
}

interface PinnedBeforeAfterProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}

function PinnedBeforeAfter({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
}: PinnedBeforeAfterProps): ReactNode {
  // The outer wrapper is tall (2× viewport) so the inner pinned
  // frame has room to scrub while the user scrolls.
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Reveal progresses from 0% (fully before) at the start of the
  // outer wrapper to 100% (fully after) by its end.
  const reveal = useTransform(scrollYProgress, [0.15, 0.85], [0, 100]);
  const clipRight = useTransform(reveal, (v) => `${100 - v}%`);
  const dividerLeft = useTransform(reveal, (v) => `${v}%`);

  return (
    <div ref={ref} className={styles.frame}>
      <div className={styles.stage}>
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          sizes="100vw"
          className={styles.image}
          loading="lazy"
          decoding="async"
        />
        <motion.div
          className={styles.afterWrap}
          style={{ clipPath: useTransform(clipRight, (v) => `inset(0 ${v} 0 0)`) }}
          aria-hidden="true"
        >
          <Image
            src={afterSrc}
            alt=""
            fill
            sizes="100vw"
            className={cn(styles.image, styles.imageAfter)}
            loading="lazy"
            decoding="async"
          />
        </motion.div>
        <motion.div className={styles.divider} style={{ left: dividerLeft }} aria-hidden="true" />
        {/* Visually hidden but readable — describes the after-state
         * for screen-reader users who can't see the scrub. */}
        <span className={styles.srOnly}>{afterAlt}</span>
      </div>
    </div>
  );
}
