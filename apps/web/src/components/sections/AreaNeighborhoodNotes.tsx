/**
 * AreaNeighborhoodNotes — second section of `/areas/[zip]`.
 *
 * Cream surface, two-column desktop layout: the intro paragraph
 * reads like an editorial neighborhood profile on the left; the
 * "Nearby" pill list on the right gives visitors a quick
 * locator ("Belleair / Belleair Beach access / Clearwater") to
 * confirm the ZIP matches their address.
 *
 * Drops to a single column on mobile. Reads everything from
 * `lib/content.ts → areaDetail[zip]` — the steward edits one
 * file when the operator learns new facts about a ZIP.
 */

import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { Pill } from '@/components/ui';
import { cn } from '@/lib/cn';
import { areaDetail } from '@/lib/content';

import styles from './AreaNeighborhoodNotes.module.css';

interface AreaNeighborhoodNotesProps {
  /** Service-area ZIP — must be a key in `areaDetail`. */
  zip: string;
  className?: string | undefined;
}

export function AreaNeighborhoodNotes({ zip, className }: AreaNeighborhoodNotesProps): ReactNode {
  const detail = areaDetail[zip as keyof typeof areaDetail];
  if (!detail) return null;
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <div className={styles.grid}>
          <FadeUp className={styles.prose}>
            <Eyebrow tone="default" dot>
              About this neighborhood
            </Eyebrow>
            <p className={styles.intro}>{detail.intro}</p>
          </FadeUp>

          <FadeUp className={styles.aside}>
            <Eyebrow tone="default" dot>
              Nearby
            </Eyebrow>
            <ul className={styles.pillList}>
              {detail.nearby.map((place) => (
                <li key={place}>
                  <Pill tone="outline" size="md">
                    {place}
                  </Pill>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </div>
    </Section>
  );
}
