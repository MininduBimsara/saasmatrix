import React from 'react';
import { Metadata } from 'next';
import { REVIEWS, TOOLS } from '@/lib/data';
import ReviewDetailsClient from '@/components/ReviewDetailsClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate rich, CRO-optimized dynamic meta headers for crawlers
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const review = REVIEWS.find((r) => r.slug === slug);

  if (!review) {
    return {
      title: 'Expert Software Comparison | SaaSPebble Review',
      description: 'Dynamic comparison matrix matching leading SaaS products, feature lists, pricing matrices, and conversion-optimized scorecards.',
    };
  }

  // Resolve Tool names to dynamically enrich indexing metrics
  const toolA = TOOLS.find((t) => t.slug === review.toolA);
  const toolB = TOOLS.find((t) => t.slug === review.toolB);

  const toolAName = toolA?.name || review.toolA;
  const toolBName = toolB?.name || review.toolB;

  const title = `Is ${toolAName} or ${toolBName} Better? ${review.title} Verdict`;
  const description = `${review.excerpt || `In-depth comparative review comparing ${toolAName} versus ${toolBName}.`} Read our full verdict, dynamic feature comparison tables, and conversion pricing.`;

  return {
    title,
    description,
    alternates: { canonical: `https://saaspebble.tech/reviews/${slug}` },
    keywords: [
      toolAName,
      toolBName,
      `${toolAName} vs ${toolBName}`,
      'SaaS analysis',
      'conversion assessment',
      review.category,
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://saaspebble.tech/reviews/${slug}`,
      siteName: 'SaaSPebble',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// Export baseline paths for static build exportation pipelines
export async function generateStaticParams() {
  return REVIEWS.map((review) => ({
    slug: review.slug,
  }));
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const staticReview = REVIEWS.find((r) => r.slug === slug) || null;

  return <ReviewDetailsClient staticReview={staticReview} slug={slug} />;
}

