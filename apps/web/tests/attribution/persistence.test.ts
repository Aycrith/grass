/**
 * persistence.test.ts — Stage 3 acceptance: attribution survives
 * navigation across pages and survives page reload.
 *
 * Per plan `review-the-plans-recently-lucky-catmull.md` Stage 3 §1:
 *   "Attribution survives navigation between landing path, /quote, and
 *    /contact, and survives page reload."
 *
 * Run with:  bun test apps/web/tests/attribution/persistence.test.ts
 *
 * Strategy: simulate the browser-side persistence contract by exercising
 * `captureAttribution()` → `persistAttribution()` → `readPersistedAttribution()`
 * with a stubbed `window`/`localStorage`. Each test maps to one
 * acceptance criterion: cross-page navigation, page reload, first-touch
 * immutability, TTL expiry.
 */

import { afterEach, beforeEach, describe, expect, it } from 'bun:test';

import {
  type AttributionPayload,
  captureAttribution,
  persistAttribution,
  readPersistedAttribution,
} from '@/lib/attribution';

interface MemoryStorage {
  data: Map<string, string>;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function makeBrowser(): {
  location: { search: string; pathname: string };
  localStorage: MemoryStorage;
} {
  const data = new Map<string, string>();
  return {
    location: { search: '', pathname: '/' },
    localStorage: {
      data,
      getItem(key: string) {
        return data.get(key) ?? null;
      },
      setItem(key: string, value: string) {
        data.set(key, value);
      },
      removeItem(key: string) {
        data.delete(key);
      },
    },
  };
}

function setSearch(b: ReturnType<typeof makeBrowser>, search: string): void {
  b.location.search = search;
}

function setPathname(b: ReturnType<typeof makeBrowser>, pathname: string): void {
  b.location.pathname = pathname;
}

function installBrowser(b: ReturnType<typeof makeBrowser>): void {
  // The lib guards `typeof window === 'undefined'` so we set a real
  // window-like object. localStorage + location are the only props read.
  (globalThis as unknown as { window: unknown }).window = b;
}

function uninstallBrowser(): void {
  (globalThis as unknown as { window?: unknown }).window = undefined;
}

const URL_WITH_UTMS =
  '?utm_source=google&utm_medium=cpc&utm_campaign=pw_search&utm_term=mowing&gclid=ABC123';
const UA_MOBILE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';

beforeEach(() => {
  installBrowser(makeBrowser());
});

afterEach(() => {
  uninstallBrowser();
});

describe('attribution: persistence across navigation', () => {
  it('persists first-touch attribution on first /t/google-ads landing', () => {
    const b = (globalThis as unknown as { window: ReturnType<typeof makeBrowser> }).window;
    setSearch(b, URL_WITH_UTMS);
    setPathname(b, '/pet-waste');

    const capture = captureAttribution('https://www.google.com', UA_MOBILE);
    const persisted = persistAttribution(capture);

    expect(persisted.utm_source).toBe('google');
    expect(persisted.utm_medium).toBe('cpc');
    expect(persisted.utm_campaign).toBe('pw_search');
    expect(persisted.gclid).toBe('ABC123');
    expect(persisted.utm_term).toBe('mowing');
    expect(persisted.device_class).toBe('mobile');
    expect(persisted.landing_path).toBe('/pet-waste');
    expect(persisted.first_touch_at).not.toBeNull();
  });

  it('preserves first-touch attribution when navigating to /quote with no UTMs', () => {
    const b = (globalThis as unknown as { window: ReturnType<typeof makeBrowser> }).window;
    // First landing on /pet-waste with UTMs.
    setSearch(b, URL_WITH_UTMS);
    setPathname(b, '/pet-waste');
    const first = persistAttribution(captureAttribution('', UA_MOBILE));
    const originalFirstTouchAt = first.first_touch_at;
    expect(originalFirstTouchAt).not.toBeNull();

    // Navigate to /quote — URL params cleared.
    setSearch(b, '');
    setPathname(b, '/quote');
    const second = persistAttribution(captureAttribution('', UA_MOBILE));

    // First-touch fields preserved (per `persistAttribution` contract —
    // `landing_path` is part of the first-touch immutable set, see the
    // doc comment on `persistAttribution`).
    expect(second.utm_source).toBe('google');
    expect(second.utm_medium).toBe('cpc');
    expect(second.utm_campaign).toBe('pw_search');
    expect(second.gclid).toBe('ABC123');
    expect(second.landing_path).toBe('/pet-waste');
    expect(second.first_touch_at).toBe(originalFirstTouchAt);

    // Last-touch fields updated.
    expect(second.utm_term).toBeNull();
    expect(second.referrer).toBeNull();
  });

  it('survives page reload — readPersistedAttribution returns the merged payload', () => {
    const b = (globalThis as unknown as { window: ReturnType<typeof makeBrowser> }).window;
    setSearch(b, URL_WITH_UTMS);
    setPathname(b, '/pet-waste');
    const first = persistAttribution(captureAttribution('', UA_MOBILE));
    expect(first.utm_source).toBe('google');

    // Simulate reload — URL cleared, but localStorage still has the entry.
    setSearch(b, '');
    setPathname(b, '/pet-waste');
    const reloaded = readPersistedAttribution();

    expect(reloaded).not.toBeNull();
    expect(reloaded?.utm_source).toBe('google');
    expect(reloaded?.utm_medium).toBe('cpc');
    expect(reloaded?.utm_campaign).toBe('pw_search');
    expect(reloaded?.gclid).toBe('ABC123');
  });

  it('first-touch is immutable — second capture with different utm_source is ignored', () => {
    const b = (globalThis as unknown as { window: ReturnType<typeof makeBrowser> }).window;
    setSearch(b, URL_WITH_UTMS);
    setPathname(b, '/pet-waste');
    const first = persistAttribution(captureAttribution('', UA_MOBILE));
    expect(first.utm_source).toBe('google');

    // Second visit with a different utm_source (e.g., direct fb ad click).
    setSearch(b, '?utm_source=facebook&utm_medium=social&utm_campaign=mp_listing');
    setPathname(b, '/quote');
    const second = persistAttribution(captureAttribution('', UA_MOBILE));

    // First-touch utm_source from google stays (landing_path also
    // first-touch per persistAttribution contract).
    expect(second.utm_source).toBe('google');
    expect(second.landing_path).toBe('/pet-waste');
  });

  it('returns null when localStorage has no entry', () => {
    const reloaded = readPersistedAttribution();
    expect(reloaded).toBeNull();
  });

  it('returns null when the persisted entry is expired (TTL elapsed)', () => {
    const b = (globalThis as unknown as { window: ReturnType<typeof makeBrowser> }).window;
    // Seed localStorage with an expired entry.
    const expired: AttributionPayload = {
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'pw_search',
      utm_term: null,
      utm_content: null,
      gclid: null,
      landing_path: '/pet-waste',
      referrer: null,
      device_class: null,
      first_touch_at: '2026-06-01T00:00:00.000Z',
      source: 'google',
    };
    b.localStorage.data.set(
      'grass_attribution_v1',
      JSON.stringify({
        payload: expired,
        // 1ms ago — definitely expired.
        expires_at: Date.now() - 1,
      }),
    );

    const reloaded = readPersistedAttribution();
    expect(reloaded).toBeNull();
    // Expired key should be removed from storage.
    expect(b.localStorage.data.has('grass_attribution_v1')).toBe(false);
  });
});
