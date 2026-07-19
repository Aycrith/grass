/**
 * ProcessStepIcon — small inline SVG glyphs for the three
 * ProcessSteps cards. Decorative-only (aria-hidden); the visible
 * step number and title carry the meaning.
 *
 * One component, three cases by `step` ("01" | "02" | "03").
 * Sized 28×28, fills via `currentColor` so the surrounding step
 * palette drives the tint.
 *
 * Authored by hand. Brand-tinted abstract icons — no invented
 * customer-facing copy.
 */

import type { ReactNode } from 'react';

export type ProcessStepKey = '01' | '02' | '03';

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
      // Coverage — map pin / location marker.
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, parent step provides semantics
        <svg {...COMMON} className={className}>
          <path d="M14 3a7 7 0 0 0-7 7c0 5 7 11 7 11s7-6 7-11a7 7 0 0 0-7-7z" />
          <circle cx="14" cy="10" r="2.5" fill="currentColor" stroke="none" opacity="0.85" />
        </svg>
      );

    case '02':
      // Quote — clipboard / document with checkmark.
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, parent step provides semantics
        <svg {...COMMON} className={className}>
          <path d="M7 4h14v20H7z" />
          <path d="M4 8h20" />
          <path d="M11 2v4M17 2v4" />
          <path d="M11 14.5l2.5 2.5L17 13" />
        </svg>
      );

    case '03':
      // Relax / mow — simplified mower silhouette.
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

    default: {
      // Exhaustiveness guard for ProcessStepKey.
      const _exhaustive: never = step;
      return _exhaustive;
    }
  }
}
