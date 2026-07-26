/**
 * Eyebrow — tracked label.
 *
 * Convention: eyebrow texts look like "01 — Services" or "02 —
 * Areas". Stays uppercase + tracked + clay-colored (or sand-colored
 * on dark backgrounds via `tone="dark"`).
 *
 * D-0016 / 2026-07-25: the legacy `dot` prop was removed. It was
 * used by a Pre-Flight draft to render a small clay dot before
 * the label, but the dot was flagged as an anti-slop tell (skill
 * §9.F) — eyebrow text alone reads cleanly. The prop had no live
 * callers (verified with rg), so this is a pure cut.
 */

import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

import styles from './Eyebrow.module.css';

interface EyebrowProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  /** Force sand color when the section uses a dark background. */
  tone?: 'default' | 'dark' | undefined;
  size?: 'default' | 'lg' | undefined;
  className?: string | undefined;
}

export function Eyebrow({
  children,
  tone = 'default',
  size = 'default',
  className,
  ...rest
}: EyebrowProps) {
  return (
    <span
      className={cn(
        styles.root,
        tone === 'dark' && styles.dark,
        size === 'lg' && styles.lg,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
