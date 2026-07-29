/**
 * Eyebrow — tracked label.
 *
 * Convention: eyebrow texts look like "01 — Services" or "02 —
 * Areas". Stays uppercase + tracked + clay-colored (or sand-colored
 * on dark backgrounds via `tone="dark"`).
 *
 * D-0016 / 2026-07-25: the legacy `dot` prop and the `size`
 * variant were removed. Neither had any live callers (verified
 * with rg across apps/web/src). Eyebrow text alone reads
 * cleanly at the default size — the decorative dot was
 * flagged as a Pre-Flight anti-slop tell (skill §9.F), and
 * the lg size variant was a leftover from an earlier
 * section-number exploration that consolidated onto a
 * single tracked-label scale.
 */

import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

import styles from './Eyebrow.module.css';

interface EyebrowProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  /** Force sand color when the section uses a dark background. */
  tone?: 'default' | 'dark' | undefined;
  className?: string | undefined;
}

export function Eyebrow({
  children,
  tone = 'default',
  className,
  ...rest
}: EyebrowProps) {
  return (
    <span
      className={cn(
        styles.root,
        tone === 'dark' && styles.dark,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
