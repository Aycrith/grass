/**
 * /process — "How it works" deep-dive page.
 *
 * Why this page exists separately from the homepage's ProcessSteps
 * section:
 *   - The homepage ProcessSteps is a 3-card grid (Coverage → Quote
 *     → Relax) — a teaser for the at-fold visitor who has not
 *     decided yet.
 *   - The /process page is the long-form version: 6 steps instead
 *     of 3, with each step's body expanded to 1-2 sentences and a
 *     "duration" tag. Plus a "Why this works" differentiators
 *     section that the homepage does not have room for.
 *   - The /process page is the SEO surface for "how does lawn
 *     service work in Largo" / "do I need to be home for the
 *     mowing" / "what happens during hurricane season" long-tail
 *     queries. Search engines index it; the homepage composition
 *     is for the human who already decided to read more.
 *
 * Page composition (server-rendered, 4 sections):
 *   1. Page-level hero (eyebrow + h1 + tagline).
 *   2. The 6 steps (numbered list, each with a "duration" tag).
 *   3. "Why this works" — 4 differentiators.
 *   4. Related links strip.
 *
 * SEO:
 *   - Title: targets "How it works · Lawn care in Largo FL"
 *   - Canonical: /process
 *   - JSON-LD: HowTo (the 6 steps) + BreadcrumbList.
 *
 * Single source of truth: every block of copy comes from
 * `lib/content.ts → processPage`.
 */

import { Container, Eyebrow, Section } from '@/components/site';
import { BUSINESS } from '@/lib/business';
import { processPage } from '@/lib/content';
import { JsonLd, pageBreadcrumb } from '@/lib/json-ld';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How it works',
  description: `From the first text to the 30th mow. Six steps, no portal, no subscription. Solo-operator lawn care in ${BUSINESS.address.city}, FL.`,
  alternates: { canonical: '/process' },
};

export default function ProcessPage() {
  // HowTo JSON-LD — Google's "HowTo" rich-result type. Each step
  // becomes a HowToStep with a name + text body. The "totalTime"
  // field is a coarse ISO-8601 duration string; the actual
  // end-to-end is "about 5 minutes" of customer time across
  // a multi-day schedule, so P0Y0M0DT0H5M0S encodes "5 minutes."
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to get started with solo-operator lawn care in Largo, FL',
    description: processPage.tagline,
    totalTime: 'PT5M',
    step: processPage.steps.map((s) => ({
      '@type': 'HowToStep',
      position: Number(s.n),
      name: s.title,
      text: s.body,
    })),
    provider: { '@type': 'LandscapingBusiness', name: BUSINESS.name },
  };

  const breadcrumbSchema = pageBreadcrumb({
    currentLabel: 'How it works',
    currentHref: '/process',
  });

  return (
    <>
      <JsonLd data={howToJsonLd} />
      <JsonLd data={breadcrumbSchema} />

      {/* 1. Page hero */}
      <Section rhythm="loose">
        <Container size="prose">
          <Eyebrow tone="default">{processPage.eyebrow}</Eyebrow>
          <h1>{processPage.heading}</h1>
          <p>{processPage.tagline}</p>
        </Container>
      </Section>

      {/* 2. The 6 steps. Each step is a <li> with a number (Fraunces
       * bold), a title, a body, and a small "duration" tag at the
       * bottom. The cadence matches the homepage ProcessSteps
       * (01 / 02 / 03 ...) so visitors who saw the home teaser can
       * match the numbering. The longer body answers the "but
       * what about X?" follow-ups the home can't fit. */}
      <Section>
        <Container size="prose">
          <ol>
            {processPage.steps.map((step) => (
              <li key={step.n}>
                <h2>
                  <span aria-hidden="true">{step.n}</span> {step.title}
                </h2>
                <p>{step.body}</p>
                <p>
                  <small>
                    <strong>Time on your end:</strong> {step.duration}
                  </small>
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 3. "Why this works" — 4 differentiators in a definition-list
       * style. The page is for visitors who are already past the
       * "is this a real business" question and into the "what makes
       * this different from a franchise" question. The 4 bullets
       * answer that in plain language without the brand-marketing
       * tropes the brand guidelines forbid ("#1 in [city]",
       * "Family-owned", "Free estimate", etc.). */}
      <Section tone="soft">
        <Container size="prose">
          <h2>{processPage.whyHeading}</h2>
          <p>{processPage.whyBody}</p>
          <dl>
            {processPage.differentiators.map((d) => (
              <div key={d.label}>
                <dt>
                  <strong>{d.label}.</strong>
                </dt>
                <dd>{d.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* 4. Related links strip — same pattern as /faq and
       * /hurricane-prep. Soft tone to break the editorial rhythm
       * before the site footer. */}
      <Section rhythm="default">
        <Container size="prose">
          <h2>{processPage.relatedHeading}</h2>
          <ul>
            {processPage.relatedLinks.map((link) => (
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
            Ready to start?{' '}
            <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phone}</a> or{' '}
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
          </p>
        </Container>
      </Section>
    </>
  );
}
