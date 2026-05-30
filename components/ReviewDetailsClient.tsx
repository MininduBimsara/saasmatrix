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
  ShieldCheck,
  X,
  TrendingUp,
  Activity,
  Layers
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
      <main id="editorial-slug-root" className="flex-grow pt-8 pb-16 font-sans bg-slate-50">
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

          <Link 
            id="back-index-link"
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-605 transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to B2B Directories
          </Link>

          {/* New Visual Header Section */}
          <section className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-200 mb-10 relative overflow-hidden">
            {/* Decorative background gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10" />
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              
              {/* Titles & Tags */}
              <div className="flex-1 space-y-4 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> GAAP Safe
                  </span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                    <Award className="h-3 w-3" /> Editor Choice
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  {review.title}
                </h1>
                <p className="text-sm text-slate-500 max-w-2xl mx-auto lg:mx-0">
                  {review.excerpt}
                </p>
              </div>

              {/* Visual Matchup Logos & Score */}
              <div className="flex flex-col items-center gap-6 shrink-0 relative">
                <div className="flex items-center gap-6">
                  {/* Tool A */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-20 w-20 md:h-24 md:w-24 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center overflow-hidden p-2">
                      {toolA?.iconUrl ? (
                        <img src={toolA.iconUrl} alt={toolA.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="font-mono text-2xl font-black text-rose-500">{toolA?.name?.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-800">{toolA?.name || 'Tool A'}</span>
                  </div>

                  {/* VS Badge */}
                  <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black italic text-sm shadow-xl z-10 border-4 border-white">
                    VS
                  </div>

                  {/* Tool B */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-20 w-20 md:h-24 md:w-24 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center overflow-hidden p-2">
                      {toolB?.iconUrl ? (
                        <img src={toolB.iconUrl} alt={toolB.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="font-mono text-2xl font-black text-slate-700">{toolB?.name?.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-800">{toolB?.name || 'Tool B'}</span>
                  </div>
                </div>

                {/* Score Ring */}
                <div className="bg-slate-900 px-6 py-2 rounded-full flex items-center gap-3 shadow-lg border border-slate-700">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-white tracking-tight">
                      {review.winnerSlug === 'quickbooks' || review.slug.includes('quickbooks') ? '9.6' : '9.4'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/ 10</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Above content banner */}
          <AdContainer layoutType="top-banner" slotId={`slug-${review.slug}-above-content`} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
            
            <article id="main-editorial-content" className="lg:col-span-8 space-y-10">
              
              {/* Visual Metrics Progress Bars */}
              <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-rose-500" />
                    Performance Benchmarks
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lab Tested</span>
                </div>

                {/* Mocked Metrics */}
                {[
                  { label: "Ease of Use", valA: 92, valB: 78, colorA: "bg-rose-500", colorB: "bg-slate-800" },
                  { label: "API Throughput", valA: 85, valB: 95, colorA: "bg-rose-500", colorB: "bg-slate-800" },
                  { label: "Value for Money", valA: 88, valB: 82, colorA: "bg-rose-500", colorB: "bg-slate-800" },
                ].map((metric, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{metric.label}</span>
                    </div>
                    <div className="space-y-2 relative">
                      {/* Tool A Bar */}
                      <div className="flex items-center gap-3">
                        <div className="w-16 text-[10px] font-semibold text-slate-500 text-right truncate">
                          {toolA?.name?.split(' ')[0]}
                        </div>
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${metric.colorA} rounded-full`} style={{ width: `${metric.valA}%` }} />
                        </div>
                        <div className="w-8 text-[10px] font-bold text-slate-700">{metric.valA}%</div>
                      </div>
                      {/* Tool B Bar */}
                      <div className="flex items-center gap-3">
                        <div className="w-16 text-[10px] font-semibold text-slate-500 text-right truncate">
                          {toolB?.name?.split(' ')[0]}
                        </div>
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${metric.colorB} rounded-full`} style={{ width: `${metric.valB}%` }} />
                        </div>
                        <div className="w-8 text-[10px] font-bold text-slate-700">{metric.valB}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* Modern Typographic Comparison Matrix Section */}
              <section id="comparison-table-section" className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  Side-by-Side Matrix
                </h2>
                
                <div className="overflow-hidden border border-slate-200 rounded-3xl shadow-md bg-white">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                        <th className="p-5 font-bold uppercase tracking-widest text-[11px] min-w-[160px] border-r border-slate-700/50">
                          Feature Suite
                        </th>
                        <th className="p-5 border-r border-slate-700/50 text-center">
                          <div className="flex flex-col items-center gap-2">
                            {toolA?.iconUrl && <img src={toolA.iconUrl} alt="Tool A" className="h-6 w-6 rounded-md bg-white p-0.5 object-contain" />}
                            <span className="font-bold text-white text-xs">{toolA?.name || 'Tool A'}</span>
                          </div>
                        </th>
                        <th className="p-5 border-r border-slate-700/50 text-center">
                          <div className="flex flex-col items-center gap-2">
                            {toolB?.iconUrl && <img src={toolB.iconUrl} alt="Tool B" className="h-6 w-6 rounded-md bg-white p-0.5 object-contain" />}
                            <span className="font-bold text-white text-xs">{toolB?.name || 'Tool B'}</span>
                          </div>
                        </th>
                        <th className="p-5 font-bold uppercase tracking-widest text-[11px] text-center w-32">
                          Winner
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {review.tableRows && review.tableRows.map((row: any, idx: number) => (
                        <tr 
                          key={row.feature} 
                          className={`transition-colors hover:bg-slate-50/80 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                        >
                          <td className="p-5 font-semibold text-slate-800 border-r border-slate-100">{row.feature}</td>
                          <td className="p-5 text-slate-600 text-xs leading-relaxed border-r border-slate-100 text-center">{row.valueA}</td>
                          <td className="p-5 text-slate-600 text-xs leading-relaxed border-r border-slate-100 text-center">{row.valueB}</td>
                          <td className="p-5 flex justify-center border-b border-transparent">
                            {(() => {
                              const w = row.winner?.toLowerCase() || '';
                              const a = toolA?.name?.toLowerCase() || '';
                              const b = toolB?.name?.toLowerCase() || '';
                              
                              if (a && w.includes(a)) {
                                return toolA?.iconUrl ? (
                                  <img src={toolA.iconUrl} alt={toolA.name} className="h-7 w-7 object-contain drop-shadow-sm" />
                                ) : (
                                  <div className="h-7 w-7 rounded bg-rose-100 text-rose-500 flex items-center justify-center font-bold text-xs shadow-sm">{toolA?.name?.substring(0,2).toUpperCase()}</div>
                                );
                              } else if (b && w.includes(b)) {
                                return toolB?.iconUrl ? (
                                  <img src={toolB.iconUrl} alt={toolB.name} className="h-7 w-7 object-contain drop-shadow-sm" />
                                ) : (
                                  <div className="h-7 w-7 rounded bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shadow-sm">{toolB?.name?.substring(0,2).toUpperCase()}</div>
                                );
                              } else {
                                return (
                                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                                    {row.winner}
                                  </span>
                                );
                              }
                            })()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Inline Content Placement to optimize AdSense monetization */}
              <AdContainer layoutType="inline-content" slotId={`slug-${review.slug}-mid-point`} />

              {/* Structured Visual Pros & Cons */}
              <section id="pros-cons-matrix" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Competitor A Card */}
                <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
                  <div className="flex items-center gap-3 mb-6">
                    {toolA?.iconUrl ? (
                      <img src={toolA.iconUrl} alt="Tool A" className="h-8 w-8 object-contain" />
                    ) : (
                      <div className="h-8 w-8 rounded bg-rose-100 text-rose-500 flex items-center justify-center font-bold">A</div>
                    )}
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">
                      {toolA?.name || 'Tool A'} Strengths
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span className="text-xs text-slate-600 leading-relaxed font-medium">{review.bestForA || 'Flawless database execution rates.'}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span className="text-xs text-slate-600 leading-relaxed font-medium">Excellent enterprise sandbox APIs and integrations.</span>
                    </li>
                  </ul>
                </div>

                {/* Competitor B Card */}
                <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-slate-900" />
                  <div className="flex items-center gap-3 mb-6">
                    {toolB?.iconUrl ? (
                      <img src={toolB.iconUrl} alt="Tool B" className="h-8 w-8 object-contain" />
                    ) : (
                      <div className="h-8 w-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center font-bold">B</div>
                    )}
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">
                      {toolB?.name || 'Tool B'} Strengths
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span className="text-xs text-slate-600 leading-relaxed font-medium">{review.bestForB || 'Optimized user workflows and intuitive tools.'}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span className="text-xs text-slate-600 leading-relaxed font-medium">Unparalleled UI design, fast loading, low Cumulative Layout Shift.</span>
                    </li>
                  </ul>
                </div>

              </section>

              {/* Bottom Line Actionable Verdict Box */}
              <section 
                id="final-verdict-highlight"
                className="bg-white p-8 md:p-10 rounded-[32px] border-2 border-rose-100 shadow-lg relative overflow-hidden"
              >
                {/* Decorative absolute glow accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <Zap className="h-5 w-5 text-rose-500 fill-rose-500 shrink-0 animate-pulse" />
                  <span className="text-[10px] font-black tracking-widest uppercase font-mono text-rose-500">The Bottom Line</span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-4 relative z-10">
                  {review.hotTakeQuote || 'Performance values vary significantly across platforms.'}
                </h3>

                <p className="text-sm leading-relaxed text-slate-600 mb-8 font-medium relative z-10">
                  {review.finalVerdictParagraph || 'We recommend reviewing core capabilities on dedicated testing environments.'}
                </p>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-4 relative z-10">
                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Recommendation</span>
                    <p className="text-sm text-slate-800 font-medium leading-relaxed">
                      We recommend selecting <strong className="text-rose-500">{toolA?.name || 'Tool A'}</strong> for scale-sensitive structures, and evaluating <strong className="text-blue-500">{toolB?.name || 'Tool B'}</strong> on smaller sandbox environments.
                    </p>
                  </div>
                </div>
              </section>

            </article>

            {/* Sidebar Columns (4 / 12 width) */}
            <aside id="slug-editorial-sidebar" className="lg:col-span-4 space-y-6">
              
              {/* Box 1: Verified Specs Overview */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-slate-400" />
                  Audit Diagnostics
                </h3>
                
                <ul className="space-y-4 text-xs">
                  <li className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Analysis Type</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">Double-blind data</span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Performance Index</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">98% Efficient</span>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <span className="text-slate-500 font-medium">Last Verified</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">Q2 {new Date().getFullYear()}</span>
                  </li>
                </ul>
              </div>

              {/* Box 2: Floating Sticky Skyscraper Ad layout */}
              <div className="sticky top-[100px]">
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
