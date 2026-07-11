/**
 * /preview/gbp — renders drafts/gbp/profile-content.md.
 *
 * Every GBP field is pre-filled and ready to copy-paste into
 * https://business.google.com/ when the steward is ready.
 */

import { renderMarkdownFromPath } from '@/lib/markdown';
import { MarkdownPreview } from '@/components/MarkdownPreview';

export const metadata = {
  title: 'Preview — GBP Profile',
  robots: { index: false, follow: false },
};

export default async function PreviewGbp() {
  const html = await renderMarkdownFromPath(
    'C:/Users/camer/DEVNEW/GRASS/drafts/gbp/profile-content.md',
  );
  return (
    <>
      <h1>GBP Profile — Copy-Paste-Ready</h1>
      <div className="preview-callout">
        <strong>Source file:</strong> <code>drafts/gbp/profile-content.md</code>. When ready to
        file: open <a href="https://business.google.com/">business.google.com</a>, paste these
        fields one by one. Postcard arrives in 5-14 days at your real mailbox.
      </div>
      <MarkdownPreview content={html} />

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        ← <a href="/preview">Back to preview index</a> ·{' '}
        <a href="/preview/profit">← Profitability</a> ·{' '}
        <a href="/preview/citations">Next: Citation Plan →</a>
      </p>
    </>
  );
}