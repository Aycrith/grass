'use client';

/**
 * AreaCard — animated card root for the /areas directory grid.
 *
 * One card per neighborhood ZIP. The motion(Link) is the card root;
 * it carries the fade-up variants itself so the surrounding <li>
 * with `display: contents` is the only DOM between the grid and
 * the anchor. Reduces one DOM level versus the previous FadeUp
 * wrapper arrangement.
 *
 * Stagger is driven by a `delay` prop passed from the parent map.
 * `prefers-reduced-motion` collapses duration + delay to near-zero.
 */

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { useFadeUp } from '@/components/motion';
import type { AreaDetail } from '@/lib/content';

import styles from './areas.module.css';

const MotionLink = motion(Link);

interface AreaCardProps {
  zip: string;
  detail: AreaDetail;
  imageSlot?: string | undefined;
  delay?: number;
}

export function AreaCard({
  zip,
  detail,
  imageSlot,
  delay = 0,
}: AreaCardProps): ReactNode {
  const { ref, fadeUpProps } = useFadeUp<HTMLAnchorElement>(delay);

  return (
    <MotionLink
      ref={ref}
      href={`/areas/${zip}`}
      className={styles.card}
      aria-label={detail.name}
      {...fadeUpProps}
    >
      <article>
        <div className={styles.imageWrap}>
          {imageSlot && (
            <Image
              src={imageSlot}
              alt={`Painted ${detail.name} neighborhood at golden hour`}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className={styles.image}
            />
          )}
          <span className={styles.zipPill}>ZIP {zip}</span>
        </div>
        <div className={styles.body}>
          <h2 className={styles.cardTitle}>{detail.name}</h2>
          <p className={styles.cardTeaser}>{detail.tagline.split('.')[0]}.</p>
          <span className={styles.cardLink} aria-hidden="true">
            View neighborhood details
            <span className={styles.cardLinkArrow}>→</span>
          </span>
        </div>
      </article>
    </MotionLink>
  );
}
