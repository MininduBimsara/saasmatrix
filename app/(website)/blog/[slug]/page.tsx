import React from 'react';
import { BLOG_POSTS } from '@/lib/data';
import BlogDetailsClient from '@/components/BlogDetailsClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Map baseline keys for compile-time SSG exporting
export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const staticPost = BLOG_POSTS.find((p) => p.slug === slug) || null;

  return <BlogDetailsClient staticPost={staticPost} slug={slug} />;
}
