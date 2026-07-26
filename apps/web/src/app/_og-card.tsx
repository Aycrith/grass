/**
 * Shared card composition for /opengraph-image and /twitter-image.
 *
 * Both route files (app/opengraph-image.tsx + app/twitter-image.tsx)
 * render a 1200×630 PNG with the same brand mark, sun accent, and
 * editorial headline. Before this refactor, the JSX was duplicated
 * byte-for-byte between the two files (≈ 100 lines each). This
 * shared component is imported by both, so the brand mark only
 * needs to be edited in one place when the steward updates the
 * logo or copy.
 *
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

export function OgCard(): React.ReactNode {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F4E8D0', // --ll-sand-bleached
        padding: 80,
        color: '#1A1F1B', // --ll-palm-bark
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
          opacity: 0.85,
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
              backgroundColor: '#1F4E2C', // --ll-green
              borderRadius: 12,
              transform: 'rotate(-8deg)',
            }}
          />
          <div
            style={{
              width: 24,
              height: 100,
              backgroundColor: '#1F4E2C', // --ll-green
              borderRadius: 12,
            }}
          />
          <div
            style={{
              width: 24,
              height: 100,
              backgroundColor: '#1F4E2C', // --ll-green
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
              color: '#1F4E2C', // --ll-green
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
              color: '#1F4E2C', // --ll-green
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
          fontSize: 16,
          fontWeight: 700,
          color: '#B5651D', // --ll-clay
          letterSpacing: 3,
          display: 'flex',
        }}
      >
        LAWN CARE IN 33771
      </div>

      <div
        style={{
          marginTop: 16,
          fontSize: 92,
          fontWeight: 700,
          color: '#1A1F1B', // --ll-palm-bark
          letterSpacing: -2,
          lineHeight: 1.05,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span>Your neighbor&apos;s</span>
        <span>lawn mower.</span>
      </div>

      <div
        style={{
          marginTop: 32,
          fontSize: 22,
          fontWeight: 500,
          color: '#1A1F1B', // --ll-palm-bark
          opacity: 0.78,
          lineHeight: 1.4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span>Local, solo-operator lawn care in Largo and the adjacent</span>
        <span>five Pinellas ZIPs. Free quotes within 24 hours.</span>
      </div>
    </div>
  );
}
