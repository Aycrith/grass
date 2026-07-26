/**
 * /areas - index of all 6 Pinellas neighborhood pages.
 *
 * D-0034 re-authorization. D-0033 deleted this route along
 * with the per-ZIP pages and the per-area components. The
 * form on the homepage (`ServiceAreaMap`) is the primary
 * service-area surface (D-0031); this index is a secondary
 * "explore the neighborhoods" surface for users who want to
 * dig in.
 *
 * 6-card grid of all 6 ZIPs, each card links to
 * `/areas/{zip}`. Card body reads ZIP pill + neighborhood
 * name + 1-line teaser from the `areaDetail` copy. The card
 * uses the same per-area webp as the page it links to, so
 * the index reads as a visual key to the neighborhood pages.
 *
 * The 6 cards render in pinLocation-display order (matches
 * the homepage service-area subhead): Belleair first, then
 * working east to Seminole.
 */

import type { Metadata } from 'next';

import { FadeUp } from '@/components/motion';
import { Container, Eyebrow } from '@/components/site';
import { FinalCTABanner } from '@/components/sections';
import { BUSINESS } from '@/lib/business';
import { areaDetail, areaImages } from '@/lib/content';

import { AreaCard } from './AreaCard';
import styles from './areas.module.css';

export const metadata: Metadata = {
  title: 'Service areas',
  description: `Six Pinellas County neighborhoods we mow on a consistent weekly route: ${BUSINESS.service_area_zips.join(', ')}. Home base is 33771.`,
  alternates: { canonical: '/areas' },
};

/**
 * Display order: matches the homepage pinLocations key
 * order (Belleair → Belleair Bluffs → central → east →
 * Ridgecrest → Seminole). Different from the route-day
 * order (which is the operator's internal scheduling).
 */
const DISPLAY_ORDER: ReadonlyArray<string> = [
  '33756',
  '33770',
  '33771',
  '33773',
  '33774',
  '33778',
];

const STAGGER_STEP_S = 0.06;

export default function AreasIndexPage() {
  return (
    <main className={styles.root}>
      <section className={styles.hero}>
        <Container>
          <FadeUp>
            <Eyebrow tone="default" className={styles.eyebrow}>
              01 — Service areas
            </Eyebrow>
            <h1 className={styles.title}>Six Pinellas neighborhoods.</h1>
            <p className={styles.tagline}>
              Home base is 33771, the heart of Largo. The route reaches into the five adjacent ZIPs
              on a consistent weekly schedule. Click any neighborhood for what mows like there,
              what I do about it, and the local questions that come up at quote-time.
            </p>
          </FadeUp>
        </Container>
      </section>

      <section className={styles.directory}>
        <Container>
          <ul className={styles.grid}>
            {DISPLAY_ORDER.map((zip, i) => {
              const detail = areaDetail[zip];
              if (!detail) return null;
              const imageSlot = areaImages[zip];
              return (
                <li key={zip} className={styles.cardLi}>
                  <AreaCard
                    zip={zip}
                    detail={detail}
                    imageSlot={imageSlot}
                    delay={STAGGER_STEP_S * i}
                  />
                </li>
              );
            })}
          </ul>

          <p className={styles.tail}>
            Outside these six? Type your ZIP in the form on the homepage and we will route you to a
            quote — I am flexible about nearby ZIPs while I am building the route.
          </p>
        </Container>
      </section>

      {/* Page closer — FinalCTABanner is the same one used on /,
       * /pricing, /about, and /services. Without it, a visitor who
       * lands on /areas from a "Largo lawn care 33770" search has
       * no in-page path to /quote besides the header nav. */}
      <FinalCTABanner />
    </main>
  );
}
