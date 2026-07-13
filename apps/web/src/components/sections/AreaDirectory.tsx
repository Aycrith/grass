/**
 * AreaDirectory — `/areas` index page.
 *
 * 6-card ZIP directory. Each card carries the per-ZIP webp
 * (re-used from the landing-page rail via serviceAreaMap), the
 * neighborhood name, and a link to the detail page.
 *
 * Reads from `lib/content.ts → serviceAreaMap.pinLocations` for
 * labels, `lib/content.ts → serviceAreaMap.areaImages` for the
 * 6 webps, and `lib/content.ts → areasIndex` for the page
 * header. `BUSINESS.service_area_zips` drives the iteration
 * order (matches the order on the landing-page service-area
 * map so visitors feel continuity between / and /areas).
 */

import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { StaggerGroup } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { Pill } from '@/components/ui';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { areasIndex, serviceAreaMap } from '@/lib/content';

import styles from './AreaDirectory.module.css';

interface AreaDirectoryProps {
  className?: string | undefined;
}

export function AreaDirectory({ className }: AreaDirectoryProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <header className={styles.header}>
          <Eyebrow tone="default" dot className={styles.headerEyebrow}>
            {areasIndex.eyebrow}
          </Eyebrow>
          <h1 className={styles.headerTitle}>{areasIndex.heading}</h1>
          <p className={styles.headerTagline}>{areasIndex.tagline}</p>
        </header>

        <StaggerGroup as="div" className={styles.grid} childDelay={0.05} initialDelay={0.06}>
          {BUSINESS.service_area_zips.map((zip) => {
            const label =
              serviceAreaMap.pinLocations[zip as keyof typeof serviceAreaMap.pinLocations];
            const image = serviceAreaMap.areaImages[zip as keyof typeof serviceAreaMap.areaImages];
            return (
              <Link
                key={zip}
                href={`/areas/${zip}`}
                className={styles.card}
                aria-label={`${label} ZIP ${zip}`}
              >
                <article>
                  <div className={styles.imageWrap}>
                    <Image
                      src={image}
                      alt={serviceAreaMap.areaImageAlt}
                      fill
                      sizes="(max-width: 980px) 100vw, 33vw"
                    />
                    <div className={styles.scrim} />
                    <Pill tone="outline" size="sm" className={styles.zipPill}>
                      {zip}
                    </Pill>
                  </div>
                  <div className={styles.body}>
                    <h2 className={styles.title}>{label}</h2>
                    <span className={styles.cta}>Service details →</span>
                  </div>
                </article>
              </Link>
            );
          })}
        </StaggerGroup>

        <p className={styles.tail}>{areasIndex.tail}</p>
      </div>
    </Section>
  );
}
