'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdContainer } from '@/components/AdContainer';
import { SectionHeading } from '@/components/SectionHeading';
import { ReviewCard } from '@/components/ReviewCard';
import { Review, Tool, CATEGORIES } from '@/lib/data';

interface ReviewsPageClientProps {
  initialReviews: Review[];
  initialTools: Tool[];
}

export function ReviewsPageClient({ initialReviews, initialTools }: ReviewsPageClientProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTool, setSelectedTool] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 10;

  // Sync with local storage overrides if any exist (admin pipelines, etc.)
  useEffect(() => {
    const hasCustomData = typeof window !== 'undefined' && (
      !!localStorage.getItem('saasrooms_custom_tools') ||
      !!localStorage.getItem('saasrooms_custom_reviews')
    );

    if (hasCustomData) {
      setIsLoading(true);
      import('@/lib/contentSource').then(async (src) => {
        const [allTools, allReviews] = await Promise.all([
          src.getPublishedTools(),
          src.getPublishedReviews(),
        ]);
        setTools(allTools);
        setReviews(allReviews);
        setIsLoading(false);
      });
    }
  }, []);

  // Compute lookup tables & unique lists
  const toolLookup = useMemo(() => {
    const map = new Map<string, string>();
    tools.forEach(t => map.set(t.slug, t.name));
    return map;
  }, [tools]);

  const categoryLookup = useMemo(() => {
    const map = new Map<string, string>();
    CATEGORIES.forEach(c => map.set(c.slug, c.name));
    return map;
  }, []);

  // Get tools that are actually used in the review cards to avoid empty states
  const toolsInReviews = useMemo(() => {
    const uniqueSlugs = Array.from(
      new Set(reviews.flatMap(r => [r.toolA, r.toolB]))
    );
    return uniqueSlugs
      .map(slug => ({
        slug,
        name: toolLookup.get(slug) || slug.charAt(0).toUpperCase() + slug.slice(1)
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [reviews, toolLookup]);

  // Handle filter reset
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTool('all');
    setSelectedCategory('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Reset pagination to page 1 on filter/search change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleToolChange = (val: string) => {
    setSelectedTool(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  // Filtered and sorted list computations
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    // 1. Tool Filter
    if (selectedTool !== 'all') {
      result = result.filter(
        r => r.toolA === selectedTool || r.toolB === selectedTool
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(r => r.category === selectedCategory);
    }

    // 3. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(r => {
        const titleMatch = r.title.toLowerCase().includes(q);
        const excerptMatch = r.excerpt.toLowerCase().includes(q);
        
        const catName = categoryLookup.get(r.category) || r.category;
        const categoryMatch = catName.toLowerCase().includes(q);

        const toolAName = toolLookup.get(r.toolA) || r.toolA;
        const toolBName = toolLookup.get(r.toolB) || r.toolB;
        const toolsMatch = toolAName.toLowerCase().includes(q) || toolBName.toLowerCase().includes(q);

        return titleMatch || excerptMatch || categoryMatch || toolsMatch;
      });
    }

    // 4. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.publicationDate).getTime() - new Date(b.publicationDate).getTime();
        case 'read-time-asc':
          return a.readTimeMinutes - b.readTimeMinutes;
        case 'read-time-desc':
          return b.readTimeMinutes - a.readTimeMinutes;
        case 'newest':
        default:
          return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
      }
    });

    return result;
  }, [reviews, selectedTool, selectedCategory, searchQuery, sortBy, toolLookup, categoryLookup]);

  // Paginated reviews
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedReviews, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedReviews.length / itemsPerPage);

  // Helper for generating page numbers with ellipses
  const getPageNumbers = () => {
    const range: (number | 'ellipsis')[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== 'ellipsis') {
        range.push('ellipsis');
      }
    }
    return range;
  };

  const isAnyFilterActive = searchQuery !== '' || selectedTool !== 'all' || selectedCategory !== 'all';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main id="reviews-index-root" className="flex-grow py-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="mb-6 text-xs text-slate-400 font-mono">
            <Link href="/" className="hover:text-blue-600 transition-colors">HOME</Link> / ALL REVIEW MATRICES
          </nav>

          {/* Editorial Section Heading */}
          <SectionHeading
            as="h1"
            title="Every verified software review matrix on file"
            eyebrow="The Full Archive"
            emphasized="review"
            meta={`${reviews.length} Active Comparisons`}
          />

          {/* Introductory layout */}
          <div className="max-w-3xl mb-8">
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
          <div className="mb-10">
            <AdContainer
              layoutType="top-banner"
              slotId="archive-top-advert"
            />
          </div>

          {/* PREMIUM SEARCH AND FILTER BOARD */}
          <section id="reviews-filter-board" className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 md:p-6 mb-8 shadow-[0_1px_3px_rgba(15,23,42,0.02)]">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-200/50 pb-3">
              <SlidersHorizontal className="h-4 w-4 text-slate-500" />
              <h2 className="text-xs font-black text-slate-700 uppercase tracking-widest font-mono">
                Index Filter Engine
              </h2>
              {isAnyFilterActive && (
                <button
                  onClick={handleResetFilters}
                  className="ml-auto flex items-center gap-1 text-[10px] font-mono font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-2.5 py-1 rounded-full transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  RESET ALL
                </button>
              )}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Search input (5 cols) */}
              <div className="md:col-span-5 relative">
                <label className="block text-[10px] font-mono uppercase font-bold text-slate-400 mb-1.5">
                  Search keyword / software name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-450">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search e.g. clickup, jira, crm, project management..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl py-2.5 pl-10 pr-9 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearchChange('')}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tool dropdown filter (3 cols) */}
              <div className="md:col-span-3">
                <label className="block text-[10px] font-mono uppercase font-bold text-slate-400 mb-1.5">
                  Filter by Software
                </label>
                <div className="relative">
                  <select
                    value={selectedTool}
                    onChange={(e) => handleToolChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-850 text-xs rounded-xl py-2.5 pl-3.5 pr-10 appearance-none focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold transition-all"
                  >
                    <option value="all">All Software Platforms</option>
                    {toolsInReviews.map(t => (
                      <option key={t.slug} value={t.slug}>{t.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Category dropdown filter (2 cols) */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono uppercase font-bold text-slate-400 mb-1.5">
                  Category niche
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-850 text-xs rounded-xl py-2.5 pl-3.5 pr-10 appearance-none focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold transition-all"
                  >
                    <option value="all">All Niches</option>
                    {CATEGORIES.map(c => (
                      <option key={c.slug} value={c.slug}>{c.emoji} {c.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Sort Order (2 cols) */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono uppercase font-bold text-slate-400 mb-1.5">
                  Sort Matrix
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-850 text-xs rounded-xl py-2.5 pl-3.5 pr-10 appearance-none focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold transition-all"
                  >
                    <option value="newest">Newest Listed</option>
                    <option value="oldest">Oldest Archive</option>
                    <option value="read-time-asc">Read Time: Low-High</option>
                    <option value="read-time-desc">Read Time: High-Low</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

            </div>

            {/* Filter Metadata Indicators */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-200/50">
              <span className="text-[10px] font-semibold text-slate-450 font-mono tracking-wider mr-2 uppercase">
                {filteredAndSortedReviews.length === 0 
                  ? 'No matching comparisons' 
                  : `Found ${filteredAndSortedReviews.length} comparative ${filteredAndSortedReviews.length === 1 ? 'study' : 'studies'}`
                }
              </span>

              {/* Removable Active Tags */}
              <AnimatePresence>
                {selectedTool !== 'all' && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1 text-[11px] font-medium text-slate-600 shadow-2xs"
                  >
                    Platform: <span className="font-bold text-slate-800">{toolLookup.get(selectedTool) || selectedTool}</span>
                    <button onClick={() => handleToolChange('all')} className="text-slate-400 hover:text-rose-600 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                )}
                
                {selectedCategory !== 'all' && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1 text-[11px] font-medium text-slate-600 shadow-2xs"
                  >
                    Category: <span className="font-bold text-slate-800">{categoryLookup.get(selectedCategory) || selectedCategory}</span>
                    <button onClick={() => handleCategoryChange('all')} className="text-slate-400 hover:text-rose-600 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                )}

                {searchQuery.trim() && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1 text-[11px] font-medium text-slate-600 shadow-2xs"
                  >
                    Query: <span className="font-bold text-slate-800">"{searchQuery}"</span>
                    <button onClick={() => handleSearchChange('')} className="text-slate-400 hover:text-rose-600 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Archive Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-[24.5px] p-7 h-[250px] animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {filteredAndSortedReviews.length > 0 ? (
                <div>
                  <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                  >
                    <AnimatePresence mode="popLayout">
                      {paginatedReviews.map((review) => (
                        <motion.div
                          layout
                          key={review.slug}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.25 }}
                          className="h-full"
                        >
                          <ReviewCard review={review} variant="default" />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Pagination Section */}
                  {totalPages > 1 && (
                    <div className="flex flex-col items-center gap-3.5 mt-8 pt-8 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        {/* Prev Button */}
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="p-2.5 bg-white border border-slate-200 hover:border-slate-300 disabled:opacity-30 disabled:hover:border-slate-200 text-slate-600 rounded-xl transition-all font-semibold flex items-center justify-center disabled:cursor-not-allowed shadow-2xs hover:shadow-xs"
                          aria-label="Previous Page"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>

                        {/* Page Numbers */}
                        {getPageNumbers().map((pageNumber, idx) => {
                          if (pageNumber === 'ellipsis') {
                            return (
                              <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 text-xs font-bold font-mono select-none">
                                ...
                              </span>
                            );
                          }
                          return (
                            <button
                              key={`page-${pageNumber}`}
                              onClick={() => setCurrentPage(pageNumber as number)}
                              className={`h-9 min-w-9 px-3.5 text-xs font-bold font-mono rounded-xl border transition-all shadow-2xs hover:shadow-xs ${
                                currentPage === pageNumber
                                  ? 'bg-rose-500 border-rose-500 text-white hover:bg-rose-600'
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50/50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}

                        {/* Next Button */}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2.5 bg-white border border-slate-200 hover:border-slate-300 disabled:opacity-30 disabled:hover:border-slate-200 text-slate-600 rounded-xl transition-all font-semibold flex items-center justify-center disabled:cursor-not-allowed shadow-2xs hover:shadow-xs"
                          aria-label="Next Page"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Small Counter Page Info */}
                      <span className="text-[10px] text-slate-400 font-mono tracking-widest font-black uppercase">
                        PAGE {currentPage} OF {totalPages}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-[28px] my-6">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 border border-slate-200/60">
                    <Search className="h-5 w-5 text-slate-450" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">No comparisons match your criteria</h3>
                  <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
                    We couldn't find any comparative reviews matching your current filters. Try resetting them or adjusting your query.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all shadow-xs hover:shadow-md hover:scale-102 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset All Filters
                  </button>
                </div>
              )}
            </>
          )}

          {/* Ad Container at the bottom of listings to respect scan path */}
          <div className="border-t border-slate-100 pt-8 mt-12">
            <AdContainer layoutType="top-banner" slotId="archive-bottom-advert" />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
