/**
 * ServiceBentoIcon — six hand-authored SVG glyphs for the
 * ServiceBento cards, one per ServiceKey. Decorative-only
 * (aria-hidden); the visible card title carries the meaning.
 *
 * D-0021 upgrade: bumped from 28x28 / 1.6px stroke to 40x40 /
 * 2px stroke. The bigger viewBox + heavier line weight reads as
 * hand-painted at the new 40px display size. Each icon got more
 * intentional detail (wheel circles, hedge trim lines, leaf shapes)
 * and slight asymmetric line angles so the marks feel hand-drawn,
 * not iconographic.
 *
 * One component, switch on `ServiceKey`. Sized 40x40 in the
 * design viewBox, but the consuming component sizes the rendered
 * SVG via CSS (28-40px depending on card context). Fills via
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
  width: 40,
  height: 40,
  viewBox: '0 0 40 40',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function ServiceBentoIcon({ service, className }: ServiceBentoIconProps): ReactNode {
  switch (service) {
    case 'mowing':
      // Side-profile push mower: deck + two wheels + handle + grass below.
      // Hand-drawn feel comes from the slightly-tilted handle and the
      // asymmetric deck (front edge is shorter than the back).
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, card title provides semantics
        <svg {...COMMON} className={className}>
          {/* mower deck — trapezoid, wider in the back */}
          <path d="M8 24 L33 22 L36 28 L8 30 Z" />
          {/* engine bump on top of deck */}
          <path d="M14 22 L14 18 L22 18 L22 22" />
          {/* handle — angles up to the right */}
          <path d="M28 22 L34 8" />
          {/* handle grip bar */}
          <path d="M30 9 L36 7" />
          {/* front wheel */}
          <circle cx="12" cy="32" r="2.5" />
          {/* back wheel */}
          <circle cx="30" cy="32" r="2.5" />
          {/* grass tufts below the mower */}
          <path d="M6 36 L8 33" />
          <path d="M18 37 L20 34" />
          <path d="M32 37 L34 34" />
        </svg>
      );

    case 'edging':
      // An L-shape showing where lawn meets concrete, with a fresh
      // vertical cut-line on the left and a scalloped grass edge
      // on the right. Reads as "I cut a clean line here."
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, card title provides semantics
        <svg {...COMMON} className={className}>
          {/* the fresh cut — vertical line on the left */}
          <path d="M14 5 L14 35" strokeWidth="2.2" />
          {/* ground line at the bottom */}
          <path d="M5 36 L35 36" strokeWidth="1.6" opacity="0.55" />
          {/* scalloped grass edge to the right of the cut */}
          <path d="M14 8 c3 2 4 4 4 7 s-2 5 -4 7 c3 2 4 4 4 7 s-2 5 -4 7" />
          {/* a few grass ticks for texture */}
          <path d="M22 14 L24 12" opacity="0.6" />
          <path d="M22 22 L24 20" opacity="0.6" />
          <path d="M22 30 L24 28" opacity="0.6" />
        </svg>
      );

    case 'mulching':
      // A pile of mulch with a few leaves resting on top, a
      // base line, and texture marks inside the pile suggesting
      // shredded bark. Reads as "we laid new mulch here."
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, card title provides semantics
        <svg {...COMMON} className={className}>
          {/* mulch pile — mound shape */}
          <path d="M4 32 c0 -8 7 -14 16 -14 s16 6 16 14" />
          {/* ground line */}
          <path d="M3 34 L37 34" strokeWidth="1.6" />
          {/* texture marks inside the pile */}
          <path d="M10 30 L12 28" strokeWidth="1.5" opacity="0.55" />
          <path d="M16 30 L18 28" strokeWidth="1.5" opacity="0.55" />
          <path d="M22 30 L24 28" strokeWidth="1.5" opacity="0.55" />
          <path d="M28 30 L30 28" strokeWidth="1.5" opacity="0.55" />
          {/* two leaves resting on top — small oval + stem */}
          <path d="M14 18 c0 -2 2 -3 4 -3 c0 2 -2 3 -4 3 z" fill="currentColor" fillOpacity="0.2" />
          <path d="M14 18 L17 15" strokeWidth="1.5" />
          <path d="M24 16 c0 -2 2 -3 4 -3 c0 2 -2 3 -4 3 z" fill="currentColor" fillOpacity="0.2" />
          <path d="M24 16 L27 13" strokeWidth="1.5" />
        </svg>
      );

    case 'hedge-trimming':
      // A trimmed hedge seen from the side: rounded-top rectangle
      // with horizontal lines suggesting the clean trimmed face.
      // The classic "hedge" silhouette.
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, card title provides semantics
        <svg {...COMMON} className={className}>
          {/* hedge body — flat bottom, rounded top */}
          <path d="M5 33 L5 18 c0 -7 7 -12 15 -12 s15 5 15 12 L35 33 Z" />
          {/* horizontal trim lines on the face */}
          <path d="M8 22 L32 22" strokeWidth="1.4" opacity="0.6" />
          <path d="M7 27 L33 27" strokeWidth="1.4" opacity="0.6" />
          <path d="M7 31 L33 31" strokeWidth="1.4" opacity="0.6" />
          {/* ground line */}
          <path d="M3 35 L37 35" strokeWidth="1.6" opacity="0.5" />
          {/* a couple of leaf tufts poking up above the trimmed top */}
          <path d="M14 8 L13 4" strokeWidth="1.6" />
          <path d="M22 7 L23 3" strokeWidth="1.6" />
          <path d="M28 8 L29 5" strokeWidth="1.6" />
        </svg>
      );

    case 'hurricane-prep':
      // A hurricane spiral on top, a small palm below. Two
      // distinct visual signals that together say "Florida
      // storm prep."
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, card title provides semantics
        <svg {...COMMON} className={className}>
          {/* hurricane spiral — winds inward */}
          <path d="M5 12 c2 -4 6 -7 11 -7 c6 0 10 3 10 7 c0 3 -3 5 -6 5 c-2 0 -4 -1 -4 -3 c0 -1 1 -2 3 -2" />
          {/* wind streaks extending out */}
          <path d="M2 8 L7 9" strokeWidth="1.5" opacity="0.55" />
          <path d="M3 15 L8 14" strokeWidth="1.5" opacity="0.55" />
          {/* small palm below — curved trunk */}
          <path d="M20 19 L19 32" />
          {/* three fronds */}
          <path d="M19 19 c-3 -2 -5 -3 -7 -3" />
          <path d="M19 19 c3 -2 5 -3 7 -3" />
          <path d="M19 19 L19 14" />
          {/* ground */}
          <path d="M14 34 L26 34" strokeWidth="1.6" opacity="0.5" />
        </svg>
      );

    case 'seasonal-cleanup':
      // A rake with a few leaves being gathered. The rake is
      // the operator's tool; the leaves are the autumn debris.
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, card title provides semantics
        <svg {...COMMON} className={className}>
          {/* rake handle — long angled line */}
          <path d="M8 5 L30 27" strokeWidth="2.2" />
          {/* rake head — short horizontal bar at the bottom of the handle */}
          <path d="M27 24 L36 33" strokeWidth="2.2" />
          {/* rake tines — short downward strokes from the head */}
          <path d="M28 26 L28 30" strokeWidth="1.5" />
          <path d="M31 29 L31 33" strokeWidth="1.5" />
          <path d="M34 32 L34 36" strokeWidth="1.5" />
          {/* three leaves being raked up */}
          <path d="M10 32 c0 -3 3 -5 6 -5 c0 3 -3 5 -6 5 z" fill="currentColor" fillOpacity="0.2" />
          <path d="M10 32 L13 29" strokeWidth="1.4" />
          <path d="M4 36 c0 -2 2 -4 5 -4 c0 2 -2 4 -5 4 z" fill="currentColor" fillOpacity="0.2" />
          <path d="M4 36 L7 33" strokeWidth="1.4" />
        </svg>
      );

    default: {
      // Exhaustiveness guard for ServiceKey.
      const _exhaustive: never = service;
      return _exhaustive;
    }
  }
}
