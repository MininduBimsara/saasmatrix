import React from 'react';
import { Metadata } from 'next';
import { getPublishedReviews, getAllTools } from '@/lib/contentSource';
import { Tool, Review } from '@/lib/data';
import ReviewDetailsClient from '@/components/ReviewDetailsClient';

// Render per-request so scheduled/paused items are evaluated against the
// current time (drip-publish + pipeline pause/resume). Crawlers still receive
// fully server-rendered HTML.
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate rich, CRO-optimized dynamic meta headers for crawlers
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  let review = null;
  let tools: Tool[] = [];
  try {
    const [reviews, allTools] = await Promise.all([
      getPublishedReviews(),
      getAllTools()
    ]);
    review = reviews.find((r) => r.slug === slug);
    tools = allTools;
  } catch (error) {
    console.error("Metadata generation error for review:", error);
  }


  if (!review) {
    return {
      title: 'Expert Software Comparison | SaaSPebble Review',
      description: 'Dynamic comparison matrix matching leading SaaS products, feature lists, pricing matrices, and conversion-optimized scorecards.',
    };
  }

  // Resolve Tool names to dynamically enrich indexing metrics
  const toolA = tools.find((t) => t.slug === review.toolA);
  const toolB = tools.find((t) => t.slug === review.toolB);

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

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  
  let staticReview: Review | null = null;
  let initialToolA: Tool | null = null;
  let initialToolB: Tool | null = null;
  try {
    const [reviews, allTools] = await Promise.all([
      getPublishedReviews(),
      getAllTools()
    ]);
    const foundReview = reviews.find((r) => r.slug === slug) || null;
    if (foundReview) {
      staticReview = foundReview;
      initialToolA = allTools.find((t) => t.slug === foundReview.toolA) || null;
      initialToolB = allTools.find((t) => t.slug === foundReview.toolB) || null;
    }
  } catch (error) {
    console.error("Page fetch error for review:", error);
  }

  return (
    <ReviewDetailsClient
      staticReview={staticReview}
      slug={slug}
      initialToolA={initialToolA}
      initialToolB={initialToolB}
    />
  );
}


