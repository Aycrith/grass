/**
 * SectionDivider — D-0013 painted storybook section break.
 *
 * Renders the hand-painted gouache wavy-line ornament
 * (`/illustrations/divider-v3-1200.webp` and its 2× sibling) as a
 * centered "chapter break" between major sections of a page.
 *
 * Used on the home page to tie the painted storybook sections
 * together — the same home page has painted ranch house in the
 * hero, painted service webps in ServiceBento, painted Pinellas
 * map, painted quote mark, and a painted wordmark lockup. Without
 * the divider, light-to-light section transitions only get a color
 * change; with it, every transition reads as a storybook chapter
 * break.
 *
 * The painted line is in sun-gold (#E8B65A) with a small grass
 * tuft in the center as a brand mark. The webp is transparent-
 * background (cream chroma-keyed at SDXL output) so it sits
 * cleanly on any sand-bleached section.
 *
 * Decorative: `aria-hidden="true"`. Section boundaries are
 * already conveyed by the next section's eyebrow + heading.
 *
 * Sizing: rendered at full container width on mobile (≤768px),
 * capped at 720px wide on larger viewports. The 2× webp is
 * served to displays with `devicePixelRatio >= 2` via the
 * `srcSet`. Painted line has no fine detail so a 1.5–2× upscale
 * by the browser is imperceptible.
 */
import Image from 'next/image';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

import styles from './SectionDivider.module.css';

interface SectionDividerProps {
  className?: string | undefined;
}

export function SectionDivider({ className }: SectionDividerProps): ReactNode {
  return (
    <div className={cn(styles.root, className)} aria-hidden="true">
      <Image
        src="/illustrations/divider-v3-1200.webp"
        alt=""
        width={1200}
        height={163}
        sizes="(max-width: 768px) 100vw, 720px"
        loading="lazy"
        decoding="async"
        className={styles.image}
      />
    </div>
  );
}
