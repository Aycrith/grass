/**
 * Terms page — minimal but compliant.
 *
 * NOTE on insurance + payment language: this page was originally
 * written with "we carry $1M general liability" and "we accept
 * Stripe / ACH / check / cash" claims. As of 2026-07-26 the
 * business is in cash-min mode (state/ledger.yaml ->
 * objectives.deferred_cash_constrained -> OBJ-M2-002, OBJ-M2-003):
 *   - OBJ-M2-003 (insurance binding) is DEFERRED until first
 *     paying customer or first equipment incident. Until then
 *     the operator uses a signed waiver-of-liability on every
 *     quote and operates hand-tools-only.
 *   - Stripe is on the deferred tech-stack list (D-0002 phase B);
 *     payment for the first 5 paid pilots is Cash, Venmo, Zelle,
 *     or card-on-phone (the operator's own phone's card reader).
 *
 * The page now states the actual current policy. When the
 * deferred items activate, the page is updated to match the
 * real policy. See state/ledger.yaml -> OBJ-M2-003 for the
 * reactivation triggers.
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
          Invoices are due within 14 days of issue. Currently accepted payment methods are
          <strong> cash, Venmo, Zelle, or card-on-phone</strong> (the operator&apos;s personal
          phone with a card reader). We do not store credit card numbers. Online card payments
          (via Stripe) and ACH are planned once invoice volume justifies the integration cost.
          Late payment after 30 days may pause service until the balance is settled.
        </p>

        <h2>Liability & insurance</h2>
        <p>
          <strong>Current state:</strong> general liability insurance is in the binding queue
          (state/ledger.yaml -&gt; OBJ-M2-003) and will bind at the first paid customer or
          first equipment-related incident, whichever comes first. Until the policy is in
          force, every quote is paired with a signed
          <strong> waiver-of-liability</strong> (see content/templates/waiver-of-liability.md)
          and we operate hand-tools-only on lots &le; 0.25 acre. The current
          liability cap is the steward&apos;s personal umbrella; any incident above
          that cap is the customer&apos;s recourse through a separate homeowner&apos;s
          insurance policy, which is the steward&apos;s recommendation in the interim.
        </p>
        <p>
          When the GL policy binds, this section is updated to: &ldquo;We carry $1M general
          liability insurance. Damage caused by our crew is documented, reported, and
          repaired at our cost.&rdquo; Until then, the waiver-of-liability is the contract.
          Pre-existing conditions, acts of nature, or issues outside the quoted scope are
          not the steward&apos;s responsibility.
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
          <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phone}</a>
        </p>
        </div>
      </Container>
    </Section>
  );
}
