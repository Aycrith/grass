'use client';

/**
 * ServiceAreaMap — Mission 1 illustrative map.
 *
 * Renders a schematic Pinellas peninsula silhouette with 6 ZIP
 * pins (one per `BUSINESS.service_area_zips`). Each pin is a
 * `<Link>` to `/areas/[zip]`. Hover/focus highlights the matching
 * row in the side rail.
 *
 * The map is intentionally stylized — this is a service-area
 * visual, not navigation software. The actual property boundary
 * lines aren't drawn (we'd need a real geojson source for that
 * which is out of scope per the master PRD).
 */

import Link from 'next/link';
import type { ReactNode } from 'react';

import { Eyebrow, Section } from '@/components/site';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';

import styles from './ServiceAreaMap.module.css';

interface ServiceAreaMapProps {
  className?: string;
}

// Pin coordinates tuned for an abstract 800×1000 viewBox:
// Pinellas peninsula is a vertical strip on the West side of
// Tampa Bay; the 6 ZIPs all sit within it.
const PIN_LAYOUT: Record<string, { x: number; y: number; name: string }> = {
  '33756': { x: 380, y: 320, name: 'Belleair / Clearwater' },
  '33770': { x: 360, y: 410, name: 'Belleair Bluffs / Largo' },
  '33771': { x: 380, y: 510, name: 'Largo (central)' },
  '33773': { x: 420, y: 600, name: 'Largo (east)' },
  '33774': { x: 360, y: 670, name: 'Largo / Ridgecrest' },
  '33778': { x: 320, y: 760, name: 'Seminole / Largo West' },
};

export function ServiceAreaMap({ className }: ServiceAreaMapProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <div className={styles.inner}>
          <header className={styles.header}>
            <Eyebrow tone="dark" dot className={styles.headerEyebrow}>
              06 — Where I mow
            </Eyebrow>
            <h2 className={styles.headerHeading}>Six ZIPs, one route.</h2>
            <p className={styles.headerSub}>
              We keep the service area tight on purpose — six ZIPs across Largo and the adjacent
              Pinellas neighborhoods. If you are right outside one of these, ask; I sometimes make
              exceptions for yards next door.
            </p>
          </header>

          <div className={styles.mapWrap}>
            <svg
              className={styles.svg}
              viewBox="0 0 800 1000"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Map of Largo Lawn service area with six ZIPs marked"
            >
              {/* Tampa Bay water — gulf blue, brand token.
                  (--ll-gulf is the gulf horizon blue; semantically the
                  water of Tampa Bay reads as gulf blue, not palm green.) */}
              <rect className={styles.water} width="800" height="1000" />

              {/* Pinellas peninsula (abstract) */}
              <path
                className={styles.peninsula}
                d="M 380 120 Q 280 200 280 380 Q 260 540 340 700 Q 360 860 420 940 Q 480 860 460 720 Q 480 560 460 400 Q 480 240 380 120 Z"
              />

              {/* Tampa Bay label */}
              <text className={styles.labelPrimary} x="650" y="450">
                Tampa Bay
              </text>

              {/* Gulf of Mexico label */}
              <text
                className={styles.labelSecondary}
                x="100"
                y="500"
                transform="rotate(-90 100 500)"
              >
                Gulf of Mexico
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
                return (
                  <Link key={zip} href={`/areas/${zip}`} aria-label={`Service area ${zip}`}>
                    <g className={styles.pinGroup}>
                      <circle className={styles.pinRing} cx={layout.x} cy={layout.y} r="32" />
                      <circle className={styles.pinRing} cx={layout.x} cy={layout.y} r="20" />
                      <circle className={styles.pin} cx={layout.x} cy={layout.y} r="10" />
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
            <p className={styles.railTitle}>Service areas</p>
            {BUSINESS.service_area_zips.map((zip) => {
              const info = PIN_LAYOUT[zip];
              return (
                <Link key={zip} href={`/areas/${zip}`} className={styles.railItem}>
                  <span className={styles.railItemZip}>{zip}</span>
                  <span className={styles.railItemName}>{info?.name ?? 'Largo area'}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
