'use client';

/**
 * Accordion — Mission 1
 *
 * Thin wrapper over @radix-ui/react-accordion. Renders a list of
 * {q, a} items as a disclosure stack. Keyboard accessible by Radix
 * defaults; chevron rotates 180° when open.
 *
 * Used by FAQAccordion in Phase G.
 */

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

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
                  <ChevronDown className={styles.chevron} aria-hidden="true" />
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
