import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/business';

export const metadata: Metadata = {
  title: 'Leave a Review · Largo Lawn',
  description:
    'If Largo Lawn serviced your yard, a 30-second Google review helps a local small business more than you know.',
};

/**
 * /review — placeholder for the GBP write-review funnel.
 *
 * Pre-launch (no GBP yet): this page thanks the customer and tells them
 * to text/call directly with feedback.
 *
 * Post-launch (GBP verified): update this page to redirect to the live
 * GBP write-a-review URL. Customers scan the QR code on the
 * review-magnet card → land here → redirected to Google's form.
 *
 * The redirect is a one-line edit when GBP is verified:
 *   return NextResponse.redirect('https://search.google.com/local/writereview?placeid=<PLACE_ID>');
 */
export default function ReviewPage() {
  return (
    <main className="container">
      <section className="hero">
        <h1>Leave a Review</h1>
        <p className="lead">
          Thanks for trusting us with your yard. A 30-second Google review helps a local
          small business compete against the big guys — and it means the world to a one-person
          operation like ours.
        </p>
      </section>

      <section className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <h2 style={{ marginTop: 0 }}>Google review coming soon</h2>
        <p>
          Our Google Business Profile is being set up this season. Once verified, the QR code on
          your review-magnet card will open our Google review form directly.
        </p>
        <p style={{ marginTop: '1rem' }}>
          In the meantime, text or call us directly with any feedback — good or bad:
        </p>
        <p style={{ marginTop: '1rem' }}>
          <a
            href={`tel:${BUSINESS.phone.replace(/\D/g, '')}`}
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: '#2f6b3d',
              color: '#f7f1e3',
              borderRadius: 6,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.1rem',
            }}
          >
            {BUSINESS.phone}
          </a>
        </p>
      </section>

      <section className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>When something isn't right</h2>
        <p>
          Most lawn-care complaints come down to one of three things: missed spots, edge cleanup,
          or timing. We want to fix any of those before they fester — text or call us and we'll be
          back within 48 hours to make it right. No charge for the return visit.
        </p>
        <p style={{ marginTop: '1rem' }}>
          This is the standard we hold ourselves to. Local reputation is everything when you're a
          solo operator — one bad review we didn't try to fix matters more than five great ones
          we never had to make right.
        </p>
      </section>
    </main>
  );
}