'use client';

/**
 * ServiceAreaMap — Mission 1 illustrative map.
 *
 * D-0024: hand-authored Pinellas County SVG. Replaces the
 * WP19-era abstract shapes and the D-0012 SDXL-painted land mass
 * (which came out below quality bar per the user review — the
 * SDXL "peninsula" was a long thin sliver with the wrong water
 * boundaries, no bridges, no mainland, and ZIPs stacked
 * vertically instead of spread across the width).
 *
 * The new map is a single inline SVG with the actual Pinellas
 * County coastline (wide rectangular peninsula, NE mainland
 * connection at Safety Harbor, four water bodies, three
 * bridges). Vector — no raster — so the coastline stays crisp
 * at any rendered size. Uses the same hand-authored-SVG pattern
 * as the section dividers (D-0018), corner stamps (D-0020),
 * passport stamp (D-0023), FAQ sun (D-0022), and service icons
 * (D-0021).
 *
 * The viewBox is 1000x800 (wider than tall) to match the real
 * Pinellas aspect ratio. The 6 service-area ZIPs sit in a
 * roughly horizontal band in the west-central portion of the
 * peninsula, which is where they actually are in real life
 * (within ~6 miles of each other along the US-19 corridor).
 *
 * Bidirectional hover/focus sync (since WP14): pinning a ZIP on
 * either surface — the SVG pin or the side rail row — paints a
 * matching `data-zip-active="true"` on both. Single source of
 * truth: the `activeZip` state.
 *
 * Pin hierarchy: ZIPs in `PRIORITY_ZIPS` (the home-base ZIP,
 * 33771) render with the sun fill instead of clay, marking the
 * service anchor on the page.
 */

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

// D-0024 — Pin coordinates re-tuned for the new 1000x800 wide
// viewBox with the v2 coastline path. The 6 service-area ZIPs
// all sit in a roughly horizontal band in the west-central
// portion of the peninsula, within ~6 miles of each other along
// the US-19 corridor. Real relative positions:
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
//
// x is roughly Gulf-side-to-bay-side (west-to-east).
// y is north-to-south.
//
// The previous layout (in the SDXL-era) stacked them
// top-to-bottom, which suggested they were in different cities.
// They are all in the same neighborhood.
const PIN_LAYOUT: Record<string, { x: number; y: number }> = {
  '33756': { x: 240, y: 330 },
  '33770': { x: 180, y: 410 },
  '33771': { x: 300, y: 470 },
  '33773': { x: 420, y: 470 },
  '33774': { x: 350, y: 555 },
  '33778': { x: 470, y: 545 },
};

/** ZIPs in this set render with sun fill + thicker ring stroke —
 * marks the service anchor (home base) on the map. Hardcoded
 * because it carries operator policy, not copy — not in
 * `lib/content.ts`. WP14. */
const PRIORITY_ZIPS = new Set(['33771']);

export function ServiceAreaMap({ className }: ServiceAreaMapProps): ReactNode {
  /** Single source of truth for pin↔rail sync. Both surfaces
   * read this state to render `data-zip-active` on their own
   * nodes. Mouse + focus handlers on each surface update it. */
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
            <svg
              className={styles.svg}
              viewBox="0 0 1000 800"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label={serviceAreaMap.svgAriaLabel}
            >
              {/* D-0024 — water background. Single rect filling the
                  entire viewBox in the gulf-blue. Land paths sit
                  on top with a clay outline. */}
              <rect className={styles.water} x="0" y="0" width="1000" height="800" />

              {/* D-0024 — Pinellas County coastline. Single path
                  with smoother curves + a more angular silhouette
                  (less blobby than the v1 path). Wide rectangular
                  peninsula hanging off the mainland, with the
                  real coast shape: roughly straight N coast,
                  straighter W coast, slight E-coast bulge at
                  St. Petersburg, curved SW corner. Clockwise
                  from the NW corner. */}
              <path
                className={styles.land}
                d="M 175 215
                   L 350 195
                   C 480 188, 600 200, 720 245
                   L 740 320
                   C 745 380, 730 440, 710 500
                   C 700 540, 695 580, 685 620
                   L 670 685
                   L 600 705
                   L 500 715
                   L 380 710
                   L 270 690
                   L 180 650
                   C 145 600, 120 540, 115 470
                   C 112 400, 120 330, 140 270
                   Z"
              />

              {/* D-0024 — Mainland stub (NE). A small land mass
                  extending right and up from the NE corner of
                  Pinellas, showing the Safety Harbor / Oldsmar
                  connection to the rest of Florida. The three
                  bridges cross the narrow Old Tampa Bay / Tampa
                  Bay water between Pinellas and the mainland. */}
              <path
                className={styles.land}
                d="M 720 245
                   L 850 215
                   L 1000 240
                   L 1000 420
                   L 850 425
                   L 740 380
                   L 720 320
                   Z"
              />

              {/* D-0024 — 3 bridges (short lines crossing the
                  water). From N to S: Courtney Campbell Causeway
                  (SR 60), Howard Frankland Bridge (I-275), Gandy
                  Bridge (US-92). */}
              <g className={styles.bridges}>
                <line x1="700" y1="245" x2="870" y2="220" />
                <line x1="710" y1="410" x2="900" y2="410" />
                <line x1="660" y1="600" x2="870" y2="600" />
              </g>

              {/* D-0024 — city labels (italic Fraunces serif, cream).
                  Reference points so users can orient themselves
                  against real-world geography. Positioned near
                  the city centers on the land mass. */}
              <g className={styles.cityLabels}>
                <text x="200" y="260" text-anchor="middle">Tarpon Springs</text>
                <text x="200" y="320" text-anchor="middle">Clearwater</text>
                <text x="370" y="500" text-anchor="middle">Largo</text>
                <text x="400" y="610" text-anchor="middle">Seminole</text>
                <text x="500" y="700" text-anchor="middle">St. Petersburg</text>
                <text x="850" y="320" text-anchor="middle">Safety Harbor</text>
              </g>

              {/* D-0024 — water labels (italic, low opacity). The
                  four bodies of water that bound Pinellas:
                  Gulf of Mexico (W), Old Tampa Bay (N), Tampa Bay
                  (E), Boca Ciega Bay (S). */}
              <g className={styles.waterLabels}>
                <text x="60" y="450" text-anchor="middle" transform="rotate(-90 60 450)">
                  Gulf of Mexico
                </text>
                <text x="500" y="120" text-anchor="middle">Old Tampa Bay</text>
                <text x="860" y="480" text-anchor="middle" transform="rotate(90 860 480)">
                  Tampa Bay
                </text>
                <text x="380" y="780" text-anchor="middle">Boca Ciega Bay</text>
              </g>

              {/* D-0024 — compass rose (small N indicator in the
                  NE corner of the map). Orients users to the
                  map's north-up convention. */}
              <g className={styles.compass} transform="translate(940, 60)">
                <circle r="22" />
                <text x="0" y="-9" text-anchor="middle">N</text>
                <text x="0" y="18" text-anchor="middle" className={styles.compassS}>
                  S
                </text>
              </g>

              {/* ZIP pins + rings (interactive, sit on top of the
                  land mass). D-0024 positions updated to match
                  the new wide-format viewBox. */}
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
                      <circle className={styles.pinRing} cx={layout.x} cy={layout.y} r="32" />
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
                      <text className={styles.pinLabel} x={layout.x} y={layout.y + 4}>
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
