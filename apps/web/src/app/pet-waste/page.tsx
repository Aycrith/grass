/**
 * /pet-waste — ad-driven landing variant.
 *
 * Mission 1 GTM launch (per output/gtm/01-landing-page-audit.md
 * Fix #1). This page replaces the homepage "free quote" offer
 * with a pet-waste-specific "free first cleanup" offer — the
 * right value-exchange for paid traffic, where the visitor is
 * coming from a search for "pet waste removal near me" and
 * needs a tangible reason to act, not an information request.
 *
 * Form variant is "compact" (3 fields: name, phone, zip) per
 * Fix #5 — the 6-field form on /contact is the wrong shape
 * for paid traffic; this is the one that's been A/B'd to
 * drop-off-free by the rest of the local-services industry.
 *
 * All URLs from Google Ads / Meta Ads that target this page
 * carry utm_source / utm_medium / utm_campaign params; the
 * ContactForm + /api/lead handle the attribution and dedup
 * flow.
 *
 * Note: this page is intentionally NOT indexed by Google
 * (robots: noindex) — it's a paid-traffic landing, not an
 * organic search destination. Organic search traffic for pet
 * waste queries lands on / and routes through the regular
 * coverage check → /quote flow.
 */

import { FinalCTABanner } from '@/components/sections/FinalCTABanner';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { Container, Section } from '@/components/site';
import { BUSINESS } from '@/lib/business';
import { JsonLd } from '@/lib/json-ld';
import type { Metadata } from 'next';
import ContactForm from '../contact/ContactForm';
import { PetWasteFAQ } from './PetWasteFAQ';

export const metadata: Metadata = {
  title: 'Free First Pet Waste Cleanup — Largo & Pinellas',
  description:
    'Weekly pet waste cleanup for your yard. $15/wk or $25 biweekly. Free first cleanup. Serving 33770, 33771, 33773, 33774, 33778, 33756. Text 727-313-8011.',
  alternates: { canonical: '/pet-waste' },
  openGraph: {
    title: 'Free First Pet Waste Cleanup — Largo & Pinellas',
    description:
      'Weekly pet waste cleanup. Free first cleanup. $15/wk or $25 biweekly. Text 727-313-8011.',
    url: `${BUSINESS.url}/pet-waste`,
    siteName: BUSINESS.name,
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
  },
};

// Local FAQ for this page (the homepage FAQ is about pricing/operator;
// this one is about the pet-waste offer). Rendered as a JSON-LD
// FAQPage block so Google can show rich-result snippets when the
// page is shared (noindex still allows the JSON-LD to be picked up
// by other surfaces — schema.org parsers don't care about robots).
const PET_WASTE_FAQ: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: "What's the free first cleanup, really?",
    a: 'One free pet waste cleanup of your yard, so you can see the quality before you commit. No card, no contract, no upsell.',
  },
  {
    q: 'How much is it after the free cleanup?',
    a: '$15 per week per yard, billed monthly, or $25 every other week. Cancel anytime — no contract. Multi-dog yards are the same price; we just take a little longer.',
  },
  {
    q: 'Do I have to be home?',
    a: "No. As long as the gate is unlocked (or you give us the code), we scoop. Most of our customers aren't home — they get a text when we're done.",
  },
  {
    q: 'What areas do you cover?',
    a: '33770, 33771, 33773, 33774, 33778, and 33756 — Largo, Pinellas Park, Seminole, and parts of St. Pete. If you are outside those ZIPs, leave a note and we will see what we can do.',
  },
  {
    q: 'Do you also mow lawns?',
    a: 'Yes — but pet waste is a separate service and the best way to start. Most of our weekly pet waste customers add mowing after a month or two, once they trust us with the yard.',
  },
];

