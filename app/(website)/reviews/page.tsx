import React from 'react';
import { getPublishedReviews, getPublishedTools } from '@/lib/contentSource';
import { ReviewsPageClient } from '@/components/ReviewsPageClient';
import { Review, Tool } from '@/lib/data';

// Render per-request so the published set reflects drip-publish timing and
// pipeline pause/resume immediately (still full server-rendered HTML for SEO).
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Reviews | SaaSPebble',
  description: 'Unbiased B2B SaaS comparison matrices and verified reviews.',
  alternates: { canonical: 'https://saaspebble.tech/reviews' },
};

export default async function ReviewsPage() {
  let activeReviews: Review[] = [];
  let activeTools: Tool[] = [];
  try {
    const [reviews, tools] = await Promise.all([
      getPublishedReviews(),
      getPublishedTools(),
    ]);
    activeReviews = reviews;
    activeTools = tools;
  } catch (error) {
    console.error("Reviews page fetch error:", error);
  }

  return (
    <ReviewsPageClient
      initialReviews={activeReviews}
      initialTools={activeTools}
    />
  );
}

