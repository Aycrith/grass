/**
 * Contact page — lead-capture form.
 *
 * Posts to /api/lead which validates, calls @grass/crm-core createLead,
 * and dispatches SMS/email via @grass/notifications-core sendLeadResponse.
 */

import { BUSINESS, inServiceArea } from '@/lib/business';
import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get a free lawn-care quote in ${BUSINESS.address.city}, FL. We respond within 24 hours during business days.`,
};

interface ContactProps {
  searchParams: Promise<{ source?: string }>;
}

export default async function ContactPage({ searchParams }: ContactProps) {
  const { source } = await searchParams;
  return (
    <section className="container">
      <h1>Get a Free Quote</h1>
      <p>
        Tell us about your yard and we'll get back to you within 24 hours during business days. Or
        call us directly at <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a>.
      </p>
      {source === 'hurricane' ? (
        <div
          style={{
            background: 'var(--red-700)',
            color: 'white',
            padding: '1rem',
            borderRadius: 6,
            margin: '1rem 0',
          }}
        >
          <strong>Hurricane Mode Active:</strong> We are prioritizing prep and cleanup requests.
          Please include your address and any concerns in the message field below.
        </div>
      ) : null}
      <ContactForm source={source} />
      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
        We currently service {BUSINESS.service_area_zips.join(', ')}.
        {` Not sure if we cover your ZIP? Enter it above and we'll let you know.`}
      </p>
    </section>
  );
}

export { inServiceArea };
