/**
 * AreaHero — `/areas/[zip]` page opener.
 *
 * Full-bleed storybook-painted neighborhood scene (the per-ZIP
 * webp from `apps/web/public/areas/{zip}.webp`) with editorial
 * Fraunces heading + tagline floating on a clay-warm scrim.
 * Eyebrow reads the ZIP, h1 reads the neighborhood.
 *
 * The image is generated via the ComfyUI pipeline at
 * `apps/comfyui/prompts/area.md` (D-0034). Each ZIP has its
 * own painted neighborhood scene; the brief asks for a
 * ranch-house + mature-tree + golden-hour Florida feel rather
 * than the SDXL-map / aerial-view anti-pattern.
 *
 * Copy comes from `lib/content.ts → areaDetail[zip]` so the
 * steward edits one file when neighborhood copy changes.
 */

import Image from 'next/image';
import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Breadcrumb, Eyebrow } from '@/components/site';
import { Button } from '@/components/ui';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { type AreaDetail, areaImages } from '@/lib/content';

import styles from './AreaHero.module.css';

interface AreaHeroProps {
  detail: AreaDetail;
  className?: string | undefined;
}

export function AreaHero({ detail, className }: AreaHeroProps): ReactNode {
  const phoneHref = `tel:${BUSINESS.phoneTel}`;
  const imageSlot = areaImages[detail.zip] ?? '/illustrations/pinellas-palm-v3-600x400.webp';
  const imageAlt = `Storybook-painted ${detail.name} neighborhood at golden hour — Largo, FL ${detail.zip}.`;

  return (
    <section className={cn(styles.root, className)}>
      <div className={styles.media} aria-hidden="true">
        <Image
          src={imageSlot}
          alt={imageAlt}
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
            <Breadcrumb
              tone="dark"
              className={styles.breadcrumb}
              items={[
                { label: 'Home', href: '/' },
                { label: 'Service areas', href: '/areas' },
                { label: `ZIP ${detail.zip}` },
              ]}
            />
            <Eyebrow tone="dark" className={styles.eyebrow}>
              ZIP {detail.zip}
            </Eyebrow>
            <h1 className={styles.title}>{detail.longName}</h1>
            <p className={styles.tagline}>{detail.tagline}</p>
            <p className={styles.intro}>{detail.intro}</p>
            <div className={styles.actions}>
              <Button as="link" href={`/quote?zip=${detail.zip}`} variant="sun" size="lg">
                Get a free quote for {detail.zip}
              </Button>
              <Button as="a" href={phoneHref} variant="outline" size="lg" inverse>
                Call {BUSINESS.phone}
              </Button>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
