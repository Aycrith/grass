'use client';

/**
 * ProcessSteps — three numbered steps describing how a quote turns
 * into a clean yard.
 *
 * Reads `lib/content.ts → processSteps`. The horizontal connector
 * line is implemented in CSS (`.grid::before`) and only shows on
 * ≥900px.
 *
 * D-0030 (Wave C of three sequential design changes) — visual
 * system hygiene pass:
 *   - Header decorative image removed. The old layout had a small
 *     180×101 image of the mowing card sitting in the header,
 *     reusing `services.mowing.imageSlot` to "tie this section
 *     visually back to the bento above." Per the ornament cap
 *     (≤1 major illustration per fold), this section already
 *     has 3 step icons — adding a 4th illustration in the header
 *     was over-decorating. Header is now heading-only.
 *   - StaggerGroup wrapper removed (below-fold = static per
 *     D-0030 motion gating). Steps render flat on first paint.
 */

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { type ReactNode, useRef } from 'react';

import { Section } from '@/components/site';
import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';
import { processSteps } from '@/lib/content';

import { ProcessStepIcon, type ProcessStepKey } from './ProcessStepIcon';
import styles from './ProcessSteps.module.css';

interface ProcessStepsProps {
  className?: string;
}

export function ProcessSteps({ className }: ProcessStepsProps): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();

  return (
    <Section rhythm="loose" className={cn(styles.root, className)} data-test-section="process-steps">
      <div className="container">
        <header className={styles.header}>
          <h2 className={styles.headerHeading}>{processSteps.heading}</h2>
        </header>

        <div ref={ref} className={styles.grid}>
          <motion.span
            className={styles.connector}
            initial={{ scaleX: reduced ? 1 : 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: reduced ? 1 : 0 }}
            transition={{ duration: reduced ? 0.01 : 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'left center' }}
            aria-hidden="true"
          />
          {processSteps.steps.map((step, i) => (
            <motion.article
              key={step.n}
              className={styles.step}
              initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: reduced ? 0.01 : 0.6,
                delay: reduced ? 0 : 0.15 + i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ProcessStepIcon step={step.n as ProcessStepKey} className={styles.icon} />
              <span className={styles.num}>{step.n}</span>
              <p className={styles.label}>{step.label}</p>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.body}>{step.body}</p>
              <Button as="link" href={step.cta.href} variant="outline" size="sm" className={styles.cta}>
                {step.cta.label}
                <span aria-hidden="true"> →</span>
              </Button>
            </motion.article>
          ))}
        </div>

        <div className={styles.sectionCta}>
          <Button
            as="link"
            href={processSteps.sectionCta.href}
            variant="sun"
            size="lg"
          >
            {processSteps.sectionCta.label}
            <span aria-hidden="true"> →</span>
          </Button>
        </div>
      </div>
    </Section>
  );
}
