'use client';

/**
 * ServiceAreaMap — Mission 1 illustrative map.
 *
 * D-0026 (final): custom-composed editorial map. The 6 service-area
 * ZIP badges (33756, 33770, 33771, 33773, 33774, 33778) are baked
 * directly into the image as filled circles with dark borders and
 * dark text labels — the priority ZIP (33771, home base) gets a
 * sun-gold fill. This replaces the D-0025/D-0026 split-image approach
 * (map image + separate SVG pin overlay) which the steward called
 * "incoherent" because the SVG rings used cream stroke on a white
 * map (invisible), leaving just floating text labels.
 *
 * The image is a single self-contained artifact:
 *   - Line-art OSM base (real coastline, street grid, water bodies)
 *   - 6 ZIP badges positioned at their real lat/lon coordinates
 *   - Tiny "Map Data © OSM" attribution in the bottom-right (ODbL)
 *
 * The 6 ZIPs are also surfaced in the side rail below the map —
 * each rail row links to /areas/{zip} and shows a thumbnail + the
 * neighborhood name. The map is the visual reference; the side rail
 * is the navigation. (D-0026 final: no separate SVG pin layer.)
 *
 * The .mapWrap is a positioned 4:3 container that holds the image
 * edge-to-edge. The side rail is in the same column as the heading
 * on desktop, and stacks below the map on mobile.
 */

import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Eyebrow, Section } from '@/components/site';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { serviceAreaMap } from '@/lib/content';

import styles from './ServiceAreaMap.module.css';

interface ServiceAreaMapProps {
  className?: string;
}

export function ServiceAreaMap({ className }: ServiceAreaMapProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <div className={styles.inner}>
          <header className={styles.header}>
            <Eyebrow tone="dark" className={styles.headerEyebrow}>
              {serviceAreaMap.eyebrow}
            </Eyebrow>
            <h2 className={styles.headerHeading}>{serviceAreaMap.heading}</h2>
            <p className={styles.headerSub}>{serviceAreaMap.subhead}</p>
          </header>

          <div className={styles.mapWrap}>
            {/* D-0026 final — single self-contained editorial map. The
             * 6 ZIP badges are baked into the image at their real
             * lat/lon coordinates; the priority ZIP (33771) has a
             * sun-gold fill. No separate SVG pin overlay needed.
             * 1200x900 px (4:3) WebP, ~225 KB. */}
            <Image
              src="/illustrations/pinellas-map-clean-1200x900.webp"
              alt={serviceAreaMap.svgAriaLabel}
              fill
              sizes="(max-width: 980px) 100vw, 60vw"
              className={styles.mapImage}
              priority={false}
            />
          </div>

          <div className={styles.rail}>
            <p className={styles.railTitle}>{serviceAreaMap.railTitle}</p>
            {BUSINESS.service_area_zips.map((zip) => {
              const name = serviceAreaMap.pinLocations[zip] ?? 'Largo area';
              const thumbSrc = serviceAreaMap.areaImages[zip];
              return (
                <Link
                  key={zip}
                  href={`/areas/${zip}`}
                  className={styles.railItem}
                >
                  <span className={styles.railItemThumb}>
                    {thumbSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbSrc}
                        alt={serviceAreaMap.areaImageAlt}
                        loading="lazy"
                        decoding="async"
                        width={120}
                        height={67}
                      />
                    ) : null}
                  </span>
                  <span className={styles.railItemZip}>{zip}</span>
                  <span className={styles.railItemName}>{name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
