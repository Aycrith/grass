'use client';

/**
 * ServiceAreaMap — Mission 1 illustrative map.
 *
 * Renders a schematic Pinellas peninsula silhouette with 6 ZIP
 * pins (one per `BUSINESS.service_area_zips`). Each pin is a
 * `<Link>` to `/areas/[zip]`.
 *
 * Bidirectional hover/focus sync (since WP14): pinning a ZIP on
 * either surface — the SVG pin or the side rail row — paints a
 * matching `data-zip-active="true"` on both. Single source of
 * truth: the `activeZip` state. Each surface's mouse + keyboard
 * handlers update it; CSS reads the data attribute. This keeps
 * the JS thin and lets the visual rules live with the rest of
 * the section's styles.
 *
 * Pin hierarchy: ZIPs in `PRIORITY_ZIPS` (the home-base ZIP,
 * 33771) render with the sun fill instead of clay, marking the
 * service anchor on the page.
 *
 * The map is intentionally stylized — this is a service-area
 * visual, not navigation software. The actual property boundary
 * lines aren't drawn (we'd need a real geojson source for that
 * which is out of scope per the master PRD).
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

// Pin coordinates tuned for an abstract 800×1000 viewBox:
// Pinellas peninsula is a vertical strip on the West side of
// Tampa Bay; the 6 ZIPs all sit within it.
//
// Neighborhood labels (the `name` strings) live in
// `lib/content.ts → serviceAreaMap.pinLocations` so copy edits
// don't need a code change to a layout-config table. To add a
// new service-area ZIP: extend both BUSINESS.service_area_zips
// and PIN_LAYOUT here, plus add the matching label to
// serviceAreaMap.pinLocations.
const PIN_LAYOUT: Record<string, { x: number; y: number }> = {
  '33756': { x: 380, y: 320 },
  '33770': { x: 360, y: 410 },
  '33771': { x: 380, y: 510 },
  '33773': { x: 420, y: 600 },
  '33774': { x: 360, y: 670 },
  '33778': { x: 320, y: 760 },
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
            <Eyebrow tone="dark" dot className={styles.headerEyebrow}>
              {serviceAreaMap.eyebrow}
            </Eyebrow>
            <h2 className={styles.headerHeading}>{serviceAreaMap.heading}</h2>
            <p className={styles.headerSub}>{serviceAreaMap.subhead}</p>
          </header>

          <div className={styles.mapWrap}>
            <svg
              className={styles.svg}
              viewBox="0 0 800 1000"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label={serviceAreaMap.svgAriaLabel}
            >
              {/* D-0012 — painted storybook Pinellas peninsula (water + land
                  + 6 small green markers baked in). Replaces the WP19-era
                  abstract SVG water rect + peninsula path so the section's
                  only full-bleed hand-drawn surface is consistent with the
                  rest of the painted storybook homepage. The interactive
                  pins (rings + ZIP labels) still sit on top of the painted
                  land so the 6 neighborhoods remain clickable. */}
              <image
                className={styles.paintedMap}
                href="/illustrations/pinellas-map-v3-800x1000.webp"
                x="0"
                y="0"
                width="800"
                height="1000"
                preserveAspectRatio="xMidYMid slice"
              />

              {/* Tampa Bay label */}
              <text className={styles.labelPrimary} x="650" y="450">
                {serviceAreaMap.tampaBayLabel}
              </text>

              {/* Gulf of Mexico label */}
              <text
                className={styles.labelSecondary}
                x="100"
                y="500"
                transform="rotate(-90 100 500)"
              >
                {serviceAreaMap.gulfOfMexicoLabel}
              </text>

              {/* Latitude / longitude hint lines (very faint) */}
              <g className={styles.gridLine}>
                <line x1="200" y1="0" x2="200" y2="1000" />
                <line x1="400" y1="0" x2="400" y2="1000" />
                <line x1="600" y1="0" x2="600" y2="1000" />
                <line x1="0" y1="400" x2="800" y2="400" />
                <line x1="0" y1="600" x2="800" y2="600" />
              </g>

              {/* ZIP pins + rings */}
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
                      {/* WP23 — outer ring + inner ring form a readable badge
                          with the ZIP label inside. The previous design had a
                          solid r=10 pin dot at (x, y) sitting on top of the
                          label center, obscuring the middle digits ("33756"
                          read as "3∅7∅6"). Removed the dot; priority state
                          (home-base 33771) is now carried by the inner ring
                          fill (see .ringInnerPriority). */}
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
