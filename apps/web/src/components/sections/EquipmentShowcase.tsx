/**
 * EquipmentShowcase — `/about` equipment gallery.
 *
 * 4-tile grid showcasing the actual gear. Reads
 * `lib/content.ts → operator.equipment` (the existing array: Honda
 * mower, EGO trimmer, Greenworks blower, Echo edger).
 *
 * Each tile: image left, manufacturer + model + use right. Hover
 * state lifts the card -4px and scales the image 1.03 (matches
 * the ServiceBento hover pattern).
 *
 * Imagery is the existing equipment quartet at
 * `apps/web/public/equipment/*.webp` (mower / trimmer / blower /
 * edger). Mapped by index — mower[0], trimmer[1], blower[2],
 * edger[3] — keeping `lib/content.ts` free of next/image src.
 *
 * Reduced-motion: hover lift and image scale collapse to instant
 * via the existing `motion-config` provider (reduced duration).
 */

import Image from 'next/image';
import type { ReactNode } from 'react';

import { FadeUp, StaggerGroup } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { cn } from '@/lib/cn';
import { operator } from '@/lib/content';

import styles from './EquipmentShowcase.module.css';

interface EquipmentShowcaseProps {
  className?: string | undefined;
}

const EQUIPMENT_IMAGES = [
  '/equipment/mower.webp',
  '/equipment/trimmer.webp',
  '/equipment/blower.webp',
  '/equipment/edger.webp',
] as const;

const EQUIPMENT_ALT = [
  'Honda self-propelled mower parked on a residential driveway.',
  'Cordless string trimmer leaning against a service vehicle.',
  'Battery leaf blower in the bed of a pickup truck.',
  'Walk-behind edger lined up at a freshly-cut curb.',
] as const;

export function EquipmentShowcase({ className }: EquipmentShowcaseProps): ReactNode {
  return (
    <Section
      rhythm="loose"
      tone="default"
      className={cn(styles.root, className)}
      data-test-section="equipment-showcase"
    >
      <div className="container">
        <FadeUp>
          <Eyebrow tone="default" className={styles.eyebrow}>
            The kit
          </Eyebrow>
          <h2 className={styles.heading}>Commercial-grade, residential-quiet.</h2>
          <p className={styles.lede}>
            Four pieces of equipment, well-maintained. The mower is the loudest part of the route
            and it idles down for backyards on a Tuesday afternoon.
          </p>
        </FadeUp>

        <StaggerGroup as="div" className={styles.grid} childDelay={0.08}>
          {operator.equipment.map((item, i) => {
            const src = EQUIPMENT_IMAGES[i];
            const alt = EQUIPMENT_ALT[i] ?? `${item.use} — ${item.name}.`;
            return (
              <article key={item.name} className={styles.tile}>
                <div className={styles.media}>
                  {src ? (
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className={styles.image}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </div>
                <div className={styles.copy}>
                  <p className={styles.use}>{item.use}</p>
                  <h3 className={styles.model}>{item.name}</h3>
                </div>
              </article>
            );
          })}
        </StaggerGroup>
      </div>
    </Section>
  );
}
