'use client';

/**
 * ServiceFAQ — per-service FAQ accordion on `/services/[slug]`.
 *
 * 2–3 questions specific to one service (vs. the homepage
 * FAQAccordion which has 6 cross-cutting questions). Wraps the
 * design-system <Accordion> primitive (Radix-backed) so keyboard
 * a11y, focus rings, and reduced-motion paths stay consistent.
 *
 * Reads from `lib/content.ts → serviceDetail[slug].faqs`.
 */

import type { ReactNode } from 'react';

import { Eyebrow } from '@/components/site';
import { Accordion } from '@/components/ui';
import { cn } from '@/lib/cn';
import { type ServiceKey, serviceDetail } from '@/lib/content';

import styles from './ServiceFAQ.module.css';

interface ServiceFAQProps {
  slug: ServiceKey;
  className?: string | undefined;
}

export function ServiceFAQ({ slug, className }: ServiceFAQProps): ReactNode {
  const detail = serviceDetail[slug];
  const faqs = detail.faqs;
  return (
    <section className={cn(styles.root, className)}>
      <div className="container">
        <header className={styles.header}>
          <Eyebrow tone="default" dot className={styles.headerEyebrow}>
            Questions
          </Eyebrow>
          <h2 className={styles.headerHeading}>Frequently asked.</h2>
          <p className={styles.headerSub}>
            Honest answers to the things people ask before the first visit.
          </p>
        </header>

        <Accordion
          id={`faq-${detail.slug}`}
          items={faqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))}
          className={styles.accordion}
        />
      </div>
    </section>
  );
}
