'use client';

/**
 * MotionConfig — global Framer Motion configuration.
 *
 * Sets `reducedMotion="user"` so every motion.* component on the tree honors
 * the user's OS-level `prefers-reduced-motion: reduce` preference. Pairs with
 * `LenisProvider` and the CSS-level gate in styles/motion.css.
 */

import { MotionConfig as FramerMotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

interface MotionConfigProps {
  children: ReactNode;
}

export function MotionConfig({ children }: MotionConfigProps) {
  return (
    <FramerMotionConfig reducedMotion="user" transition={{ ease: 'easeOut' }}>
      {children}
    </FramerMotionConfig>
  );
}
