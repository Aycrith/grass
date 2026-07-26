/**
 * /faq — Frequently Asked Questions page.
 *
 * A standalone destination for the same 6 Q&As the homepage
 * FAQAccordion shows. Two reasons the page exists:
 *
 *   1. SEO. The homepage FAQ is a single <section> inside a
 *      14-section composition. Google indexes it, but a dedicated
 *      /faq URL is the canonical FAQ surface — easier to rank for
 *      "lawn care Largo FL FAQ" / "how does lawn service billing
 *      work" / etc. The page renders an FAQPage JSON-LD block
 *      with the same 6 questions, so the structured data is
 *      always in lockstep with what the user actually sees.
 *
 *   2. Discoverability. The homepage is a single long scroll; if
 *      a visitor lands on the homepage via a search result and
 *      wants to read all the questions at once, /faq is a
 *      single-screen surface that fits. The related-links strip
 *      at the bottom is the natural next-step: pricing, quote,
 *      contact, services, areas, terms.
 *
 * Single source of truth: the Q&A list is the same `faq` array
 * the homepage FAQAccordion + /pricing PricingFAQ + every other
 * FAQ-shaped surface consumes. Editing a question in `lib/content.ts`
 * updates every surface, including this page's JSON-LD.
 *
 * The page is server-rendered. The Accordion primitive is a
 * 'use client' component (Radix needs state for expand/collapse)
 * but it's safe to mount from a server component — Next 15 App
 * Router handles the boundary.
 */

import { Container, Eyebrow, Section } from '@/components/site';
import { Accordion } from '@/components/ui';
import { BUSINESS } from '@/lib/business';
import { faq, faqPage } from '@/lib/content';
import { JsonLd, pageBreadcrumb } from '@/lib/json-ld';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: `Common questions about lawn care in ${BUSINESS.address.city}, FL — scheduling, billing, weather, dogs, gates, hurricane prep, and more.`,
  alternates: { canonical: '/faq' },
};

export default function FAQPage() {
  // FAQPage JSON-LD — same shape as the homepage + /pricing. Google
  // can render these as rich-result FAQ snippets in search. The
  // structured data is generated server-side from the same `faq`
  // array the React component consumes, so it can never drift from
  // what the user actually sees (the canonical home for the Q&A
  // list is `lib/content.ts → faq`).
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
    provider: { '@type': 'LandscapingBusiness', name: BUSINESS.name },
  };

  const breadcrumbSchema = pageBreadcrumb({
    currentLabel: 'Frequently asked questions',
    currentHref: '/faq',
  });

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbSchema} />

      {/* Page-level hero — distinct from the homepage FAQAccordion
       * section header (which reads "08 - Questions" / "Honest
       * answers." as part of the 14-section editorial composition).
       * The /faq page is a standalone destination; the eyebrow and
       * h1 are the page's own. */}
      <Section rhythm="loose">
        <Container size="prose">
          <Eyebrow tone="default">{faqPage.eyebrow}</Eyebrow>
          <h1>{faqPage.heading}</h1>
          <p>{faqPage.tagline}</p>
        </Container>
      </Section>

      {/* FAQ accordion — same `faq` array the homepage uses. The
       * `id="faq-page"` keeps the disclosure widget's DOM ids
       * distinct from the homepage's `id="faq"` so screen-reader
       * users navigating by id don't get collisions if both
       * surfaces are open in different tabs. */}
      <Section>
        <Container size="prose">
          <Accordion
            id="faq-page"
            items={faq.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))}
          />
        </Container>
      </Section>

      {/* Related-links strip — the natural next step after the
       * visitor has read the FAQ. Each link is a single-page
       * surface (no nested routes), so the visitor is never more
       * than one click from a contact channel. Phone + email
       * live in the site footer + the contact page; this strip
       * is for the in-page navigation. */}
      <Section tone="soft" rhythm="default">
        <Container size="prose">
          <h2>{faqPage.relatedHeading}</h2>
          <ul>
            {faqPage.relatedLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>
                  <strong>{link.label}</strong>
                </a>
                {' — '}
                {link.blurb}
              </li>
            ))}
          </ul>
          <p>
            Still have a question?{' '}
            <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phone}</a> or{' '}
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
          </p>
        </Container>
      </Section>
    </>
  );
}
