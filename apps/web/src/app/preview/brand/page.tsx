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

      <h2>Logo Mark — v3 (painted storybook, default)</h2>
      <div
        style={{
          background: 'var(--ll-cream)',
          padding: '2rem',
          borderRadius: 'var(--radius)',
          textAlign: 'center',
        }}
      >
        {/* Plain <img> on purpose: srcSet drives the responsive webp. */}
        {/* biome-ignore lint/performance/noImgElement: srcSet is a feature here */}
        <img
          src="/illustrations/logo-mark-v3-128.webp"
          srcSet="/illustrations/logo-mark-v3-32.webp 32w, /illustrations/logo-mark-v3-64.webp 64w, /illustrations/logo-mark-v3-128.webp 128w, /illustrations/logo-mark-v3-256.webp 256w, /illustrations/logo-mark-v3-1024.webp 1024w"
          sizes="120px"
          alt="Largo Lawn mark — painted storybook v3"
          width={120}
          height={120}
          style={{ display: 'inline-block' }}
        />
      </div>

      <h3>Logo Mark — v1 (line art, legacy / favicon)</h3>
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
          alt="Largo Lawn mark — line art v1"
          width={120}
          height={120}
          style={{ display: 'inline-block' }}
        />
      </div>

      <h2>Quote Mark — v3 (painted storybook, default in FinalCTABanner)</h2>
      <div
        style={{
          background: 'var(--ll-palm-shadow)',
          padding: '2rem',
          borderRadius: 'var(--radius)',
          textAlign: 'center',
        }}
      >
        <img
          src="/illustrations/quote-mark-v3-56.webp"
          srcSet="/illustrations/quote-mark-v3-56.webp 56w, /illustrations/quote-mark-v3-120.webp 120w, /illustrations/quote-mark-v3-240.webp 240w, /illustrations/quote-mark-v3-480.webp 480w"
          sizes="56px"
          alt="Largo Lawn quote mark — painted storybook v3"
          width={56}
          height={45}
          style={{ display: 'inline-block' }}
        />
      </div>

      <h3>Quote Mark — v1 (line art, legacy)</h3>
      <div
        style={{
          background: 'var(--ll-palm-shadow)',
          padding: '2rem',
          borderRadius: 'var(--radius)',
          textAlign: 'center',
        }}
      >
        <Image
          src="/illustrations/quote-mark.svg"
          alt="Largo Lawn quote mark — line art v1"
          width={56}
          height={45}
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