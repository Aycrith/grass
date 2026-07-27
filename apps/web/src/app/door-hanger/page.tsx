/**
 * /door-hanger — print-ready door hanger for neighborhood distribution.
 *
 * Embeds the branded door hanger HTML (public/print/door-hanger.html)
 * in an iframe preview + provides a direct link to print/save.
 *
 * The page is a Server Component — no client-side interactivity.
 * Hover effects use CSS, not JavaScript event handlers.
 *
 * D-000x (2026-07-26): Initial implementation.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Print Door Hanger — Free to Download',
  description:
    'Print and distribute a branded door hanger for Largo Lawn. Two-sided, color, print-ready at 4.25" × 11" on letter stock.',
  alternates: { canonical: '/door-hanger' },
};

export default function DoorHangerPage() {
  return (
    <div className="door-hanger-page">
      {/* Page header */}
      <div className="dh-header">
        <span className="dh-eyebrow">Free to print</span>
        <h1 className="dh-title">Door Hanger</h1>
        <p className="dh-intro">
          Two-sided, color, ready to print on 4.25&Prime; &times; 11&Prime; door hanger stock
          (or letter paper). Hole punch at the top, fold along the dashed line, hang it on the
          doorknob. Real phone number, real website, no obligation.
        </p>
      </div>

      {/* Print instructions */}
      <div className="dh-instructions">
        <p>
          <strong>Print: </strong>
          Open in your browser&apos;s print dialog (
          <kbd>Ctrl+P</kbd> / <kbd>⌘+P</kbd>), set paper size to
          4.25&Prime; &times; 11&Prime; or select Letter and trim, and make sure
          &ldquo;Background graphics&rdquo; is enabled in your print settings.
        </p>
      </div>

      {/* iFrame preview */}
      <iframe
        src="/print/door-hanger.html"
        title="Door hanger preview"
        className="dh-iframe"
        loading="lazy"
      />

      {/* CTA */}
      <div className="dh-cta">
        <a
          href="/print/door-hanger.html"
          target="_blank"
          rel="noopener noreferrer"
          className="dh-btn-primary"
        >
          Open in new tab &rarr;
        </a>
        <p className="dh-cta-note">
          Or right-click and &ldquo;Save As&rdquo; to download the HTML file.
        </p>
      </div>

      {/* Business card shortcut */}
      <div className="dh-shortcuts">
        <p>
          Also printing business cards?{' '}
          <a href="/print/business-card.html" target="_blank" rel="noopener noreferrer">
            Business card template
          </a>
          .
        </p>
        <p className="dh-shortcuts-contact">(727) 313-8011 · hello@largolawn.pro · largolawn.pro</p>
      </div>

      <style>{`
        .door-hanger-page {
          min-height: 100vh;
          background: var(--color-bg-soft);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-10) var(--space-6) var(--space-12);
        }

        .dh-header {
          text-align: center;
          margin-bottom: var(--space-8);
          max-width: 600px;
        }

        .dh-eyebrow {
          display: block;
          font-size: var(--type-eyebrow);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ll-green);
          font-family: var(--font-inter);
          font-weight: 600;
          margin-bottom: var(--space-3);
        }

        .dh-title {
          font-family: var(--font-fraunces), serif;
          font-size: var(--type-display-sm);
          font-weight: 700;
          color: var(--ll-charcoal);
          margin: 0 0 var(--space-4);
          letter-spacing: -0.025em;
        }

        .dh-intro {
          font-family: var(--font-inter);
          font-size: var(--type-body);
          color: var(--color-text-muted);
          line-height: 1.6;
          margin: 0;
        }

        .dh-instructions {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-4) var(--space-5);
          margin-bottom: var(--space-6);
          max-width: 700px;
          width: 100%;
        }

        .dh-instructions p {
          font-family: var(--font-inter);
          font-size: var(--type-small);
          color: var(--color-text-muted);
          margin: 0;
          line-height: 1.6;
        }

        .dh-instructions strong {
          color: var(--ll-charcoal);
        }

        .dh-instructions kbd {
          background: var(--color-bg-soft);
          border: 1px solid var(--color-border);
          border-radius: 3px;
          padding: 1px 5px;
          font-family: monospace;
          font-size: 12px;
        }

        .dh-iframe {
          width: 100%;
          max-width: 450px;
          height: 1100px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: white;
          box-shadow: var(--elevation-3);
          margin-bottom: var(--space-8);
        }

        .dh-cta {
          text-align: center;
          margin-bottom: var(--space-10);
        }

        .dh-btn-primary {
          display: inline-block;
          padding: 14px 32px;
          background: var(--ll-green);
          color: var(--ll-sand-bleached);
          border-radius: var(--radius-pill);
          font-family: var(--font-inter);
          font-weight: 700;
          font-size: 16px;
          text-decoration: none;
          letter-spacing: 0.01em;
          box-shadow: var(--elevation-2);
          transition: background 150ms ease;
        }

        .dh-btn-primary:hover {
          background: var(--ll-green-hover);
          text-decoration: none;
        }

        .dh-cta-note {
          margin-top: var(--space-3);
          font-family: var(--font-inter);
          font-size: var(--type-small);
          color: var(--color-text-muted);
        }

        .dh-shortcuts {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-5) var(--space-6);
          max-width: 500px;
          width: 100%;
          text-align: center;
        }

        .dh-shortcuts p {
          font-family: var(--font-inter);
          font-size: var(--type-small);
          color: var(--color-text-muted);
          margin: 0 0 var(--space-3);
          line-height: 1.6;
        }

        .dh-shortcuts a {
          color: var(--ll-sky);
        }

        .dh-shortcuts-contact {
          font-family: var(--font-inter);
          font-size: var(--type-caption);
          color: var(--color-text-muted);
          margin: 0 !important;
        }
      `}</style>
    </div>
  );
}
