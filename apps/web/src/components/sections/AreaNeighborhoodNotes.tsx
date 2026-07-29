/**
 * AreaNeighborhoodNotes — `/areas/[zip]` body section.
 *
 * Three sub-blocks, all reading from `lib/content.ts →
 * areaDetail[zip]`:
 *   1. About the neighborhood — 2-3 paragraphs of real local
 *      content (neighborhood character, lot patterns, what mows
 *      like here). Cream surface, Fraunces sub-heading.
 *   2. Nearby landmarks — bulleted list of 4-5 real local
 *      places the user would recognize.
 *   3. Common lawn challenges — 3 bullets of the real
 *      challenges for this ZIP, paired with the operator's
 *      "what I do about it" line.
 *
 * Surfaces alternate so the reader feels a rhythm:
 * cream (about) → sand-bleached (landmarks) → cream (challenges).
 * Matches the visual rhythm of OperatorBio on the /about page.
 *
 * D-0030 rule: below-the-fold sections render flat (no FadeUp
 * wrappers). The about/landmarks/challenges blocks all live in
 * the second fold of the per-area page; they render statically
 * on first paint, no fade-up cascade.
 */

import type { ReactNode } from 'react';

import { Container, Eyebrow, Section } from '@/components/site';
import { cn } from '@/lib/cn';
import type { AreaDetail } from '@/lib/content';

import styles from './AreaNeighborhoodNotes.module.css';

interface AreaNeighborhoodNotesProps {
  detail: AreaDetail;
  className?: string | undefined;
}

export function AreaNeighborhoodNotes({
  detail,
  className,
}: AreaNeighborhoodNotesProps): ReactNode {
  return (
    <>
      <Section rhythm="loose" className={cn(styles.aboutSection, className)}>
        <Container>
          <div className={styles.aboutHeader}>
            <Eyebrow tone="default">About this neighborhood</Eyebrow>
            <h2 className={styles.aboutHeading}>{detail.name}, on the ground.</h2>
          </div>
          <div className={styles.aboutBody}>
            {detail.about.map((para) => (
              <div key={para} className={styles.aboutParagraph}>
                <p>{para}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section rhythm="loose" className={cn(styles.landmarksSection, className)}>
        <Container>
          <div className={styles.landmarksInner}>
            <div className={styles.landmarksHeader}>
              <Eyebrow tone="default">Nearby landmarks</Eyebrow>
              <h2 className={styles.landmarksHeading}>Where you know me from.</h2>
              <p className={styles.landmarksSub}>
                The places in and around {detail.name} I drive past on the route. If you live near
                one of them, you have probably seen the mower.
              </p>
            </div>
            <div className={styles.landmarksList}>
              <ul>
                {detail.landmarks.map((landmark) => (
                  <li key={landmark}>{landmark}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section rhythm="loose" className={cn(styles.challengesSection, className)}>
        <Container>
          <div className={styles.challengesInner}>
            <div className={styles.challengesHeader}>
              <Eyebrow tone="default">Common lawn challenges</Eyebrow>
              <h2 className={styles.challengesHeading}>What mows like here.</h2>
              <p className={styles.challengesSub}>
                The three things that come up most often on {detail.zip} lots — and how I handle
                them on the route.
              </p>
            </div>
            <ul className={styles.challengesList}>
              {detail.challenges.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className={styles.challengesWhat}>
              <Eyebrow tone="default">What I do here</Eyebrow>
              <ul className={styles.whatWeDoList}>
                {detail.whatWeDo.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
