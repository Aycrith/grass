/**
 * Preview layout — wraps every /preview/* route in a sidebar + main
 * grid. Surfaces a "PREVIEW BUILD" banner reminding the steward that
 * nothing is purchased, registered, or live.
 */

import Link from 'next/link';
import { PREVIEW_NAV } from '@/lib/preview-nav';

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="preview-layout">
      <aside className="preview-sidebar">
        <div className="preview-banner">
          PREVIEW BUILD
          <br />
          Localhost only — do not purchase domain yet
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