/**
 * `hero-3d-test` route — real-browser review surface for HeroScene3D.
 *
 * D-0048 redesign mount surface. Renders the scene in isolation with
 * mock MotionValues that simulate "scene 2 fully revealed" — opacity 1,
 * contentOpacity 1, scrollProgress 1.0 (full camera orbit). Steward
 * navigates to this URL in a real browser to see the WebGL render
 * with parallax + wind sway + frame cycling.
 *
 * Headless Chrome drops the WebGL context in this env, so Playwright
 * captures only show the static fallback. THIS route is how we get
 * visual confirmation of the actual Three.js scene.
 *
 * Test page only. noindex, no nav link.
 */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Hero 3D Test',
  description: 'Internal — D-0048 HeroScene3D real-browser review surface.',
  robots: { index: false, follow: false },
};

export default function Hero3DTestLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}