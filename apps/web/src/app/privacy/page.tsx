/**
 * Privacy page — minimal but compliant.
 *
 * NOTE on third-party processors: this page originally listed
 * Supabase, Twilio, Resend, and Stripe as the data sub-processors.
 * As of 2026-07-26 the business is in cash-min mode and these
 * integrations are not yet active:
 *   - Supabase (D-0002 phase B): planned once revenue justifies
 *     the monthly cost; until then, customer data is stored
 *     locally (a single steward-maintained spreadsheet + the
 *     email/SMS inboxes).
 *   - Twilio (SMS): planned for the customer-text pipeline; until
 *     then SMS uses the steward&apos;s personal number.
 *   - Resend (email): planned; until then email uses Gmail.
 *   - Stripe (payments): planned; until then payments are
 *     Cash / Venmo / Zelle / card-on-phone (no card data is
 *     stored on the operator&apos;s systems at all).
 *
 * The page now states the actual current state. When the
 * deferred items activate, the page is updated to match.
 */

import { Container, Section } from '@/components/site';
import { BUSINESS } from '@/lib/business';
import { LEGAL_LAST_UPDATED } from '@/lib/content';
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
          <p>Last updated: {LEGAL_LAST_UPDATED}.</p>

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
          <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phone}</a>.
        </p>

        <h2>Data storage (current state)</h2>
        <p>
          The business is in pre-launch / cash-min mode (see
          <code> state/ledger.yaml -&gt; objectives.deferred_cash_constrained </code>
          for the deferred items). The current data flow is:
        </p>
        <ul>
          <li>
            <strong>Quote/contact form submissions</strong> arrive at the steward&apos;s
            <code> {BUSINESS.email} </code> inbox (Gmail; Google is a sub-processor for
            email storage).
          </li>
          <li>
            <strong>Customer records</strong> are maintained in a single steward-managed
            spreadsheet (Google Sheets; Google is a sub-processor) until volume justifies
            a dedicated customer database.
          </li>
          <li>
            <strong>SMS</strong> uses the steward&apos;s personal number until Twilio binds;
            once bound, Twilio becomes a sub-processor.
          </li>
          <li>
            <strong>Email</strong> uses Gmail; once Resend binds, Resend becomes the
            transactional-email sub-processor.
          </li>
          <li>
            <strong>Payments</strong> are Cash / Venmo / Zelle / card-on-phone. We do
            <strong> not</strong> store credit card numbers on any of our systems. Card
            data is held by the card reader / Venmo / Zelle. Online card payments via
            Stripe (and the Stripe data sub-processor relationship) are planned once
            invoice volume justifies the integration cost.
          </li>
        </ul>
        <p>
          When the deferred items activate, this section is updated to list Supabase,
          Twilio, Resend, and Stripe as the data sub-processors (each with a linked
          privacy policy and a US-only data residency commitment).
        </p>
        </div>
      </Container>
    </Section>
  );
}
