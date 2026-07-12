/**
 * Section — vertical rhythm + background variant.
 *
 * Wraps a `<Container>` (or any child) with consistent vertical
 * padding and an optional background tone. Pass an `id` to anchor
 * jumps from the nav, FAQ, table-of-contents, etc.
 *
 * `<Section eyebrow="01 — Services" eyebrowRule>` renders the
 * numbered-eyebrow + clay rule motif at the top of the section.
 */

import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

import styles from './Section.module.css';

export type SectionTone = 'default' | 'dark' | 'warm' | 'soft' | 'white';
export type SectionRhythm = 'default' | 'tight' | 'loose' | 'hero';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  rhythm?: SectionRhythm;
  /** Centered horizontal layout (default false = left-aligned). */
  center?: boolean;
  /** Render a clay divider above the section + numbered eyebrow. */
  eyebrowRule?: boolean;
  /** Optional id for anchor links. */
  id?: string;
}

const rhythmClass: Record<SectionRhythm, string> = {
  default: styles.root ?? '',
  tight: styles.tight ?? '',
  loose: styles.loose ?? '',
  hero: styles.hero ?? '',
};

const toneClass: Record<SectionTone, string> = {
  default: '',
  dark: styles.dark ?? '',
  warm: styles.warm ?? '',
  soft: styles.soft ?? '',
  white: styles.white ?? '',
};

export function Section({
  tone = 'default',
  rhythm = 'default',
  center = false,
  eyebrowRule = false,
  className,
  children,
  id,
  ...rest
}: SectionProps) {
  const cls = cn(
    rhythmClass[rhythm],
    toneClass[tone],
    center && 'text-center',
    eyebrowRule && styles.eyebrowRule,
    className,
  );

  return (
    <section id={id} className={cls} {...rest}>
      {children}
    </section>
  );
}
