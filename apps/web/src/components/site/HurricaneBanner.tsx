'use client';

/**
 * HurricaneBanner — capability-bound site banner.
 *
 * Reads `lib/business → BUSINESS.hurricaneModeActive` (today: a
 * constant that defaults to `false`). When the operator flips the
 * `cap_hurricane_mode` capability on, the banner mounts at the top
 * of the page and pushes everything else down by its height.
 *
 * Slide-down animation on mount (240ms) honors `prefers-reduced-motion`
 * via Framer's `useReducedMotion`. **No exit animation by design** —
 * the banner reflects an organizational capability, not a transient UI.
 *
 * Uses fixed copy per the brand voice PRD — every phrase must survive a
 * legal review. Do not edit copy without consulting the brand steward.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { DURATION, EASE } from '@/lib/motion';

import styles from './HurricaneBanner.module.css';

interface HurricaneBannerProps {
  className?: string;
}

export function HurricaneBanner({ className }: HurricaneBannerProps) {
  const reduced = useReducedMotion();
  const phoneHref = `tel:${BUSINESS.phone.replace(/[^\d+]/g, '')}`;

  return (
    <motion.output
      aria-live="polite"
      initial={reduced ? false : { y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: reduced ? 0.01 : DURATION.base,
        ease: EASE.out,
      }}
      className={cn(styles.root, className)}
    >
      <AlertTriangle className={styles.icon} aria-hidden="true" />
      <span className={styles.content}>
        Hurricane mode active. Visits auto-rescheduled. Reply within 24 hours post-storm.{' '}
        <a href={phoneHref} className={styles.link}>
          Call {BUSINESS.phone}
        </a>
      </span>
    </motion.output>
  );
}
