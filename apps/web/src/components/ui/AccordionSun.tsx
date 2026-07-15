/**
 * AccordionSun — hand-drawn sun-burst toggle that replaces the
 * generic chevron in the <Accordion> primitive.
 *
 * D-0022: instead of a stock ChevronDown lucide icon, the toggle
 * is a hand-authored 4-ray sun-burst with a center dot. At rest
 * the rays point N/S/E/W (a "plus" shape); on open the icon
 * rotates 45° so the rays point NE/SE/SW/NW (an "X" shape) —
 * same UX state-change semantic as the chevron's 180° rotation,
 * but visually a hand-drawn mark instead of a stock glyph.
 *
 * 24x24 viewBox, 2px stroke, currentColor fill. The surrounding
 * `.trigger` controls the color via `color: var(--ll-clay)`.
 *
 * Decorative-only (aria-hidden) — the trigger text already
 * labels the action.
 */

import type { ReactNode } from 'react';

import styles from './AccordionSun.module.css';

interface AccordionSunProps {
  className?: string | undefined;
}

export function AccordionSun({ className }: AccordionSunProps): ReactNode {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, trigger text provides semantics
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? styles.sun}
    >
      {/* 4 rays at compass points — N, S, E, W */}
      <line x1="12" y1="3" x2="12" y2="7" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="3" y1="12" x2="7" y2="12" />
      <line x1="17" y1="12" x2="21" y2="12" />
      {/* 4 short diagonal rays — give the sun more presence */}
      <line x1="5.6" y1="5.6" x2="8.4" y2="8.4" strokeWidth="1.5" opacity="0.7" />
      <line x1="15.6" y1="15.6" x2="18.4" y2="18.4" strokeWidth="1.5" opacity="0.7" />
      <line x1="5.6" y1="18.4" x2="8.4" y2="15.6" strokeWidth="1.5" opacity="0.7" />
      <line x1="15.6" y1="8.4" x2="18.4" y2="5.6" strokeWidth="1.5" opacity="0.7" />
      {/* center sun */}
      <circle cx="12" cy="12" r="3.2" fill="currentColor" fillOpacity="0.18" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
