/**
 * /channel-paused — soft landing page for paid channels that are
 * intentionally dormant.
 *
 * Per D-0064 §0.1: Meta ad spend is hard-stopped before the Stage 6
 * outcome ADR. Any inbound `/t/meta-ads` clicks get a soft 302 here
 * instead of a 404 — the visitor sees a calm explanation rather than
 * a dead end, and the channel-paused pattern is reusable for any
 * future sunset.
 *
 * Per steward resolution Q-2 (Stage 3): this page exists so we can
 * delete the `meta-ads` slug from CHANNELS without breaking in-flight
 * links (e.g. an old Nextdoor comment with a /t/meta-ads URL).
 *
 * The page is intentionally minimal — no CTAs, no form. It's a
 * dead-end by design; the visitor should call/text if they want to
 * reach us.
 */

import Link from 'next/link';

import { BUSINESS } from '@/lib/business';

export const metadata = {
  title: 'Channel paused — Largo Lawn',
  description:
    'This acquisition channel is currently paused. Call or text Largo Lawn directly for a quote.',
  robots: { index: false, follow: false },
};

export default function ChannelPausedPage() {
  return (
    <main
      style={{
        maxWidth: '36rem',
        margin: '0 auto',
        padding: '4rem 1.5rem',
        fontFamily: 'var(--font-body, system-ui)',
      }}
    >
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
        This channel is paused
      </h1>
      <p style={{ fontSize: '1.125rem', lineHeight: 1.6, color: '#374151' }}>
        We&apos;re not running ads on this platform right now. If you&apos;d like a quote for lawn
        care in Largo, FL, the fastest way to reach us is a text or call.
      </p>

      <div
        style={{
          marginTop: '2rem',
          padding: '1.25rem',
          background: '#f3f4f6',
          borderRadius: '0.5rem',
        }}
      >
        <p style={{ margin: 0, fontSize: '1rem', color: '#1f2937' }}>
          Call:{' '}
          <a href={`tel:${BUSINESS.phoneTel}`} style={{ color: '#0f766e', fontWeight: 600 }}>
            {BUSINESS.phone}
          </a>
        </p>
        <p style={{ margin: '0.5rem 0 0', fontSize: '1rem', color: '#1f2937' }}>
          Text:{' '}
          <a href={`sms:${BUSINESS.phoneTel}`} style={{ color: '#0f766e', fontWeight: 600 }}>
            {BUSINESS.phone}
          </a>
        </p>
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
          Mon-Fri 7a-5p, Sat 8a-2p. We reply within 5 minutes during business hours.
        </p>
      </div>

      <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
        Or <Link href="/quote">request a quote</Link> and we&apos;ll text you back.
      </p>
    </main>
  );
}
