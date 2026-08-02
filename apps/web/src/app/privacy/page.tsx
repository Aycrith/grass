/**
 * Privacy page — honest about the actual current data flow.
 *
 * 2026-07-31 pivot (D-0067): ConsentBanner + AnalyticsProvider +
 * GoogleAnalytics + MetaPixel were removed from the layout (per
 * D-0064 §0.9 hard-stop: no GA4, no Meta Pixel, no client-side
 * analytics tags). The only analytics fire-path is the server-side
 * PostHog `lead_captured` event fired by `/api/lead` — no consent
 * gate, no client-side script, no third-party cookies.
 *
 * What flows:
 *   - Server-side PostHog `lead_captured` event (keyed by lead.id,
 *     analytics sub-processor; no PII beyond what was submitted)
 *   - grass_attribution_v1 localStorage (30-day TTL, no consent gate)
 *   - No GA4, no Meta Pixel, no client-side tracking, no third-party
 *     cookies set by this site.
 *
 * The privacy copy below documents this current posture. See
 * `output/plans/RESUMING.md` and D-0067/D-0068 for the resume path.
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
              consent gate — PostHog receives only what is in your lead record (which you
              provided by submitting the form).
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

          <h2>Client-side analytics (none — server-side PostHog only)</h2>
          <p>
            As of 2026-07-31, this site does <strong>not</strong> load Google Analytics, Meta
            Pixel, or any other third-party advertising or tracking script in your browser.
            There is no consent banner because no third-party scripts are loaded. See
            governance/decisions/0067-pilot-pause-and-preservation.md for the rationale.
          </p>
          <ul>
            <li>
              <strong>Server-side PostHog</strong> receives only the lead id, ZIP, landing path,
              and UTMs on form submission. No PII (email, phone, first/last name, message body)
              is shipped to PostHog. PostHog is the analytics sub-processor.
            </li>
            <li>
              <strong>Local-storage attribution key</strong> (<code>grass_attribution_v1</code>,
              30-day TTL) records UTM parameters and first-touch landing path so the lead
              pipeline can attribute organic and paid sources. Not shared with any third party.
            </li>
          </ul>
          <p>
            No <code>_ga</code> / <code>_ga_*</code> cookies, no <code>_fbp</code> cookies, no
            third-party cookies set by this site. If you previously accepted a consent banner
            when the site had GA4 + Meta Pixel, those third-party cookies may still exist in
            your browser — clear them via your browser&apos;s site data controls.
          </p>

          <h2>What we don&apos;t do</h2>
          <ul>
            <li>We do not sell your information to third parties.</li>
            <li>
              We do not load advertising or tracking pixels before you accept the consent banner.
              We do not retarget you across other websites.
            </li>
            <li>
              We do not ship PII (email, phone, first/last name, message body) to PostHog — the
              server-side event carries only the lead id, ZIP, landing path, and UTMs.
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

          <h2>Data storage and sub-processors (current state)</h2>
          <p>
            The business is in pre-launch / cash-min mode (see{' '}
            <code>state/ledger.yaml -&gt; objectives.deferred_cash_constrained</code> for the
            deferred items). Sub-processors currently in the data flow:
          </p>
          <ul>
            <li>
              <strong>Google (Gmail + Google Sheets)</strong> — quote/contact form submissions
              arrive at the steward&apos;s <code>{BUSINESS.email}</code> inbox (Gmail) and are
              maintained in a steward-managed spreadsheet (Sheets).
            </li>
            <li>
              <strong>PostHog</strong> — server-side analytics processor; events are keyed by{' '}
              <code>lead.id</code> and include ZIP and landing path. PostHog is a hosted
              analytics sub-processor (no self-hosting yet). No client-side PostHog script is
              loaded in your browser.
            </li>
            <li>
              <strong>SMS</strong> uses the steward&apos;s personal number until Twilio binds;
              once bound, Twilio becomes a sub-processor.
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
            As of 2026-07-31 (D-0067 pivot), Google Analytics, Meta Pixel, and all
            client-side third-party tracking scripts are <strong>not</strong> loaded in your
            browser. There is no consent banner because no client-side scripts are loaded.
          </p>
          <p>
            When the deferred items activate (Supabase, Twilio, Resend, Stripe), this section is
            updated to add them as sub-processors (each with a linked privacy policy and a
            US-only data residency commitment).
          </p>
        </div>
      </Container>
    </Section>
  );
}