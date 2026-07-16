'use client';

/**
 * ServiceAreaMap — Mission 1 illustrative map + Coverage Check.
 *
 * D-0028: replaced the D-0027 light-cards rail with a single, obvious
 * ZIP-or-neighborhood input that runs an in-section coverage check.
 *
 * Problem D-0028 fixes (carried over from D-0026c + D-0027):
 *   - The previous 6-card rail was a SECOND UI object next to the
 *     static map illustration. The eye didn't know which object
 *     answered "am I in your service area?"
 *   - Most Largo homeowners know their street + neighborhood name
 *     ("I live off Indian Rocks, near Belleair Bluffs"). Asking
 *     them to pick from 6 ZIP cards mid-scroll was a cognitive tax.
 *   - The rail's primary verb was "view details" (→ /areas/{zip});
 *     the real primary verb is "get a free quote" with the ZIP
 *     prefilled so the calculator can pre-load the right area.
 *
 * New flow (D-0028):
 *   1. Section header is small + centered (unchanged from D-0026c).
 *   2. ONE input: ZIP or neighborhood name. `<datalist>` is seeded
 *      with all 6 ZIPs and all 6 neighborhood labels from
 *      `serviceAreaMap.pinLocations`, so users can either type a
 *      5-digit ZIP OR start typing a neighborhood (Largo, Belleair,
 *      Seminole, ...) and pick from the autocomplete.
 *   3. On submit, a tiny resolver runs:
 *        - 5-digit ZIP, in service area       -> hit (link to /quote?zip=)
 *        - 5-digit ZIP, not in service area   -> miss (link to /quote)
 *        - text containing a known token      -> hit (resolved to ZIP)
 *        - text without a known token         -> miss
 *        - empty / partial / 1-2 char         -> invalid (inline helper)
 *   4. A result panel sits to the right of the map on desktop and
 *      below the map on mobile. It uses the native `<output>` element
 *      (which carries an implicit `role="status"` + `aria-live="polite"`)
 *      so screen readers announce the result.
 *   5. The 6 area "details" collapse into a `<details>` element
 *      below the form. Each chip is a secondary path to
 *      `/areas/{zip}` (still useful for SEO + users who want to
 *      browse per-area).
 *
 * Acceptance notes:
 *   - The map picture is preserved as-is (`/illustrations/pinellas-
 *     map-clean-1200x900.webp`). NO AI regeneration, per the burned-
 *     once-on-D-0024 hard rule.
 *   - Palette + typography tokens are unchanged. Sun-filled hit CTA
 *     uses the existing `Button` variant="sun" + outline miss CTA
 *     uses Button variant="outline".
 *   - Visible focus ring on the input AND the check button (global
 *     `*:focus-visible` rule in typography.css applies automatically).
 *   - Form uses `<form onSubmit>` so Enter submits; the "Check
 *     coverage" button is `type="submit"` (the shared `Button`
 *     component hard-codes `type="button"`, so the submit button is
 *     a raw `<button>` to keep keyboard-submit behavior correct).
 *   - Prefill loop: the result panel links to `/quote?zip={zip}`,
 *     and `/quote`'s QuoteCalculator reads `?zip=` to prefill its
 *     own ZIP select (loop-closure is in QuoteCalculator.tsx).
 */

import Image from 'next/image';
import Link from 'next/link';
import { type FormEvent, type ReactNode, useId, useState } from 'react';

import { Eyebrow, Section } from '@/components/site';
import { Button } from '@/components/ui';
import { BUSINESS, inServiceArea } from '@/lib/business';
import { cn } from '@/lib/cn';
import { serviceAreaMap } from '@/lib/content';

import styles from './ServiceAreaMap.module.css';

interface ServiceAreaMapProps {
  className?: string;
}

type CoverageResult =
  | { kind: 'hit'; zip: string; name: string }
  | { kind: 'miss'; query: string }
  | { kind: 'invalid' }
  | { kind: 'idle' };

/**
 * Build a token index once at module load. `pinLocations` is a
 * `Readonly<Record<string, string>>` whose values look like
 * "Largo (central)" or "Belleair / Clearwater". We tokenize each
 * name on whitespace / slash / paren / comma, drop tokens shorter
 * than 3 chars (so we don't match on "of" or "the"), and emit a
 * flat list of (token, zip) pairs.
 *
 * The resolver walks this list once per submit; the per-render cost
 * is negligible (< 50 entries).
 */
