/**
 * EmptyState — graceful fallback when content is missing.
 *
 * Per the PRD (`04-motion-and-microinteractions.md` anti-patterns):
 * never show invented content. When a section has nothing to render
 * (no proof yet, no customer before/after photos, no reviews, an
 * empty FAQ), this component provides an honest illustration +
 * "coming soon" label instead of a deceptive empty box.
 *
 * Variants:
 *  - "yard"     — hand-drawn grass + sun, generic content-not-yet.
 *  - "hose"     — hose curl forming a question mark, FAQ empty.
 *  - "before-after" — side-by-side placeholder for /services/mowing.
 *
 * Illustrations live in /public/illustrations/*.svg. Real photos
 * replace them 1:1 by file path; nothing in this component changes.
 */

import { cn } from '@/lib/cn';

import styles from './EmptyState.module.css';

export type EmptyStateVariant = 'yard' | 'hose' | 'before-after';

const SRC: Record<
  EmptyStateVariant,
  { src: string; width: number; height: number; label: string }
> = {
  yard: {
    src: '/illustrations/empty-state-yard.svg',
    width: 600,
    height: 400,
    label: 'Coming soon — real content on the way.',
  },
  hose: {
    src: '/illustrations/empty-state-hose.svg',
    width: 400,
    height: 400,
    label: 'No answers yet — steward adding common questions this week.',
  },
  'before-after': {
    src: '/illustrations/empty-state-before-after.svg',
    width: 1200,
    height: 600,
    label: 'Real before/after photos coming — steward shoots operator’s own yard first.',
  },
};

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  /** Optional headline to override the default label. */
  message?: string | undefined;
  className?: string | undefined;
}

export function EmptyState({
  variant = 'yard',
  message,
  className,
}: EmptyStateProps): React.ReactNode {
  const entry = SRC[variant];
  return (
    <figure className={cn(styles.root, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={entry.src}
        alt=""
        width={entry.width}
        height={entry.height}
        className={styles.image}
        loading="lazy"
        decoding="async"
      />
      <figcaption className={styles.caption}>{message ?? entry.label}</figcaption>
    </figure>
  );
}
