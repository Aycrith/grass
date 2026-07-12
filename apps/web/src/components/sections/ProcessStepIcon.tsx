/**
 * ProcessStepIcon — small inline SVG glyphs for the four
 * ProcessSteps cards. Decorative-only (aria-hidden); the visible
 * step number and title carry the meaning.
 *
 * One component, four cases by `step` ("01" | "02" | "03" | "04").
 * Sized 28×28, fills via `currentColor` so the surrounding step
 * palette drives the tint.
 *
 * Authored by hand. Brand-tinted abstract icons — no invented
 * customer-facing copy.
 */

import type { ReactNode } from 'react';

export type ProcessStepKey = '01' | '02' | '03' | '04';

interface ProcessStepIconProps {
  step: ProcessStepKey;
  className?: string | undefined;
}

const COMMON = {
  width: 28,
  height: 28,
  viewBox: '0 0 28 28',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function ProcessStepIcon({ step, className }: ProcessStepIconProps): ReactNode {
  switch (step) {
    case '01':
      // Quote — phone receiver + chat bubble.
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, parent step provides semantics
        <svg {...COMMON} className={className}>
          <path d="M5 8.5c0-1.5 1-2.5 2.5-2.5h2.2l1.3 4-2.2 1.4a13 13 0 0 0 6.8 6.8l1.4-2.2 4 1.3v2.2c0 1.5-1 2.5-2.5 2.5C10.6 22 5 16.4 5 8.5z" />
          <circle cx="22" cy="7" r="3.2" fill="currentColor" stroke="none" opacity="0.85" />
        </svg>
      );

    case '02':
      // Schedule — calendar with one marked day.
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, parent step provides semantics
        <svg {...COMMON} className={className}>
          <rect x="4" y="6.5" width="20" height="17" rx="2" />
          <path d="M4 11h20" />
          <path d="M9 4v5M19 4v5" />
          <rect
            x="13"
            y="14"
            width="5"
            height="5"
            rx="1"
            fill="currentColor"
            stroke="none"
            opacity="0.85"
          />
        </svg>
      );

    case '03':
      // Mow — simplified mower silhouette.
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, parent step provides semantics
        <svg {...COMMON} className={className}>
          <path d="M3 19h18" />
          <rect x="11" y="11" width="11" height="6" rx="1.2" />
          <path d="M11 14H7.5a2 2 0 0 1-2-2V9.5l3.5-1.5L11 11" />
          <circle cx="14.5" cy="20.2" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="19.5" cy="20.2" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      );

    case '04':
      // Bill — receipt with checkmark.
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, parent step provides semantics
        <svg {...COMMON} className={className}>
          <path d="M7 3h14v22l-3-2-3 2-3-2-3 2-3-2z" />
          <path d="M11 11h6M11 14h6" />
          <path d="M11 17.5l1.6 1.5L15.5 16" />
        </svg>
      );

    default: {
      // Exhaustiveness guard for ProcessStepKey.
      const _exhaustive: never = step;
      return _exhaustive;
    }
  }
}
