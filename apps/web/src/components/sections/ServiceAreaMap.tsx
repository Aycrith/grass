'use client';

/**
 * ServiceAreaMap — Mission 1 illustrative map.
 *
 * D-0026 final layout: the map is the FOCAL POINT of the section.
 * The previous 2-column side-by-side layout (heading-left, map-right)
 * made the map look like a small side-image; the user review called
 * that "incoherent" because the heading dwarfed the visual.
 *
 * New layout (top-down):
 *   - Small eyebrow + heading + subhead (centered)
 *   - The map (full width, 4:3)
 *   - The 6 ZIP rail (horizontal row below the map)
 *
 * The map is a single self-contained editorial composition
 * (pinellas-map-clean-1200x900.webp) with the 6 ZIP badges
 * baked directly into the image at their real lat/lon coords.
 * Priority ZIP (33771, home base) has a sun-gold fill; the other
 * 5 have a cream fill. Each badge has a hand-stamped feel
 * (subtle drop shadow) matching the corner-stamp and
 * passport-stamp SVGs elsewhere on the page.
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
          {/* Section header — small + centered, the map below is the
             focal point so we don't want the header to compete. */}
          <header className={styles.header}>
            <Eyebrow tone="dark" className={styles.headerEyebrow}>
              {serviceAreaMap.eyebrow}
            </Eyebrow>
            <h2 className={styles.headerHeading}>{serviceAreaMap.heading}</h2>
            <p className={styles.headerSub}>{serviceAreaMap.subhead}</p>
          </header>

          {/* The map — the focal point. 4:3 aspect, fills the
             container edge-to-edge, custom-composed image with the
             6 ZIP badges baked in. */}
          <div className={styles.mapWrap}>
            <Image
              src="/illustrations/pinellas-map-clean-1200x900.webp"
              alt={serviceAreaMap.svgAriaLabel}
              fill
              sizes="(max-width: 980px) 100vw, 80vw"
              className={styles.mapImage}
              priority={false}
            />
          </div>

          {/* The 6 ZIPs as a horizontal navigation row below the map.
             Each row links to /areas/{zip} and shows a thumbnail +
             the neighborhood name. Bidirectional hover syncs the
             thumbnail with the (no-longer-existing) SVG pin via
             data-zip-active. */}
          <nav className={styles.rail} aria-label="Service area ZIP codes">
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
          </nav>
        </div>
      </div>
    </Section>
  );
}
