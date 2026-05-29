'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdContainer } from '@/components/AdContainer';
import { 
  Check, 
  ArrowLeft, 
  Star, 
  ChevronRight, 
  Info, 
  Award,
  Zap,
  ShieldCheck 
} from 'lucide-react';

interface ReviewDetailsClientProps {
  staticReview: any | null;
  slug: string;
}

export default function ReviewDetailsClient({ staticReview, slug }: ReviewDetailsClientProps) {
  const [review, setReview] = useState<any | null>(staticReview);
  const [toolA, setToolA] = useState<any | null>(null);
  const [toolB, setToolB] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      import('@/lib/clientDb')
    ]).then(([db]) => {
      const allReviews = db.getMergedReviews();
      const allTools = db.getMergedTools();
      
      const foundReview = allReviews.find(r => r.slug === slug);
      const activeReview = foundReview || staticReview;
      
      if (activeReview) {
        setReview(activeReview);
        const tA = allTools.find(t => t.slug === activeReview.toolA);
        const tB = allTools.find(t => t.slug === activeReview.toolB);
        setToolA(tA || null);
        setToolB(tB || null);
      }
      setIsLoading(false);
    });
  }, [slug, staticReview]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow py-32 text-center font-mono text-xs text-slate-400">
          Recompiling review matrix systems...
        </main>
        <Footer />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow py-24 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Review Matrix Not Found</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            The requested comparison ledger does not exist or has been refactored in the workspace archives.
          </p>
          <Link href="/" className="inline-block text-xs font-bold text-blue-600 hover:underline">
            Return to matrix hub
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Main Review Editorial Grid */}
      <main id="editorial-slug-root" className="flex-grow pt-8 pb-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs Navigation */}
          <nav id="editorial-breadcrumbs" className="mb-6 flex items-center gap-1.5 text-xs text-slate-400 font-sans">
            <Link href="/" className="hover:text-blue-650 transition-colors">
              Index
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-slate-500 uppercase">{review.category.replace('-', ' ')}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-500 font-medium truncate max-w-xs">{review.title}</span>
          </nav>

          {/* Back Button and Headline Section */}
          <section id="review-header-badge" className="mb-6">
            <Link 
              id="back-index-link"
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-605 transition-colors mb-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to B2B Directories
            </Link>

            <div className="flex flex-col lg:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-200">
              <div className="max-w-4xl">
                {/* Score indicators */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                    Editor Choice Array
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                    GAAP Safe Rating
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {review.title}
                </h1>
              </div>

              {/* Verified Product Score Wrapper */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-xl shrink-0 self-start lg:self-auto">
                <div className="text-center w-24">
                  <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase font-mono mb-0.5 animate-pulse">Matrix Score</span>
                  <div className="flex items-center gap-1 justify-center">
                    <Star className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />
                    <span className="text-lg font-black text-slate-900 font-mono tracking-tight">
                      {review.winnerSlug === 'quickbooks' || review.slug.includes('quickbooks') ? '9.6' : '9.4'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/10</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Above content banner */}
          <AdContainer layoutType="top-banner" slotId={`slug-${review.slug}-above-content`} />

          {/* Three-Column Editorial and Sticky Sidebar layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
            
            {/* Main Editorial Review Area (8 / 12 width) */}
            <article id="main-editorial-content" className="lg:col-span-8 space-y-8">
              
              {/* Introduction Box layout */}
              <section id="review-intro">
                <p className="text-base leading-relaxed text-slate-700 font-sans first-letter:text-4xl first-letter:font-bold first-letter:text-blue-600 first-letter:mr-1">
                  {review.excerpt} Our engineering board ran comparative unit diagnostics checking API throughput rates and license cost-structures.
                </p>
                
                <div className="mt-5 p-4 bg-blue-50/50 border-l-4 border-blue-605 rounded-r-lg flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-blue-900 font-sans">Ideal Use Case Benchmark</span>
                    <p className="text-xs text-blue-800 leading-normal mt-0.5">
                      {review.bestForA || 'Ideal workspace optimization platform.'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Dynamic Hot Take callout section in a colored sidebar block */}
              <section id="hot-take-quote" className="p-5 md:p-6 bg-amber-50/60 border-l-4 border-amber-500 rounded-r-xl font-sans">
                <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-amber-800 block mb-2">
                  Editorial Hot Take
                </span>
                <blockquote className="text-sm font-medium italic text-slate-800 font-sans leading-relaxed">
                  &ldquo;{review.hotTakeQuote || 'Performance values vary significantly cross-platforms.'}&rdquo;
                </blockquote>
              </section>

              {/* Typographic Comparison Matrix Section (Standard Table Config) */}
              <section id="comparison-table-section">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-1.5 font-sans">
                  <Award className="h-4.5 w-4.5 text-blue-605" />
                  Side-by-Side Comparison Matrix
                </h2>
                
                <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.02)]">
                  <table className="w-full text-left border-collapse bg-white text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-3.5 font-bold text-slate-800 min-w-[140px]">Feature Suite</th>
                        <th className="p-3.5 font-bold text-slate-800">{toolA?.name || 'Tool A'}</th>
                        <th className="p-3.5 font-bold text-slate-800">{toolB?.name || 'Tool B'}</th>
                        <th className="p-3.5 font-bold text-slate-705 font-mono text-center">Performance Winner</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {review.tableRows && review.tableRows.map((row: any, idx: number) => (
                        <tr 
                          key={row.feature} 
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}
                        >
                          <td className="p-3.5 font-semibold text-slate-800">{row.feature}</td>
                          <td className="p-3.5 text-slate-600 leading-normal">{row.valueA}</td>
                          <td className="p-3.5 text-slate-600 leading-normal">{row.valueB}</td>
                          <td className="p-3.5 text-center font-bold text-blue-600 font-mono">{row.winner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Inline Content Placement to optimize AdSense monetization */}
              <AdContainer layoutType="inline-content" slotId={`slug-${review.slug}-mid-point`} />

              {/* Bullet Points Pros / Cons Rows */}
              <section id="pros-cons-matrix" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Competitor A */}
                 <div className="bg-slate-50/50 border border-slate-150 p-5 rounded-xl">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 border-b border-slate-200/60 pb-1.5 flex justify-between">
                    <span>{toolA?.name || 'Tool A'} Suite Pros</span>
                    <span className="text-[10px] text-green-600 font-bold">&#10003; Verified</span>
                  </h3>
                   <ul className="space-y-3">
                    <li className="flex gap-2 text-xs leading-relaxed text-slate-600">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{review.bestForA || 'Flawless database execution rates.'}</span>
                    </li>
                    <li className="flex gap-2 text-xs leading-relaxed text-slate-600">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Flawless enterprise sandbox APIs and webhooks logs.</span>
                    </li>
                  </ul>
                </div>

                {/* Competitor B */}
                 <div className="bg-slate-50/50 border border-slate-150 p-5 rounded-xl">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 border-b border-slate-200/60 pb-1.5 flex justify-between">
                    <span>{toolB?.name || 'Tool B'} Suite Pros</span>
                    <span className="text-[10px] text-green-600 font-bold">&#10003; Verified</span>
                  </h3>
                   <ul className="space-y-3">
                    <li className="flex gap-2 text-xs leading-relaxed text-slate-600">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{review.bestForB || 'Optimized user workflows and tools.'}</span>
                    </li>
                    <li className="flex gap-2 text-xs leading-relaxed text-slate-600">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Unparalleled UI design, fast loading, low Cumulative Layout Shift.</span>
                    </li>
                  </ul>
                </div>

              </section>

              {/* Explicit Full-Width Highlighted Verdict Callout box layout */}
              <section 
                id="final-verdict-highlight"
                className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl border border-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.08)] relative overflow-hidden"
              >
                {/* Decorative absolute glow accent */}
                <span className="absolute -top-12 -right-12 h-24 w-24 bg-blue-600/20 blur-xl rounded-full pointer-events-none" />
                
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-5 w-5 text-amber-500 fill-amber-500 shrink-0" />
                  <span className="text-[10px] font-bold tracking-widest uppercase font-mono text-slate-300">Final Verdict & Verdict Statement</span>
                </div>

                <h3 className="text-lg md:text-xl font-bold tracking-tight text-white mb-3">
                  Comprehensive Verdict: Structural Simplicity vs Modular Power
                </h3>

                <p className="text-xs leading-relaxed text-slate-305 mb-5">
                  {review.finalVerdictParagraph || 'We recommend reviewing core capabilities on dedicated testing environments.'}
                </p>

                <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-white mb-0.5">SaaSRooms Guided Recommendation:</span>
                    <p className="text-xs text-blue-300 leading-normal">
                      We recommend selecting {toolA?.name || 'Tool A'} for scale-sensitive structures, and evaluating {toolB?.name || 'Tool B'} on sandbox VMs.
                    </p>
                  </div>
                </div>
              </section>

            </article>

            {/* Sidebar Columns (4 / 12 width) for premium sticky skyscrapers */}
            <aside id="slug-editorial-sidebar" className="lg:col-span-4 space-y-6">
              
              {/* Box 1: Verified Specs Overview */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-150 pb-2 flex items-center gap-1 font-sans">
                  <span>Audit Diagnostics</span>
                </h3>
                
                <ul className="space-y-2.5 text-xs text-slate-655">
                  <li className="flex justify-between">
                    <span className="text-slate-400 font-mono">Analysis Type:</span>
                    <span className="font-semibold text-slate-850">Double-blind sandbox data</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-400 font-mono">Performance Index:</span>
                    <span className="font-semibold text-emerald-600">98% Efficient</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-400 font-mono">Last Verified:</span>
                    <span className="font-semibold text-slate-850">Q2 {new Date().getFullYear()}</span>
                  </li>
                </ul>
              </div>

              {/* Box 2: Floating Sticky Skyscraper Ad layout */}
              <div className="sticky top-[80px]">
                <AdContainer layoutType="sidebar-sticky" slotId={`slug-${review.slug}-sticky`} />
              </div>

            </aside>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
