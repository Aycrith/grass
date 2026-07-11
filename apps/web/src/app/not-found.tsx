/**
 * not-found — 404 page.
 */

import { BUSINESS } from '@/lib/business';
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container">
      <h1>Page not found</h1>
      <p>{`We couldn't find what you were looking for. Try the homepage or contact us.`}</p>
      <p>
        <Link href="/" className="btn">
          Home
        </Link>{' '}
        <a href={`tel:${BUSINESS.phone}`} className="btn" style={{ background: 'var(--gray-700)' }}>
          Call {BUSINESS.phone}
        </a>
      </p>
    </section>
  );
}
