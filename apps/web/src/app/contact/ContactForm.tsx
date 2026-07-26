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
 *
 * 2026-07-25 follow-up: the 9 leftover React.CSSProperties objects
 * (formStyle, rowStyle, actionsStyle, legalStyle, errorBannerStyle,
 * successIconRowStyle, successHeadingStyle, successBodyStyle,
 * successLinkStyle) and the magic-string className
 * ('contact-form-success') for the success <Card> are now in a
 * co-located `ContactForm.module.css`. Behavior is unchanged.
 */

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { Button, Card, Input } from '@/components/ui';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';

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
}

const INITIAL_STATE: FormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  zip: '',
  message: '',
  source: 'website',
};

export default function ContactForm({ source }: ContactFormProps) {
  const [form, setForm] = useState<FormState>({ ...INITIAL_STATE, source: source ?? 'website' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
          We received your request and will follow up within 24 hours during business days. For
          urgent requests, call{' '}
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
        autoComplete="tel"
        placeholder="(727) 555-0123"
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

      {status === 'error' ? (
        <p className={cn(styles.errorBanner)} role="alert">
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
          We respond within 24 hours on business days. No spam, no list-rentals.
        </p>
      </div>
    </form>
  );
}
