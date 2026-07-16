'use client';

/**
 * ServiceAreaMap — Mission 1 illustrative map.
 *
 * D-0027: reworked the 6 ZIP rail to be OBVIOUSLY interactive.
 *
 * User review (D-0026c) said: "this looks better but lacks interactivity
 * — the buttons themselves do not project an area and are not
 * clickable/interactive, the component is not intuitive or self
 * apparent." The previous rail was light-on-dark info-cards with a
 * subtle hover. They linked to /areas/{zip} but didn't read as
 * clickable buttons.
 *
 * New rail (D-0027):
 *   - Light cream cards on the dark palm-bark bg (high contrast, pops
 *     as actual cards)
 *   - Big ZIP code in sun-gold at the top, neighborhood below
 *   - "View details →" arrow at the bottom that slides on hover
 *   - Sun-gold border + lift + larger shadow on hover
 *   - 2px sun-gold focus ring for keyboard nav
 *   - Scale(0.98) on press
 *   - Full-card clickable area (no inner-element dead zones)
 *   - Visible section label "Choose your ZIP" with helper text
 *     "Tap to see pricing and availability in your neighborhood"
 *   - Single primary CTA below the rail: "Get a free quote" → /quote
 *     (catches the user who is "not sure which ZIP")
 *
 * The 6 cards still link to /areas/{zip} (the SEO landing page for
 * each ZIP) — destination is unchanged, only the affordance is.
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

          {/* The 6 ZIPs as a labeled, clickable rail below the map.
             The section label + helper text make the purpose obvious
             ("tap to see pricing/availability"), and each card is
             visually a button (light bg, big ZIP, arrow CTA, focus
             ring, press state, full-card click target). */}
          <div className={styles.railBlock}>
            <div className={styles.railLabel}>
              <span className={styles.railLabelEyebrow}>Choose your ZIP</span>
              <span className={styles.railLabelHelper}>
                Tap to see pricing and availability in your neighborhood
              </span>
            </div>

            <nav className={styles.rail} aria-label="Service area ZIP codes">
              {BUSINESS.service_area_zips.map((zip) => {
                const name = serviceAreaMap.pinLocations[zip] ?? 'Largo area';
                return (
                  <Link key={zip} href={`/areas/${zip}`} className={styles.railItem}>
                    <span className={styles.railItemZip}>{zip}</span>
                    <span className={styles.railItemName}>{name}</span>
                    <span className={styles.railItemCta}>
                      View details
                      <svg
                        className={styles.railItemArrow}
                        viewBox="0 0 16 16"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 8h10" />
                        <path d="m9 4 4 4-4 4" />
                      </svg>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <p className={styles.railFootnote}>
              Not sure which ZIP?{' '}
              <Link href="/quote" className={styles.railFootnoteLink}>
                Get a free quote
                <svg
                  className={styles.railFootnoteArrow}
                  viewBox="0 0 16 16"
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 8h10" />
                  <path d="m9 4 4 4-4 4" />
                </svg>
              </Link>{' '}
              — we&apos;ll figure out service area on the call.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
