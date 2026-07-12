'use client';

/**
 * OperatorStrip — Mission 1 "Hi, I'm the guy mowing your
 * neighbor's yard" first-person block.
 *
 * Sits between hero and service bento on the homepage. Shows the
 * operator portrait (parallax 0.3×), a 2-3 sentence bio, and a
 * 2×2 grid of equipment tiles (mower / trimmer / blower / edger).
 *
 * All copy flows from `lib/content.ts → operator` so the steward
 * can edit it without touching this component.
 *
 * Imagery: SVG placeholder. Steward swaps in real .webp at the
 * same paths. Until then, components degrade honestly.
 */

import Image from 'next/image';
import type { ReactNode } from 'react';

import { FadeUp, ParallaxImage, StaggerGroup } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
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
          </div>

          <div className={styles.equipment}>
            <p className={styles.equipmentTitle}>What I run</p>
            <StaggerGroup as="div" className={styles.equipmentGrid} childDelay={0.06}>
              {operator.equipment.map((item) => {
                const slug = item.use.toLowerCase().includes('mower')
                  ? 'mower'
                  : item.use.toLowerCase().includes('trimmer')
                    ? 'trimmer'
                    : item.use.toLowerCase().includes('blower')
                      ? 'blower'
                      : item.use.toLowerCase().includes('edger')
                        ? 'edger'
                        : 'mower';
                return (
                  <div key={item.name} className={styles.equipmentTile}>
                    <div className={styles.equipmentImage}>
                      <Image
                        src={`/equipment/${slug}.webp`}
                        alt={item.use}
                        width={200}
                        height={150}
                      />
                    </div>
                    <p className={styles.equipmentName}>{item.name}</p>
                    <p className={styles.equipmentUse}>{item.use}</p>
                  </div>
                );
              })}
            </StaggerGroup>
          </div>
        </div>
      </div>
    </Section>
  );
}
