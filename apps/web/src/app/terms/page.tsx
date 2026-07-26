/**
 * Terms page — minimal but compliant.
 */

import { Container, Section } from '@/components/site';
import { BUSINESS } from '@/lib/business';
import { LEGAL_LAST_UPDATED } from '@/lib/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `${BUSINESS.name} terms of service — quote, scheduling, payment, cancellation.`,
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <Section rhythm="default">
      <Container size="prose">
        <div className="prose">
          <h1>Terms of Service</h1>
          <p>Last updated: {LEGAL_LAST_UPDATED}.</p>

        <h2>Quotes</h2>
        <p>
          Quotes are valid for 30 days from issue unless otherwise noted. Final pricing may change if
          the actual scope differs materially from the quoted scope (e.g., lot size is larger than
          estimated, additional services requested).
        </p>

        <h2>Scheduling</h2>
        <p>
          Recurring services are scheduled on the same day of the week where possible. We may adjust
          by ±1 day around holidays or weather events. Service reminders are sent the day before via
          SMS or email.
        </p>

        <h2>Weather & cancellations</h2>
        <p>
          When sustained winds reach {BUSINESS.hurricane_wind_threshold_mph} mph or higher, or during
          active rain, outdoor work pauses. We auto-reschedule to the next clear day at no charge to
          you. You may also cancel or pause service at any time with 7 days notice — no fee.
        </p>

        <h2>Hurricane mode</h2>
        <p>
          When a named storm threatens Pinellas County (within the 48-hour cone), we trigger hurricane
          mode: regular scheduling pauses, prep visits are dispatched, and active jobs are notified.
          No-fault cancellations during a named storm are auto-credited.
        </p>

        <h2>Payment</h2>
        <p>
          Invoices are due within 14 days of issue. We accept card (Stripe), ACH, check, or cash. Late
          payment after 30 days may pause service until the balance is settled.
        </p>

        <h2>Liability</h2>
        <p>
          We carry $1M general liability insurance and workers&apos; compensation coverage. Damage caused
          by our crew is documented, reported, and repaired at our cost. We are not responsible for
          pre-existing conditions, acts of nature, or issues outside our scope of work.
        </p>

        <h2>Disputes</h2>
        <p>
          Service complaints should be reported within 48 hours. We will inspect, document, and
          resolve in good faith. Unresolved disputes are subject to Pinellas County small-claims
          jurisdiction.
        </p>

        <h2>Contact</h2>
        <p>
          <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> ·{' '}
          <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a>
        </p>
        </div>
      </Container>
    </Section>
  );
}
