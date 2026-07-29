/**
 * Privacy page — honest about the actual current data flow.
 *
 * Stage 3 reconciliation (B-3 follow-up): the previous version described
 * a GA4 + Meta Pixel + CallRail + CookieConsent banner flow that no
 * longer exists in the code. CookieConsent was removed in S3.10; no
 * client-side tracking tags are loaded; the only analytics source is
 * server-side PostHog fired from the /api/lead route handler after a
 * lead is persisted.
 *
 * What this page must describe accurately:
 *   1. PostHog server-side events keyed by `lead.id` (acts as
 *      distinct_id) — first-party analytics processor.
 *   2. `grass_attribution_v1` localStorage key — first-touch attribution
 *      (UTM trio + gclid + landing_path + referrer + device_class +
 *      first_touch_at), 30-day TTL.
 *   3. The lead row itself (email, phone, ZIP, message) and its
 *      10 attribution fields.
 *
 * What this page must NOT mention (out-of-scope for the pilot, deferred
 * until Stage 6 outcome ADR):
 *   - Google Analytics 4 / gtag
 *   - Meta Pixel / Meta CAPI
 *   - CallRail or any call-tracking SaaS
 *   - Retargeting audiences
 *   - CookieConsent banner (the only client state is the localStorage
 *     attribution key, which is functional, not a tracking choice)
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
            <li>
              <strong>Quote/contact form data you provide:</strong> name, email, phone, ZIP, and
              any message you include. Used only to respond to your inquiry and (if you become a
              customer) to schedule service.
            </li>
            <li>
              <strong>SMS consent flag on the lead record:</strong> a boolean recorded at submit
              time. Immutable thereafter. Per D-0066 — we never send SMS without an explicit,
              contemporaneous opt-in.
            </li>
            <li>
              <strong>Attribution data (10 discrete fields):</strong> when you arrive from a
              marketing channel (paid ad, social post, referral, etc.) the URL parameters
              (utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid), the page you
              landed on, your device class, and a first-touch timestamp are stored with your
              lead. Used only to measure which channels produce real inquiries (not vanity
              clicks).
            </li>
            <li>
              <strong>Local-storage attribution key (<code>grass_attribution_v1</code>):</strong>
              the same attribution set is also stored in your browser&apos;s localStorage so it
              survives page reloads and navigation between the landing page, the quote
              calculator, and the contact form. It expires after 30 days. You can clear it at
              any time via your browser&apos;s site-data settings.
            </li>
            <li>
              <strong>Server-side PostHog events:</strong> when you submit a form, the server
              fires one analytics event to PostHog with the lead id, ZIP, and landing path. No
              client-side tracking tags (no GA4, no Meta Pixel, no cookies) are loaded.
            </li>
          </ul>

          <h2>How we use it</h2>
          <ul>
            <li>To provide quotes and perform services you request</li>
            <li>To send appointment reminders and service updates via SMS/email (only with consent)</li>
            <li>To send a post-service review request (one message, opt-out anytime)</li>
            <li>
              To attribute inquiries to marketing channels and stop spending on channels that
              don&apos;t produce real leads
            </li>
          </ul>

          <h2>What we don&apos;t do</h2>
          <ul>
            <li>We do not sell your information to third parties.</li>
            <li>
              We do not load client-side advertising or tracking tags (no Google Analytics, no
              Meta Pixel, no call-tracking widgets). There is no consent banner because there is
              nothing to consent to.
            </li>
            <li>
              We do not retarget you across other websites. There is no advertising audience
              built from this site.
            </li>
          </ul>

          <h2>Your rights</h2>
          <p>
            You can request a copy of your data, request deletion, or opt out of communications at any
            time by emailing <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> or calling{' '}
            <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phone}</a>.
          </p>

          <h2>SMS communications and consent (per D-0066)</h2>
          <p>
            When you submit a form on this site (quote or contact), you may be asked to check a
            box before we send you an SMS. The consent language is:
          </p>
          <blockquote>
            <strong>&ldquo;I agree to receive SMS messages from Largo Lawn at the number provided.
            Message frequency varies. Reply STOP to opt out, HELP for help. Message and data
            rates may apply.&rdquo;</strong>
          </blockquote>
          <p>
            We send SMS <strong>only when this box is checked</strong>. The consent choice is
            stored with your lead record and is immutable thereafter. You can revoke consent at
            any time by replying STOP to any SMS we send, by emailing{' '}
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>, or by calling{' '}
            <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phone}</a>.
          </p>
          <p>
            We honor the STOP and HELP keywords at any time after consent is given. Persistent
            opt-out state is recorded against your lead record.
          </p>

          <h2>Data storage (current state)</h2>
          <p>
            The business is in pre-launch / cash-min mode (see{' '}
            <code>state/ledger.yaml -&gt; objectives.deferred_cash_constrained</code> for the
            deferred items). The current data flow is:
          </p>
          <ul>
            <li>
              <strong>Quote/contact form submissions</strong> arrive at the steward&apos;s{' '}
              <code>{BUSINESS.email}</code> inbox (Gmail; Google is a sub-processor for email
              storage).
            </li>
            <li>
              <strong>Customer records</strong> are maintained in a single steward-managed
              spreadsheet (Google Sheets; Google is a sub-processor) until volume justifies a
              dedicated customer database.
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
              <strong>Analytics</strong> goes to PostHog server-side only. PostHog is a
              first-party analytics processor; events are keyed by <code>lead.id</code> and
              include ZIP and landing path. No cookies are set in your browser by this site.
            </li>
            <li>
              <strong>Payments</strong> are Cash / Venmo / Zelle / card-on-phone. We do{' '}
              <strong>not</strong> store credit card numbers on any of our systems. Card data is
              held by the card reader / Venmo / Zelle. Online card payments via Stripe (and the
              Stripe data sub-processor relationship) are planned once invoice volume justifies
              the integration cost.
            </li>
          </ul>
          <p>
            When the deferred items activate, this section is updated to list Supabase, Twilio,
            Resend, and Stripe as the data sub-processors (each with a linked privacy policy and
            a US-only data residency commitment).
          </p>
        </div>
      </Container>
    </Section>
  );
}