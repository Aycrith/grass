/**
 * /preview/content — surfaces all 13 customer-facing content artifacts
 * (Phase 2 = 4, Phase 3 = 9) authored in content/.
 *
 * Each card links to a full rendered markdown page under
 * /preview/content/[slug]. The markdown files themselves live at
 * content/{gbp-qa,phone-scripts,email-templates,sms-templates}.md and
 * content/{assets,templates}/*.md.
 */

import Link from 'next/link';

export const metadata = {
  title: 'Preview — Customer-Facing Content',
  robots: { index: false, follow: false },
};

const CONTENT_GROUPS = [
  {
    heading: 'Phase 2 — Customer-facing content',
    items: [
      {
        slug: 'gbp-qa',
        label: 'GBP Q&A — 12 pre-emptive answers',
        description:
          'Rain mowing, frequency, licensing honesty, gates/dogs, hurricane mode, etc.',
        path: 'C:/Users/camer/DEVNEW/GRASS/content/gbp-qa.md',
        trigger: 'Before GBP creation',
      },
      {
        slug: 'phone-scripts',
        label: 'Phone scripts — S1/S2/S3',
        description:
          'Inbound new customer, outbound pilot outreach, weather cancellation',
        path: 'C:/Users/camer/DEVNEW/GRASS/content/phone-scripts.md',
        trigger: 'Pilot #1',
      },
      {
        slug: 'email-templates',
        label: 'Email templates — T1..T7',
        description:
          'Welcome, quote confirm, reminder, review request, follow-up, cancel, hurricane',
        path: 'C:/Users/camer/DEVNEW/GRASS/content/email-templates.md',
        trigger: 'Pilot #1',
      },
      {
        slug: 'sms-templates',
        label: 'SMS templates — S1..S10',
        description:
          '160-char or fewer texts: review, on-the-way, weather, hurricane, quote ready',
        path: 'C:/Users/camer/DEVNEW/GRASS/content/sms-templates.md',
        trigger: 'Pilot #1',
      },
    ],
  },
  {
    heading: 'Phase 3 — Printable & digital assets',
    items: [
      {
        slug: 'business-card',
        label: 'Business card spec',
        description: 'Vistaprint 500-card matte, $20, two-sided',
        path: 'C:/Users/camer/DEVNEW/GRASS/content/assets/business-card.md',
        trigger: 'After Pilot #3 closes',
      },
      {
        slug: 'door-hanger',
        label: 'Door hanger spec',
        description: 'Vistaprint 4.25×11 full-color, $35/250',
        path: 'C:/Users/camer/DEVNEW/GRASS/content/assets/door-hanger.md',
        trigger: 'After Pilot #10',
      },
      {
        slug: 'yard-sign',
        label: 'Yard sign spec',
        description: 'Vistaprint 18×24 coroplast with H-stake, $25',
        path: 'C:/Users/camer/DEVNEW/GRASS/content/assets/yard-sign.md',
        trigger: 'After Pilot #5',
      },
      {
        slug: 'review-magnet-card',
        label: 'Review-magnet card',
        description: 'Avery 5371 5×7, home-print, QR to GBP review form',
        path: 'C:/Users/camer/DEVNEW/GRASS/content/assets/review-magnet-card.md',
        trigger: 'Pilot #1',
      },
      {
        slug: 'gbp-photo-spec',
        label: 'GBP photo spec',
        description: '10 photo compositions: cover, profile, work, team',
        path: 'C:/Users/camer/DEVNEW/GRASS/content/assets/gbp-photo-spec.md',
        trigger: 'Before GBP creation',
      },
      {
        slug: 'quote-template',
        label: 'Quote template',
        description: 'Single-page PDF spec, quote # convention, terms',
        path: 'C:/Users/camer/DEVNEW/GRASS/content/templates/quote-template.md',
        trigger: 'Pilot #1',
      },
      {
        slug: 'invoice-template',
        label: 'Invoice template',
        description: 'Carbon or Jobber, 6.75% sales-tax line, DR-1 deferral note',
        path: 'C:/Users/camer/DEVNEW/GRASS/content/templates/invoice-template.md',
        trigger: 'Pilot #1',
      },
      {
        slug: 'waiver-of-liability',
        label: 'Waiver of liability',
        description: 'Service ack + $500 self-insured cap, when to use',
        path: 'C:/Users/camer/DEVNEW/GRASS/content/templates/waiver-of-liability.md',
        trigger: 'First high-risk job (hedge, branch, deep edge)',
      },
      {
        slug: 'follow-up-card',
        label: 'Quote follow-up card',
        description: 'Single-touch Day-6 follow-up (text + email), no chasing',
        path: 'C:/Users/camer/DEVNEW/GRASS/content/templates/follow-up-card.md',
        trigger: 'Day 6 after every unanswered quote',
      },
    ],
  },
] as const;

export default function PreviewContentIndex() {
  return (
    <>
      <h1>Customer-Facing Content — 13 authored artifacts</h1>

      <div className="preview-callout">
        <strong>Status:</strong> All 13 artifacts authored and ready for review. These are the
        templates you&apos;ll use day-to-day once pilots start — the GBP answers, phone/email/SMS
        scripts, and printable/digital/transactional assets.
      </div>

      {CONTENT_GROUPS.map((group) => (
        <section key={group.heading} style={{ marginBottom: '3rem' }}>
          <h2>{group.heading}</h2>
          <div className="preview-card-grid">
            {group.items.map((item) => (
              <Link
                key={item.slug}
                href={`/preview/content/${item.slug}`}
                className="preview-card"
                style={{
                  display: 'block',
                  padding: '1rem',
                  border: '1px solid var(--gray-300)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--ll-cream)',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <h3 style={{ marginTop: 0 }}>{item.label}</h3>
                <p style={{ fontSize: '0.95rem', margin: '0.5rem 0' }}>{item.description}</p>
                <small>
                  <strong>Trigger:</strong> {item.trigger}
                </small>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <h2>How to use this surface</h2>
      <ol>
        <li>
          Browse the 13 cards above. Each title is a click-through to the full markdown source
          rendered as a page.
        </li>
        <li>
          Read each before its trigger fires (e.g., read the GBP Q&amp;A before you file the
          GBP, not after).
        </li>
        <li>
          When you&apos;re ready to use an artifact in production, the markdown is the source
          of truth — copy-paste from the rendered page, or read the raw{' '}
          <code>content/&hellip;</code> file directly.
        </li>
        <li>
          Edits happen in the source file. Re-rendering the preview page picks up changes
          immediately.
        </li>
      </ol>

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        ← <a href="/preview">Back to preview index</a> ·{' '}
        <a href="/preview/runbooks">← Operational Runbooks</a> ·{' '}
        <a href="/preview/decisions">Next: Decision Log →</a>
      </p>
    </>
  );
}