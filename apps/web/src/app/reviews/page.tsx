/**
 * /reviews — "From your neighbors" page.
 *
 * The single destination for customer reviews. The page reads
 * `social.proof[]` (the same array the homepage TestimonialQuote
 * section reads) so the canonical review list lives in one place.
 * When the array is empty — current state — the page renders an
 * empty-state explainer: who I am, what I do, how to leave a
 * review, what a useful review covers, and where to leave it.
 *
 * Why this page exists separately from the homepage TestimonialQuote
 * section:
 *   - The homepage section is a single fold's worth of social
 *     proof; it lives between two other sections and renders
 *     nothing when the array is empty.
 *   - The /reviews page is the long-form canonical destination:
 *     the SEO surface for "lawn care Largo reviews" / "lawn mowing
 *     Pinellas County reviews", the empty-state explainer for
 *     first-time visitors who want to know "is this a real
 *     business", and the future "all 47 reviews" list once the
 *     array populates.
 *
 * Page composition (server-rendered):
 *   1. Page-level hero (eyebrow + h1 + tagline).
 *   2. The review list (renders from `social.proof[]` if non-empty;
 *      otherwise shows the empty-state block).
 *   3. "How to leave a review" — 3 options.
 *   4. "What a useful review covers" — 5 bullets.
 *   5. Related links strip.
 *
 * SEO:
 *   - JSON-LD: Review list (when populated) + BreadcrumbList.
 *   - Canonical: /reviews
 *   - When empty, the page is noindex,follow so Google does not
 *     index an empty review page (and we don't tank the homepage
 *     with thin content). When `social.proof[]` populates, the
 *     `metadata` flip to index,follow.
 *
 * Single source of truth: `social.proof[]` is the only place the
 * review data lives. Edit there, both surfaces update.
 */

import { Container, Eyebrow, Section } from '@/components/site';
import { BUSINESS } from '@/lib/business';
import { reviewsPage, social } from '@/lib/content';
import { JsonLd, pageBreadcrumb } from '@/lib/json-ld';
import type { Metadata } from 'next';

const hasReviews = social.proof.length > 0;

export const metadata: Metadata = {
  title: 'Reviews · Lawn care in Largo, FL',
  description: `Real reviews from real neighbors in ${BUSINESS.address.city} and the five adjacent Pinellas ZIPs. Solo-operator lawn care from ${BUSINESS.name}.`,
  alternates: { canonical: '/reviews' },
  // When the review list is empty, noindex the page. Once a real
  // review lands, the steward flips `hasReviews` to true and the
  // page becomes indexable.
  robots: hasReviews ? { index: true, follow: true } : { index: false, follow: true },
};

export default function ReviewsPage() {
  const breadcrumbSchema = pageBreadcrumb({
    currentLabel: 'Reviews',
    currentHref: '/reviews',
  });

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      {/* 1. Page hero */}
      <Section rhythm="loose">
        <Container size="prose">
          <Eyebrow tone="default">{reviewsPage.eyebrow}</Eyebrow>
          <h1>{reviewsPage.heading}</h1>
          <p>{reviewsPage.tagline}</p>
        </Container>
      </Section>

      {/* 2. The review list. When `social.proof[]` populates, this
       * section renders the real reviews (one per customer, with
       * name + ZIP + source). When empty (current state), it
       * shows the empty-state block. Both states are valid; the
       * empty state is honest about "we are new, we have not
       * earned reviews yet" which is more trustworthy than
       * inventing quotes. */}
      <Section>
        <Container size="prose">
          {hasReviews ? (
            <>
              <h2>What neighbors are saying</h2>
              <ul>
                {social.proof.map((r, idx) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: index is stable; the
                  // proof array is append-only and never re-ordered
                  <li key={idx}>
                    <blockquote>
                      <p>“{r.quote}”</p>
                    </blockquote>
                    <p>
                      <strong>— {r.name}</strong>
                      {r.zip ? `, ${r.zip}` : ''}
                      {r.source ? ` · ${r.source}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EmptyState />
          )}
        </Container>
      </Section>

      {/* 3. How to leave a review — 3 options. Each option names
       * the channel, what the customer does, and how the operator
       * uses it. The Google option points to the GBP placeholder
       * URL (g.page/largo-lawn — the steward replaces with the
       * real GBP review URL when the GBP verifies per
       * state/ledger.yaml -> OBJ-M2-002). */}
      <Section tone="soft">
        <Container size="prose">
          <h2>{reviewsPage.leaveHeading}</h2>
          <p>{reviewsPage.leaveIntro}</p>
          <ol>
            {reviewsPage.leaveOptions.map((opt) => (
              <li key={opt.label}>
                <p>
                  <strong>{opt.label}.</strong>
                </p>
                <p>{opt.body}</p>
              </li>
            ))}
          </ol>
          <p>
            <a href="/review">Go to the review form →</a>
          </p>
        </Container>
      </Section>

      {/* 4. What a useful review covers — 5 bullets. A short list
       * that helps a customer write a review that is actually
       * useful to the next neighbor reading it. The brand
       * guideline (no "Family-owned", no "#1 in [city]") is
       * applied here too: the page describes the practical
       * signal, not the marketing signal. */}
      <Section>
        <Container size="prose">
          <h2>{reviewsPage.whatMattersHeading}</h2>
          <p>{reviewsPage.whatMattersBody}</p>
          <ul>
            {reviewsPage.whatMattersItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 5. Related links strip */}
      <Section tone="warm" rhythm="loose">
        <Container size="prose">
          <h2>{reviewsPage.relatedHeading}</h2>
          <ul>
            {reviewsPage.relatedLinks.map((link) => (
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
            Have a question first?{' '}
            <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phone}</a> or{' '}
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
          </p>
        </Container>
      </Section>
    </>
  );
}

/**
 * EmptyState — the "we have not earned reviews yet" block.
 *
 * Renders inside the review-list section when `social.proof[]`
 * is empty. Honest about the state ("we are new, we have not
 * earned reviews yet, here is what to do when you are ready")
 * rather than inventing quotes.
 */
function EmptyState() {
  return (
    <div
      style={{
        padding: '24px',
        background: 'var(--ll-cream, #F8F0E0)',
        border: '1px solid var(--ll-clay, #C58A4A)',
        borderRadius: '12px',
      }}
    >
      <h2 style={{ marginTop: 0 }}>No reviews yet.</h2>
      <p>
        We started tracking reviews in <strong>July 2026</strong>. The page
        updates as reviews come in. If you have used the service, the
        review form is the fastest way to leave one — every quote
        includes a one-tap link.
      </p>
      <p>
        <a
          href="/review"
          style={{
            display: 'inline-block',
            padding: '10px 16px',
            background: 'var(--ll-palm, #1F4E2C)',
            color: 'var(--ll-sand-bleached, #F4E8D0)',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 700,
          }}
        >
          Leave a review →
        </a>
      </p>
    </div>
  );
}
