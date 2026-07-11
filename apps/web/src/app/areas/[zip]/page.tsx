/**
 * Area [zip] page — one per service area.
 *
 * Targets hyperlocal SEO: "lawn care 33771", "landscaping Belleair", etc.
 * Content rendered from a single template + per-ZIP data.
 */

import { BUSINESS, type ServiceAreaZip, inServiceArea } from '@/lib/business';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface AreaParams {
  params: Promise<{ zip: string }>;
}

const AREA_INFO: Record<ServiceAreaZip, { name: string; notes: string; nearby: string[] }> = {
  '33756': {
    name: 'Belleair / Clearwater (33756)',
    notes:
      'Mix of historic homes and waterfront properties. Salinity-resistant plant selection is common. Strict HOA standards on visible curb appeal.',
    nearby: ['Belleair', 'Belleair Beach access', 'Clearwater'],
  },
  '33770': {
    name: 'Belleair Bluffs / Largo (33770)',
    notes:
      'Established neighborhood with mature oaks. Heavy leaf-drop in spring. Many homes have lush, established landscaping requiring routine maintenance.',
    nearby: ['Belleair Bluffs', 'Indian Rocks Beach access'],
  },
  '33771': {
    name: 'Largo Central (33771)',
    notes:
      'Our home base — fast response times for this ZIP. Mix of older and newer homes; many 0.25–0.5 acre lots. St. Augustine grass is dominant.',
    nearby: ['Downtown Largo', 'Largo Central Park', 'Starkey Ranch'],
  },
  '33773': {
    name: 'Largo East (33773)',
    notes:
      'Newer subdivisions with irrigation systems and Bahia or St. Augustine lawns. Many homes under 10 years old with new landscaping.',
    nearby: ['East Bay', 'Pinellas Park border'],
  },
  '33774': {
    name: 'Largo / Ridgecrest (33774)',
    notes:
      'Ridgecrest area with elevated terrain and mature tree canopy. Drainage considerations and shade-tolerant grass varieties are common needs.',
    nearby: ['Ridgecrest', 'Seminole border'],
  },
  '33778': {
    name: 'Seminole / Largo West (33778)',
    notes:
      'Coastal influence — sandy soil and salt air. Service scheduling is tight due to high demand in this ZIP. Hurricane prep is a top seller.',
    nearby: ['Seminole', 'Indian Shores access', 'Largo (west)'],
  },
};

export async function generateStaticParams() {
  return BUSINESS.service_area_zips.map((zip) => ({ zip }));
}

export async function generateMetadata({ params }: AreaParams): Promise<Metadata> {
  const { zip } = await params;
  if (!inServiceArea(zip)) return {};
  const info = AREA_INFO[zip as ServiceAreaZip];
  return {
    title: `Lawn Care in ${info.name}`,
    description: info.notes,
  };
}

export default async function AreaZipPage({ params }: AreaParams) {
  const { zip } = await params;
  if (!inServiceArea(zip)) notFound();
  const info = AREA_INFO[zip as ServiceAreaZip];

  return (
    <section className="container">
      <h1>Lawn Care & Landscaping in {info.name}</h1>
      <p>{info.notes}</p>

      <h2>Services Available in {zip}</h2>
      <ul>
        <li>
          <Link href="/services/mowing">Weekly / bi-weekly mowing</Link>
        </li>
        <li>
          <Link href="/services/edging">Edging</Link>
        </li>
        <li>
          <Link href="/services/mulching">Mulch installation</Link>
        </li>
        <li>
          <Link href="/services/hedge-trimming">Hedge trimming</Link>
        </li>
        <li>
          <Link href="/services/hurricane-prep">Hurricane prep & cleanup</Link>
        </li>
        <li>
          <Link href="/services/seasonal-cleanup">Seasonal cleanup</Link>
        </li>
      </ul>

      <h2>About the Neighborhood</h2>
      <p>Nearby areas we also serve: {info.nearby.join(', ')}.</p>
      <p>
        <strong>Local insight:</strong> {info.notes}
      </p>

      <h2>Get a Quote for {zip}</h2>
      <p>
        <Link href="/contact" className="btn">
          Request a Free Quote →
        </Link>
      </p>

      <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        <Link href="/areas">← All service areas</Link>
      </p>
    </section>
  );
}
