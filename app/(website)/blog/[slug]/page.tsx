import React from 'react';
import type { Metadata } from 'next';
import { getPublishedBlogPosts } from '@/lib/contentSource';
import BlogDetailsClient from '@/components/BlogDetailsClient';

// Render per-request so scheduled/paused posts are evaluated against the
// current time (drip-publish + pipeline pause/resume). Crawlers still receive
// fully server-rendered HTML.
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  let post = null;
  try {
    const posts = await getPublishedBlogPosts();
    post = posts.find((p) => p.slug === slug);
  } catch (error) {
    console.error("Metadata generation error for blog:", error);
  }

  if (!post) {
    return {
      title: 'Dispatch Article | SaaSPebble',
      description: 'SaaS procurement insights from the SaaSPebble editorial team.',
    };
  }

  const title = `${post.title} | SaaSPebble Dispatch`;

  return {
    title,
    description: post.excerpt,
    alternates: { canonical: `https://saaspebble.tech/blog/${slug}` },
    openGraph: {
      title,
      description: post.excerpt,
      type: 'article',
      url: `https://saaspebble.tech/blog/${slug}`,
      siteName: 'SaaSPebble',
      publishedTime: post.publicationDate,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  
  let staticPost = null;
  try {
    const posts = await getPublishedBlogPosts();
    staticPost = posts.find((p) => p.slug === slug) || null;
  } catch (error) {
    console.error("Page fetch error for blog:", error);
  }

  const jsonLd = staticPost
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: staticPost.title,
        description: staticPost.excerpt,
        datePublished: staticPost.publicationDate,
        author: {
          '@type': 'Organization',
          name: 'SaaSPebble',
          url: 'https://saaspebble.tech',
        },
        publisher: {
          '@type': 'Organization',
          name: 'SaaSPebble',
          url: 'https://saaspebble.tech',
        },
        url: `https://saaspebble.tech/blog/${slug}`,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BlogDetailsClient staticPost={staticPost} slug={slug} />
    </>
  );
}

