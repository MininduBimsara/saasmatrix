import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, TOOLS, REVIEWS, getCategory } from '@/lib/data';
import { CategoryPageClient } from '@/components/CategoryPageClient';

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

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
    openGraph: {
      title: `${category.name} Comparison Matrices & Ratings`,
      description: category.blurb,
      type: 'website',
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

  // Filter tools and reviews for this category
  const categoryTools = TOOLS.filter((tool) => tool.category === category.slug);
  const categoryReviews = REVIEWS.filter((review) => review.category === category.slug);
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
