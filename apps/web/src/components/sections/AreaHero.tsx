/**
 * AreaHero — `/areas/[zip]` page opener.
 *
 * Same full-bleed image + editorial copy overlay pattern as
 * ServiceHero, but pulls the image from `serviceAreaMap.
 * areaImages[zip]` (the same webp used on the landing-page
 * rail and the AreaDirectory cards) so visitors see the
 * neighborhood image they clicked through from.
 *
 * ZIP-specific content flows from `lib/content.ts →
 * areaDetail[zip]`. The hero shows neighborhood name + ZIP
 * pill on the image and a single "Get a free quote" CTA
 * below.
 */

import Image from 'next/image';
import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Eyebrow } from '@/components/site';
import { Button, Pill } from '@/components/ui';
import { cn } from '@/lib/cn';
import { areaDetail, serviceAreaMap } from '@/lib/content';

import styles from './AreaHero.module.css';

interface AreaHeroProps {
  /** Service-area ZIP — must be a key in `areaDetail` and `serviceAreaMap.areaImages`. */
  zip: string;
  className?: string | undefined;
}

export function AreaHero({ zip, className }: AreaHeroProps): ReactNode {
  const detail = areaDetail[zip as keyof typeof areaDetail];
  const image = serviceAreaMap.areaImages[zip as keyof typeof serviceAreaMap.areaImages];
  if (!detail || !image) return null;
  return (
    <section className={cn(styles.root, className)}>
      <div className={styles.media} aria-hidden="true">
        <Image
          src={image}
          alt={serviceAreaMap.areaImageAlt}
          fill
          sizes="100vw"
          className={styles.image}
          priority
        />
        <div className={styles.scrim} />
      </div>

      <div className="container">
        <div className={styles.copy}>
          <FadeUp>
            <div className={styles.tagRow}>
              <Pill tone="outline" size="sm" className={styles.zipPill}>
                {zip}
              </Pill>
              <Eyebrow tone="dark" dot>
                {detail.name}
              </Eyebrow>
            </div>
            <h1 className={styles.title}>{detail.heading}</h1>
            <div className={styles.actions}>
              <Button as="link" href="/quote" variant="sun" size="lg">
                Get a free quote
              </Button>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
