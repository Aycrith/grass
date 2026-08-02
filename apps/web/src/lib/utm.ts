/**
 * UTM helpers — read UTM params from the current URL.
 *
 * SSR-safe: returns an empty object on the server (no `window`).
 * All values are either a non-empty string or `undefined` (we
 * explicitly skip empty strings so the form payload doesn't
 * carry `utm_source: ""` for organic traffic).
 *
 * Used by:
 *   - ContactForm (utm capture on mount)
 *   - SiteHeader / ConversionRail (detect paid traffic → swap
 *     the displayed phone number to the CallRail tracking number)
 */

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

const UTM_KEYS: ReadonlyArray<keyof UTMParams> = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
];

function clean(s: string | null): string | undefined {
  if (s === null) return undefined;
  const trimmed = s.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function readUTMs(): UTMParams {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string | undefined> = {};
  for (const key of UTM_KEYS) {
    const value = clean(params.get(key));
    if (value !== undefined) out[key] = value;
  }
  return out as UTMParams;
}

/** True if any UTM param is present (i.e., this is paid traffic). */
export function isPaidTraffic(): boolean {
  const utm = readUTMs();
  return utm.utm_source !== undefined;
}
