import React from 'react';
import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/lib/data';
import BlogDetailsClient from '@/components/BlogDetailsClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

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

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const staticPost = BLOG_POSTS.find((p) => p.slug === slug) || null;

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
