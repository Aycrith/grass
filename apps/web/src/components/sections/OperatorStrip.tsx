'use client';

/**
 * OperatorStrip — Mission 1 "Hi, I'm the guy mowing your
 * neighbor's yard" first-person block.
 *
 * Sits between hero and service bento on the homepage. Shows the
 * operator portrait (parallax 0.3×), a 2-3 sentence bio, and
 * (since WP14) a horizontal "tools I run" metabar in place of
 * the legacy 2×2 webp tile grid.
 *
 * The metabar trades webp tile micro-photography for typographic
 * clarity — four italic-Fraunces model names with sun-colored
 * dots in a clay-bordered column, mirroring the OperatorNote
 * "clay rule + portrait" idiom. Reads as operator voice more
 * directly than tiny webps did, and removes the only place on
 * the page that rendered the equipment webp slots.
 *
 * Copy flows from `lib/content.ts → operator` so the steward
 * can edit it without touching this component.
 *
 * Imagery: SVG placeholder. Steward swaps in real .webp at the
 * same paths. Until then, components degrade honestly.
 */

import Image from 'next/image';
import type { ReactNode } from 'react';

import { FadeUp, ParallaxImage } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { Illustration } from '@/components/ui';
import { cn } from '@/lib/cn';
import { operator } from '@/lib/content';

import styles from './OperatorStrip.module.css';

interface OperatorStripProps {
  className?: string;
}

export function OperatorStrip({ className }: OperatorStripProps): ReactNode {
  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <div className={styles.inner}>
          <FadeUp>
            <ParallaxImage offset={40} className={styles.portrait}>
              <div className={styles.portraitInner}>
                <Image
                  src="/operator/portrait.webp"
                  alt={`Portrait of ${operator.name}, Largo Lawn operator`}
                  fill
                  sizes="(max-width: 980px) 100vw, 320px"
                />
              </div>
            </ParallaxImage>
          </FadeUp>

          <div className={styles.bio}>
            <Eyebrow tone="default" dot className={styles.bioEyebrow}>
              02 — The operator
            </Eyebrow>
            <h2 className={styles.bioHeading}>
              Hi, I'm <em>{operator.name}</em>.
            </h2>
            <span className={styles.bioMeta}>
              {operator.yearsMowing} years cutting grass in 33771
            </span>
            <p className={styles.bioBody}>{operator.bio}</p>

            {/* WP15 — editorial "operator signature mark" closing the bio.
             * A sun-color rule + centered pinellas-palm + city caption,
             * reading as the operator's signed mark. Florida identity
             * is the operator identity. */}
            <div className={styles.bioSignature} aria-hidden="true">
              <span className={styles.bioSignatureRule} />
              <Illustration
                src="/illustrations/pinellas-palm-v3-72.webp"
                alt=""
                width={72}
                height={72}
                className={styles.bioSignatureMark}
              />
              <p className={styles.bioSignatureCity}>Largo · Florida</p>
            </div>
          </div>

          <div className={styles.equipment}>
            <p className={styles.equipmentTitle}>What I run</p>
            <FadeUp>
              <ul className={styles.toolBar} aria-label="Equipment list">
                {operator.equipment.map((item) => (
                  <li key={item.name} className={styles.tool}>
                    <span className={styles.toolDot} aria-hidden="true" />
                    <span className={styles.toolModel}>{item.name}</span>
                    <span className={styles.toolUse}>{item.use}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>
        </div>
      </div>
    </Section>
  );
}
