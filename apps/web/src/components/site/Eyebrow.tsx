/**
 * Eyebrow — tracked label.
 *
 * Convention: eyebrow texts look like "01 — Services" or "02 —
 * Areas". Renders an optional leading dot, the text, and stays
 * uppercase + tracked + clay-colored (or sand-colored on dark
 * backgrounds via `tone="dark"`).
 */

import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

import styles from './Eyebrow.module.css';

interface EyebrowProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  /** Show a small clay dot before the label. */
  dot?: boolean;
  /** Force sand color when the section uses a dark background. */
  tone?: 'default' | 'dark';
  size?: 'default' | 'lg';
  className?: string | undefined;
}

export function Eyebrow({
  children,
  dot = false,
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
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
