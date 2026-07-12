/**
 * LogoMark — Mission 1
 *
 * Renders the brand mark from /public/logo-mark.svg with an inline
 * fallback so the component works without the asset present (e.g.
 * for tests, or while the asset is regenerating).
 *
 * Sized via the `size` prop (px) — defaults to 32. Color follows
 * currentColor so the mark inherits its parent's text color (CSS
 * `color` on the wrapper).
 */

import { cn } from '@/lib/cn';

import styles from './LogoMark.module.css';

interface LogoMarkProps {
  size?: number;
  className?: string;
  /** Override the asset path. Defaults to /logo-mark.svg. */
  src?: string;
  title?: string;
}

export function LogoMark({
  size = 32,
  className,
  src = '/logo-mark.svg',
  title = 'Largo Lawn',
}: LogoMarkProps) {
  return (
    <img
      src={src}
      alt={title}
      width={size}
      height={size}
      className={cn(styles.mark, className)}
      style={{ width: size, height: size }}
    />
  );
}
