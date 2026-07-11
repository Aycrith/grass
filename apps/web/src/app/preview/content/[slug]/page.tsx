/**
 * /preview/content/[slug] — renders one of the 13 customer-facing
 * content artifacts as a full markdown page.
 *
 * Path is looked up from a static registry so we don't take a path
 * injection from the URL.
 */

import { notFound } from 'next/navigation';
import { renderMarkdownFromPath } from '@/lib/markdown';
import { MarkdownPreview } from '@/components/MarkdownPreview';

export const metadata = {
  title: 'Preview — Customer Content',
  robots: { index: false, follow: false },
};

const REGISTRY: Record<string, { path: string; title: string; nav: string }> = {
  'gbp-qa': {
    path: 'C:/Users/camer/DEVNEW/GRASS/content/gbp-qa.md',
    title: 'GBP Q&A — 12 Pre-emptive Answers',
    nav: 'Customer Content',
  },
  'phone-scripts': {
    path: 'C:/Users/camer/DEVNEW/GRASS/content/phone-scripts.md',
    title: 'Phone Scripts — S1/S2/S3',
    nav: 'Customer Content',
  },
  'email-templates': {
    path: 'C:/Users/camer/DEVNEW/GRASS/content/email-templates.md',
    title: 'Email Templates — T1..T7',
    nav: 'Customer Content',
  },
  'sms-templates': {
    path: 'C:/Users/camer/DEVNEW/GRASS/content/sms-templates.md',
    title: 'SMS Templates — S1..S10',
    nav: 'Customer Content',
  },
  'business-card': {
    path: 'C:/Users/camer/DEVNEW/GRASS/content/assets/business-card.md',
    title: 'Business Card — Print Spec',
    nav: 'Customer Content',
  },
  'door-hanger': {
    path: 'C:/Users/camer/DEVNEW/GRASS/content/assets/door-hanger.md',
    title: 'Door Hanger — Spec + Copy',
    nav: 'Customer Content',
  },
  'yard-sign': {
    path: 'C:/Users/camer/DEVNEW/GRASS/content/assets/yard-sign.md',
    title: 'Yard Sign — Spec + Copy',
    nav: 'Customer Content',
  },
  'review-magnet-card': {
    path: 'C:/Users/camer/DEVNEW/GRASS/content/assets/review-magnet-card.md',
    title: 'Review-Magnet Card — Spec + Copy',
    nav: 'Customer Content',
  },
  'gbp-photo-spec': {
    path: 'C:/Users/camer/DEVNEW/GRASS/content/assets/gbp-photo-spec.md',
    title: 'GBP Photo Spec — 10 Compositions',
    nav: 'Customer Content',
  },
  'quote-template': {
    path: 'C:/Users/camer/DEVNEW/GRASS/content/templates/quote-template.md',
    title: 'Quote Template',
    nav: 'Customer Content',
  },
  'invoice-template': {
    path: 'C:/Users/camer/DEVNEW/GRASS/content/templates/invoice-template.md',
    title: 'Invoice Template',
    nav: 'Customer Content',
  },
  'waiver-of-liability': {
    path: 'C:/Users/camer/DEVNEW/GRASS/content/templates/waiver-of-liability.md',
    title: 'Waiver of Liability',
    nav: 'Customer Content',
  },
  'follow-up-card': {
    path: 'C:/Users/camer/DEVNEW/GRASS/content/templates/follow-up-card.md',
    title: 'Quote Follow-Up Card',
    nav: 'Customer Content',
  },
};

export async function generateStaticParams() {
  return Object.keys(REGISTRY).map((slug) => ({ slug }));
}

export default async function PreviewContentDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = REGISTRY[slug];
  if (!entry) {
    notFound();
  }
  const html = await renderMarkdownFromPath(entry.path);
  return (
    <>
      <h1>{entry.title}</h1>
      <div className="preview-callout">
        Source file: <code>{entry.path.replace('C:/Users/camer/DEVNEW/GRASS/', '')}</code>
      </div>
      <MarkdownPreview content={html} />
      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        ← <a href="/preview/content">Back to {entry.nav}</a> ·{' '}
        <a href="/preview">Back to preview index</a>
      </p>
    </>
  );
}