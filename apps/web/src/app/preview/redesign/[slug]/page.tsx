/**
 * Renders any PRD markdown file from product/front-end-redesign/.
 * Lets steward read the source documents without leaving the app.
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const ROOT = 'C:/Users/camer/DEVNEW/GRASS/product/front-end-redesign';

// New PRD slug map (these don't all exist as files yet)
const REDESIGN_SLUGS = [
  { slug: 'README', title: 'Index' },
  { slug: '00-master-prd', title: 'Master PRD' },
  { slug: '01-design-system-prd', title: 'Design system' },
  { slug: '02-content-model', title: 'Content model' },
  { slug: '03-surfaces-prd', title: 'Surface specs' },
  { slug: '04-motion-and-microinteractions', title: 'Motion' },
  { slug: '05-photography-and-illustration-brief', title: 'Photography' },
  { slug: '06-work-packages', title: 'Work packages' },
  { slug: '07-success-metrics', title: 'Success metrics' },
];

export const dynamicParams = false;

export function generateStaticParams() {
  return REDESIGN_SLUGS.map(s => ({ slug: s.slug }));
}

export default async function RedesignPrdPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const file = `${slug}.md`;
  let raw = '';
  try {
    raw = await readFile(join(ROOT, file), 'utf-8');
  } catch {
    notFound();
  }

  return (
    <>
      <section className="hero" style={{ background: 'var(--ll-cream)' }}>
        <div className="container">
          <p style={{ margin: 0, fontSize: '0.85rem' }}>
            <Link href="/preview">← Preview index</Link>
            {' · '}
            <Link href="/preview/design">Design system</Link>
          </p>
          <h1 style={{ color: 'var(--ll-green)', marginTop: '0.5rem' }}>{file}</h1>
          <p className="lead">
            Source PRD document, rendered verbatim. Open in any markdown editor for
            power-user viewing.
          </p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            <strong>File path:</strong>{' '}
            <code>product/front-end-redesign/{file}</code>
          </p>
        </div>
      </section>

      <div className="container" style={{ maxWidth: 900, padding: '2rem 1.5rem' }}>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            background: 'white',
            padding: '1.5rem',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            fontSize: '0.95rem',
            lineHeight: 1.65,
            fontFamily: 'ui-monospace, "SF Mono", monospace',
          }}
        >
          {raw}
        </pre>
      </div>
    </>
  );
}
