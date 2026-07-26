/**
 * Preview layout - wraps every /preview/* route in a sidebar + main
 * grid. Surfaces a "PREVIEW BUILD" banner reminding the steward that
 * nothing is purchased, registered, or live.
 *
 * SEO: every /preview/* route is steward-only internal
 * documentation (citations, design previews, content drafts,
 * profit scenarios, runbooks, compliance review). noindex so
 * Google never indexes any of them — the in-page "PREVIEW
 * BUILD" banner is the human-readable signal; the meta robots
 * tag is the crawler-readable signal. Without this, all
 * 30+ /preview/* routes would inherit the root layout's
 * `index: true` and risk being served in search results.
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { PREVIEW_NAV } from '@/lib/preview-nav';

export const metadata: Metadata = {
  title: 'Preview · Steward-only',
  description:
    'Steward-only preview surfaces (citations, design, content, runbooks, compliance). Not for public indexing.',
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="preview-layout">
      <aside className="preview-sidebar">
        <div className="preview-banner">
          PREVIEW BUILD
          <br />
          Localhost only. Do not purchase domain yet.
        </div>
        <h2>Surface Map</h2>
        <nav>
          <Link href="/preview">
            <strong>Index</strong>
            <small>Roadmap + checklist</small>
          </Link>
          {PREVIEW_NAV.map((item) => (
            <Link key={item.slug} href={`/preview/${item.slug}`}>
              {item.label}
              <small>{item.description}</small>
            </Link>
          ))}
        </nav>
        <h2 style={{ marginTop: '1.5rem' }}>Marketing</h2>
        <nav>
          <Link href="/">
            <small>← back to main site</small>
          </Link>
        </nav>
      </aside>
      <main className="preview-main">{children}</main>
    </div>
  );
}