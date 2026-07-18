/* eslint-disable react/no-unescaped-entities */
/**
 * /preview/design — Live visual preview of the design system spec.
 *
 * Renders the design tokens, type scale, color palette, and component
 * samples inline so the steward can see exactly what the redesign is
 * proposing. As the steward fills in `<<STEWARD: ...>>` placeholders
 * in 01-design-system-prd.md, the engineer updates tokens.css and
 * this page reflects the change on next `bun run build`.
 *
 * Sections:
 * 1. Color palette (current + proposed)
 * 2. Typography scale
 * 3. Spacing + radii + elevation
 * 4. Component samples (Button, Card, Hero, Nav, Footer)
 * 5. Before/After comparison notes
 * 6. PRD index links
 */

import Link from 'next/link';

const PROPOSED_PALETTE = [
  { token: '--ll-palm-shadow',  hex: '#2D5A3D', name: 'Palm Shadow',  role: 'Primary green (CTAs, headings)' },
  { token: '--ll-palm-light',   hex: '#6B9B7E', name: 'Palm Light',   role: 'Hover, secondary surfaces' },
  { token: '--ll-gulf',         hex: '#2E6B8C', name: 'Gulf',         role: 'Information, links to /areas' },
  { token: '--ll-sun',          hex: '#E8B65A', name: 'Sun',          role: 'High-attention CTAs' },
  { token: '--ll-clay',         hex: '#B5651D', name: 'Clay',         role: 'Destructive, hurricane-warning' },
  { token: '--ll-sand-bleached', hex: '#F4E8D0', name: 'Sand Bleached', role: 'Background' },
  { token: '--ll-shell',        hex: '#FFFFFF', name: 'Shell',        role: 'Cards on sand background' },
  { token: '--ll-palm-bark',    hex: '#1A1F1B', name: 'Palm Bark',    role: 'Body text' },
  { token: '--ll-sage-muted',   hex: '#8FA89B', name: 'Sage Muted',   role: 'Disabled, meta, captions' },
];

const CURRENT_PALETTE = [
  { token: '--ll-green',    hex: '#1F4E2C', name: 'Green (current)' },
  { token: '--ll-sand',     hex: '#D4A574', name: 'Sand (current)' },
  { token: '--ll-sky',      hex: '#3B7DD8', name: 'Sky (current)' },
  { token: '--ll-charcoal', hex: '#1A1A1A', name: 'Charcoal (current)' },
  { token: '--ll-cream',    hex: '#FAF6F0', name: 'Cream (current)' },
];

const TYPE_SCALE = [
  { token: '--text-xs',    size: '0.8rem',    usage: 'Captions, meta' },
  { token: '--text-sm',    size: '0.9rem',    usage: 'Small body' },
  { token: '--text-base',  size: '1rem',      usage: 'Body' },
  { token: '--text-lg',    size: '1.25rem',   usage: 'Lead paragraphs' },
  { token: '--text-xl',    size: '1.563rem',  usage: 'Card titles (h3)' },
  { token: '--text-2xl',   size: '1.953rem',  usage: 'Section heads (h2)' },
  { token: '--text-3xl',   size: '2.441rem',  usage: 'Page heads (h1)' },
  { token: '--text-4xl',   size: '3.052rem',  usage: 'Homepage hero' },
  { token: '--text-5xl',   size: '3.815rem',  usage: 'Homepage hero (mobile fallback)' },
];

const SPACING_SCALE = [
  { token: '--space-1', value: '4px' },
  { token: '--space-2', value: '8px' },
  { token: '--space-3', value: '12px' },
  { token: '--space-4', value: '16px' },
  { token: '--space-5', value: '24px' },
  { token: '--space-6', value: '32px' },
  { token: '--space-7', value: '48px' },
  { token: '--space-8', value: '64px' },
  { token: '--space-9', value: '96px' },
  { token: '--space-10', value: '128px' },
];

