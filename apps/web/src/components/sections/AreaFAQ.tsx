/**
 * AreaFAQ — `/areas/[zip]` per-ZIP question & answer list.
 *
 * Reuses the existing `<Accordion>` primitive + `<AccordionSun>`
 * sun-burst toggle (D-0022) for visual consistency with
 * FAQAccordion on the homepage and ServiceFAQ on the service
 * detail pages.
 *
 * Per-ZIP questions come from `lib/content.ts → areaDetail[zip]`
 * — 3-4 real local questions (the 1-question placeholder density
 * D-0026/27 had is gone). Copy grounds in real Largo / Pinellas
 * concerns: salt damage in 33756, oak leaf drop in 33770,
 * hurricane response in 33778, etc.
 */

import type { ReactNode } from 'react';

import { Container, Eyebrow, Section } from '@/components/site';
import { Accordion } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { AreaDetail } from '@/lib/content';

import styles from './AreaFAQ.module.css';

interface AreaFAQProps {
  detail: AreaDetail;
  className?: string | undefined;
}

export function AreaFAQ({ detail, className }: AreaFAQProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <Container>
        <header className={styles.header}>
          <Eyebrow tone="default" className={styles.headerEyebrow}>
            Questions from {detail.name}
          </Eyebrow>
          <h2 className={styles.headerHeading}>The four things people ask me first.</h2>
          <p className={styles.headerSub}>
            The questions that come up most often on {detail.zip} quotes. The honest answers, in
            plain English — no fine print.
          </p>
        </header>

        <Accordion
          id={`area-${detail.zip}`}
          items={detail.faqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))}
          className={styles.accordion}
        />
      </Container>
    </Section>
  );
}
