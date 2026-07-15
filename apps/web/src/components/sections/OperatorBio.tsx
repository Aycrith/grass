/**
 * OperatorBio — `/about` body section.
 *
 * Three sub-blocks, all reading from `lib/content.ts →
 * aboutPage`:
 *   1. Mission        — short editorial paragraph
 *   2. Why Solo?      — short editorial paragraph
 *   3. Our Values     — 4-card grid
 *   4. Service register — bulleted list of active capabilities
 *
 * Alternates surfaces so the reader feels a rhythm:
 * cream (mission/why) → sand-bleached (values) → cream
 * (register). Each block reads as a focused column.
 */

import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { Eyebrow, Section } from '@/components/site';
import { cn } from '@/lib/cn';
import { aboutPage } from '@/lib/content';

import styles from './OperatorBio.module.css';

interface OperatorBioProps {
  className?: string | undefined;
}

export function OperatorBio({ className }: OperatorBioProps): ReactNode {
  return (
    <>
      <Section rhythm="loose" className={cn(styles.missionSection, className)}>
        <div className="container">
          <FadeUp className={styles.prose}>
            <Eyebrow tone="default" >
              {aboutPage.missionEyebrow}
            </Eyebrow>
            <p className={styles.body}>{aboutPage.mission}</p>
          </FadeUp>

          <FadeUp className={styles.prose}>
            <Eyebrow tone="default" >
              {aboutPage.whySoloEyebrow}
            </Eyebrow>
            <p className={styles.body}>{aboutPage.whySolo}</p>
          </FadeUp>
        </div>
      </Section>

      <Section rhythm="loose" className={cn(styles.valuesSection, className)}>
        <div className="container">
          <header className={styles.valuesHeader}>
            <Eyebrow tone="default" >
              {aboutPage.valuesEyebrow}
            </Eyebrow>
            <h2 className={styles.valuesHeading}>{aboutPage.valuesEyebrow}.</h2>
          </header>
          <div className={styles.valuesGrid}>
            {aboutPage.values.map((v) => (
              <FadeUp key={v.label} className={styles.valueCard}>
                <span className={styles.valueLabel}>{v.label}</span>
                <p className={styles.valueBody}>{v.body}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section rhythm="loose" className={cn(styles.registerSection, className)}>
        <div className="container">
          <FadeUp className={styles.registerInner}>
            <Eyebrow tone="default" >
              {aboutPage.registerEyebrow}
            </Eyebrow>
            <ul className={styles.registerList}>
              {aboutPage.register.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
