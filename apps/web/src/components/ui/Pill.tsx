/**
 * Pill — tiny chip / badge.
 *
 * Tones:  neutral | accent | sage | dark | outline | danger
 * Sizes:  sm | md | lg
 * Used for ZIP markers, status labels, and small metadata rows.
 * Not for CTAs — use <Button> for that.
 */

import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/cn';

import styles from './Pill.module.css';

export type PillTone = 'neutral' | 'accent' | 'sage' | 'dark' | 'outline' | 'danger';
export type PillSize = 'sm' | 'md' | 'lg';

interface PillProps extends ComponentPropsWithoutRef<'span'> {
  tone?: PillTone;
  size?: PillSize;
  className?: string;
  children: ReactNode;
}

const sizeClass: Record<PillSize, string> = {
  sm: styles.sm ?? '',
  md: styles.md ?? '',
  lg: styles.lg ?? '',
};

export function Pill({ tone = 'neutral', size = 'md', className, children, ...rest }: PillProps) {
  return (
    <span className={cn(styles.root, styles[tone], sizeClass[size], className)} {...rest}>
      {children}
    </span>
  );
}