const NEIGHBORHOOD_TOKENS: ReadonlyArray<{ token: string; zip: string }> = (() => {
  const out: Array<{ token: string; zip: string }> = [];
  for (const [zip, name] of Object.entries(serviceAreaMap.pinLocations)) {
    const tokens = name
      .toLowerCase()
      .split(/[\s/(),]+/)
      .filter((t) => t.length >= 3);
    for (const t of tokens) {
      out.push({ token: t, zip });
    }
  }
  return out;
})();

/**
 * When a neighborhood token (e.g. "Largo") resolves to multiple
 * ZIPs (33771, 33773, 33774 all have "Largo" in their label), we
 * prefer the home-base ZIP so the result panel still points at a
 * useful quote link. 33771 is the home base per business.ts.
 */
const HOME_ZIP = BUSINESS.address.zip;

function resolveQuery(rawQuery: string): CoverageResult {
  const q = rawQuery.trim();
  if (q.length === 0) return { kind: 'invalid' };

  // Pure-digit input. Only an exact 5-digit ZIP is accepted here;
  // partials (1-4 digits) are explicitly invalid so the helper
  // text can guide the user to complete the field.
  if (/^\d+$/.test(q)) {
    if (q.length === 5) {
      if (inServiceArea(q)) {
        const name =
          serviceAreaMap.pinLocations[q as keyof typeof serviceAreaMap.pinLocations] ??
          'Largo area';
        return { kind: 'hit', zip: q, name };
      }
      return { kind: 'miss', query: q };
    }
    return { kind: 'invalid' };
  }

  // Text input. 1-2 chars are too short to be a real neighborhood.
  if (q.length < 3) return { kind: 'invalid' };

  // Case-insensitive neighborhood-token match. If any token in
  // `pinLocations` values appears as a substring of the query,
  // collect the matching ZIPs.
  const qLower = q.toLowerCase();
  const matchedZips = new Set<string>();
  for (const { token, zip } of NEIGHBORHOOD_TOKENS) {
    if (qLower.includes(token)) matchedZips.add(zip);
  }

  if (matchedZips.size === 0) return { kind: 'miss', query: q };

  // Prefer the home ZIP if it's in the match set (so "Largo"
  // resolves to 33771, not 33778 by alphabetical accident).
  // We already returned early on `matchedZips.size === 0`, so
  // `sortedZips[0]` is guaranteed to exist here.
  const sortedZips = Array.from(matchedZips).sort();
  const chosen: string = matchedZips.has(HOME_ZIP) ? HOME_ZIP : (sortedZips[0] as string);
  const name =
    serviceAreaMap.pinLocations[chosen as keyof typeof serviceAreaMap.pinLocations] ?? 'Largo area';
  return { kind: 'hit', zip: chosen, name };
}

