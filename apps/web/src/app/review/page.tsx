/**
 * /review — review-magnet page.
 *
 * Mounts the canonical ReviewMagnet section composition.
 *
 * Pre-launch (GBP not yet verified): the page renders the
 * "coming soon" state from `reviewPage`. Post-launch, the
 * steward can flip the page to redirect to the GBP
 * write-a-review URL (one-line change to this file).
 *
 * The full star-rating branch and /api/review-handler
 * wiring is WP13 — gated on `reviewPage.reviewMagnetEnabled`.
 */

import { ReviewMagnet } from '@/components/sections';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leave a Review · Largo Lawn',
  description:
    'If Largo Lawn serviced your yard, a 30-second Google review helps a local small business more than you know.',
  alternates: { canonical: '/review' },
};

export default function ReviewPage() {
  return <ReviewMagnet />;
}
