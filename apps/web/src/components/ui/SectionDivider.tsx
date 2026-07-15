/**
 * SectionDivider — D-0018 hand-authored section divider.
 *
 * Renders a hand-authored SVG wavy-line ornament between major
 * sections of a page. SVG with intentional 4px stroke weight in
 * the 1200x80 viewBox stays crisp at any rendered size, and the
 * transparent background means the divider floats on any
 * sand-bleached section without chroma keying.
 *
 * This is the hand-authored replacement for D-0013 (which used
 * SDXL-painted webp ornaments that came out thin and muddy at
 * <200px rendered height). The skill flags hand-rolled decorative
 * SVGs as "strongly discouraged as default but acceptable when
 * single, simple geometric mark" — a wavy line with a center
 * dot is exactly that.
 *
 * Decorative (aria-hidden). The Section boundary is already
 * conveyed by the next section's heading.
 *
 * Sizing: rendered at full container width on mobile (<=768px),
 * capped at 720px wide on larger viewports.
 */
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

import styles from './SectionDivider.module.css';

interface SectionDividerProps {
  className?: string | undefined;
}

export function SectionDivider({ className }: SectionDividerProps): ReactNode {
  return (
    <div className={cn(styles.root, className)} aria-hidden="true">
      <svg
        className={styles.svg}
        viewBox="0 0 1200 80"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M 120 40 C 200 28, 280 28, 360 40 S 520 52, 600 40 S 760 28, 840 40 S 1000 52, 1080 40"
          className={styles.wave}
        />
        <circle cx="600" cy="40" r="4.5" className={styles.dot} />
        <circle cx="600" cy="40" r="9" className={styles.ring} />
      </svg>
    </div>
  );
}