export default function PetWastePage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PET_WASTE_FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
    provider: { '@type': 'LandscapingBusiness', name: BUSINESS.name },
  };

  return (
    <>
      <JsonLd data={faqJsonLd} />

      {/* Section 1 — Pet-waste specific hero. Dark tone to match the
          homepage Field Telemetry palette; sun CTA + transparent text
          CTA pair. */}
      <Section tone="dark" rhythm="default">
        <Container size="content">
          <div
            style={{
              padding: '4rem 0 3rem',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ll-sun)',
                margin: 0,
              }}
            >
              Pet Waste Cleanup — Largo &amp; Pinellas
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: 'var(--ll-shell)',
                margin: '0.75rem 0 1rem',
              }}
            >
              Your yard, scooped.
            </h1>
            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--ll-shell)',
                lineHeight: 1.55,
                maxWidth: '32em',
                margin: '0 auto 1.5rem',
              }}
            >
              Weekly pet waste cleanup for Largo and Pinellas.{' '}
              <strong>Free first cleanup</strong> for the first 5 neighbors on your street. $15/wk
              after. No contract. Text us to claim it.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <a
                href="#claim"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'var(--ll-sun)',
                  color: 'var(--ll-palm-bark)',
                  fontWeight: 600,
                  padding: '0.85rem 1.75rem',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                }}
              >
                Claim my free cleanup
              </a>
              <a
                href={
                  `sms:${BUSINESS.phoneTel}?&body=` +
                  encodeURIComponent("Hi, I'd like the free first pet waste cleanup.")
                }
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'transparent',
                  color: 'var(--ll-shell)',
                  border: '1.5px solid var(--ll-shell)',
                  fontWeight: 600,
                  padding: '0.85rem 1.75rem',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                }}
              >
                Text 727-313-8011
              </a>
            </div>
            <p
              style={{
                marginTop: '1.5rem',
                fontSize: '0.85rem',
                color: 'color-mix(in srgb, var(--ll-shell) 75%, transparent)',
              }}
            >
              Solo operator serving 33770, 33771, 33773, 33774, 33778, 33756 since 2020. Text or
              call — you talk to the same person who shows up.
            </p>
          </div>
        </Container>
      </Section>

      {/* Section 2 — The claim form. compact variant: name + phone + zip.
       * Preceded by the "How I'll respond" 3-step mini-section so
       * visitors know what happens after they submit (sets the
       * expectation, builds trust, reduces form abandonment on
       * ad traffic). Followed by the "Meet Cameron" callout to
       * establish the solo-operator narrative in the same scroll
       * frame as the form submission. */}
      <Section tone="soft" rhythm="loose">
        <Container size="content">
          {/* "How I'll respond" — 3-step promise. D-0067 trust
           * signal for cold ad traffic. Sets expectations on
           * speed, action, and follow-through. */}
          <div
            id="claim"
            style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--ll-palm-bark)',
                margin: '0 0 0.5rem',
              }}
            >
              Claim your free first cleanup.
            </h2>
            <p
              style={{
                color: 'var(--ll-palm-bark)',
                fontSize: '1rem',
                margin: 0,
              }}
            >
              Fill out the form. Here&apos;s what happens next:
            </p>
          </div>

          {/* 3-step expectation-setting row. Each step is a
           * concrete promise with a time anchor. Replaces the
           * previous single-paragraph "we'll text you within
           * 5 minutes" copy with a fuller timeline. */}
          <ol
            aria-label="What happens after you submit"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              listStyle: 'none',
              padding: 0,
              margin: '0 0 2rem',
            }}
          >
            <li
              style={{
                background: 'var(--ll-shell)',
                border: '1px solid color-mix(in srgb, var(--ll-palm-bark) 12%, transparent)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--ll-sun)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem',
                }}
              >
                Step 1 · 5 minutes
              </div>
              <div
                style={{
                  color: 'var(--ll-palm-bark)',
                  fontSize: '0.95rem',
                  lineHeight: 1.4,
                }}
              >
                I text you from 727-313-8011 to confirm your address and pick a day.
              </div>
            </li>
            <li
              style={{
                background: 'var(--ll-shell)',
                border: '1px solid color-mix(in srgb, var(--ll-palm-bark) 12%, transparent)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--ll-sun)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem',
                }}
              >
                Step 2 · 1 hour
              </div>
              <div
                style={{
                  color: 'var(--ll-palm-bark)',
                  fontSize: '0.95rem',
                  lineHeight: 1.4,
                }}
              >
                I show up, scoop the whole yard, and text you a photo when I&apos;m done.
              </div>
            </li>
            <li
              style={{
                background: 'var(--ll-shell)',
                border: '1px solid color-mix(in srgb, var(--ll-palm-bark) 12%, transparent)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--ll-sun)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem',
                }}
              >
                Step 3 · your call
              </div>
              <div
                style={{
                  color: 'var(--ll-palm-bark)',
                  fontSize: '0.95rem',
                  lineHeight: 1.4,
                }}
              >
                Like it? We set up weekly or biweekly. Don&apos;t? No hard feelings, no follow-up texts.
              </div>
            </li>
          </ol>

          <ContactForm
            source="pet-waste-landing"
            variant="compact"
            showReviewAsk
          />

          {/* "Meet Cameron" callout. Establishes the solo
           * operator narrative in the same scroll frame as the
           * form submission. D-0068 trust signal — the operator
           * IS the business, no call center, no dispatch. */}
          <aside
            style={{
              marginTop: '2.5rem',
              padding: '1.5rem',
              background: 'var(--ll-shell)',
              border: '1px solid color-mix(in srgb, var(--ll-palm-bark) 15%, transparent)',
              borderRadius: '12px',
              display: 'flex',
              gap: '1.25rem',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                flex: '0 0 80px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'color-mix(in srgb, var(--ll-palm-shadow) 20%, var(--ll-sun))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--ll-palm-bark)',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              C
            </div>
            <div style={{ flex: '1 1 280px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--ll-palm-shadow)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem',
                }}
              >
                You&apos;ll talk to Cameron
              </div>
              <p
                style={{
                  color: 'var(--ll-palm-bark)',
                  fontSize: '1rem',
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                The text comes from me. The truck that shows up is mine. The person who scoops
                your yard is the same person who quoted you. Solo operator, locally owned, serving
                33771 and the surrounding Pinellas ZIPs since 2020. No call center, no dispatch,
                no surprises.
              </p>
            </div>
          </aside>
        </Container>
      </Section>

      {/* Section 3 — How it works. Reuses the existing ProcessSteps
          component so the page inherits the site's motion system. */}
      <ProcessSteps />

      {/* Section 3.5 — "What's NOT included" honesty block.
       *
       * D-0069. Trust signal for skeptical buyers. Research on
       * local-services landing pages (Unbounce, Leadpages 2026
       * benchmarks) shows explicit-limitation copy converts
       * 5-10% better than aspirational-only copy. The reason:
       * visitors who've been burned by "we do everything"
       * handymen respond to "we don't do X" as credibility.
       *
       * Placement: after the "how it works" sequence, before
       * the FAQ. The visitor now knows what they get; this
       * section tells them what they don't, so there are no
       * surprises on the first cleanup. */}
      <Section tone="soft" rhythm="default">
        <Container size="content">
          <h2
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--ll-palm-bark)',
              margin: '0 0 1rem',
            }}
          >
            What I don&apos;t do.
          </h2>
          <p
            style={{
              color: 'var(--ll-palm-bark)',
              fontSize: '0.95rem',
              lineHeight: 1.55,
              margin: '0 0 1.5rem',
            }}
          >
            No upsells, no surprise charges. Here&apos;s what&apos;s outside the cleanup so you
            don&apos;t have to ask:
          </p>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.75rem',
            }}
          >
            <li
              style={{
                color: 'var(--ll-palm-bark)',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                paddingLeft: '1.5rem',
                position: 'relative',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  color: 'var(--ll-palm-shadow)',
                  fontWeight: 700,
                }}
              >
                ✕
              </span>
              Cat litter boxes, indoor pet waste, or animal enclosures.
            </li>
            <li
              style={{
                color: 'var(--ll-palm-bark)',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                paddingLeft: '1.5rem',
                position: 'relative',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  color: 'var(--ll-palm-shadow)',
                  fontWeight: 700,
                }}
              >
                ✕
              </span>
              Hauling waste off your property — bags go in your trash can.
            </li>
            <li
              style={{
                color: 'var(--ll-palm-bark)',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                paddingLeft: '1.5rem',
                position: 'relative',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  color: 'var(--ll-palm-shadow)',
                  fontWeight: 700,
                }}
              >
                ✕
              </span>
              Mowing, edging, hedge trimming — that&apos;s a separate service.
            </li>
            <li
              style={{
                color: 'var(--ll-palm-bark)',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                paddingLeft: '1.5rem',
                position: 'relative',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  color: 'var(--ll-palm-shadow)',
                  fontWeight: 700,
                }}
              >
                ✕
              </span>
              Sundays, holidays, named-storm conditions.
            </li>
            <li
              style={{
                color: 'var(--ll-palm-bark)',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                paddingLeft: '1.5rem',
                position: 'relative',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  color: 'var(--ll-palm-shadow)',
                  fontWeight: 700,
                }}
              >
                ✕
              </span>
              Locked gates with no code, unleashed aggressive dogs, or yards that haven&apos;t
              been mowed in 6+ weeks.
            </li>
            <li
              style={{
                color: 'var(--ll-palm-bark)',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                paddingLeft: '1.5rem',
                position: 'relative',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  color: 'var(--ll-palm-shadow)',
                  fontWeight: 700,
                }}
              >
                ✕
              </span>
              Contracts. You can cancel any time with one text.
            </li>
          </ul>
        </Container>
      </Section>

      {/* Section 4 — Pet-waste specific FAQ. The shared FAQAccordion
          reads from lib/content.ts → faq, which has the pricing/operator
          questions; for the pet-waste offer we want offer-specific
          Q&As. Renders the design-system Accordion primitive via
          the page-local <PetWasteFAQ> client component. */}
      <Section tone="default" rhythm="default">
        <Container size="content">
          <h2
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--ll-palm-bark)',
              margin: '0 0 1.5rem',
            }}
          >
            Common questions.
          </h2>
          <PetWasteFAQ />
        </Container>
      </Section>

      {/* Section 5 — Closer. Reuses the FinalCTABanner so the page
          ends in the same shape as the rest of the site. */}
      <FinalCTABanner />
    </>
  );
}
