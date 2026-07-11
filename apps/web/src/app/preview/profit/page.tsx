/**
 * /preview/profit — renders research/market/profitability-roadmap.md.
 *
 * This is the artifact that answers "will this actually make money?"
 * Three scenarios: conservative ($24K Y1), stretch ($44K), pessimistic ($8K).
 */

import { renderMarkdownFromPath } from '@/lib/markdown';
import { MarkdownPreview } from '@/components/MarkdownPreview';

export const metadata = {
  title: 'Preview — Profitability Roadmap',
  robots: { index: false, follow: false },
};

export default async function PreviewProfit() {
  const html = await renderMarkdownFromPath(
    'C:/Users/camer/DEVNEW/GRASS/research/market/profitability-roadmap.md',
  );
  return (
    <>
      <h1>Profitability Roadmap</h1>
      <div className="preview-callout">
        Source file: <code>research/market/profitability-roadmap.md</code>. Three scenarios
        (conservative $24K Y1, stretch $44K, pessimistic $8K). Breakeven at Month 3-4. All
        scenarios stay under $200/mo infra ceiling through Month 6.
      </div>

      <MarkdownPreview content={html} />

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        ← <a href="/preview">Back to preview index</a> ·{' '}
        <a href="/preview/brand">← Brand</a> ·{' '}
        <a href="/preview/gbp">Next: GBP Profile →</a>
      </p>
    </>
  );
}