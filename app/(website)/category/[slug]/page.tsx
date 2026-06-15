import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, getCategory, Tool, Review } from '@/lib/data';
import { getPublishedTools, getPublishedReviews } from '@/lib/contentSource';
import { CategoryPageClient } from '@/components/CategoryPageClient';

// Render per-request so category tool/review lists reflect drip-publish timing
// and pipeline pause/resume immediately (still full server-rendered HTML).
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    return {
      title: 'Category Not Found | SaaSPebble',
      description: 'The requested category vertical was not found in our B2B directory index.',
    };
  }

  return {
    title: `${category.name} Review Index & Comparison Matrices | SaaSPebble`,
    description: `${category.blurb} Detailed comparative analysis, performance benchmarking, and verified pricing lists.`,
    alternates: { canonical: `https://saaspebble.tech/category/${slug}` },
    openGraph: {
      title: `${category.name} Comparison Matrices & Ratings`,
      description: category.blurb,
      type: 'website',
      url: `https://saaspebble.tech/category/${slug}`,
      siteName: 'SaaSPebble',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Review Index | SaaSPebble`,
      description: category.blurb,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    return notFound();
  }

  // Filter tools and reviews for this category from Supabase on the server side
  let categoryTools: Tool[] = [];
  let categoryReviews: Review[] = [];
  try {
    const [allTools, allReviews] = await Promise.all([
      getPublishedTools(),
      getPublishedReviews(),
    ]);
    categoryTools = allTools.filter((tool) => tool.category === category.slug);
    categoryReviews = allReviews.filter((review) => review.category === category.slug);
  } catch (error) {
    console.error(`Category page server pre-fetch error for ${slug}:`, error);
  }


  const relatedCategories = CATEGORIES.filter((c) => c.slug !== category.slug);

  return (
    <CategoryPageClient
      category={category}
      categoryTools={categoryTools}
      categoryReviews={categoryReviews}
      relatedCategories={relatedCategories}
    />
  );
}

