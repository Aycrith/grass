'use client';

/**
 * ContactForm — client-side lead capture form.
 *
 * Posts to /api/lead. Slack-style optimistic UX: inline success message,
 * inline service-area validation (rejects ZIP outside service area).
 */

import { BUSINESS } from '@/lib/business';
import { useState } from 'react';

interface ContactFormProps {
  source?: string;
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

export default function ContactForm({ source }: ContactFormProps) {
  const [form, setForm] = useState<FormState>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    zip: '',
    message: '',
    source: source ?? 'website',
  });
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
      <div
        style={{
          padding: '2rem',
          background: 'var(--green-100)',
          borderRadius: 8,
          marginTop: '1rem',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Thanks, {form.first_name}!</h2>
        <p>
          We received your request and will follow up within 24 hours during business days. For
          urgent requests, call <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 540 }}>
      <div className="form-group">
        <label htmlFor="first_name">First name *</label>
        <input
          id="first_name"
          required
          value={form.first_name}
          onChange={(e) => update('first_name', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="last_name">Last name</label>
        <input
          id="last_name"
          value={form.last_name}
          onChange={(e) => update('last_name', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="(727) 555-0123"
        />
      </div>
      <div className="form-group">
        <label htmlFor="zip">ZIP code *</label>
        <input
          id="zip"
          required
          pattern="\d{5}"
          value={form.zip}
          onChange={(e) => update('zip', e.target.value)}
          placeholder="33771"
        />
      </div>
      <div className="form-group">
        <label htmlFor="message">Tell us about your yard</label>
        <textarea
          id="message"
          rows={4}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="Lot size, services needed, anything we should know (dogs, gate code, etc.)"
        />
      </div>
      {status === 'error' ? (
        <p style={{ color: 'var(--red-700)', fontWeight: 600 }} role="alert">
          {errorMessage}
        </p>
      ) : null}
      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Get My Quote'}
      </button>
    </form>
  );
}
