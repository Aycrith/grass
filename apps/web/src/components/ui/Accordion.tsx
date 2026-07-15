'use client';

/**
 * Accordion — Mission 1
 *
 * Thin wrapper over @radix-ui/react-accordion. Renders a list of
 * {q, a} items as a disclosure stack. Keyboard accessible by Radix
 * defaults.
 *
 * D-0022: replaced the stock ChevronDown lucide icon with a
 * hand-authored sun-burst toggle (AccordionSun). The sun rotates
 * 45° when the row is open — same state-change semantic as the
 * previous chevron, but visually a hand-drawn mark instead of a
 * stock glyph. Matches the corner-stamp + section-divider pattern
 * from D-0018 / D-0020.
 *
 * Used by FAQAccordion in Phase G.
 */

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

import { AccordionSun } from './AccordionSun';
import styles from './Accordion.module.css';

export interface AccordionItem {
  q: string;
  a: ReactNode;
}

interface AccordionProps {
  items: ReadonlyArray<AccordionItem>;
  /** Optional id for testing; defaults to 'faq'. */
  id?: string;
  className?: string | undefined;
}

export function Accordion({ items, id = 'faq', className }: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={`${id}-0`}
      className={cn(styles.root, className)}
    >
      {items.map((item, idx) => {
        const value = `${id}-${idx}`;
        return (
          <AccordionPrimitive.Item key={value} value={value} className={styles.item}>
            <AccordionPrimitive.Header asChild>
              <h3>
                <AccordionPrimitive.Trigger className={styles.trigger}>
                  <span>{item.q}</span>
                  <AccordionSun className={styles.sun} />
                </AccordionPrimitive.Trigger>
              </h3>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className={styles.content}>
              <div className={styles.contentInner}>{item.a}</div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        );
      })}
    </AccordionPrimitive.Root>
  );
}
