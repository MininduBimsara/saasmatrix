'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdContainer } from '@/components/AdContainer';
import { SectionHeading } from '@/components/SectionHeading';
import { ReviewCard } from '@/components/ReviewCard';
import { TableSkeleton, ReviewCardSkeleton } from '@/components/Skeletons';
import { Category, Tool, Review } from '@/lib/data';
import { ChevronRight, ArrowLeft, Tag } from 'lucide-react';

interface CategoryPageClientProps {
  category: Category;
  categoryTools: Tool[];
  categoryReviews: Review[];
  relatedCategories: Category[];
}

export function CategoryPageClient({
  category,
  categoryTools,
  categoryReviews,
  relatedCategories,
}: CategoryPageClientProps) {
  const [isLoading, setIsLoading] = useState<boolean>(categoryTools.length === 0 && categoryReviews.length === 0);
  const [tools, setTools] = useState<Tool[]>(categoryTools);
  const [reviews, setReviews] = useState<Review[]>(categoryReviews);

  useEffect(() => {
    import('@/lib/contentSource').then(async (src) => {
      const [allTools, allReviews] = await Promise.all([
        src.getPublishedTools(),
        src.getPublishedReviews(),
      ]);
      setTools(allTools.filter((t) => t.category === category.slug));
      setReviews(allReviews.filter((r) => r.category === category.slug));
      setIsLoading(false);
    });
  }, [category.slug]);


  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main id="category-landing-root" className="flex-grow py-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs Navigation */}
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-slate-400 font-sans">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-slate-500 uppercase">Vertical Indices</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-500 font-medium">{category.name}</span>
          </nav>

          {/* Hero Section */}
          <section id="category-hero" className="mb-12 max-w-3xl">
            <Link 
              id="back-index-btn"
              href="/" 
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 mb-6"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to B2B Directory Home
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl md:text-5xl">{category.emoji}</span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-905 tracking-tight">
                {category.name} <span className="text-blue-600">Index</span>
              </h1>
            </div>

            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              {category.blurb} Real performance logs and structured comparative pricing datasets.
            </p>
          </section>

          {/* Section 1: Tool Index (Minimal high-density tables) */}
          <section id="category-tools-index" className="mb-12">
            <SectionHeading 
              title="Verified Tools Directory Index" 
              eyebrow="Market coverage" 
              emphasized="Index"
              meta={`${tools.length} Listed`}
            />

            {isLoading ? (
              <TableSkeleton rowsCount={Math.max(3, tools.length)} columnsCount={3} theme="silver" />
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(15,23,42,0.01)] text-xs">
                <div className="grid grid-cols-1 md:grid-cols-12 bg-slate-50 border-b border-slate-200 p-3.5 font-bold text-slate-700">
                  <div className="md:col-span-3">Software Platform</div>
                  <div className="md:col-span-2">Starting Pricing</div>
                  <div className="md:col-span-7">Editor One-Line Verdict</div>
                </div>

                <div className="divide-y divide-slate-100">
                  {tools.length > 0 ? (
                    tools.map((tool) => (
                      <div 
                        id={`tool-identity-row-${tool.slug}`}
                        key={tool.slug} 
                        className="grid grid-cols-1 md:grid-cols-12 p-3.5 items-center hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="md:col-span-3 font-semibold text-slate-900 text-sm">
                          {tool.name}
                        </div>
                        <div className="md:col-span-2 font-mono text-slate-600 font-semibold my-1 md:my-0">
                          {tool.startingPrice}
                        </div>
                        <div className="md:col-span-7 text-slate-600 leading-normal">
                          {tool.oneLineOpinion}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 italic">
                      Additional listed applications on this vertical are being verified on our sandbox VMs in Q3.
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Mid-point ad placements */}
          <AdContainer layoutType="top-banner" slotId={`cat-${category.slug}-above-reviews`} />

          {/* Section 2: Published review matrices for this category */}
          {reviews.length > 0 && (
            <section id="category-matrices" className="mb-12 mt-8">
              <SectionHeading 
                title={`${category.name} Comparison Matrices`} 
                eyebrow="Independent Evaluations" 
                emphasized="Matrices" 
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  Array.from({ length: Math.min(2, reviews.length) }).map((_, idx) => (
                    <ReviewCardSkeleton key={idx} variant="default" />
                  ))
                ) : (
                  reviews.map((review) => (
                    <ReviewCard key={review.slug} review={review} variant="default" />
                  ))
                )}
              </div>
            </section>
          )}

          {/* Bottom tag cloud to discover sister niches */}
          <section id="category-tag-cloud" className="border-t border-slate-200 pt-12 mt-12 bg-slate-50/60 p-6 rounded-2xl border">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5 font-sans">
              <Tag className="h-3.5 w-3.5 text-slate-400" />
              Related Directory verticals
            </h4>

            <div className="flex flex-wrap gap-2">
              {relatedCategories.map((c) => (
                <Link
                  id={`tag-link-${c.slug}`}
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="text-xs px-3.5 py-1.5 bg-white border border-slate-200 hover:border-blue-400 rounded-lg font-medium text-slate-600 hover:text-blue-600 transition-colors shadow-2xs"
                >
                  {c.emoji} {c.name} Index
                </Link>
              ))}
            </div>
          </section>

          {/* Bottom Banner Advertisement Block */}
          <div className="mt-8">
            <AdContainer
              layoutType="top-banner"
              slotId={`cat-${category.slug}-bottom`}
            />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
