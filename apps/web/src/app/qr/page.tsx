/**
 * /qr — print-ready QR codes for Largo Lawn collateral.
 *
 * Generates static QR SVGs at build time so the steward can
 * copy-paste them into print materials (yard signs, door hangers,
 * business cards, review-magnet cards).
 *
 * Refactored 2026-07-25 to use the shared <Section> + <Eyebrow>
 * + <Card> + <Button> primitives. Before this refactor the page
 * was a hand-rolled scaffold with inline `style={{...}}` blocks
 * and hardcoded hex values (#2f6b3d, #f7f1e3, #4a4a4a) that
 * didn't match the rest of the design system. The QR data
 * generation, the four target URLs, the file naming, and the
 * downstream print guidance are byte-for-byte unchanged.
 */

import type { Metadata } from 'next';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';

import { Container, Eyebrow, Section } from '@/components/site';
import { Button, Card } from '@/components/ui';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'QR Codes · Largo Lawn',
  description:
    'Print-ready QR codes for Largo Lawn yard signs, door hangers, business cards, and review-magnet cards.',
  // The QR page is a steward-facing print-asset page, not
  // a customer landing page. A 4-up grid of QR SVGs is
  // useless as a search result and could end up outranking
  // the real /quote page if indexed.
  robots: { index: false, follow: false },
  alternates: { canonical: '/qr' },
};

// Generate static QR SVGs at build time so the steward can copy-paste them
// into print materials. Each QR points to a public landing page or
// action URL — the steward replaces the placeholder domain with the real
// `largolawn.pro` once it is purchased.

const DOMAIN = 'https://largolawn.pro';

const CODES = [
  {
    name: 'Free Quote (door hanger, yard sign)',
    description:
      'Customer scans → lands on /quote → sees live price estimate → submits lead.',
    target: `${DOMAIN}/quote`,
    filename: 'largolawn-quote-qr.svg',
  },
  {
    name: 'Quick Contact (business card back)',
    description:
      'Customer scans → lands on /contact → short form, autofills name + email.',
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
    description:
      'Customer scans → lands on /areas (six ZIPs + locally-tuned copy).',
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
    CODES.map(async (c) => ({ ...c, svg: await makeSvg(c.target) })),
  );

  return (
    <>
      <Section rhythm="loose" tone="default" className={cn(styles.hero)}>
        <div className="container">
          <Eyebrow tone="default">Steward tools · Print assets</Eyebrow>
          <h1 className={cn(styles.h1)}>QR Codes</h1>
          <p className={cn(styles.lede)}>
            Print-ready QR codes for every Largo Lawn collateral piece. Each SVG
            is generated at build time — open the file in a browser, save as
            SVG, and embed in Vistaprint / Canva / your printer.
          </p>
          <p className={cn(styles.note)}>
            All QRs currently point to <code>{DOMAIN}</code>. After domain
            purchase and DNS cutover (Phase 0 / OBJ-M2-004), re-run{' '}
            <code>bun run build</code> and the URLs update automatically. For
            the <strong>Google Review QR</strong>, replace the target with the
            live GBP write-review URL once GBP is verified (OBJ-M2-006).
          </p>
        </div>
      </Section>

      <Section rhythm="default" tone="soft" className={cn(styles.gridSection)}>
        <div className="container">
          <div className={cn(styles.grid)}>
            {svgs.map((c) => (
              <Card key={c.target} variant="insight" className={cn(styles.qrCard)}>
                <h3 className={cn(styles.qrTitle)}>{c.name}</h3>
                <div
                  className={cn(styles.qrBox)}
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG-injected QR
                  dangerouslySetInnerHTML={{ __html: c.svg }}
                />
                <p className={cn(styles.qrDescription)}>{c.description}</p>
                <code className={cn(styles.qrTarget)}>{c.target}</code>
                <p className={cn(styles.qrFilename)}>
                  Filename suggestion: <strong>{c.filename}</strong>
                </p>
                <Button
                  as="a"
                  href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(c.svg)}`}
                  download={c.filename}
                  variant="primary"
                  size="md"
                  iconLeft={<Download size={16} aria-hidden="true" />}
                >
                  Download SVG
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section rhythm="default" tone="default" className={cn(styles.guideSection)}>
        <Container size="prose">
          <div className="prose">
            <h2>Where each QR goes</h2>
            <ul>
              <li>
                <strong>Yard sign (18×24 coroplast):</strong> bottom-right
                corner, 2&quot; square, alongside the phone number. Customer
                walking by can save the link.
              </li>
              <li>
                <strong>Door hanger (4.25×11):</strong> front-side center,
                1.5&quot; square. Drives the conversion.
              </li>
              <li>
                <strong>Business card (3.5×2):</strong> back side, lower-right,
                0.75&quot; square. Small but works for tech-savvy customers.
              </li>
              <li>
                <strong>Review-magnet card (5×7 Avery 5371):</strong> front,
                large 1.6&quot; square, dominant visual. Customers physically
                take this with them.
              </li>
              <li>
                <strong>Service Areas hub:</strong> use this in any longer-form
                collateral (posters, newsletter, NextDoor footer) where
                customers want the full coverage map.
              </li>
            </ul>

            <h2>After domain + GBP go live</h2>
            <ol>
              <li>
                Edit <code>apps/web/src/app/qr/page.tsx</code> and update the
                review QR target to the live GBP write-review URL.
              </li>
              <li>
                Re-run <code>bun run build</code> in <code>apps/web</code>.
              </li>
              <li>Re-download the review-magnet QR SVG.</li>
              <li>
                Re-print only the affected collateral (review-magnet card lot,
                business cards if the contact QR was for the personal site).
              </li>
            </ol>

            <p>
              Phone: {BUSINESS.phone} · Hours: {BUSINESS.hours.weekdays}
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
