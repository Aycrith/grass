/**
 * ServicePage — shared template for the 6 service pages.
 *
 * Each service page imports this component with its own content block to keep
 * structure (hero, what's included, FAQ, CTA) consistent for SEO.
 */

import Link from 'next/link';
import type { ReactNode } from 'react';

export interface ServiceFaqItem {
  q: string;
  a: string;
}

export interface ServiceContent {
  name: string;
  tagline: string;
  intro: string;
  bullets: string[];
  pricing: string;
  faqs: ServiceFaqItem[];
}

export function ServicePage({ content }: { content: ServiceContent }) {
  return (
    <section className="container">
      <h1>{content.name} in Largo, FL</h1>
      <p style={{ fontSize: '1.15rem', color: 'var(--gray-700)' }}>{content.tagline}</p>
      <p>{content.intro}</p>

      <h2>{`What's Included`}</h2>
      <ul>
        {content.bullets.map((b, i) => (
          <li key={`${content.name}-b-${i}`}>{b}</li>
        ))}
      </ul>

      <h2>Pricing</h2>
      <p>
        <strong>{content.pricing}</strong> — Final price depends on lot size, frequency, and scope.
        Get a free quote in 24 hours.
      </p>

      <h2>Frequently Asked Questions</h2>
      {content.faqs.map((faq, i) => (
        <details key={`${content.name}-faq-${i}`} style={{ marginBottom: '0.75rem' }}>
          <summary>
            <strong>{faq.q}</strong>
          </summary>
          <p>{faq.a}</p>
        </details>
      ))}

      <p style={{ marginTop: '2rem' }}>
        <Link href="/contact" className="btn">
          Get Your {content.name} Quote →
        </Link>
      </p>

      <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        <Link href="/services">← All services</Link>
      </p>
    </section>
  );
}

export function ServicePageJsonLd({
  content,
  slug,
}: {
  content: ServiceContent;
  slug: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: content.name,
    name: `${content.name} in Largo, FL`,
    description: content.tagline,
    provider: { '@type': 'LandscapingBusiness', name: 'Largo Lawn' },
    areaServed: {
      '@type': 'City',
      name: 'Largo',
      containedInPlace: { '@type': 'State', name: 'FL' },
    },
    url: `https://largolawn.pro/services/${slug}`,
  };
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: SEO JSON-LD
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function withServiceJsonLd(slug: string, content: ServiceContent) {
  return function WithJsonLd({ children }: { children: ReactNode }) {
    return (
      <>
        <ServicePageJsonLd content={content} slug={slug} />
        {children}
      </>
    );
  };
}
