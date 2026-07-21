/**
 * `hero-3d-test` route — real-browser review surface for SecondScene.
 *
 * D-0049 — replaced D-0048's Three.js HeroScene3D import with the
 * pure-CSS SecondScene component. The route name (`hero-3d-test`)
 * is preserved for backwards compatibility (steward's bookmark),
 * but the component mounted is now SecondScene (no WebGL).
 *
 * Test page only. noindex, no nav link.
 */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Hero SecondScene Test',
  description:
    'Internal — D-0049 SecondScene real-browser review surface. Pure-CSS painted-scene cycle + palms foreground parallax.',
  robots: { index: false, follow: false },
};

export default function Hero3DTestLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
