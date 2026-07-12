'use client';

/**
 * EditorialBreak — Mission 1 full-bleed image pause.
 *
 * Sits between PricingTiers (04) and ProcessSteps (05) as a
 * visual breath between two dense card sections. Single image,
 * one line of editorial copy, soft vignette, slight grain via
 * CSS filter.
 *
 * On mobile (≤768px) the image collapses entirely — the
 * section becomes a typographic-only moment on the sand-bleached
 * background, matching the OperatorNote visual weight but with a
 * different rhythm (no portrait, no quote attribution).
 *
 * Imagery is a proven keeper from `services.mowing.imageSlot`
 * (ComfyUI-generated against the storybook pipeline, 2026-07-12).
 *
 * Reduced-motion: no parallax. The image fades in once on first
 * scroll-into-view via FadeUp.
 */

import Image from 'next/image';
import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { cn } from '@/lib/cn';
import { editorialBreak } from '@/lib/content';

import styles from './EditorialBreak.module.css';

interface EditorialBreakProps {
  className?: string | undefined;
}

export function EditorialBreak({ className }: EditorialBreakProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className={styles.media} aria-hidden="true">
        <Image
          src={editorialBreak.imageSlot}
          alt=""
          fill
          sizes="100vw"
          className={styles.image}
          loading="lazy"
          decoding="async"
        />
        <div className={styles.vignette} />
        <div className={styles.grain} />
      </div>
      <div className={styles.copy}>
        <FadeUp>
          <Eyebrow tone="dark" dot className={styles.eyebrow}>
            {editorialBreak.eyebrow}
          </Eyebrow>
          <p className={styles.headline}>{editorialBreak.headline}</p>
        </FadeUp>
      </div>
    </Section>
  );
}
