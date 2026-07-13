/**
 * Illustration — wrapper for hand-authored SVG illustrations in
 * `apps/web/public/illustrations/`. Provides consistent sizing, alt
 * text defaulting to empty (decorative), and a `tone` switch for
 * dark backgrounds.
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
 */

import { cn } from '@/lib/cn';

import styles from './Illustration.module.css';

export type IllustrationTone = 'default' | 'dark';

interface IllustrationProps {
  /** Path under /public, e.g. "/illustrations/mower-side-profile.svg". */
  src: string;
  /** Width in px. Defaults to 600. */
  width?: number;
  /** Height in px. Defaults to 400. */
  height?: number;
  /** Override accessible label. Pass "" for purely decorative. */
  alt?: string;
  /** Tone switch for dark backgrounds. */
  tone?: IllustrationTone;
  /** Optional additional className. */
  className?: string;
}

export function Illustration({
  src,
  width = 600,
  height = 400,
  alt,
  tone = 'default',
  className,
}: IllustrationProps) {
  return (
    <img
      src={src}
      alt={alt ?? ''}
      width={width}
      height={height}
      className={cn(styles.illustration, styles[tone], className)}
      style={{ width, height }}
      loading="lazy"
      decoding="async"
    />
  );
}
