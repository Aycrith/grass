'use client';

/**
 * SpecimenPlate — D-0057 editorial "field guide" section.
 *
 * A 2x2 grid of pressed-herbarium turf grass specimens, placed
 * between ServiceBento ("what we do") and PricingTiers ("what it
 * costs"). Introduces the page's THIRD visual register — sepia
 * line art + light olive wash on aged cream paper — alongside the
 * existing folk-cartoon (D-0049) and painted-VEO (D-0053) registers.
 *
 * Closes a specific diagnostic gap: the page shows the operator
 * mowing lawns, but the visitor never sees the operator's plant
 * knowledge. The four specimens answer the practical question
 * "what's actually growing in my yard, and do you know how to
 * mow it properly?" with real, falsifiable UF/IFAS data.
 *
 * Design rationale (full brief in
 * apps/web/audit/d-0057-specimen-plate/memo.md):
 *
 *   - 5 vertical zones: eyebrow → H2 → subhead → 2x2 grid → closing.
 *   - Section background: faint aged-paper wash (the "next page
 *     in the same field notebook" register) — slightly darker
 *     than the cream sections above + below.
 *   - 4 hand-authored SVG specimens (340x340 viewBox), each with
 *     its own internal label + tag — they are self-contained
 *     units, not assembled by the component.
 *   - Entry animations: 4 plates fade-in staggered (0/100/200/300ms),
 *     closing line fade-up at 0.6s delay. All gated by
 *     prefers-reduced-motion: reduce.
 *   - Hover/focus: each plate subtly rotates -0.5deg and its
 *     internal "tag" rises from 50% to 100% opacity — the museum
 *     "exhibition card" pattern.
 *
 * The section's copy is grounded in real UF/IFAS Extension
 * recommendations (mowing height, frequency, spread mechanism)
 * — no invented numbers.
 */

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef, type ReactNode } from 'react';

import { Container, Section } from '@/components/site';

import styles from './SpecimenPlate.module.css';

interface Specimen {
  id: string;
  name: string;
  src: string;
  /** Inline label that appears in the "card caption" under the plate */
  caption: string;
}

const SPECIMENS: Specimen[] = [
  {
    id: 'st-augustine',
    name: 'St. Augustinegrass',
    src: '/specimens/st-augustine.svg',
    caption: 'The dominant Pinellas lawn. 80% of 33771.',
  },
  {
    id: 'bermuda',
    name: 'Bermudagrass',
    src: '/specimens/bermuda.svg',
    caption: 'Full sun only. Mowed short, often.',
  },
  {
    id: 'zoysia',
    name: 'Zoysiagrass',
    src: '/specimens/zoysia.svg',
    caption: 'Dense, slow-growing, the premium pick.',
  },
  {
    id: 'bahia',
    name: 'Bahiagrass',
    src: '/specimens/bahia.svg',
    caption: '"Highway grass" — tough, low-rent, rhizomes only.',
  },
];

export function SpecimenPlate(): ReactNode {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.15 });

  return (
    <Section
      tone="default"
      className={styles.root}
      data-test-section="specimen-plate"
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
              Field guide <span className={styles.eyebrowDot} aria-hidden="true">·</span>{' '}
              06 <span className={styles.eyebrowDot} aria-hidden="true">·</span>{' '}
              Turf grasses of Pinellas County
            </span>
            <h2 className={styles.headline}>
              Four species, four heights.
            </h2>
            <p className={styles.subhead}>
              St. Augustine covers about 80% of the lawns in 33771.
              The other 20% is Bermuda, Zoysia, and the occasional
              Bahia. They look similar. They mow completely
              differently. Mowing Floratam at 2 inches is a 4-week
              recovery. Mowing Bermuda at 4 inches is a thatch
              disaster. The grass in your yard is the grass I plan
              around.
            </p>
          </motion.div>

          {/* Zone 4: 2x2 grid of 4 specimens */}
          <div ref={gridRef} className={styles.grid}>
            {SPECIMENS.map((spec, i) => (
              <motion.figure
                key={spec.id}
                className={styles.specimen}
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ rotate: -0.5 }}
                tabIndex={0}
                aria-label={`${spec.name} — pressed specimen`}
              >
                <div className={styles.specimenImage}>
                  <Image
                    src={spec.src}
                    alt={`Pressed specimen of ${spec.name}`}
                    width={340}
                    height={340}
                    className={styles.specimenImageInner}
                    priority={false}
                  />
                </div>
                <figcaption className={styles.caption}>
                  <span className={styles.captionName}>{spec.name}</span>
                  <span className={styles.captionNote}>{spec.caption}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>

          {/* Zone 5: closing line (the brand-true kicker) */}
          <motion.p
            className={styles.closing}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            If you don&apos;t know what&apos;s in your yard,{' '}
            <a href="mailto:hello@grass.lan" className={styles.closingLink}>
              send a photo
            </a>
            . I&apos;ll tell you before I quote.
          </motion.p>
        </div>
      </Container>
    </Section>
  );
}
