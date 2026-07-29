'use client';

/**
 * PocketMap — D-0058 editorial "pocket map" section.
 *
 * A vintage illustrated pocket map of the operator's actual service
 * area in Pinellas County, FL. The map's boundary is REAL
 * OpenStreetMap data (relation 1210726, 392-point polygon) projected
 * to SVG via equirectangular projection — NOT hand-drawn (per the
 * memory lesson: D-0024 hand-authored Pinellas SVG was rejected by
 * the steward for incoherence; real OSM data is the only acceptable
 * source for geographic accuracy).
 *
 * Introduces the page's FOURTH visual register: 1920s-30s WPA /
 * pictorial map aesthetic — sepia line art, faded earth tones,
 * hand-lettered labels, compass rose, scale bar, decorative border.
 * Sits alongside:
 *   1. Folk-cartoon (D-0049, D-0050, D-0055)
 *   2. Painted VEO (D-0049, D-0053)
 *   3. Pressed-herbarium botanical (D-0057)
 *   4. Vintage illustrated pocket map (this section)
 *
 * Closes a specific gap: the page shows the operator's bio
 * (OperatorStrip) and the route (FieldLog) but never shows the
 * operator's actual TERRITORY — the geographic context the route
 * runs through. This section is the "where" between the "who"
 * (OperatorStrip) and the "what" (FieldLog).
 *
 * Design rationale (full brief in
 * apps/web/audit/d-0058-pocket-map/memo.md):
 *
 *   - 5 vertical zones: eyebrow + H2 + subhead + map + closing.
 *   - Section background: same as D-0057 (slightly more aged than
 *     the cream/sand sections) so the precision sections stack as
 *     a "we are precise" mini-cluster.
 *   - The map itself: 700x1000 SVG, viewed in the page at
 *     ~480x686 (responsive via CSS).
 *   - 3 entry animations on viewport entry, all gated by
 *     prefers-reduced-motion: reduce.
 *   - The operator's star at 33771 is the only colored element on
 *     the map — sun-yellow + clay, the page's color vocabulary
 *     from the FieldLog's truck marker.
 */

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef, type ReactNode } from 'react';

import { Container, Section } from '@/components/site';

import styles from './PocketMap.module.css';

export function PocketMap(): ReactNode {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(mapRef, { once: true, amount: 0.2 });

  return (
    <Section
      tone="default"
      className={styles.root}
      data-test-section="pocket-map"
    >
      <Container>
        <div className={styles.inner}>
          {/* Zone 1 + 2 + 3: eyebrow + H2 + subhead (fade-up) */}
          <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.eyebrow}>
              Pocket map <span className={styles.eyebrowDot} aria-hidden="true">·</span>{' '}
              06 <span className={styles.eyebrowDot} aria-hidden="true">·</span>{' '}
              The territory
            </span>
            <h2 className={styles.headline}>
              Six ZIPs, one operator, no franchises.
            </h2>
            <p className={styles.subhead}>
              This isn&apos;t a regional chain. The map is the map.
              33771 is the truck, the trailer, the walk-behind, and
              the same guy every Tuesday. The star is the home base
              — the route radiates from there. Six ZIPs, one
              operator, one truck, one walk-behind, one edger, one
              trimmer. The whole thing fits in the bed of a pickup.
            </p>
          </motion.div>

          {/* Zone 4: the map (with the same color-mix drop shadow as
              the SpecimenPlate plates, so the precision sections
              share a visual idiom) */}
          <motion.div
            ref={mapRef}
            className={styles.mapFrame}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="/maps/pinellas-pocket-map.svg"
              alt="Vintage illustrated pocket map of the operator's service area in Pinellas County, Florida"
              width={700}
              height={1000}
              className={styles.mapImage}
              priority={false}
            />
            <span className={styles.mapCaption}>
              Boundary data{' '}
              <a
                href="https://www.openstreetmap.org/relation/1210726"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapCaptionLink}
              >
                © OpenStreetMap
              </a>
              {' '}· drawn 2026-07-21
            </span>
          </motion.div>

          {/* Zone 5: closing line (the brand-true kicker) */}
          <motion.p
            className={styles.closing}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            If you&apos;re inside the line, you&apos;re on the route.
            <br />
            If you&apos;re outside, you&apos;re outside — and I&apos;ll
            tell you that, too.
          </motion.p>
        </div>
      </Container>
    </Section>
  );
}
