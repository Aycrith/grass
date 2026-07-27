/**
 * /areas-near-me — "I am one ZIP over" page.
 *
 * Long-tail SEO surface for visitors in adjacent Pinellas ZIPs
 * (33760, 33762, 33764, 33765, 33777, 33779, 33780, 33781, 34695)
 * who search "lawn care near me" + a Largo-adjacent ZIP. The
 * route is fixed at six Pinellas ZIPs, but the operator sometimes
 * makes exceptions for yards right next door. The page is the
 * canonical answer with the actual adjacent-ZIP-to-route-ZIP
 * mapping.
 *
 * Why this page exists:
 *   - Search engines index a "lawn care near 33760" query; the
 *     homepage ServiceAreaMap and the /areas index both reject
 *     out-of-route ZIPs (correctly), but they don't tell the
 *     visitor where the closest route ZIP is or whether their
 *     specific address is realistically in scope. This page does.
 *   - The page is honest about the boundary. Inventing a "we
 *     cover all of Pinellas" claim is forbidden by the brand
 *     guidelines; this page acknowledges the limit and points
 *     the visitor at the right next step (text or call).
 *
 * Page composition (server-rendered, 6 sections):
 *   1. Page hero.
 *   2. "Why the route is six ZIPs" — the model explanation.
 *   3. Adjacent ZIPs table — 9 ZIPs with closest-route + note.
 *   4. FAQ — 5 adjacent-ZIP Q&As.
 *   5. Related links strip.
 *
 * SEO:
 *   - Title: targets "Lawn care near me" + the 9 adjacent ZIPs
 *   - JSON-LD: FAQPage (5 Q&As) + BreadcrumbList.
 *   - Canonical: /areas-near-me
 *
 * Single source of truth: every block of copy comes from
 * `lib/content.ts → areasNearMePage`.
 */

import { Container, Eyebrow, Section } from '@/components/site';
import { Accordion } from '@/components/ui';
import { BUSINESS } from '@/lib/business';
import { areasNearMePage } from '@/lib/content';
import { JsonLd, pageBreadcrumb } from '@/lib/json-ld';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lawn care near me · Adjacent ZIPs to Largo, FL',
  description: `The route covers six Pinellas ZIPs: 33770, 33771, 33773, 33774, 33778, 33756. If you are right outside the route, this page maps the 9 adjacent ZIPs to the closest route ZIP.`,
  alternates: { canonical: '/areas-near-me' },
};

export default function AreasNearMePage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: areasNearMePage.faqs.map((f) => ({
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
    currentLabel: 'Areas near me',
    currentHref: '/areas-near-me',
  });

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbSchema} />

      {/* 1. Page hero */}
      <Section rhythm="loose">
        <Container size="prose">
          <Eyebrow tone="default">{areasNearMePage.eyebrow}</Eyebrow>
          <h1>{areasNearMePage.heading}</h1>
          <p>{areasNearMePage.tagline}</p>
        </Container>
      </Section>

      {/* 2. Why the route is six ZIPs — the model explanation.
       * Most adjacent-ZIP visitors land on this page after the
       * homepage ServiceAreaMap rejected their ZIP. They want
       * to know "why not?" — this section answers in 4 bullets
       * without sounding defensive. The voice is "this is how
       * the model works" not "sorry we cannot help." */}
      <Section tone="soft">
        <Container size="prose">
          <h2>{areasNearMePage.whyHeading}</h2>
          <p>{areasNearMePage.whyBody}</p>
          <ul>
            {areasNearMePage.whyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 3. Adjacent ZIPs table — 9 ZIPs with closest-route + note.
       * The note column is the actionable bit ("southern-edge
       * addresses may be reachable" vs. "out of scope today,
       * refer out"). The table is rendered as <dl> with a
       * <table>-style layout via CSS for the prose container. */}
      <Section>
        <Container size="prose">
          <h2>{areasNearMePage.adjacentHeading}</h2>
          <p>{areasNearMePage.adjacentIntro}</p>
          <dl>
            {areasNearMePage.adjacentZips.map((entry) => (
              <div key={entry.zip}>
                <dt>
                  <strong>{entry.zip}</strong> — {entry.name}
                </dt>
                <dd>
                  <p>
                    <strong>Closest route ZIP:</strong>{' '}
                    {entry.closestRoute === 'n/a'
                      ? 'none — out of route, refer out'
                      : entry.closestRoute}
                  </p>
                  <p>{entry.note}</p>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* 4. FAQ — 5 adjacent-ZIP Q&As. Same Accordion primitive
       * the /faq + /hurricane-prep pages use. id="areas-near-me-faq"
       * so disclosure widget DOM ids don't collide. */}
      <Section tone="soft">
        <Container size="prose">
          <h2>{areasNearMePage.faqHeading}</h2>
          <Accordion
            id="areas-near-me-faq"
            items={areasNearMePage.faqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))}
          />
        </Container>
      </Section>

      {/* 5. Related links strip */}
      <Section rhythm="loose">
        <Container size="prose">
          <h2>{areasNearMePage.relatedHeading}</h2>
          <ul>
            {areasNearMePage.relatedLinks.map((link) => (
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
            Not sure whether your address is in scope?{' '}
            <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phone}</a> or{' '}
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
          </p>
        </Container>
      </Section>
    </>
  );
}
