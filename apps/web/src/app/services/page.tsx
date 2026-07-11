/**
 * Services index — list of all 6 service pages.
 */

import { PRICING_FLOOR_CENTS } from '@/lib/business';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Full-service lawn care and landscaping in Largo, FL: mowing, edging, mulching, hedge trimming, hurricane prep, seasonal cleanup.',
};

const SERVICES = [
  {
    slug: 'mowing',
    name: 'Mowing',
    description: 'Push-mowing ≤0.5 acre and riding mowing 0.5–1 acre. Edging and blowing included.',
    price: `From $${(PRICING_FLOOR_CENTS.mowing_per_visit_small / 100).toFixed(0)}/visit`,
  },
  {
    slug: 'edging',
    name: 'Edging',
    description: 'Mechanical edging along curbs, walkways, and bed lines.',
    price: `From $${(PRICING_FLOOR_CENTS.edging_per_linear_ft / 100).toFixed(2)}/linear ft`,
  },
  {
    slug: 'mulching',
    name: 'Mulching',
    description: 'Bulk mulch delivery and installation (pine, cypress, hardwood).',
    price: `From $${((PRICING_FLOOR_CENTS.mulch_per_cubic_yard + PRICING_FLOOR_CENTS.mulch_install_per_cubic_yard) / 100).toFixed(0)}/yd³ installed`,
  },
  {
    slug: 'hedge-trimming',
    name: 'Hedge Trimming',
    description: 'Seasonal shrub and hedge trimming. Heights up to 12 ft.',
    price: `From $${(PRICING_FLOOR_CENTS.hedge_trim_per_linear_ft / 100).toFixed(2)}/linear ft`,
  },
  {
    slug: 'hurricane-prep',
    name: 'Hurricane Prep',
    description:
      'Pre-storm yard securing, branch removal, and post-storm debris cleanup. June–November.',
    price: `From $${(PRICING_FLOOR_CENTS.hurricane_prep_base / 100).toFixed(0)}`,
  },
  {
    slug: 'seasonal-cleanup',
    name: 'Seasonal Cleanup',
    description: 'Spring and fall leaf removal, bed cleanup, debris haul-off.',
    price: `From $${(PRICING_FLOOR_CENTS.seasonal_cleanup_base / 100).toFixed(0)}`,
  },
];

export default function ServicesIndexPage() {
  return (
    <section className="container">
      <h1>Services</h1>
      <p>
        We offer a focused set of residential services for {`Largo's`} year-round growing season.
        All work is performed by our in-house crew — never subcontracted.
      </p>
      <div className="grid">
        {SERVICES.map((svc) => (
          <div key={svc.slug} className="card">
            <h3>
              <Link href={`/services/${svc.slug}`}>{svc.name}</Link>
            </h3>
            <p>{svc.description}</p>
            <p>
              <strong>{svc.price}</strong>
            </p>
          </div>
        ))}
      </div>
      <p>
        <Link href="/contact" className="btn">
          Request a Free Quote
        </Link>
      </p>
    </section>
  );
}
