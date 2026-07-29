/**
 * Privacy page — honest about the actual current data flow.
 *
 * After B-3 + B-3a review: the previous version described a
 * server-side-only PostHog flow that did NOT match reality. The
 * layout actually mounts:
 *
 *   - ConsentBanner (always visible at the bottom; Accept / Reject /
 *     Manage choices persist in localStorage as `grass:analytics-consent`
 *     with version `v1`)
 *   - AnalyticsProvider which composes:
 *     - GoogleAnalytics (loads gtag.js from googletag.net after consent,
 *       consent-mode v2 default-deny before script load; sets _ga / _ga_*)
 *     - MetaPixel (loads fbevents.js from connect.facebook.net after
 *       consent; sets _fbp)
 *
 * Plus, on every form submit:
 *   - Server-side PostHog `lead_captured` event (no consent gate,
 *     keyed by lead.id — analytics sub-processor)
 *   - grass_attribution_v1 localStorage (30-day TTL, no consent gate)
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
            <li>
              <strong>Analytics consent choice (<code>grass:analytics-consent</code>, v1):</strong>
              when the consent banner appears at the bottom of any page, your choice (Accept,
              Reject, or Manage) is stored in localStorage. The choice is remembered on
              subsequent visits. You can change it at any time via the banner.
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

          <h2>Client-side analytics (consent-gated)</h2>
          <p>
            When you accept the consent banner, two third-party scripts load in your browser:
          </p>
          <ul>
            <li>
              <strong>Google Analytics 4 + Google Ads</strong> load{' '}
              <code>https://www.googletag.net/gtag.js</code>. Google uses the events per its{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                privacy policy
              </a>
              . We apply consent-mode v2 with a default-deny state — even if you reject the
              banner, gtag fires <em>cookieless</em> pings (no <code>_ga</code> /
              <code>_ga_*</code> cookies). Full-fidelity tracking resumes only after Accept.
            </li>
            <li>
              <strong>Meta (Facebook) Pixel</strong> loads{' '}
              <code>https://connect.facebook.net/en_US/fbevents.js</code>. Meta uses the events
              per its{' '}
              <a
                href="https://www.facebook.com/privacy/policy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                privacy policy
              </a>
              . The pixel sets a <code>_fbp</code> cookie. The script does not load and no
              cookies are set until you accept the consent banner.
            </li>
          </ul>
          <p>
            If you reject the banner, neither script runs. Server-side PostHog and the
            local-storage attribution key still operate (they are functional, not advertising),
            so the lead form and the attribution pipeline keep working — but no advertising
            pixels observe your visit.
          </p>
          <p>
            To change your choice, clear the <code>grass:analytics-consent</code> key in your
            browser&apos;s site data, or re-open the consent banner via the &ldquo;Cookie
            settings&rdquo; link in the footer (when present).
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
              analytics sub-processor (no self-hosting yet).
            </li>
            <li>
              <strong>Google (gtag.js / GA4 / Google Ads)</strong> — loaded in your browser only
              after consent is granted. Sets <code>_ga</code> / <code>_ga_*</code> cookies when
              consented.
            </li>
            <li>
              <strong>Meta (fbevents.js / Facebook Pixel)</strong> — loaded in your browser only
              after consent is granted. Sets a <code>_fbp</code> cookie when consented.
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
            When the deferred items activate (Supabase, Twilio, Resend, Stripe), this section is
            updated to add them as sub-processors (each with a linked privacy policy and a
            US-only data residency commitment).
          </p>
        </div>
      </Container>
    </Section>
  );
}