'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdContainer } from '@/components/AdContainer';
import { SectionHeading } from '@/components/SectionHeading';
import { ReviewCard } from '@/components/ReviewCard';
import { ReviewCardSkeleton } from '@/components/Skeletons';
import { Review } from '@/lib/data';

export default function ReviewsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeReviews, setActiveReviews] = useState<Review[]>([]);

  useEffect(() => {
    import('@/lib/contentSource').then(async (src) => {
      setActiveReviews(await src.getPublishedReviews());
      setIsLoading(false);
    });
  }, []);

  const sortedReviews = useMemo(() => {
    return [...activeReviews].sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
  }, [activeReviews]);

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
            {isLoading ? (
              // Fill with 6 standard default cards skeletons matching actual item counts for layout continuity
              Array.from({ length: 6 }).map((_, idx) => (
                <ReviewCardSkeleton key={idx} variant="default" />
              ))
            ) : (
              sortedReviews.map((review) => (
                <ReviewCard key={review.slug} review={review} variant="default" />
              ))
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
