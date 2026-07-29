'use client';

/**
 * ContactForm — client-side lead capture form.
 *
 * Posts to /api/lead. Slack-style optimistic UX: inline success message,
 * inline service-area validation (rejects ZIP outside service area).
 *
 * Refactored 2026-07-25 to consume the shared `<Input>` + `<Button>`
 * primitives (Input.module.css / Button.module.css). Before this refactor
 * the form was a hand-rolled scaffold with inline styles and a bare
 * `<button type="submit">` with no className — it visibly didn't match
 * the rest of the site's design system. The refactor is purely a
 * presentation / accessibility change; the data shape, the post target,
 * and the success/error copy are byte-for-byte preserved.
 *
 * Notes on the refactor:
 *   - <Input> owns the label + control + helper/error a11y wiring, so
 *     the surrounding <div className="form-group"> scaffold is gone.
 *   - The submit button now uses <Button variant="primary" size="lg">,
 *     which is the same component the quote calculator and the final CTA
 *     banner use. The spinner is a small inline <span> that swaps in
 *     while the request is in flight.
 *   - The ZIP field uses the new <Input pattern="\d{5}"> validation;
 *     the regex pattern attribute drives native browser validation
 *     before the fetch fires.
 *   - The success state keeps the same copy but uses the brand Card
 *     "insight" variant so it sits flush with the rest of the section.
 *   - ZIP prefill: 2026-07-26 — form pre-fills the user's last
 *     entered ZIP from localStorage (if any) so returning visitors
 *     don't have to retype it. The form's `?zip=` URL param still
 *     takes precedence (it overrides the remembered ZIP), so the
 *     homepage Coverage Check CTA → /contact?zip=33771 path still
 *     works.
 *
 * 2026-07-25 follow-up: the 9 leftover React.CSSProperties objects
 * (formStyle, rowStyle, actionsStyle, legalStyle, errorBannerStyle,
 * successIconRowStyle, successHeadingStyle, successBodyStyle,
 * successLinkStyle) and the magic-string className
 * ('contact-form-success') for the success <Card> are now in a
 * co-located `ContactForm.module.css`. Behavior is unchanged.
 */

import { CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button, Card, Checkbox, Input } from '@/components/ui';
import type { AttributionPayload } from '@/lib/attribution';
import { captureAttribution, persistAttribution } from '@/lib/attribution';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { recallZip, rememberZip } from '@/lib/zip-memory';

import styles from './ContactForm.module.css';

interface ContactFormProps {
  source?: string | undefined;
}

interface FormState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  zip: string;
  message: string;
  source: string;
  sms_consent: boolean;
  // Stage 3 attribution — captured once on mount, persisted to
  // localStorage, shipped with the form payload to /api/lead.
  attribution: AttributionPayload | null;
}

const INITIAL_STATE: FormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  zip: '',
  message: '',
  source: 'website',
  sms_consent: false,
  attribution: null,
};

// D-0066 — TCPA consent language. Single source of truth for the checkbox
// label across contact, quote, and (future) pet-waste forms. The exact
// wording is documented in `apps/web/src/app/privacy/page.tsx` so the
// privacy page and the consent checkbox stay in lockstep.
const SMS_CONSENT_LABEL =
  'I agree to receive SMS messages from Largo Lawn at the number provided. Message frequency varies. Reply STOP to opt out, HELP for help. Message and data rates may apply.';

