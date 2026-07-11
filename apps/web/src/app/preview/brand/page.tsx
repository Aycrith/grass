/**
 * /preview/brand — renders brand/guidelines.md verbatim + the logo SVG.
 *
 * Anti-brand list here is the source of truth; the 3 homepage edits
 * remove violations of it.
 */

import Image from 'next/image';
import { renderMarkdownFromPath } from '@/lib/markdown';
import { MarkdownPreview } from '@/components/MarkdownPreview';

export const metadata = {
  title: 'Preview — Brand & Voice',
  robots: { index: false, follow: false },
};

export default async function PreviewBrand() {
  const html = await renderMarkdownFromPath(
    'C:/Users/camer/DEVNEW/GRASS/brand/guidelines.md',
  );
  return (
    <>
      <h1>Brand &amp; Voice</h1>
      <div className="preview-callout">
        Source file: <code>brand/guidelines.md</code> (renders verbatim). Logo SVGs live at{' '}
        <code>brand/logo.svg</code> and <code>brand/logo-mark.svg</code>; copies at{' '}
        <code>apps/web/public/*</code>.
      </div>

      <h2>Logo (Wordmark)</h2>
      <div
        style={{
          background: 'var(--ll-cream)',
          padding: '2rem',
          borderRadius: 'var(--radius)',
          textAlign: 'center',
        }}
      >
        <Image
          src="/logo.svg"
          alt="Largo Lawn wordmark logo"
          width={400}
          height={100}
          style={{ maxWidth: '100%', height: 'auto' }}
          priority
        />
      </div>

      <h2>Logo Mark (favicon / app icon)</h2>
      <div
        style={{
          background: 'var(--ll-cream)',
          padding: '2rem',
          borderRadius: 'var(--radius)',
          textAlign: 'center',
        }}
      >
        <Image
          src="/logo-mark.svg"
          alt="Largo Lawn mark"
          width={120}
          height={120}
          style={{ display: 'inline-block' }}
        />
      </div>

      <h2>Brand Guidelines (full document)</h2>
      <MarkdownPreview content={html} />

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        ← <a href="/preview">Back to preview index</a> ·{' '}
        <a href="/preview/decisions">Next: Decision Log →</a>
      </p>
    </>
  );
}