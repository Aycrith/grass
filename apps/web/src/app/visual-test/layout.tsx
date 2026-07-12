/**
 * `_visual` test-only route group.
 *
 * Excluded from sitemap + `robots: noindex`. NOT linked from any nav. The
 * only consumer is Playwright via `visual/components.spec.ts`, which
 * navigates to `/_visual#hero-cinematic` (etc.) and captures each section
 * in isolation.
 *
 * Lives under `app/` (rather than outside it) so the route inherits the
 * root layout's metadata + globals.css without a parallel setup.
 */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Visual Regression Surface',
  description: 'Internal — Playwright visual regression mounts only.',
  robots: { index: false, follow: false },
};

export default function VisualLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
