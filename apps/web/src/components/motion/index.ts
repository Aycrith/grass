'use client';

/**
 * Public exports for the motion component family.
 * Imported as:  import { FadeUp, StaggerGroup, useFadeUp } from '@/components/motion';
 *
 * Verified consumers (rg -e "import.*<name> from '@/components/motion'"):
 *   - FadeUp (heavily used across all section components)
 *   - StaggerGroup (used by EquipmentShowcase, ServiceAreaStats)
 *   - useFadeUp (used by AreaCard, ServiceBento, ServiceDirectory)
 *   - useViewportMotion (used by HeroFieldTelemetry)
 *   - LenisProvider, MotionConfig (mounted in app/layout.tsx)
 *
 * The following are defined but NOT re-exported because no consumer
 * imports them — they live in the source file for future use:
 *   - WordReveal, ParallaxImage, PinnedSection, ScrollReveal
 *   - fadeUpVariants, fadeInVariants, scaleInVariants,
 *     wordRevealVariants, staggerContainerVariants (raw framer
 *     variant objects, only used internally)
 *   - VIEWPORT_MOTION_VARIANTS (consumed inside useViewportMotion.tsx)
 *   - UseFadeUpResult, ViewportMotionPreset, ViewportMotionResult
 *     (internal types)
 *
 * When a future section needs one of these, add the export — it's
 * 1 line.
 */

export { FadeUp, StaggerGroup, useFadeUp } from './variants';
export { LenisProvider } from './LenisProvider';
export { MotionConfig } from './MotionConfig';
export { useViewportMotion, type ViewportMotionLayerId } from './useViewportMotion';
