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
import { processSteps, services } from '@/lib/content';

import { ProcessStepIcon, type ProcessStepKey } from './ProcessStepIcon';
import styles from './ProcessSteps.module.css';

interface ProcessStepsProps {
  className?: string;
}

export function ProcessSteps({ className }: ProcessStepsProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <header className={styles.header}>
          <div className={styles.headerText}>
            <Eyebrow tone="default" dot className={styles.headerEyebrow}>
              05 — How it works
            </Eyebrow>
            <h2 className={styles.headerHeading}>Four steps, no portal.</h2>
          </div>
          <div className={styles.headerMedia}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={services.mowing.imageSlot}
              alt=""
              loading="lazy"
              decoding="async"
              width={180}
              height={101}
            />
          </div>
        </header>

        <StaggerGroup as="div" className={styles.grid} childDelay={0.12}>
          {processSteps.map((step) => (
            <article key={step.n} className={styles.step}>
              <ProcessStepIcon step={step.n as ProcessStepKey} className={styles.icon} />
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
