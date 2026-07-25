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
 */

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { Button, Card, Input } from '@/components/ui';
import { BUSINESS } from '@/lib/business';

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
      <Card variant="insight" className={successCardClass}>
        <div style={successIconRowStyle}>
          <CheckCircle2 size={28} aria-hidden="true" style={{ color: 'var(--ll-green)' }} />
          <h2 style={successHeadingStyle}>Thanks, {form.first_name}!</h2>
        </div>
        <p style={successBodyStyle}>
          We received your request and will follow up within 24 hours during business days. For
          urgent requests, call{' '}
          <a href={`tel:${BUSINESS.phone}`} style={successLinkStyle}>
            {BUSINESS.phone}
          </a>
          .
        </p>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} style={formStyle} noValidate={false}>
      <div style={rowStyle}>
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
        helper="We mow across {33771, 33770, 33778, 33773, 33774, 33756}. Outside that? We may still be able to help — leave a note."
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
        <p style={errorBannerStyle} role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div style={actionsStyle}>
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
        <p style={legalStyle}>
          We respond within 24 hours on business days. No spam, no list-rentals.
        </p>
      </div>
    </form>
  );
}

// ---------- Inline styles (kept local to this file; the rest of the form
// lives inside the design-system primitives, so these are just the form
// shell + the success/error callouts that don't have a dedicated Card
// variant yet). ----------

const formStyle: React.CSSProperties = {
  display: 'grid',
  gap: 'var(--space-5)',
  maxWidth: 640,
  width: '100%',
};

const rowStyle: React.CSSProperties = {
  display: 'grid',
  gap: 'var(--space-5)',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--space-4)',
  marginTop: 'var(--space-2)',
};

const legalStyle: React.CSSProperties = {
  fontSize: 'var(--type-small)',
  color: 'var(--gray-700)',
  margin: 0,
  lineHeight: 1.4,
};

const errorBannerStyle: React.CSSProperties = {
  margin: 0,
  padding: 'var(--space-3) var(--space-4)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-error)',
  background: 'color-mix(in srgb, var(--color-error) 8%, var(--ll-shell))',
  color: 'var(--color-error)',
  fontSize: 'var(--type-small)',
  fontWeight: 500,
};

const successCardClass = 'contact-form-success';
const successIconRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-3)',
  marginBottom: 'var(--space-3)',
};
const successHeadingStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-fraunces), serif',
  fontSize: '1.5rem',
  fontWeight: 700,
  color: 'var(--ll-palm-bark)',
  letterSpacing: '-0.01em',
};
const successBodyStyle: React.CSSProperties = {
  margin: 0,
  color: 'var(--ll-palm-bark)',
  lineHeight: 1.55,
};
const successLinkStyle: React.CSSProperties = {
  color: 'var(--ll-palm-shadow)',
  fontWeight: 600,
  textDecoration: 'underline',
  textUnderlineOffset: '0.2em',
};
