'use client';

/**
 * ServiceAreaMap — Mission 1 illustrative map.
 *
 * D-0025: real OpenStreetMap-based line-art map of Pinellas County,
 * generated from live OSM data via the Overpass API
 * (see apps/comfyui/scripts/make-osm-pinellas-map.py). Replaces
 * the D-0024 hand-authored SVG coastline — the steward review
 * said the hand-authored maps were "not coherent enough to meet
 * acceptance criteria." The OSM-based image uses the actual
 * real-world coastline, street grid, water bodies, and bridges
 * — same data source and editorial style as the reference map
 * (with "Map Data © OSM" attribution).
 *
 * The 6 service-area ZIPs sit as absolute-positioned SVG overlays
 * on top of the OSM image, at their actual real-world relative
 * positions within the west-central portion of the peninsula.
 * A 1000x800 viewBox matches the map area (5:4 aspect ratio after
 * the bottom typography strip is cropped). The 6 ZIPs are all
 * within ~6 miles of each other along the US-19 corridor.
 *
 * Bidirectional hover/focus sync (since WP14): pinning a ZIP on
 * either surface — the SVG pin or the side rail row — paints a
 * matching `data-zip-active="true"` on both.
 *
 * Pin hierarchy: ZIPs in `PRIORITY_ZIPS` (the home-base ZIP,
 * 33771) render with the sun fill instead of cream, marking the
 * service anchor on the page.
 */

import Image from 'next/image';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';

import { Eyebrow, Section } from '@/components/site';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { serviceAreaMap } from '@/lib/content';

import styles from './ServiceAreaMap.module.css';

interface ServiceAreaMapProps {
  className?: string;
}

// D-0025 — Pin coordinates for the 6 service-area ZIPs in the
// west-central portion of Pinellas County. Positioned on the
// 1000x800 viewBox that aligns with the OSM map's 5:4 aspect
// ratio (after the bottom typography strip is excluded). The
// 6 ZIPs are all within ~6 miles of each other along the US-19
// corridor, so the pins are clustered rather than spread across
// the whole peninsula.
//
//   N
//   ↑
//   | 33756 (Clearwater/Belleair, north-most of the 6)
//   | 33770 (Belleair Bluffs, Gulf side, west of 33771)
//   | 33771 (Largo central — home base, slightly inland)
//   | 33773 (Largo east, ~2 mi east of 33771)
//   | 33774 (Seminole / south of Largo)
//   | 33778 (Pinellas Park / central south)
//   S
const PIN_LAYOUT: Record<string, { x: number; y: number }> = {
  '33756': { x: 470, y: 390 },
  '33770': { x: 420, y: 460 },
  '33771': { x: 510, y: 510 },
  '33773': { x: 600, y: 520 },
  '33774': { x: 530, y: 610 },
  '33778': { x: 620, y: 620 },
};

/** ZIPs in this set render with sun fill + thicker ring stroke —
 * marks the service anchor (home base) on the map. */
const PRIORITY_ZIPS = new Set(['33771']);

export function ServiceAreaMap({ className }: ServiceAreaMapProps): ReactNode {
  /** Single source of truth for pin↔rail sync. */
  const [activeZip, setActiveZip] = useState<string | null>(null);

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
            {/* D-0025 — OSM-based line-art map of Pinellas County.
             * 1272x1162 px framed poster (black border + LARGO
             * wordmark + coordinates + OSM attribution). The
             * .mapWrap container is 5:4 so the image fills it
             * proportionally; the bottom typography strip is
             * part of the image and stays visible. */}
            <Image
              src="/illustrations/pinellas-map-osm-1200x960.webp"
              alt={serviceAreaMap.svgAriaLabel}
              fill
              sizes="(max-width: 980px) 100vw, 60vw"
              className={styles.mapImage}
              priority={false}
            />

            {/* D-0025 — 6 service-area ZIP pins as SVG overlay.
             * Sits on top of the OSM image at the real-world
             * relative positions. 1000x800 viewBox matches the
             * map's 5:4 aspect ratio so the pins line up with
             * the streets on the image. */}
            <svg
              className={styles.pinOverlay}
              viewBox="0 0 1000 800"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              {BUSINESS.service_area_zips.map((zip) => {
                const layout = PIN_LAYOUT[zip];
                if (!layout) return null;
                const isActive = activeZip === zip;
                const isPriority = PRIORITY_ZIPS.has(zip);
                return (
                  <Link
                    key={zip}
                    href={`/areas/${zip}`}
                    aria-label={`Service area ${zip}`}
                    onMouseEnter={() => setActiveZip(zip)}
                    onMouseLeave={() => setActiveZip(null)}
                    onFocus={() => setActiveZip(zip)}
                    onBlur={() => setActiveZip(null)}
                  >
                    <g
                      className={styles.pinGroup}
                      data-zip-active={isActive ? 'true' : undefined}
                    >
                      <circle
                        className={styles.pinRing}
                        cx={layout.x}
                        cy={layout.y}
                        r="32"
                      />
                      <circle
                        className={cn(
                          styles.pinRing,
                          styles.ringInner,
                          isPriority && styles.ringInnerPriority
                        )}
                        cx={layout.x}
                        cy={layout.y}
                        r="20"
                      />
                      <text
                        className={styles.pinLabel}
                        x={layout.x}
                        y={layout.y + 4}
                      >
                        {zip}
                      </text>
                    </g>
                  </Link>
                );
              })}
            </svg>
          </div>

          <div className={styles.rail}>
            <p className={styles.railTitle}>{serviceAreaMap.railTitle}</p>
            {BUSINESS.service_area_zips.map((zip) => {
              const name = serviceAreaMap.pinLocations[zip] ?? 'Largo area';
              const thumbSrc = serviceAreaMap.areaImages[zip];
              const isActive = activeZip === zip;
              return (
                <Link
                  key={zip}
                  href={`/areas/${zip}`}
                  className={styles.railItem}
                  data-zip-active={isActive ? 'true' : undefined}
                  onMouseEnter={() => setActiveZip(zip)}
                  onMouseLeave={() => setActiveZip(null)}
                  onFocus={() => setActiveZip(zip)}
                  onBlur={() => setActiveZip(null)}
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
