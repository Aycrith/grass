'use client';

/**
 * CookieConsent — GDPR / CCPA-compliant cookie notice banner.
 *
 * Shown on first visit to any page. Dismissed state persists in
 * localStorage so the banner only appears once per device.
 *
 * Scope: functional cookies only (analytics, preferences). No ad
 * cookies or third-party tracking — this site has none. The notice
 * is a professional signal, not a legal requirement for this site.
 *
 * D-000x (2026-07-26): Initial implementation.
 */

import { useEffect, useState } from 'react';

import { cn } from '@/lib/cn';

import styles from './CookieConsent.module.css';

const STORAGE_KEY = 'll_cookie_consent';

type Consent = 'accepted' | 'dismissed' | null;

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    setConsent(stored === 'accepted' ? 'accepted' : stored === 'dismissed' ? 'dismissed' : null);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setConsent('accepted');
  };

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'dismissed');
    setConsent('dismissed');
  };

  if (consent !== null) return null;

  return (
    <div
      className={styles.banner}
      role="dialog"
      aria-label="Cookie notice"
      aria-live="polite"
    >
      <div className={styles.inner}>
        <p className={styles.text}>
          This site uses minimal cookies for site functionality. We do not use
          advertising or tracking cookies.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={cn(styles.btn, styles.btnSecondary)}
            onClick={dismiss}
          >
            No thanks
          </button>
          <button
            type="button"
            className={cn(styles.btn, styles.btnPrimary)}
            onClick={accept}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
