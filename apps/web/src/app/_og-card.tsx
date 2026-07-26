/**
 * Shared card composition for /opengraph-image and /twitter-image,
 * plus all per-route OG images (services/[slug], areas/[zip], /about,
 * /pricing, /contact, /quote, /services, /areas).
 *
 * Per-route OG images: 2026-07-26 — previously every page on the
 * site shared the same brand-default OgCard rendered at the app
 * root. Social previews for /services/mowing, /areas/33771, /pricing,
 * /about, /contact, /quote, /services, /areas all looked identical,
 * which hurts both click-through (no context for the user scrolling
 * a feed) and SEO (Twitter/LinkedIn/Facebook rank distinct OG
 * images in their caches, so a single image dampens every link's
 * reach).
 *
 * The composition is now parameterised by:
 *   - eyebrow: short uppercase tag (e.g. "LAWN CARE · 33771")
 *   - headline: 1-2 line page title (e.g. "Mowing in Largo, FL.")
 *   - subhead: 1-2 line page subtitle (e.g. "Weekly, solo-operator.")
 *   - tone: 'sand' (default cream) or 'palm' (deep green)
 * Satori renders this JSX as a static PNG — it does NOT run in the
 * browser. The inline `style={{...}}` props are Satori's required
 * API (no CSS modules, no Tailwind). Do not refactor to CSS classes.
 *
 * Color literals are intentionally hard-coded (not var(--ll-*) refs):
 * Satori doesn't resolve CSS custom properties at the time of
 * generation (Next 15.5.x), and the brand tokens themselves are
 * defined to match these hex values — see the comments next to
 * each one (e.g. `// --ll-sand-bleached`).
 */

export const OG_CARD_SIZE = { width: 1200, height: 630 } as const;

export type OgCardTone = 'sand' | 'palm';

export interface OgCardProps {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  tone?: OgCardTone;
}

export function OgCard({
  eyebrow = 'LAWN CARE IN 33771',
  headline,
  subhead = 'Local, solo-operator lawn care in Largo and the adjacent five Pinellas ZIPs. Free quotes within 24 hours.',
  tone = 'sand',
}: OgCardProps): React.ReactNode {
  const isPalm = tone === 'palm';
  const bg = isPalm ? '#1F4E2C' : '#F4E8D0'; // --ll-green : --ll-sand-bleached
  const fg = isPalm ? '#F4E8D0' : '#1A1F1B'; // --ll-sand-bleached : --ll-palm-bark
  const accent = isPalm ? '#E8B65A' : '#B5651D'; // --ll-sun : --ll-clay
  const subheadAlpha = isPalm ? 0.85 : 0.78;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: bg,
        padding: 80,
        color: fg,
        position: 'relative',
      }}
    >
      {/* Sun accent top-right */}
      <div
        style={{
          position: 'absolute',
          top: 72,
          right: 120,
          width: 96,
          height: 96,
          borderRadius: 9999,
          backgroundColor: '#E8B65A', // --ll-sun
          opacity: isPalm ? 0.9 : 0.85,
          display: 'flex',
        }}
      />

      {/* Logo lockup: grass-blade mark + wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 6,
            height: 100,
            width: 100,
          }}
        >
          <div
            style={{
              width: 24,
              height: 100,
              backgroundColor: isPalm ? '#F4E8D0' : '#1F4E2C',
              borderRadius: 12,
              transform: 'rotate(-8deg)',
            }}
          />
          <div
            style={{
              width: 24,
              height: 100,
              backgroundColor: isPalm ? '#F4E8D0' : '#1F4E2C',
              borderRadius: 12,
            }}
          />
          <div
            style={{
              width: 24,
              height: 100,
              backgroundColor: isPalm ? '#F4E8D0' : '#1F4E2C',
              borderRadius: 12,
              transform: 'rotate(8deg)',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: isPalm ? '#F4E8D0' : '#1F4E2C',
              lineHeight: 1,
            }}
          >
            Largo Lawn
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 14,
              fontWeight: 500,
              color: isPalm ? '#F4E8D0' : '#1F4E2C',
              opacity: 0.7,
              letterSpacing: 2,
            }}
          >
            YOUR NEIGHBOR&apos;S LAWN MOWER
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 96,
          fontSize: 18,
          fontWeight: 700,
          color: accent,
          letterSpacing: 3,
          display: 'flex',
        }}
      >
        {eyebrow}
      </div>

      <div
        style={{
          marginTop: 16,
          fontSize: 84,
          fontWeight: 700,
          color: fg,
          letterSpacing: -2,
          lineHeight: 1.05,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span>{headline}</span>
      </div>

      <div
        style={{
          marginTop: 32,
          fontSize: 24,
          fontWeight: 500,
          color: fg,
          opacity: subheadAlpha,
          lineHeight: 1.4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {subhead.split('\n').map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </div>
  );
}

