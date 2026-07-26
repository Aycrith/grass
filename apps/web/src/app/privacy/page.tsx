/**
 * Privacy page — minimal but compliant.
 */

import { Container, Section } from '@/components/site';
import { BUSINESS } from '@/lib/business';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `${BUSINESS.name} privacy policy — what we collect, how we use it.`,
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <Section rhythm="default">
      <Container size="prose">
        <div className="prose">
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toISOString().split('T')[0] ?? ''}.</p>

        <h2>What we collect</h2>
        <ul>
          <li>Contact information you provide via quote forms (name, email, phone, ZIP, message)</li>
          <li>Property information you share for quoting (lot size, gate code, dog status)</li>
          <li>
            Anonymous analytics via PostHog (page views, button clicks) — no third-party advertising
            tracking
          </li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To provide quotes and perform services you request</li>
          <li>To send appointment reminders and service updates via SMS/email</li>
          <li>To send a post-service review request (one message, opt-out anytime)</li>
          <li>To improve our website (anonymous analytics only)</li>
        </ul>

        <h2>What we don&apos;t do</h2>
        <ul>
          <li>We do not sell your information to third parties.</li>
          <li>We do not share your data with advertisers.</li>
          <li>We do not use third-party tracking pixels.</li>
        </ul>

        <h2>Your rights</h2>
        <p>
          You can request a copy of your data, request deletion, or opt out of communications at any
          time by emailing <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> or calling{' '}
          <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a>.
        </p>

        <h2>Data storage</h2>
        <p>
          Customer data is stored in Supabase (Postgres) in the US. SMS/email is sent via Twilio and
          Resend respectively. Payments are processed by Stripe — we do not store credit card numbers.
        </p>
        </div>
      </Container>
    </Section>
  );
}
