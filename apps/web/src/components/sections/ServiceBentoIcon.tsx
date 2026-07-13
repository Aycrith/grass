/**
 * ServiceBentoIcon — six small inline SVG glyphs for the
 * ServiceBento cards, one per ServiceKey. Decorative-only
 * (aria-hidden); the visible card title carries the meaning.
 *
 * One component, switch on `ServiceKey`. Sized 28×28, fills via
 * `currentColor` so the surrounding ServiceBento palette drives
 * the tint (clay at rest, sun on card hover — see
 * ServiceBento.module.css .icon).
 *
 * Mirrors the structure of `ProcessStepIcon.tsx` so the section
 * library has one consistent hand-authored icon pattern.
 */

import type { ReactNode } from 'react';

import type { ServiceKey } from '@/lib/content';

interface ServiceBentoIconProps {
  service: ServiceKey;
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

export function ServiceBentoIcon({ service, className }: ServiceBentoIconProps): ReactNode {
  switch (service) {
    case 'mowing':
      // Horizontal blade with two short grass ticks below
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, card title provides semantics
        <svg {...COMMON} className={className}>
          <path d="M3 13h22" />
          <path d="M6 13v-2M22 13v-2" />
          <path d="M8 17l1.5-2M14 17l1.5-2M20 17l1.5-2" />
          <circle cx="14" cy="22" r="1.4" fill="currentColor" stroke="none" opacity="0.85" />
        </svg>
      );

    case 'edging':
      // Vertical straight line + scallop wave — a clean cut beside curbing
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, card title provides semantics
        <svg {...COMMON} className={className}>
          <path d="M9 4v20" />
          <path d="M9 4c4 2 6 5 6 8s-2 6-6 8c4 2 6 5 6 8s-2 6-6 8" />
          <path d="M16 12h9" opacity="0.5" />
        </svg>
      );

    case 'mulching':
      // Three small rounded mound shapes
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, card title provides semantics
        <svg {...COMMON} className={className}>
          <path d="M5 20c0-3 2-5 4-5s4 2 4 5" />
          <path d="M11 20c0-4 3-7 6-7s6 3 6 7" />
          <path d="M3 22h22" strokeWidth="1.4" />
        </svg>
      );

    case 'hedge-trimming':
      // Rounded-top rectangle + horizontal cut lines suggesting trimmed faces
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, card title provides semantics
        <svg {...COMMON} className={className}>
          <path d="M4 12c0-4 4-7 10-7s10 3 10 7v9H4z" />
          <path d="M4 16h20M4 19h20" strokeWidth="1.2" opacity="0.7" />
        </svg>
      );

    case 'hurricane-prep':
      // Spiral wind + lightning accent dot
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, card title provides semantics
        <svg {...COMMON} className={className}>
          <path d="M5 14c2-5 6-8 10-8 5 0 8 3 8 6 0 2-2 4-4 4" />
          <path d="M9 19c1-2 3-3 5-3 3 0 5 1 5 3" opacity="0.7" />
          <circle cx="20" cy="22" r="1.6" fill="currentColor" stroke="none" opacity="0.85" />
        </svg>
      );

    case 'seasonal-cleanup':
      // Three leaves with stems — autumn/leaf-season visual
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, card title provides semantics
        <svg {...COMMON} className={className}>
          <path d="M8 22c0-5 4-9 9-9 0 5-4 9-9 9z" />
          <path d="M8 22l4-4" />
          <path d="M18 22c0-4 3-7 7-7 0 4-3 7-7 7z" />
          <path d="M18 22l3-3" opacity="0.7" />
          <path d="M13 23c0-3 2-5 5-5 0 3-2 5-5 5z" opacity="0.6" />
        </svg>
      );

    default: {
      // Exhaustiveness guard for ServiceKey.
      const _exhaustive: never = service;
      return _exhaustive;
    }
  }
}