export default function DesignPreviewPage() {
  return (
    <>
      <section className="hero" style={{ background: 'var(--ll-cream)' }}>
        <div className="container">
          <h1 style={{ color: 'var(--ll-green)' }}>Design System Preview</h1>
          <p className="lead">
            Live visual reference for the front-end redesign. Tokens below mirror
            what will land in <code>apps/web/src/styles/tokens.css</code>; component
            samples show the proposed visual language.
          </p>
          <p style={{ marginTop: '1rem' }}>
            <strong>Status:</strong> Awaiting steward creative direction. Eight PRDs
            authored in <code>product/front-end-redesign/</code>; design tokens,
            surfaces, motion, photography, work packages, and success metrics all
            documented. Steward fills in the <code>&lt;&lt;…&gt;&gt;</code> placeholders
            and engineering executes <Link href="/preview/design#packages">Phase B–F</Link>.
          </p>
        </div>
      </section>

      <div className="container" style={{ maxWidth: 1100, padding: '2rem 1.5rem' }}>

        {/* ========== COLOR ========== */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ borderTop: '2px solid var(--ll-green)', paddingTop: '1rem' }}>Color</h2>
          <p>
            The current palette is plausible-but-placeless — could be a coffee roaster
            or a yoga studio. The proposed palette is <strong>Pinellas-evocative</strong>:
            deeper green (palm-shadow), muted blue-green (gulf horizon), warm yellow
            (sun), warm clay (mulch earth). See{' '}
            <Link href="/preview/design#prd">PRD-01 § 1</Link> for usage rules.
          </p>

          <h3 style={{ marginTop: '1.5rem' }}>Proposed — "Pinellas-evocative"</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {PROPOSED_PALETTE.map(c => (
              <div key={c.token} style={{ border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'hidden', background: 'white' }}>
                <div style={{ background: c.hex, height: 96 }} />
                <div style={{ padding: '0.75rem' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--gray-700)' }}>{c.token}</div>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>{c.hex}</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '0.4rem' }}>{c.role}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: '2rem' }}>Current (for comparison)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {CURRENT_PALETTE.map(c => (
              <div key={c.token} style={{ border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'hidden', background: 'white' }}>
                <div style={{ background: c.hex, height: 64 }} />
                <div style={{ padding: '0.5rem 0.75rem' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--gray-700)' }}>{c.token}</div>
                  <div style={{ fontSize: '0.85rem' }}>{c.name} · {c.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========== TYPOGRAPHY ========== */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ borderTop: '2px solid var(--ll-green)', paddingTop: '1rem' }}>Typography</h2>
          <p>
            Proposed: <strong>Fraunces</strong> (display serif, variable) + <strong>Inter</strong>
            (body sans, variable). Both open-source, both on Google Fonts, both $0. The serif
            display gives editorial weight that says "this was designed, not defaulted."
            Inter keeps body UI legible and neutral.
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--gray-700)' }}>
            Alternative: sans-only (Inter for both display and body, weights 700-900 for display moments).
          </p>

          <h3 style={{ marginTop: '1.5rem' }}>Type scale</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--ll-green)' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.25rem' }}>Token</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.25rem' }}>Size</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.25rem' }}>Usage</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.25rem' }}>Sample</th>
              </tr>
            </thead>
            <tbody>
              {TYPE_SCALE.map(t => (
                <tr key={t.token} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.4rem 0.25rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>{t.token}</td>
                  <td style={{ padding: '0.4rem 0.25rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>{t.size}</td>
                  <td style={{ padding: '0.4rem 0.25rem' }}>{t.usage}</td>
                  <td style={{ padding: '0.4rem 0.25rem', fontSize: t.size, fontWeight: 700, fontFamily: '"Fraunces", Georgia, serif' }}>
                    Your neighbor's lawn
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ========== SPACING ========== */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ borderTop: '2px solid var(--ll-green)', paddingTop: '1rem' }}>Spacing, Radii, Elevation</h2>

          <h3 style={{ marginTop: '1.5rem' }}>Spacing scale (4px base)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
            {SPACING_SCALE.map(s => (
              <div key={s.token} style={{ textAlign: 'center' }}>
                <div style={{ width: s.value, height: s.value, background: 'var(--ll-green)', margin: '0 auto' }} />
                <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', marginTop: '0.4rem' }}>{s.token}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-700)' }}>{s.value}</div>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: '2rem' }}>Radii</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { token: '--radius-sm',   size: '4px',  value: 4 },
              { token: '--radius',      size: '8px',  value: 8 },
              { token: '--radius-lg',   size: '16px', value: 16 },
              { token: '--radius-xl',   size: '24px', value: 24 },
            ].map(r => (
              <div key={r.token} style={{ textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, background: 'var(--ll-sand)', borderRadius: r.value }} />
                <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', marginTop: '0.4rem' }}>{r.token}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-700)' }}>{r.size}</div>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: '2rem' }}>Elevation</h3>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { token: '--elevation-1', boxShadow: '0 1px 2px rgba(45, 90, 61, 0.05), 0 1px 1px rgba(45, 90, 61, 0.04)' },
              { token: '--elevation-2', boxShadow: '0 4px 8px rgba(45, 90, 61, 0.06), 0 2px 4px rgba(45, 90, 61, 0.04)' },
              { token: '--elevation-3', boxShadow: '0 12px 24px rgba(45, 90, 61, 0.10), 0 4px 8px rgba(45, 90, 61, 0.06)' },
            ].map(e => (
              <div key={e.token} style={{ textAlign: 'center' }}>
                <div style={{ width: 120, height: 80, background: 'white', borderRadius: 8, boxShadow: e.boxShadow }} />
                <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', marginTop: '0.5rem' }}>{e.token}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-700)', marginTop: '0.5rem' }}>
            Note: tinted (palm-shadow) shadows, not gray. Reads more "this object is in the world."
          </p>
        </section>

        {/* ========== COMPONENT SAMPLES ========== */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ borderTop: '2px solid var(--ll-green)', paddingTop: '1rem' }}>Component samples</h2>
          <p>
            Each of these is a static preview of the proposed visual language using the
            proposed palette + type. When tokens land in code, every page on the site
            renders at this fidelity.
          </p>

          <h3 style={{ marginTop: '1.5rem' }}>Buttons</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
            <button type="button" style={{
              background: '#E8B65A', color: '#1A1F1B', border: 0, padding: '0.85rem 1.75rem',
              borderRadius: 8, fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit', letterSpacing: '0.01em',
            }}>
              Free Quote →
            </button>
            <button type="button" style={{
              background: '#2D5A3D', color: '#F4E8D0', border: 0, padding: '0.85rem 1.75rem',
              borderRadius: 8, fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              Send me this quote
            </button>
            <button type="button" style={{
              background: 'transparent', color: '#2D5A3D', border: '2px solid #2D5A3D',
              padding: '0.85rem 1.75rem', borderRadius: 8, fontSize: '1rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Call (727) 555-0123
            </button>
            <button type="button" disabled style={{
              background: '#8FA89B', color: 'white', border: 0, padding: '0.85rem 1.75rem',
              borderRadius: 8, fontSize: '1rem', fontWeight: 700, cursor: 'not-allowed',
              fontFamily: 'inherit', opacity: 0.7,
            }}>
              Submitting…
            </button>
          </div>

          <h3 style={{ marginTop: '1.5rem' }}>Service card (proposed composition)</h3>
          <div style={{
            border: '1px solid var(--color-border)', borderRadius: 16, overflow: 'hidden',
            background: 'white', maxWidth: 360, boxShadow: '0 1px 2px rgba(45, 90, 61, 0.05)',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #6B9B7E 0%, #2D5A3D 100%)',
              aspectRatio: '4 / 5', position: 'relative',
              display: 'flex', alignItems: 'flex-end', padding: '1rem',
            }}>
              <div style={{ color: '#F4E8D0', fontFamily: '"Fraunces", Georgia, serif', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
                Mowing
              </div>
              <div style={{
                position: 'absolute', top: '0.75rem', right: '0.75rem',
                background: '#E8B65A', color: '#1A1F1B',
                padding: '0.25rem 0.6rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700,
              }}>
                FROM $48/WK
              </div>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <p style={{ margin: 0, color: '#1A1F1B' }}>
                Weekly, bi-weekly, or one-time. Edging and blowing included with weekly.
              </p>
              <p style={{ marginTop: '0.75rem', fontWeight: 700, color: '#2D5A3D' }}>
                Learn about mowing →
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-700)', marginTop: '0.5rem' }}>
            vs. current: bordered card with h3 + plain paragraph + bold price.
          </p>

          <h3 style={{ marginTop: '2rem' }}>Hero (proposed composition)</h3>
          <div style={{
            background: 'linear-gradient(180deg, #F4E8D0 0%, #FAF6F0 100%)',
            borderRadius: 16, padding: '4rem 3rem', position: 'relative', overflow: 'hidden',
            minHeight: 320, display: 'flex', alignItems: 'center',
          }}>
            <div style={{ maxWidth: 560, position: 'relative', zIndex: 1 }}>
              <div style={{ color: '#2D5A3D', fontFamily: '"Fraunces", Georgia, serif', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Largo, FL · 33771 + 5 ZIPs
              </div>
              <h1 style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05,
                margin: '0.5rem 0 1rem', color: '#1A1F1B',
              }}>
                Your neighbor's<br />lawn mower.
              </h1>
              <p style={{ fontSize: '1.15rem', color: '#1A1F1B', maxWidth: 480 }}>
                Local, solo-operator lawn care in Largo, FL. Free quotes within 24 hours.
                No contracts.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" style={{
                  background: '#E8B65A', color: '#1A1F1B', border: 0, padding: '1rem 2rem',
                  borderRadius: 8, fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>
                  Free Quote →
                </button>
                <button type="button" style={{
                  background: 'transparent', color: '#2D5A3D', border: '2px solid #2D5A3D',
                  padding: '1rem 2rem', borderRadius: 8, fontSize: '1.05rem', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  Call (727) 555-0123
                </button>
              </div>
            </div>
            {/* Decorative hero photo placeholder */}
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%',
              background: 'linear-gradient(135deg, #6B9B7E 0%, #2D5A3D 60%, #1A1F1B 100%)',
              opacity: 0.85, clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)',
            }}>
              <div style={{ color: '#F4E8D0', padding: '2rem', fontFamily: '"Fraunces", Georgia, serif', fontSize: '1.25rem', fontStyle: 'italic', textAlign: 'right', marginTop: 'auto', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                &lt;hero photo here&gt;
              </div>
            </div>
          </div>

          <h3 style={{ marginTop: '2rem' }}>Operator strip (proposed)</h3>
          <div style={{
            display: 'flex', gap: '1.5rem', alignItems: 'center',
            padding: '1.5rem', background: 'white', borderRadius: 16,
            border: '1px solid var(--color-border)',
          }}>
            <div style={{
              width: 96, height: 96, borderRadius: 999,
              background: 'linear-gradient(135deg, #6B9B7E, #2D5A3D)',
              flexShrink: 0,
            }} />
            <div>
              <div style={{ color: '#2D5A3D', fontWeight: 700, fontSize: '1.1rem' }}>Hi, I'm &lt;name&gt;.</div>
              <p style={{ margin: '0.25rem 0 0' }}>
                Born in Largo, mowing since 2019. When you call, you talk to me. When I show
                up to mow, it's me on the mower.
              </p>
            </div>
          </div>
        </section>

        {/* ========== BEFORE / AFTER ========== */}
        <section id="comparison" style={{ marginBottom: '3rem' }}>
          <h2 style={{ borderTop: '2px solid var(--ll-green)', paddingTop: '1rem' }}>Current vs. proposed</h2>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Aspect</th>
                <th>Current</th>
                <th>Proposed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Hero composition</strong></td>
                <td>Centered cream block, text + 2 buttons, no imagery</td>
                <td>Split layout: headline + CTAs left, hero photo right with diagonal clip</td>
              </tr>
              <tr>
                <td><strong>Display font</strong></td>
                <td>Inter (default SaaS font)</td>
                <td>Fraunces (warm, editorial, variable)</td>
              </tr>
              <tr>
                <td><strong>Color signal</strong></td>
                <td>Plausible-but-placeless green + cream</td>
                <td>Pinellas-evocative palette (palm-shadow, gulf, sun, clay, sand-bleached)</td>
              </tr>
              <tr>
                <td><strong>Imagery</strong></td>
                <td>Zero photographs (only logo SVGs)</td>
                <td>Hero + 6 service photos + 6 area photos + operator portrait + work samples</td>
              </tr>
              <tr>
                <td><strong>Operator voice</strong></td>
                <td>Buried in plain copy</td>
                <td>Dedicated operator strip on homepage with photo + first-person bio</td>
              </tr>
              <tr>
                <td><strong>Card design</strong></td>
                <td>6 identical bordered boxes, no visual differentiation</td>
                <td>Photo + title + price badge; gradient/illustration as backdrop</td>
              </tr>
              <tr>
                <td><strong>Motion</strong></td>
                <td>None (one hover transition)</td>
                <td>Restrained: hero entrance, card hover, button press, form feedback</td>
              </tr>
              <tr>
                <td><strong>Trust signals</strong></td>
                <td>None visible</td>
                <td>Operator photo + bio, equipment list, "what I won't do" honesty section</td>
              </tr>
              <tr>
                <td><strong>Build size</strong></td>
                <td>~102 KB shared JS + ~6 KB CSS</td>
                <td>Target: ≤150 KB JS gzipped, ≤50 KB CSS gzipped, ≤500 KB images per page</td>
              </tr>
              <tr>
                <td><strong>Editability</strong></td>
                <td>Hard-coded in page.tsx files; edit requires code change</td>
                <td>Centralized in <code>lib/content.ts</code>; steward edits strings + drops images in <code>public/</code></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ========== WORK PACKAGES ========== */}
        <section id="packages" style={{ marginBottom: '3rem' }}>
          <h2 style={{ borderTop: '2px solid var(--ll-green)', paddingTop: '1rem' }}>Work package summary</h2>
          <p>
            Full ticket breakdown in <code>product/front-end-redesign/06-work-packages.md</code>.
            Six phases, ~82–118 engineering hours, ~4–6 calendar weeks at autonomous pace.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {[
              { phase: 'A', name: 'Steward direction', hours: 'Variable', desc: 'Steward answers Q1–Q8 + provides bio/photos/copy', blocking: true },
              { phase: 'B', name: 'Design system', hours: '24-34h', desc: 'Tokens.css, typography, components B1-B7', blocking: false },
              { phase: 'C', name: 'Asset production', hours: '5-7h eng', desc: 'Engineer-authorable icons + illustrations; steward photos', blocking: false },
              { phase: 'D', name: 'Surface implementation', hours: '38-55h', desc: 'All 13 surfaces redesigned (D1-D12)', blocking: false },
              { phase: 'E', name: 'QA + lighthouse', hours: '11-16h', desc: 'axe-core, lighthouse CI, manual mobile, cross-browser', blocking: false },
              { phase: 'F', name: 'Soft launch + monitoring', hours: '4-6h', desc: 'Deploy, PostHog events, RUM, daily check-in', blocking: false },
            ].map(p => (
              <div key={p.phase} style={{ border: '1px solid var(--color-border)', borderRadius: 8, padding: '1rem', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--ll-green)', fontSize: '0.9rem' }}>Phase {p.phase}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gray-700)', fontFamily: 'monospace' }}>{p.hours}</span>
                </div>
                <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>{p.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>{p.desc}</div>
                {p.blocking && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--red-700, #b3261e)' }}>
                    ⚠ Blocks all subsequent phases
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ========== PRD INDEX ========== */}
        <section id="prd" style={{ marginBottom: '3rem' }}>
          <h2 style={{ borderTop: '2px solid var(--ll-green)', paddingTop: '1rem' }}>PRD package index</h2>
          <p>
            Eight documents authored in <code>product/front-end-redesign/</code>. Each one
            has steward-decision placeholders (<code>&lt;&lt;…&gt;&gt;</code>) that, once
            filled, give engineering everything needed to execute.
          </p>

          <div className="preview-card-grid">
            {[
              { file: 'README.md',                      title: 'Index',                  desc: 'How to use this package' },
              { file: '00-master-prd.md',               title: 'Master PRD',             desc: 'Vision, success criteria, scope, Q1–Q8' },
              { file: '01-design-system-prd.md',        title: 'Design system',         desc: 'Color, typography, spacing, motion, components' },
              { file: '02-content-model.md',            title: 'Content model',         desc: 'lib/content.ts shape, edit workflow, future-CMS' },
              { file: '03-surfaces-prd.md',             title: 'Surface specs',         desc: 'Per-route layouts, states, success criteria' },
              { file: '04-motion-and-microinteractions.md', title: 'Motion',              desc: 'Durations, easings, reduced-motion, perf budget' },
              { file: '05-photography-and-illustration-brief.md', title: 'Photography',   desc: 'Asset list, shot direction, anti-patterns' },
              { file: '06-work-packages.md',            title: 'Work packages',         desc: 'Phase A–F ticket breakdown, dependency graph' },
              { file: '07-success-metrics.md',          title: 'Success metrics',       desc: 'KPIs, instrumentation, reporting cadence' },
            ].map(p => (
              <Link key={p.file} href={`/preview/redesign/${p.file.replace(/\.md$/, '')}`} className="card">
                <h3 style={{ marginTop: 0, fontFamily: 'monospace', fontSize: '0.85rem' }}>{p.file}</h3>
                <p style={{ fontWeight: 700 }}>{p.title}</p>
                <p style={{ fontSize: '0.85rem' }}>{p.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ========== NEXT STEPS ========== */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ borderTop: '2px solid var(--ll-green)', paddingTop: '1rem' }}>Next steps</h2>
          <ol>
            <li>
              <strong>Steward reviews 00-master-prd.md § 6 (Q1–Q8)</strong> — these are
              the only decisions that block everything else. Edit the placeholders directly,
              commit, then engineering resumes Phase B.
            </li>
            <li>
              <strong>Steward provides operator photo + bio + per-ZIP notes</strong> —
              unblocks homepage redesign and per-area pages.
            </li>
            <li>
              <strong>Steward picks which photography direction (Proposal A vs own)</strong> —
              unblocks Phase C.
            </li>
            <li>
              <strong>Engineering reads the full PRD package</strong> (~30 min) and starts
              Phase B (token CSS file) without waiting for A1.
            </li>
            <li>
              <strong>Once Phase B is done, steward reviews /preview/design</strong> and
              confirms token values before Phase D (surface implementation).
            </li>
          </ol>

          <p style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--ll-cream)', borderRadius: 6, borderLeft: '4px solid var(--ll-sand)' }}>
            <strong>Working from outside the redesign loop?</strong> Every PRD document is
            readable on its own — start with <code>00-master-prd.md</code> for the executive
            vision, then <code>01-design-system-prd.md</code> for token decisions, then
            <code>06-work-packages.md</code> for execution. <Link href="/preview">Back to preview index</Link>.
          </p>
        </section>
      </div>
    </>
  );
}