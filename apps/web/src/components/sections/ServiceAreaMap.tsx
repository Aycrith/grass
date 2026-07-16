'use client';

/**
 * ServiceAreaMap — D-0031: form-dominant Coverage Check, no map.
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
 * neighborhood; on the homepage, the section is now just:
 *   1. Section header (small + centered, unchanged)
 *   2. Form column (max-width 480px, centered) — input + Check
 *      coverage button side by side on desktop, stacked on mobile
 *   3. Result panel (same max-width, only renders after a check;
 *      cream card with sun-filled CTA on hit, outline CTA on miss)
 *   4. "See all six areas" chips (visible by default — they're
 *      the real "where I mow" information, not a collapsed
 *      secondary path)
 *
 * All D-0028 behavior preserved:
 *   - ZIP or neighborhood input with <datalist>
 *   - On hit: result panel with sun CTA → /quote?zip=
 *   - On miss: result panel with outline CTA → /quote
 *   - On invalid: inline helper text below the input
 *   - Live region for screen reader announcement
 *   - /quote prefill via ?zip= query param
 *
 * Single primary interactive zone per the design principles.
 */

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

            {/* Result panel — only renders after a check. Cream card
                 on the dark palm-bark background, sun CTA on hit. */}
            {showResult && result && (
              <output id={liveId} className={styles.result} data-result={result.kind}>
                {result.kind === 'hit' ? (
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
                ) : (
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
                          <circle cx="8" cy="8" r="6" />
                          <path d="M8 5v3" />
                          <path d="M8 11v.5" />
                        </svg>
                      </span>
                      <span>Outside my usual route &mdash; still ask.</span>
                    </p>
                    <Button as="link" href="/quote" variant="outline" className={styles.resultCta}>
                      Get a free quote
                      <span aria-hidden="true" className={styles.resultCtaArrow}>
                        &rarr;
                      </span>
                    </Button>
                  </div>
                )}
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
