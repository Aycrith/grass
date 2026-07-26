/**
 * LogoMark — Mission 1
 *
 * Renders the brand mark. Default is the v3 painted storybook mark
 * (apps/web/public/illustrations/logo-mark-v3-{32,64,128}.webp) with
 * a srcSet so hi-DPR displays pick up the larger source.
 *
 * For the line-art SVG fallback (e.g. GBP asset generation, line-art
 * variants, or environments that can't load webp), pass
 * `variant="line"`.
 *
 * Sized via the `size` prop (px) — defaults to 32.
 *
 * WP34 follow-up: removed the inline `style={{ width, height }}` so
 * consumer-provided `className` can override the rendered size
 * (e.g. `className={styles.brandMark}` in SiteHeader.module.css
 * already declares `width: 32px; height: 32px`). The HTML
 * width/height attributes still declare the intrinsic dimensions
 * for layout pre-paint and aspect-ratio fallback. Same fix as
 * Illustration.tsx.
 */

import { cn } from '@/lib/cn';

import styles from './LogoMark.module.css';

interface LogoMarkProps {
  size?: number | undefined;
  className?: string | undefined;
  /** Override the asset path. Defaults to v3 painted webp. */
  src?: string | undefined;
  /** Mark style. "painted" uses the v3 webp; "line" uses the SVG. */
  variant?: 'painted' | 'line' | undefined;
  title?: string | undefined;
}

const PAINTED_SRC = '/illustrations/logo-mark-v3-64.webp';
const PAINTED_SRCSET = [
  '/illustrations/logo-mark-v3-32.webp 32w',
  '/illustrations/logo-mark-v3-64.webp 64w',
  '/illustrations/logo-mark-v3-128.webp 128w',
  '/illustrations/logo-mark-v3-256.webp 256w',
].join(', ');

export function LogoMark({
  size = 32,
  className,
  src,
  variant = 'painted',
  title = 'Largo Lawn',
}: LogoMarkProps) {
  const resolvedSrc = src ?? (variant === 'painted' ? PAINTED_SRC : '/logo-mark.svg');
  const isPainted = variant === 'painted' && !src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={title ?? 'Largo Lawn'}
      width={size}
      height={size}
      className={cn(styles.mark, className)}
      {...(isPainted ? { srcSet: PAINTED_SRCSET, sizes: `${size}px` } : {})}
    />
  );
}
