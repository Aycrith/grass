/**
 * Illustration — wrapper for hand-authored SVG illustrations in
 * `apps/web/public/illustrations/`. Provides consistent sizing and
 * alt text defaulting to empty (decorative).
 *
 * Sized via `width` / `height` (px) — defaults to 600×400 (matches the
 * 600×400 viewBox of all illustrations in the kit). Aspect ratio is
 * preserved when only one dimension is provided.
 *
 * Usage:
 *   <Illustration src="/illustrations/mower-side-profile.svg" />
 *   <Illustration src="/illustrations/pinellas-palm.svg" height={240} />
 *
 * Accessibility: SVGs in the illustration kit ship with role="img" +
 * aria-label baked into the asset itself. To force a custom label,
 * pass `alt`; to mark the illustration decorative (skip SR), pass
 * `alt=""`.
 *
 * 2026-07-25: removed the `tone?: 'default' | 'dark'` prop. It had
 * no live callers (verified with rg) — the only existing usage is
 * on the not-found 404 page, which uses the default (light) tone.
 * If a future surface needs a luminosity lift on dark backgrounds,
 * add a per-call className with the appropriate CSS rather than
 * reaching for a binary tone prop.
 */

import { cn } from '@/lib/cn';

import styles from './Illustration.module.css';

interface IllustrationProps {
  /** Path under /public, e.g. "/illustrations/mower-side-profile.svg". */
  src: string;
  /** Width in px (HTML attribute — intrinsic size for layout pre-paint). Defaults to 600. */
  width?: number | undefined;
  /** Height in px (HTML attribute — intrinsic size for layout pre-paint). Defaults to 400. */
  height?: number | undefined;
  /** Override accessible label. Pass "" for purely decorative. */
  alt?: string | undefined;
  /** Optional additional className. */
  className?: string | undefined;
}

export function Illustration({
  src,
  width = 600,
  height = 400,
  alt,
  className,
}: IllustrationProps) {
  // WP34 — removed the inline `style={{ width, height }}` so CSS class
  // sizing (e.g., `.mower { width: 38%; }`) is honored. Before this fix,
  // the inline style silently overrode every consumer's responsive CSS
  // (e.g., `clamp(56px, 7vw, 72px)` in OperatorStrip, `width: 100%` in
  // ScheduleTimeline's todayMower). The HTML width/height attributes still
  // declare the intrinsic dimensions for layout pre-paint and aspect-ratio
  // fallback when no CSS class overrides.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ''}
      width={width}
      height={height}
      className={cn(styles.illustration, className)}
      loading="lazy"
      decoding="async"
    />
  );
}
