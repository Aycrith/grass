/**
 * ServiceAreaStats — "By the numbers" poster on `/`.
 *
 * Mounts between EditorialBreak (04.5) and ProcessSteps (05) as a
 * third typographic pause — no CTAs, just four numbers that earn
 * trust the way the operator talks (specific, not aspirational).
 *
 * Reads `lib/content.ts → areaStats`. Each stat is a
 * `{ value: string; label: string }` pair so the steward can decide
 * per-stat phrasing (e.g. "47" vs "47 yards" vs "47 yards weekly") at
 * the content layer without touching layout.
 *
 * Layout: 4-column grid on desktop, 2-column on mobile. Numbers in
 * clamp(3.5rem, 6vw, 5rem) Fraunces, label in Inter caption.
 *
 * WP15 — adds a subtle Pinellas palm SVG watermark behind the grid
 * (right side, 4% opacity, mix-blend-mode multiply). Anchors the
 * brand's Florida identity to the all-type section without competing
 * with the numbers.
 *
 * Reduced-motion: numbers still appear — this section has no
 * triggered animation, just a static fade-up via the parent
 * <Section> rhythm. The stagger from `StaggerGroup` is the only
 * motion and respects `useReducedMotion` already.
 */

import type { ReactNode } from 'react';

import { StaggerGroup } from '@/components/motion';
import { Section } from '@/components/site';
import { Illustration } from '@/components/ui';
import { cn } from '@/lib/cn';
import { areaStats } from '@/lib/content';

import styles from './ServiceAreaStats.module.css';

interface ServiceAreaStatsProps {
  className?: string | undefined;
}

export function ServiceAreaStats({ className }: ServiceAreaStatsProps): ReactNode {
  return (
    <Section
      rhythm="loose"
      tone="warm"
      className={cn(styles.root, className)}
      data-test-section="service-area-stats"
    >
      <Illustration
        src="/illustrations/pinellas-palm-v3-600x400.webp"
        alt=""
        width={600}
        height={400}
        className={styles.watermark}
      />
      <div className="container">
        <header className={styles.header}>
          <h2 className={styles.heading}>A small crew, by design.</h2>
          <p className={styles.lede}>
            Scale on a clipboard, not on a website — what the operator actually does, written down
            plain.
          </p>
        </header>

        <StaggerGroup as="div" className={styles.grid} childDelay={0.1}>
          {areaStats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <p className={styles.value}>{stat.value}</p>
              <p className={styles.label}>{stat.label}</p>
            </div>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
