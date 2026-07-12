/**
 * TestimonialQuote — single-quote card.
 *
 * **Empty-state behavior**: never renders anything unless
 * `lib/content.ts → social.proof[]` contains at least one item.
 * Per PRD-04 anti-patterns: invented testimonials are forbidden.
 *
 * The default export returns null when no proof is configured.
 * Once steward supplies real customer quotes, the first item
 * appears as a hero card between ServiceAreaMap (06) and
 * FAQAccordion (07). The static "04 — From a neighbor" eyebrow
 * in this component is a placeholder; when the section is
 * actually rendered, it sits at position 07 in the homepage
 * sequence, so re-render the eyebrow inline as needed.
 */

import { Eyebrow, Section } from '@/components/site';
import { cn } from '@/lib/cn';
import { social } from '@/lib/content';

import styles from './TestimonialQuote.module.css';

interface TestimonialQuoteProps {
  className?: string | undefined;
}

export function TestimonialQuote({ className }: TestimonialQuoteProps): React.ReactNode {
  // Empty-state: never render invented quotes.
  if (!social || !Array.isArray(social.proof) || social.proof.length === 0) {
    return null;
  }

  const item = social.proof[0];

  return (
    <Section rhythm="loose" tone="warm" className={cn(styles.root, className)}>
      <div className="container">
        <div className={styles.inner}>
          <Eyebrow tone="default" dot className={styles.eyebrow}>
            07 — From a neighbor
          </Eyebrow>
          <blockquote className={styles.quote}>
            <span className={styles.quoteMark} aria-hidden="true">
              &ldquo;
            </span>
            {item.quote}
          </blockquote>
          <footer className={styles.attribution}>
            <span className={styles.name}>{item.name}</span>
            {item.zip ? <span className={styles.meta}>· {item.zip}</span> : null}
            {item.source ? <span className={styles.meta}>· {item.source}</span> : null}
          </footer>
        </div>
      </div>
    </Section>
  );
}
