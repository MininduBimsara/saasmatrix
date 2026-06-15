import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdContainer } from '@/components/AdContainer';
import { SectionHeading } from '@/components/SectionHeading';
import { ReviewCard } from '@/components/ReviewCard';
import { getPublishedReviews } from '@/lib/contentSource';
import { Review } from '@/lib/data';

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
  try {
    activeReviews = await getPublishedReviews();
  } catch (error) {
    console.error("Reviews page fetch error:", error);
  }


  const sortedReviews = [...activeReviews].sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main id="reviews-index-root" className="flex-grow py-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="mb-6 text-xs text-slate-400 font-mono">
            <Link href="/" className="hover:text-blue-605">HOME</Link> / ALL REVIEW MATRICES
          </nav>

          {/* Editorial Section Heading */}
          <SectionHeading
            as="h1"
            title="Every verified software review matrix on file"
            eyebrow="The Full Archive"
            emphasized="review"
            meta={`${sortedReviews.length} Active Comparisons`}
          />

          {/* Introgductory layout with escape hatch links */}
          <div className="max-w-3xl mb-12">
            <p className="text-sm leading-relaxed text-slate-600">
              We update our sandbox arrays weekly. Read fully transparent comparative matrix tables with zero sponsored placement noise. If you already have two specific tools in mind, check our{' '}
              <Link href="/compare" className="text-blue-600 font-semibold hover:underline">
                Interactive comparison tool
              </Link>{' '}
              or isolate software listings in specific{' '}
              <Link href="/#categories-matrix" className="text-blue-600 font-semibold hover:underline">
                Industry niches
              </Link>.
            </p>
          </div>

          {/* Top Banner Advertisement Block */}
          <div className="mb-8">
            <AdContainer
              layoutType="top-banner"
              slotId="archive-top-advert"
            />
          </div>

          {/* Archive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {sortedReviews.length > 0 ? (
              sortedReviews.map((review) => (
                <ReviewCard key={review.slug} review={review} variant="default" />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-xs font-mono text-slate-450 italic">
                No active comparative matrices registered in database.
              </div>
            )}
          </div>

          {/* Ad Container at the bottom of listings to respect scan path */}
          <div className="border-t border-slate-100 pt-8">
            <AdContainer layoutType="top-banner" slotId="archive-bottom-advert" />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

