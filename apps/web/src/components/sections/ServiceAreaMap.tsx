'use client';

/**
 * ServiceAreaMap — D-0031: form-dominant Coverage Check, no map.
 *                D-0032: permissive about ZIP codes.
 *
 * D-0031 redesign (per steward feedback after D-0028): the 3-col
 * layout (form | map | result) shipped in D-0028 was technically
 * correct but visually wrong. The map was 1.5fr in the grid, so
 * it was the visual primary even though the form was the only
 * interactive element. The eye went to the map first, not the
 * "type your ZIP" input that actually answers the conversion
 * question. The steward escalated after seeing it in production:
 * "I still don't like the map/zip component/layout."
 *
 * D-0031 takes the brutal option: drop the map from the homepage
 * entirely. The form is the answer to "where I mow?" — the map
 * was decoration competing for attention. The map picture still
 * lives on /areas/{zip} for users who want to dig into a specific
 * neighborhood.
 *
 * D-0032: the form is now permissive about ZIP codes. The
 * steward has not yet landed a customer; wants to be flexible
 * about ZIPs during the pre-revenue phase to maximize conversion.
 * The service-area gate moved to /quote + the on-site visit, not
 * this input. We accept any 5-digit ZIP and any 3+ char text as
 * a positive result routed to /quote. The 6 home-area ZIPs are
 * still shown as the chip strip below the form (primary territory),
 * but the form itself is open.
 *
 * Section layout (vertical stack, all centered):
 *   1. Section header (small + centered)
 *   2. Form column (max-width 480px, centered) — input + Check
 *      coverage button side by side on desktop, stacked on mobile
 *   3. Result panel (same max-width, only renders after a check;
 *      cream card with sun-filled CTA for any valid input)
 *   4. Chip strip (the 6 ZIP neighborhoods — primary territory)
 *
 * All D-0028 behavior preserved + D-0032 expansion:
 *   - ZIP or neighborhood input with <datalist>
 *   - On any 5-digit ZIP: result panel with sun CTA → /quote?zip=
 *   - On text that doesn't match a known neighborhood: result
 *     panel with sun CTA → /quote (no zip param)
 *   - On invalid (empty / partial / 1-2 chars): inline helper
 *     text below the input
 *   - Live region for screen reader announcement
 *   - /quote prefill via ?zip= query param
 *
 * Single primary interactive zone per the design principles.
 */

import Link from 'next/link';
import { type FormEvent, type ReactNode, useId, useState } from 'react';

import { Eyebrow, Section } from '@/components/site';
import { Button } from '@/components/ui';
import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';
import { serviceAreaMap } from '@/lib/content';

import styles from './ServiceAreaMap.module.css';

interface ServiceAreaMapProps {
  className?: string;
}

/**
 * D-0032: Coverage Check is now permissive about ZIP codes.
 *
 * The service-area gate is the quote form (/quote) and the
 * eventual on-site visit, not this input. We accept any 5-digit
 * ZIP and route the user to /quote?zip={zip} where the actual
 * serviceability check + price estimate happens. For ZIPs we
 * have a neighborhood name for, we show the rich result; for
 * ZIPs we don't recognize, we just show the ZIP. Same UX either
 * way — sun-filled "Get free quote" CTA.
 *
 * This is a temporary relaxation per the D-0032 decision. The
 * steward has not yet landed a customer; wants to be flexible
 * about ZIPs to maximize conversion during the pre-revenue
 * phase. The 6 home-area ZIPs (33770, 33771, 33773, 33774, 33778,
 * 33756) are still the primary territory — shown as the chip
 * strip below the form — but the form is open to any ZIP.
 *
 * The inServiceArea() helper in business.ts is unchanged (other
 * code may still use it) — it's just no longer wired into this
 * resolver. The `BUSINESS.service_area_zips` array is still the
 * source of truth for the chip strip below.
 */
