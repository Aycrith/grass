'use client';

/**
 * Public exports for the motion component family.
 * Imported as:  import { FadeUp, StaggerGroup, WordReveal } from '@/components/motion';
 */

export {
  FadeUp,
  StaggerGroup,
  WordReveal,
  ParallaxImage,
  PinnedSection,
  ScrollReveal,
  fadeUpVariants,
  fadeInVariants,
  scaleInVariants,
  wordRevealVariants,
  staggerContainerVariants,
  useFadeUp,
  type UseFadeUpResult,
} from './variants';

export { LenisProvider } from './LenisProvider';
export { MotionConfig } from './MotionConfig';
export {
  useViewportMotion,
  VIEWPORT_MOTION_VARIANTS,
  type ViewportMotionLayerId,
  type ViewportMotionPreset,
  type ViewportMotionResult,
} from './useViewportMotion';
