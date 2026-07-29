/**
 * ReviewMagnetForm — `/review` interactive star-rating branch.
 *
 * Gated on `social.reviewMagnetEnabled` (default false). When true,
 * this client component replaces the static "coming soon" card in
 * ReviewMagnet with:
 *
 *   1. 5-star emoji strip selector
 *   2a. 4-5 stars → thank-you + GBP redirect link
 *   2b. 1-3 stars → "Sorry, what went wrong?" form → posts to
 *       `/api/review-handler` (Phase-3 backend)
 *
 * The flow is a one-shot — once a star is selected, the form
 * collapses into the appropriate branch and never resets.
 *
 * Reduced-motion: no star selection animation, no confetti, no
 * animated transitions. The branch swap is instant.
 *
 * Tracking: every GBP redirect appends `?src=review-magnet&zip=
 * [zip]` so the GBP stub can attribute the visit.
 */

'use client';

import { useReducedMotion } from 'framer-motion';
import { type ChangeEvent, type FormEvent, type ReactNode, useState } from 'react';

import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { reviewPage } from '@/lib/content';

import styles from './ReviewMagnetForm.module.css';

interface ReviewMagnetFormProps {
  className?: string | undefined;
}

type Branch = 'select' | 'positive' | 'negative' | 'submitted';

const STARS = [1, 2, 3, 4, 5] as const;

export function ReviewMagnetForm({ className }: ReviewMagnetFormProps): ReactNode {
  const reduced = useReducedMotion();
  const [branch, setBranch] = useState<Branch>('select');
  const [hover, setHover] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', zip: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onStarClick = (n: number) => {
    if (branch !== 'select') return;
    setSelected(n);
    setBranch(n >= 4 ? 'positive' : 'negative');
  };

  const onStarHover = (n: number) => {
    if (branch !== 'select') setHover(n);
  };

  const onStarLeave = () => {
    if (branch !== 'select') setHover(null);
  };

  const onFieldChange =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/review-handler', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          rating: selected,
          name: form.name,
          zip: form.zip,
          message: form.message,
        }),
      });
      if (!res.ok) {
        throw new Error(`Review handler returned ${res.status}`);
      }
      setBranch('submitted');
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Could not send your note. Please call or text instead.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (branch === 'select') {
    const activeCount = hover ?? selected ?? 0;
    return (
      <div className={cn(styles.root, className)}>
        <p className={styles.label}>How was it?</p>
        <div
          className={styles.stars}
          role="radiogroup"
          aria-label="Rate your experience from 1 to 5 stars"
          onMouseLeave={onStarLeave}
        >
          {STARS.map((n) => {
            const isActive = n <= activeCount;
            // Visually-hidden native radio for screen-reader + form
            // semantics. Label wraps the visible star button so
            // clicking the star checks the radio. The hidden
            // input is the actual form control; the visible
            // star button is the styled label trigger.
            return (
              <span key={n} className={styles.starWrap}>
                <input
                  type="radio"
                  name="review-rating"
                  value={n}
                  checked={selected === n}
                  onChange={() => onStarClick(n)}
                  className={styles.hiddenRadio}
                  aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
                />
                <button
                  type="button"
                  aria-hidden="true"
                  tabIndex={-1}
                  className={cn(
                    styles.star,
                    isActive && styles.starActive,
                    reduced && styles.starReduced,
                  )}
                  onMouseEnter={() => onStarHover(n)}
                  onFocus={() => onStarHover(n)}
                  onBlur={onStarLeave}
                >
                  {isActive ? '★' : '☆'}
                </button>
              </span>
            );
          })}
        </div>
        <p className={styles.hint}>
          Tap a star. 4–5 stars open Google; lower stars come back to me.
        </p>
      </div>
    );
  }

  if (branch === 'positive') {
    // GBP URL is the steward-set destination. Append tracking
    // params so GBP stub can attribute the visit.
    const gbpHref = reviewPage.gbpUrl
      ? `${reviewPage.gbpUrl}?src=review-magnet${form.zip ? `&zip=${encodeURIComponent(form.zip)}` : ''}`
      : `tel:${BUSINESS.phoneTel}`;
    return (
      <div className={cn(styles.root, className)}>
        <p className={styles.thanks}>Thank you — that means a lot.</p>
        <p className={styles.body}>
          Google reviews help a solo operator more than almost anything else. Takes about thirty
          seconds:
        </p>
        <div className={styles.actions}>
          <a className={styles.primaryLink} href={gbpHref} target="_blank" rel="noreferrer">
            Leave a Google review →
          </a>
        </div>
      </div>
    );
  }

  if (branch === 'negative') {
    return (
      <form className={cn(styles.root, styles.form, className)} onSubmit={onSubmit}>
        <p className={styles.thanks}>Sorry it wasn’t right.</p>
        <p className={styles.body}>
          I’d rather hear it from you than read it on a review. Tell me what to fix and I’ll come
          back within forty-eight hours.
        </p>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Your name</span>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={onFieldChange('name')}
            className={styles.input}
            autoComplete="name"
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>ZIP</span>
          <input
            type="text"
            name="zip"
            inputMode="numeric"
            pattern="[0-9]{5}"
            value={form.zip}
            onChange={onFieldChange('zip')}
            className={styles.input}
            autoComplete="postal-code"
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>What went wrong</span>
          <textarea
            name="message"
            required
            rows={4}
            value={form.message}
            onChange={onFieldChange('message')}
            className={styles.textarea}
          />
        </label>
        {submitError ? (
          <p role="alert" className={styles.error}>
            {submitError}
          </p>
        ) : null}
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? 'Sending…' : 'Send to the operator'}
          </button>
        </div>
      </form>
    );
  }

  // branch === 'submitted'
  return (
    <div className={cn(styles.root, className)}>
      <p className={styles.thanks}>Sent. I’ll be in touch within forty-eight hours.</p>
      <p className={styles.body}>
        If it’s urgent, the fastest path is a text to{' '}
        <a href={`tel:${BUSINESS.phoneTel}`} className={styles.phoneLink}>
          {BUSINESS.phone}
        </a>
        .
      </p>
    </div>
  );
}
