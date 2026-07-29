/**
 * zip-memory — small wrapper over localStorage for "remember my ZIP".
 *
 * Every ZIP-input surface on the site (the homepage coverage check
 * in <ServiceAreaMap>, the <ContactForm> on /contact, the
 * <QuoteCalculator> on /quote) currently re-asks the user for their
 * ZIP on every visit. The first ZIP a user enters is almost always
 * the same ZIP they care about — the property they own or are
 * looking to maintain — so re-asking is friction.
 *
 * `rememberZip(zip)` saves the last ZIP to localStorage;
 * `recallZip()` reads it back. Both functions guard against:
 *   - SSR (typeof window === 'undefined')
 *   - localStorage being blocked (Safari private mode, etc.)
 *   - invalid ZIPs (anything not 5 digits)
 *   - localStorage quota errors
 * so they're safe to call unconditionally on mount.
 *
 * Storage key: 'll.remembered_zip' (namespaced with the brand
 * initials so a future dev rename of the constant doesn't break
 * existing users' stored values — the value is keyed by string,
 * not by import name).
 */

const STORAGE_KEY = 'll.remembered_zip';
const ZIP_RE = /^\d{5}$/;

export function rememberZip(zip: string): void {
  if (typeof window === 'undefined') return;
  if (!ZIP_RE.test(zip)) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, zip);
  } catch {
    // localStorage may be blocked (Safari private mode, embedded
    // webview, strict cookie policies). The form still works
    // without the memory — this is a best-effort convenience.
  }
}

export function recallZip(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return ZIP_RE.test(stored) ? stored : null;
  } catch {
    return null;
  }
}
