/**
 * Areas index — links to each service-area ZIP page.
 */

import { BUSINESS } from '@/lib/business';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Service Areas',
  description: `Lawn care and landscaping service areas: ${BUSINESS.service_area_zips.join(', ')} in Pinellas County.`,
};

export default function AreasIndexPage() {
  return (
    <section className="container">
      <h1>Service Areas</h1>
      <p>
        We serve {BUSINESS.address.city} and the surrounding neighborhoods in Pinellas County. Click
        your ZIP code below to learn more about service in your specific area.
      </p>
      <div className="grid">
        {BUSINESS.service_area_zips.map((zip) => (
          <div key={zip} className="card">
            <h3>
              <Link href={`/areas/${zip}`}>{zip}</Link>
            </h3>
            <p>
              <strong>{ZIP_NAMES[zip] ?? 'Largo area'}</strong>
            </p>
            <p>
              <Link href={`/areas/${zip}`}>Service details →</Link>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

const ZIP_NAMES: Record<(typeof BUSINESS.service_area_zips)[number], string> = {
  '33756': 'Belleair / Clearwater',
  '33770': 'Belleair Bluffs / Largo',
  '33771': 'Largo (central)',
  '33773': 'Largo (east)',
  '33774': 'Largo (Ridgecrest)',
  '33778': 'Seminole / Largo (west)',
};
