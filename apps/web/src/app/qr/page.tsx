import type { Metadata } from 'next';
import QRCode from 'qrcode';
import { BUSINESS } from '@/lib/business';

export const metadata: Metadata = {
  title: 'QR Codes · Largo Lawn',
  description: 'Print-ready QR codes for Largo Lawn yard signs, door hangers, business cards, and review-magnet cards.',
};

// Generate static QR SVGs at build time so the steward can copy-paste them
// into print materials. Each QR points to a public landing page or
// action URL — the steward replaces the placeholder domain with the real
// `largolawn.pro` once it is purchased.

const DOMAIN = 'https://largolawn.pro';

const CODES = [
  {
    name: 'Free Quote (door hanger, yard sign)',
    description: 'Customer scans → lands on /quote → sees live price estimate → submits lead.',
    target: `${DOMAIN}/quote`,
    filename: 'largolawn-quote-qr.svg',
  },
  {
    name: 'Quick Contact (business card back)',
    description: 'Customer scans → lands on /contact → short form, autofills name + email.',
    target: `${DOMAIN}/contact`,
    filename: 'largolawn-contact-qr.svg',
  },
  {
    name: 'Google Review (review-magnet card)',
    description:
      'Customer scans → opens GBP review form (post-launch, this URL becomes the real GBP write-review link).',
    target: `${DOMAIN}/review`,
    filename: 'largolawn-review-qr.svg',
  },
  {
    name: 'Service Areas hub (yard sign)',
    description: 'Customer scans → lands on /areas (six ZIPs + locally-tuned copy).',
    target: `${DOMAIN}/areas`,
    filename: 'largolawn-areas-qr.svg',
  },
];

async function makeSvg(url: string): Promise<string> {
  return await QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 512,
    color: { dark: '#1a2f25', light: '#ffffff' },
  });
}

export default async function QRPage() {
  const svgs = await Promise.all(
    CODES.map(async c => ({ ...c, svg: await makeSvg(c.target) })),
  );

  return (
    <main className="container">
      <section className="hero">
        <h1>QR Codes</h1>
        <p className="lead">
          Print-ready QR codes for every Largo Lawn collateral piece. Each SVG is generated at build
          time — open the file in a browser, save as SVG, and embed in Vistaprint / Canva / your printer.
        </p>
        <p style={{ fontSize: '0.9rem', color: '#4a4a4a' }}>
          All QRs currently point to <code>{DOMAIN}</code>. After domain purchase and DNS cutover
          (Phase 0 / OBJ-M2-004), re-run <code>bun run build</code> and the URLs update automatically.
          For the <strong>Google Review QR</strong>, replace the target with the live GBP write-review
          URL once GBP is verified (OBJ-M2-006).
        </p>
      </section>

      <section style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {svgs.map(c => (
          <article key={c.target} className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ marginTop: 0 }}>{c.name}</h3>
            <div
              style={{ width: 220, height: 220, margin: '0 auto 1rem', border: '2px solid #2f6b3d', borderRadius: 8, padding: 8, background: 'white' }}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG-injected QR
              dangerouslySetInnerHTML={{ __html: c.svg }}
            />
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', minHeight: '3.6em' }}>{c.description}</p>
            <code style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{c.target}</code>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              Filename suggestion: <strong>{c.filename}</strong>
            </p>
            <a
              href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(c.svg)}`}
              download={c.filename}
              style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                background: '#2f6b3d',
                color: '#f7f1e3',
                borderRadius: 6,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Download SVG
            </a>
          </article>
        ))}
      </section>

      <section className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>Where each QR goes</h2>
        <ul>
          <li>
            <strong>Yard sign (18×24 coroplast):</strong> bottom-right corner, 2" square, alongside the
            phone number. Customer walking by can save the link.
          </li>
          <li>
            <strong>Door hanger (4.25×11):</strong> front-side center, 1.5" square. Drives the
            conversion.
          </li>
          <li>
            <strong>Business card (3.5×2):</strong> back side, lower-right, 0.75" square. Small but
            works for tech-savvy customers.
          </li>
          <li>
            <strong>Review-magnet card (5×7 Avery 5371):</strong> front, large 1.6" square, dominant
            visual. Customers physically take this with them.
          </li>
          <li>
            <strong>Service Areas hub:</strong> use this in any longer-form collateral (posters,
            newsletter, NextDoor footer) where customers want the full coverage map.
          </li>
        </ul>
      </section>

      <section className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>After domain + GBP go live</h2>
        <ol>
          <li>Edit <code>apps/web/src/app/qr/page.tsx</code> and update the review QR target to the live GBP write-review URL.</li>
          <li>Re-run <code>bun run build</code> in <code>apps/web</code>.</li>
          <li>Re-download the review-magnet QR SVG.</li>
          <li>Re-print only the affected collateral (review-magnet card lot, business cards if the contact QR was for the personal site).</li>
        </ol>
        <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: '#4a4a4a' }}>
          Phone: {BUSINESS.phone} · Hours: {BUSINESS.hours.weekdays}
        </p>
      </section>
    </main>
  );
}