type CoverageResult =
  | { kind: 'hit'; zip: string; name: string | null }  // 5-digit ZIP (known or unknown)
  | { kind: 'miss'; query: string }                    // 3+ char text we couldn't resolve
  | { kind: 'invalid' };

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

  // Pure-digit input. D-0032: any 5-digit ZIP is accepted
  // (serviceability check moves to /quote + on-site visit, not
  // this input). Partials (1-4 digits) are explicitly invalid
  // so the helper text can guide the user to complete the field.
  if (/^\d+$/.test(q)) {
    if (q.length === 5) {
      const name =
        serviceAreaMap.pinLocations[q as keyof typeof serviceAreaMap.pinLocations] ?? null;
      return { kind: 'hit', zip: q, name };
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

  if (matchedZips.size > 0) {
    // Prefer the home ZIP if it's in the match set (so "Largo"
    // resolves to 33771, not 33778 by alphabetical accident).
    // We already returned early on `matchedZips.size === 0`, so
    // `sortedZips[0]` is guaranteed to exist here.
    const sortedZips = Array.from(matchedZips).sort();
    const chosen: string = matchedZips.has(HOME_ZIP) ? HOME_ZIP : (sortedZips[0] as string);
    const name =
      serviceAreaMap.pinLocations[chosen as keyof typeof serviceAreaMap.pinLocations] ?? null;
    return { kind: 'hit', zip: chosen, name };
  }

  // 3+ char text we couldn't resolve to a known neighborhood.
  // Still a positive result (D-0032: don't gate on text either)
  // — route to /quote, no zip param, where the form will collect
  // the address properly.
  return { kind: 'miss', query: q };
}

export function ServiceAreaMap({ className }: ServiceAreaMapProps): ReactNode {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<CoverageResult | null>(null);

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

  const showInvalidHelper = result?.kind === 'invalid';
  const showResult = result?.kind === 'hit' || result?.kind === 'miss';

  return (
    <Section rhythm="loose" className={cn(styles.root, className)}>
      <div className="container">
        <div className={styles.inner}>
          {/* Section header — small + centered. */}
          <header className={styles.header}>
            <Eyebrow tone="dark" className={styles.headerEyebrow}>
              {serviceAreaMap.eyebrow}
            </Eyebrow>
            <h2 className={styles.headerHeading}>{serviceAreaMap.heading}</h2>
            <p className={styles.headerSub}>{serviceAreaMap.subhead}</p>
          </header>

          {/* Form + result — form-dominant. max-width 480px so the
             form is the obvious "do this" element, not lost in a
             wide grid. Result panel (when shown) sits directly
             below the form, same width, as a confirmation. */}
          <div className={styles.coverage}>
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
                    if (result !== null) setResult(null);
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

            {/* Result panel — only renders after a check. D-0032:
                 all positive cases (known ZIP, unknown ZIP, unresolved
                 text) get the same cream card + sun-filled CTA. The
                 service-area gate moved to /quote + on-site visit. */}
            {showResult && result && (
              <output id={liveId} className={styles.result} data-result={result.kind === 'miss' ? 'text' : 'hit'}>
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
                      {result.kind === 'hit' && result.name
                        ? `Got it \u00b7 ${result.zip} \u2014 ${result.name}`
                        : result.kind === 'hit'
                          ? `Got it \u00b7 ${result.zip}`
                          : `Got it \u2014 let\u2019s chat about ${result.query}`}
                    </span>
                  </p>
                  <Button
                    as="link"
                    href={result.kind === 'hit' ? `/quote?zip=${result.zip}` : '/quote'}
                    variant="sun"
                    className={styles.resultCta}
                  >
                    Get free quote
                    <span aria-hidden="true" className={styles.resultCtaArrow}>
                      &rarr;
                    </span>
                  </Button>
                </div>
              </output>
            )}
          </div>

          {/* "Where I mow" — the six neighborhood chips. With the
             map gone, the chips ARE the where-I-mow information.
             Visible by default; each chip links to /areas/{zip}
             (the SEO landing page for that ZIP). */}
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
        </div>
      </div>
    </Section>
  );
}
