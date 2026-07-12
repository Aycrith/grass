'use client';

/**
 * ProcessSteps — four numbered steps describing how a quote turns
 * into a clean yard.
 *
 * Reads `lib/content.ts → processSteps`. The horizontal connector
 * line is implemented in CSS (`.grid::before`) and only shows on
 * ≥900px. Steps fade-up stagger on enter.
 */

import type { ReactNode } from 'react';

import { StaggerGroup } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { cn } from '@/lib/cn';
import { processSteps } from '@/lib/content';

import styles from './ProcessSteps.module.css';

interface ProcessStepsProps {
  className?: string;
}

export function ProcessSteps({ className }: ProcessStepsProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <header className={styles.header}>
          <Eyebrow tone="default" dot className={styles.headerEyebrow}>
            05 — How it works
          </Eyebrow>
          <h2 className={styles.headerHeading}>Four steps, no portal.</h2>
        </header>

        <StaggerGroup as="div" className={styles.grid} childDelay={0.12}>
          {processSteps.map((step) => (
            <article key={step.n} className={styles.step}>
              <span className={styles.num}>{step.n}</span>
              <p className={styles.label}>{step.label}</p>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.body}>{step.body}</p>
            </article>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