export function ServiceAreaMap({ className }: ServiceAreaMapProps): ReactNode {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<CoverageResult>({ kind: 'idle' });

  // Stable IDs so the input/label/region wiring is unique per
  // mount (avoids a11y collisions if two instances ever coexist
  // on the same page).
  const inputId = useId();
  const helperId = useId();
  const liveId = useId();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setResult(resolveQuery(query));
  };

  const showResultPanel = result.kind === 'hit' || result.kind === 'miss';
  const showInvalidHelper = result.kind === 'invalid';

  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <div className={styles.inner}>
          {/* Section header — small + centered, the map below is the
             focal point so we don't want the header to compete. */}
          <header className={styles.header}>
            <Eyebrow tone="dark" className={styles.headerEyebrow}>
              {serviceAreaMap.eyebrow}
            </Eyebrow>
            <h2 className={styles.headerHeading}>{serviceAreaMap.heading}</h2>
            <p className={styles.headerSub}>{serviceAreaMap.subhead}</p>
          </header>

          {/* Coverage Check — 3-col on desktop (form | map | result),
             single-col stack on mobile (form → map → result). */}
          <div className={styles.coverage}>
            {/* ---- Form column ---- */}
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <label htmlFor={inputId} className={styles.formLabel}>
                ZIP or neighborhood
              </label>
              <div className={styles.formRow}>
                <input
                  id={inputId}
                  name="coverage"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{5}"
                  autoComplete="postal-code"
                  list="coverage-zips"
                  className={styles.formInput}
                  placeholder="33771 or Largo"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    // Clear a stale result as soon as the user starts
                    // editing again — keeps the panel from lying
                    // about a query that no longer matches.
                    if (result.kind !== 'idle') setResult({ kind: 'idle' });
                  }}
                  aria-describedby={showInvalidHelper ? helperId : undefined}
                  aria-controls={liveId}
                />
                <datalist id="coverage-zips">
                  {BUSINESS.service_area_zips.map((zip) => {
                    const label =
                      serviceAreaMap.pinLocations[
                        zip as keyof typeof serviceAreaMap.pinLocations
                      ] ?? '';
                    return (
                      <option key={zip} value={zip}>
                        {label}
                      </option>
                    );
                  })}
                  {Object.entries(serviceAreaMap.pinLocations).map(([zip, name]) => (
                    <option key={`name-${zip}`} value={name}>
                      {zip}
                    </option>
                  ))}
                </datalist>
                <button type="submit" className={styles.formSubmit}>
                  Check coverage
                </button>
              </div>
              {showInvalidHelper && (
                <p id={helperId} className={styles.formHelper}>
                  Type a 5-digit ZIP or a neighborhood name like &ldquo;Largo&rdquo; or
                  &ldquo;Belleair&rdquo;.
                </p>
              )}
            </form>

            {/* ---- Map (center column on desktop, full-width on mobile) ---- */}
            <div className={styles.mapWrap}>
              <Image
                src="/illustrations/pinellas-map-clean-1200x900.webp"
                alt={serviceAreaMap.svgAriaLabel}
                fill
                sizes="(max-width: 980px) 100vw, 50vw"
                className={styles.mapImage}
                priority={false}
              />
            </div>

            {/* ---- Result panel (right column on desktop, full-width
                 on mobile). Always mounted so the layout is stable;
                 the idle state shows a friendly prompt. ---- */}
            <output
              id={liveId}
              className={cn(styles.result, !showResultPanel && styles.resultIdle)}
            >
              {result.kind === 'hit' && (
                <div className={styles.resultInner}>
                  <p className={styles.resultHeadline}>
                    <span className={styles.resultCheck} aria-hidden="true">
                      <svg
                        viewBox="0 0 16 16"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m3 8 3.5 3.5L13 5" />
                      </svg>
                    </span>
                    <span>
                      You&rsquo;re covered &middot; {result.zip} &mdash; {result.name}
                    </span>
                  </p>
                  <p className={styles.resultDetail}>
                    On the weekly route. Free quote within 24 hours.
                  </p>
                  <Button
                    as="link"
                    href={`/quote?zip=${result.zip}`}
                    variant="sun"
                    className={styles.resultCta}
                  >
                    Get free quote
                    <span aria-hidden="true" className={styles.resultCtaArrow}>
                      &rarr;
                    </span>
                  </Button>
                </div>
              )}
              {result.kind === 'miss' && (
                <div className={styles.resultInner}>
                  <p className={styles.resultHeadline}>
                    <span className={styles.resultCheckMiss} aria-hidden="true">
                      <svg
                        viewBox="0 0 16 16"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M8 3v6" />
                        <path d="M8 12.5v.5" />
                      </svg>
                    </span>
                    <span>That&rsquo;s outside my usual route.</span>
                  </p>
                  <p className={styles.resultDetail}>
                    Still ask &mdash; I sometimes take neighbors. Free quote within 24 hours.
                  </p>
                  <Button as="link" href="/quote" variant="outline" className={styles.resultCta}>
                    Get a free quote
                    <span aria-hidden="true" className={styles.resultCtaArrow}>
                      &rarr;
                    </span>
                  </Button>
                </div>
              )}
              {result.kind === 'idle' && (
                <div className={styles.resultInner}>
                  <p className={styles.resultIdleHeadline}>We&rsquo;ll tell you on the spot.</p>
                  <p className={styles.resultIdleBody}>
                    Type a ZIP or neighborhood above and hit{' '}
                    <span className={styles.resultIdleKbd}>Check coverage</span>. If you&rsquo;re on
                    the route, the next click takes you to a pre-filled quote.
                  </p>
                </div>
              )}
            </output>
          </div>

          {/* Collapsed "See all areas" — secondary path. Each chip
             still links to /areas/{zip} (the SEO landing page). */}
          <details className={styles.areasDetails}>
            <summary className={styles.areasSummary}>
              <span>See all six areas</span>
              <svg
                className={styles.areasChevron}
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m4 6 4 4 4-4" />
              </svg>
            </summary>
            <nav className={styles.areasChips} aria-label="All service area ZIPs">
              {BUSINESS.service_area_zips.map((zip) => {
                const name =
                  serviceAreaMap.pinLocations[zip as keyof typeof serviceAreaMap.pinLocations] ??
                  'Largo area';
                return (
                  <Link key={zip} href={`/areas/${zip}`} className={styles.areaChip}>
                    <span className={styles.areaChipZip}>{zip}</span>
                    <span className={styles.areaChipName}>{name}</span>
                  </Link>
                );
              })}
            </nav>
          </details>
        </div>
      </div>
    </Section>
  );
}