export default function ContactForm({ source }: ContactFormProps) {
  const [form, setForm] = useState<FormState>({ ...INITIAL_STATE, source: source ?? 'website' });
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const errorRef = useRef<HTMLParagraphElement | null>(null);

  // Focus management: when the form enters the 'error' state, move
  // keyboard focus to the error banner so the user (and any screen
  // reader) immediately lands on the explanation. The <p> already
  // has role="alert" so AT will announce it on render; explicit
  // focus() is the belt-and-suspenders for keyboard users who
  // tabbed past the submit button.
  useEffect(() => {
    if (status === 'error' && errorRef.current) {
      errorRef.current.focus();
    }
  }, [status]);

  // ZIP memory: prefill with the last entered ZIP from localStorage
  // on first mount. The `?zip=` URL param (set by the homepage
  // Coverage Check CTA when it routes to /contact?zip=33771) takes
  // precedence — the useEffect reads the URL once and overrides the
  // remembered value if the URL param is set and in-service-area.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlZip = params.get('zip');
    if (urlZip && /^\d{5}$/.test(urlZip)) {
      setForm((f) => ({ ...f, zip: urlZip }));
      return;
    }
    const remembered = recallZip();
    if (remembered) setForm((f) => ({ ...f, zip: remembered }));
  }, []);

  // Stage 3: capture attribution from the current URL + UA + localStorage
  // and persist to localStorage. First-touch fields are preserved across
  // page loads (utm_source/medium/campaign, gclid, landing_path,
  // first_touch_at). Last-touch fields update on each capture.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = window.navigator?.userAgent ?? '';
    const ref = document.referrer ?? '';
    const captured = captureAttribution(ref, ua);
    const persisted = persistAttribution(captured);
    setForm((f) => ({ ...f, attribution: persisted }));
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    // Persist the ZIP for next time the user visits /quote, /contact,
    // or the homepage coverage check. Successful submit is the right
    // moment to write — the user has now confirmed this is a ZIP
    // they care about.
    if (form.zip) rememberZip(form.zip);
    try {
      // Stage 3: spread attribution fields into the lead payload. The
      // server-side validator handles undefined/missing fields gracefully.
      const attribution = form.attribution;
      const leadPayload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        zip: form.zip,
        message: form.message,
        source: attribution?.source ?? form.source,
        sms_consent: form.sms_consent,
        ...(attribution?.utm_source !== undefined ? { utm_source: attribution.utm_source } : {}),
        ...(attribution?.utm_medium !== undefined ? { utm_medium: attribution.utm_medium } : {}),
        ...(attribution?.utm_campaign !== undefined
          ? { utm_campaign: attribution.utm_campaign }
          : {}),
        ...(attribution?.utm_term !== undefined ? { utm_term: attribution.utm_term } : {}),
        ...(attribution?.utm_content !== undefined ? { utm_content: attribution.utm_content } : {}),
        ...(attribution?.gclid !== undefined ? { gclid: attribution.gclid } : {}),
        ...(attribution?.landing_path !== undefined
          ? { landing_path: attribution.landing_path }
          : {}),
        ...(attribution?.referrer !== undefined ? { referrer: attribution.referrer } : {}),
        ...(attribution?.device_class !== undefined
          ? { device_class: attribution.device_class }
          : {}),
        ...(attribution?.first_touch_at !== undefined
          ? { first_touch_at: attribution.first_touch_at }
          : {}),
      };
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
      });
      const data = (await res.json()) as { ok: boolean; message?: string; error?: string };
      if (!data.ok) {
        setStatus('error');
        setErrorMessage(data.error ?? 'Something went wrong. Please try again or call us.');
        return;
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Network error');
    }
  }

  if (status === 'success') {
    return (
      <Card variant="insight">
        <div className={cn(styles.successIconRow)}>
          <CheckCircle2 size={28} aria-hidden="true" className={cn(styles.successIcon)} />
          <h2 className={cn(styles.successHeading)}>Thanks, {form.first_name}!</h2>
        </div>
        <p className={cn(styles.successBody)}>
          We text or email within 5 minutes during business hours (Mon-Fri 7a-5p, Sat 8a-2p). After
          hours we&apos;ll reply first thing next business morning. For urgent requests, call{' '}
          <a href={`tel:${BUSINESS.phoneTel}`} className={cn(styles.successLink)}>
            {BUSINESS.phone}
          </a>
          .
        </p>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn(styles.form)}>
      <div className={cn(styles.row)}>
        <Input
          label="First name"
          required
          value={form.first_name}
          onChange={(e) => update('first_name', e.target.value)}
          autoComplete="given-name"
        />
        <Input
          label="Last name"
          value={form.last_name}
          onChange={(e) => update('last_name', e.target.value)}
          autoComplete="family-name"
        />
      </div>
      <Input
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={(e) => update('email', e.target.value)}
        autoComplete="email"
        placeholder="you@email.com"
      />
      <Input
        label="Phone"
        type="tel"
        value={form.phone}
        onChange={(e) => update('phone', e.target.value)}
        onBlur={() => setPhoneTouched(true)}
        autoComplete="tel"
        placeholder="(727) 313-8011"
        helper="Optional, but a text is the fastest way to quote you."
      />
      <Input
        label="ZIP code"
        required
        pattern="\d{5}"
        value={form.zip}
        onChange={(e) => update('zip', e.target.value)}
        autoComplete="postal-code"
        placeholder="33771"
        helper={
          <>
            We mow across {BUSINESS.service_area_zips.join(', ')}. Outside that? We may still be
            able to help — leave a note.
          </>
        }
      />
      <Input
        label="Tell us about your yard"
        type="textarea"
        value={form.message}
        onChange={(e) => update('message', e.target.value)}
        placeholder="Lot size, services needed, anything we should know (dogs, gate code, etc.)"
        rows={4}
      />

      {/* D-0066 SMS consent — only required when a phone number is provided.
          When phone is blank, the consent is irrelevant (we'll email) so the
          checkbox is hidden. The phone blur tracks whether the user has typed
          a value so the consent appears immediately as they fill the field. */}
      {form.phone.trim().length > 0 ? (
        <Checkbox
          label={SMS_CONSENT_LABEL}
          checked={form.sms_consent}
          onChange={(checked) => update('sms_consent', checked)}
          required={phoneTouched}
          helper={
            phoneTouched && !form.sms_consent
              ? 'Required to text you back. We will email instead if you prefer.'
              : undefined
          }
        />
      ) : null}

      {status === 'error' ? (
        <p ref={errorRef} className={cn(styles.errorBanner)} role="alert" tabIndex={-1}>
          {errorMessage}
        </p>
      ) : null}

      <div className={cn(styles.actions)}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={status === 'submitting'}
          iconLeft={
            status === 'submitting' ? (
              <Loader2 size={18} aria-hidden="true" className="ll-spin" />
            ) : undefined
          }
        >
          {status === 'submitting' ? 'Sending…' : 'Get My Quote'}
        </Button>
        <p className={cn(styles.legal)}>
          We respond within 5 minutes during business hours, first thing next business morning after
          hours. No spam, no list-rentals.
        </p>
      </div>
    </form>
  );
}
