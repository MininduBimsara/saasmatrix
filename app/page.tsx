'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdContainer } from '@/components/AdContainer';
import { ReviewCard } from '@/components/ReviewCard';
import { ReviewCardSkeleton } from '@/components/Skeletons';
import { SectionHeading } from '@/components/SectionHeading';
import { CATEGORIES, Category, Review, Tool } from '@/lib/data';
import { 
  Coins, 
  Layers, 
  Users, 
  ClipboardList, 
  MessageSquare, 
  Cpu, 
  Megaphone, 
  Palette, 
  Search, 
  Sliders, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Grid, 
  Award,
  Zap,
  Check,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'accounting': Coins,
  'project-management': Layers,
  'crm': Users,
  'hr-payroll': ClipboardList,
  'communications': MessageSquare,
  'developer-tools': Cpu,
  'marketing': Megaphone,
  'design': Palette
};

export default function Page() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeReviews, setActiveReviews] = useState<Review[]>([]);
  const [activeTools, setActiveTools] = useState<Tool[]>([]);
  const [selectedQuickReview, setSelectedQuickReview] = useState<string>('');

  useEffect(() => {
    import('@/lib/clientDb').then((db) => {
      setActiveReviews(db.getMergedReviews());
      setActiveTools(db.getMergedTools());
      setIsLoading(false);
    });
  }, []);

  // Compute selected review and details
  const selectedReviewObj = useMemo(() => {
    if (!selectedQuickReview) return null;
    return activeReviews.find(r => r.slug === selectedQuickReview) || null;
  }, [selectedQuickReview, activeReviews]);

  const resolvedToolA = useMemo(() => {
    if (!selectedReviewObj) return null;
    return activeTools.find(t => t.slug === selectedReviewObj.toolA) || null;
  }, [selectedReviewObj, activeTools]);

  const resolvedToolB = useMemo(() => {
    if (!selectedReviewObj) return null;
    return activeTools.find(t => t.slug === selectedReviewObj.toolB) || null;
  }, [selectedReviewObj, activeTools]);

  // Extract categories lists
  const filterCategories = useMemo(() => {
    return ['All', ...CATEGORIES.map(c => c.name)];
  }, []);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return activeReviews.filter(review => {
      const categoryObj = CATEGORIES.find(c => c.slug === review.category);
      const categoryName = categoryObj ? categoryObj.name : 'All';
      
      const matchesCategory = selectedCategory === 'All' || categoryName === selectedCategory;
      const matchesSearch = 
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        review.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.category.toLowerCase().includes(searchTerm.toLowerCase());
        
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, activeReviews]);

  // Handle routing on quick search trigger
  const handleQuickCompareGo = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedQuickReview) {
      router.push(`/reviews/${selectedQuickReview}`);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-slate-800 transition-colors duration-300 font-sans selection:bg-rose-100">
      <Header />

      <main id="homepage-root" className="flex flex-col">
        
        {/* SECTION 1: CATCHING, HERO INTERACTIVE EXPEDITION PANEL */}
        <section className="relative bg-white pt-10 pb-16 lg:py-24 border-b border-slate-100 overflow-hidden">
          {/* Subtle warm architectural backdrop circle */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50/20 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-12 w-[300px] h-[300px] bg-amber-50/30 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Side: Copywriting & High-Converting Search Console */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Premium tag */}
                <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100/60 text-rose-600 px-4 py-1.5 rounded-full select-none">
                  <Sparkles className="h-3.5 w-3.5 text-rose-500 animate-spin" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">
                    SaaS comparison remade &bull; Complete Integrity
                  </span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.08] tracking-tight">
                    Remaking the way <br />
                    we compare <span className="text-rose-500 select-all selection:bg-rose-100 italic font-sans font-semibold">SaaS tools</span>.
                  </h1>
                  <p className="text-sm md:text-base leading-relaxed text-slate-500 max-w-xl">
                    Analytical side-by-side matrices comparing accurate performance loads, licensing price traps, and legal GAAP compliance. Simple indices audited objectively in our clean-room laboratory.
                  </p>
                </div>

                {/* Airbnb-style Dynamic Search Form console card */}
                <div className="bg-white border border-slate-200/90 rounded-[32px] p-6 shadow-lg md:max-w-xl w-full">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Sliders className="h-3 w-3 text-rose-500" />
                    Interactive Lab Comparator
                  </h3>
                  
                  <form onSubmit={handleQuickCompareGo} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      
                      {/* Dropdown to select matrix comparison */}
                      <div className="md:col-span-8">
                        <label htmlFor="quick-matrix-sel" className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                          Select Audited Matrix
                        </label>
                        <select
                          id="quick-matrix-sel"
                          value={selectedQuickReview}
                          onChange={(e) => setSelectedQuickReview(e.target.value)}
                          className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl py-3 px-4 text-slate-800 transition-colors focus:ring-2 focus:ring-rose-500/20 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="">Choose an active study...</option>
                          {activeReviews.map((r) => (
                            <option key={r.slug} value={r.slug}>
                              {r.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Direct query trigger */}
                      <div className="md:col-span-4 flex items-end">
                        <button
                          type="submit"
                          disabled={!selectedQuickReview}
                          style={{ minHeight: '44px' }}
                          className={`w-full text-xs font-bold uppercase tracking-wider bg-slate-900 border border-transparent text-white px-5 rounded-2xl hover:bg-rose-600 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                            !selectedQuickReview ? 'opacity-50 cursor-not-allowed bg-slate-400' : ''
                          }`}
                        >
                          Compare
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>

                    </div>
                  </form>

                  {/* Real-time Dynamic Comparison Preview */}
                  {selectedReviewObj && resolvedToolA && resolvedToolB && (
                    <div className="mt-5 p-4 border border-rose-100 bg-rose-50/20 rounded-2xl animate-fade-in space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase text-rose-500 tracking-wider">
                        <span>Live Sandbox Preview</span>
                        <span>{selectedReviewObj.readTimeMinutes} min study</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-11 items-center gap-3">
                        {/* Tool A */}
                        <div className="sm:col-span-5 bg-white p-3 rounded-xl border border-slate-150 shadow-xs flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {resolvedToolA.iconUrl ? (
                              <img
                                src={resolvedToolA.iconUrl}
                                alt={resolvedToolA.name}
                                className="h-6 w-6 rounded-full object-contain shrink-0 border border-slate-200"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-rose-500 text-white flex items-center justify-center font-mono text-[9px] font-black uppercase shrink-0">
                                {resolvedToolA.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <h4 className="text-xs font-bold text-slate-900 truncate">{resolvedToolA.name}</h4>
                          </div>
                          <span className="inline-block self-start text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {resolvedToolA.startingPrice}
                          </span>
                          <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                            {resolvedToolA.oneLineOpinion}
                          </p>
                        </div>

                        {/* VS Divider */}
                        <div className="sm:col-span-1 flex justify-center">
                          <span className="text-[10px] font-mono font-black text-rose-600 bg-rose-100 rounded-full h-5 w-5 flex items-center justify-center border border-rose-200">
                            VS
                          </span>
                        </div>

                        {/* Tool B */}
                        <div className="sm:col-span-5 bg-white p-3 rounded-xl border border-slate-150 shadow-xs flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {resolvedToolB.iconUrl ? (
                              <img
                                src={resolvedToolB.iconUrl}
                                alt={resolvedToolB.name}
                                className="h-6 w-6 rounded-full object-contain shrink-0 border border-slate-200"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-slate-700 text-white flex items-center justify-center font-mono text-[9px] font-black uppercase shrink-0">
                                {resolvedToolB.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <h4 className="text-xs font-bold text-slate-900 truncate">{resolvedToolB.name}</h4>
                          </div>
                          <span className="inline-block self-start text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {resolvedToolB.startingPrice}
                          </span>
                          <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                            {resolvedToolB.oneLineOpinion}
                          </p>
                        </div>
                      </div>

                      {/* Excerpt context and quick insights */}
                      <div className="bg-white border border-slate-150 rounded-xl p-3 text-[11px] text-slate-600 leading-relaxed font-sans">
                        <span className="font-bold text-slate-900 uppercase text-[9px] tracking-wider block mb-0.5 text-rose-500">
                          Comparative Focus:
                        </span>
                        {selectedReviewObj.excerpt}

                        <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px]">
                          <div>
                            <span className="font-bold text-slate-800 block">Best for {resolvedToolA.name}:</span>
                            <p className="text-slate-500 italic line-clamp-2 leading-snug font-sans">{selectedReviewObj.bestForA}</p>
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">Best for {resolvedToolB.name}:</span>
                            <p className="text-slate-500 italic line-clamp-2 leading-snug font-sans">{selectedReviewObj.bestForB}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-450 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[3]" />
                      No referral loops
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[3]" />
                      GAAP Audited
                    </span>
                  </div>
                </div>

              </div>

              {/* Right Side: STUNNING, UNIQUE NANO BANANA ACCELERATOR INTEGRATED SVG ARTWORK */}
              <div className="lg:col-span-5 flex justify-center items-center">
                <div className="relative w-full max-w-[420px] aspect-square rounded-[40px] bg-rose-50/10 border border-slate-150 p-8 shadow-xs flex items-center justify-center group overflow-hidden">
                  
                  {/* Subtle vector grid */}
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-60" />
                  
                  {/* Floating particle animations */}
                  <div className="absolute top-10 left-10 h-3 w-3 bg-rose-400 rounded-full animate-bounce" />
                  <div className="absolute bottom-16 right-12 h-2.5 w-2.5 bg-yellow-400 rounded-full animate-ping" />
                  
                  {/* Highly refined responsive dynamic yellow curved geometric vector (Our beautiful custom Nano Banana Concept graphic) */}
                  <svg className="relative w-full h-full text-amber-400 filter drop-shadow-xl select-none" viewBox="0 0 400 400" fill="none">
                    
                    {/* Background glowing rings */}
                    <circle cx="200" cy="200" r="140" stroke="#f3f4f6" strokeWidth="2" strokeDasharray="5 5" />
                    <circle cx="200" cy="200" r="100" stroke="#fee2e2" strokeWidth="1.5" />
                    
                    {/* The Nano Banana Curve Core */}
                    <path 
                      d="M 120,290 C 130,240 220,110 300,105 C 290,135 220,225 150,305 C 135,305 125,300 120,290 Z" 
                      fill="url(#bananaGradient)" 
                      className="transition-transform duration-500 hover:scale-105"
                    />
                    
                    {/* Shadow underneath core for 3D realism */}
                    <path 
                      d="M 120,300 C 140,295 190,290 230,305" 
                      stroke="#fbbf24" 
                      strokeWidth="6" 
                      strokeLinecap="round" 
                      opacity="0.2" 
                    />
                    
                    {/* Futuristic circuitry nodes connecting outward from the nano banana */}
                    <path d="M 270,115 L 340,95" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
                    <path d="M 170,245 L 90,200" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="230" y1="165" x2="280" y2="230" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2" />
                    
                    {/* Connected bubble items representing Jira, Asana, Hubspot */}
                    <circle cx="340" cy="95" r="15" fill="#0052cc" />
                    <text x="340" y="99" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">JI</text>
                    
                    <circle cx="90" cy="200" r="15" fill="#f06a6c" />
                    <text x="90" y="204" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">AS</text>

                    <circle cx="280" cy="230" r="15" fill="#ff7a59" />
                    <text x="280" y="234" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">HS</text>

                    {/* Glowing Core center indicator representing calibration telemetry */}
                    <circle cx="204" cy="180" r="7" fill="#fb7185" className="animate-ping" />
                    <circle cx="204" cy="180" r="4" fill="#e11d48" />

                    {/* Vector Gradients */}
                    <defs>
                      <linearGradient id="bananaGradient" x1="120" y1="290" x2="300" y2="105" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#fef08a" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Absolute badged telemetry overlay representing professional design craftsmanship */}
                  <div className="absolute bottom-6 left-6 bg-white border border-slate-205 rounded-2xl p-3 shadow-md flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-rose-500" />
                    <div>
                      <div className="text-[9px] font-black uppercase text-slate-400">BENCHMARK LAB</div>
                      <div className="text-[11px] font-bold text-slate-900 leading-none">NANO CALIBRATED</div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Monochrome Brand Streamer / Clients Ribbon below the fold */}
            <div className="mt-16 pt-10 border-t border-slate-100/80 text-center space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                Audited systems and partner integrations
              </span>
              <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 opacity-50 select-none saturate-0 cursor-none">
                <span className="font-extrabold text-sm text-slate-950 uppercase tracking-tight">KPMG SYNC</span>
                <span className="font-black text-sm text-slate-950 uppercase tracking-widest">deloitte</span>
                <span className="font-sans italic font-extrabold text-sm text-slate-950 uppercase">Saudi Cement</span>
                <span className="font-mono font-bold text-[11px] tracking-wider text-slate-950 uppercase">Efficiency Cent</span>
                <span className="font-sans italic text-sm text-slate-950">Yazdan</span>
                <span className="font-mono text-xs tracking-widest text-slate-950 uppercase">BurgerFi</span>
                <span className="font-extrabold text-sm tracking-widest text-slate-950">SHACE</span>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: AIRBNB CATEGORIES STRIP BAR & DIRECTORY MATRIX EXPLORER */}
        <section id="directory" className="py-14 bg-[#FCFCFA] border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
                Explore Evaluated Stacks
              </h2>
              <p className="text-sm text-slate-500">
                Choose a vertical below to instantly inspect verified comparisons. Each score tracks actual transaction speed, direct payment transparency, and team scaling multipliers.
              </p>
            </div>

            {/* AIRBNB-STYLE CATEGORIES HORIZONTAL NAVIGATION STRIP */}
            <div className="sticky top-20 bg-[#FCFCFA] z-20 py-4 border-b border-slate-200 mb-8 overflow-hidden select-none">
              <div className="flex items-center justify-between gap-6 overflow-x-auto scrollbar-none pb-2">
                <div className="flex items-center gap-8 md:gap-10">
                  {filterCategories.map((name) => {
                    const isSelected = selectedCategory === name;
                    
                    // Match slug for icon identification
                    const categoryObj = CATEGORIES.find(c => c.name === name);
                    const slug = categoryObj ? categoryObj.slug : 'all';
                    const IconComponent = slug === 'all' ? Grid : (CATEGORY_ICONS[slug] || Zap);

                    return (
                      <button
                        key={name}
                        onClick={() => setSelectedCategory(name)}
                        className={`flex flex-col items-center gap-2 pb-3.5 transition-all outline-none cursor-pointer border-b-2 ${
                          isSelected 
                            ? 'border-rose-500 text-rose-600 font-bold scale-102' 
                            : 'border-transparent text-slate-450 hover:text-slate-800 hover:border-slate-350'
                        }`}
                      >
                        <IconComponent className={`h-6 w-6 transition-transform group-hover:scale-105 ${
                          isSelected ? 'text-rose-500' : 'text-slate-400'
                        }`} />
                        <span className="text-[11px] font-medium tracking-tight whitespace-nowrap">
                          {name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Vertical slider controls button */}
                <div className="hidden lg:flex items-center gap-2 border-l border-slate-200 pl-4">
                  <button 
                    onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }}
                    className="flex items-center gap-1.5 bg-white border border-slate-205 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 hover:shadow-xs transition-shadow cursor-pointer"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-rose-500" />
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE DYNAMIC SEARCH & MATRIX COUNTER */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Showing {filteredReviews.length} verified comparisons in{' '}
                <span className="text-rose-600 font-black">[{selectedCategory.toUpperCase()}]</span>
              </div>

              {/* Dynamic search box */}
              <div className="relative w-full max-w-sm">
                <input
                  id="search-input-box"
                  type="text"
                  placeholder="Seach active evaluations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs font-semibold pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800 transition-all placeholder:text-slate-400"
                />
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </span>
              </div>
            </div>

            {/* AD CONTAINER AT TOP OF THE FOLD */}
            <div className="max-w-7xl mx-auto mb-8">
              <AdContainer layoutType="top-banner" slotId="homepage-leaderboard" />
            </div>

            {/* DIRECTORY CARDS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Reviews Grid */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ReviewCardSkeleton variant="default" />
                    <ReviewCardSkeleton variant="default" />
                  </div>
                ) : filteredReviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {filteredReviews.map((review) => {
                      return (
                        <div key={review.slug} className="h-full">
                          <ReviewCard review={review} theme="bento" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div id="no-reviews-box" className="text-center py-24 px-6 bg-white border border-slate-200/90 rounded-[28px] space-y-4">
                    <SlidersHorizontal className="h-10 w-10 text-slate-300 mx-auto animate-pulse" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">No matching studies found</h3>
                    <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
                      We haven&apos;t indexed this exact SaaS pair in our lab yet. Let us know what we should benchmark next!
                    </p>
                    <button
                      id="clear-all-params-btn"
                      onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                      className="text-xs font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors inline-block pt-1 cursor-pointer"
                    >
                      Reset active search filters
                    </button>
                  </div>
                )}

                {/* Inline advertisement */}
                <div className="pt-2">
                  <AdContainer layoutType="inline-content" slotId="home-inline-middle" />
                </div>
              </div>

              {/* Sidebar Information Cards */}
              <aside className="lg:col-span-4 space-y-6">
                
                {/* Clean, high-converting interactive tools card */}
                <div className="bg-white border border-slate-200/90 p-6 rounded-[28px] space-y-4 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-500 block">
                    Interactive Tools
                  </span>
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">
                    SaaS evaluation calculators
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Test different direct license tiers, compute team cost metrics, or estimate stack overhead in real-time.
                  </p>
                  
                  <div className="flex flex-col gap-2 pt-2">
                    <Link
                      id="sidebar-link-compare"
                      href="/compare"
                      className="flex items-center justify-between text-xs font-bold text-slate-850 bg-slate-50 hover:bg-slate-100 py-3.5 px-4 rounded-xl transition-all border border-slate-200 hover:border-slate-300"
                    >
                      <span>Custom Compare Generator</span>
                      <span className="text-rose-500 font-extrabold">&rarr;</span>
                    </Link>
                    
                    <Link
                      id="sidebar-link-calculator"
                      href="/calculator"
                      className="flex items-center justify-between text-xs font-bold text-slate-850 bg-slate-50 hover:bg-slate-100 py-3.5 px-4 rounded-xl transition-all border border-slate-200 hover:border-slate-300"
                    >
                      <span>Compute SaaS ROI Core</span>
                      <span className="text-rose-500 font-extrabold">&rarr;</span>
                    </Link>
                  </div>
                </div>

                {/* Lab Audit parameters breakdown */}
                <div className="bg-white border border-slate-200/90 p-6 rounded-[28px] space-y-4 shadow-sm font-sans">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 pb-2 border-b border-slate-100">
                    Evaluation Weights
                  </h4>
                  <div className="space-y-3.5 text-xs text-slate-500">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-600">Integrations Load Metrics</span>
                      <strong className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded-md">45%</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-600">Financial Transparency</span>
                      <strong className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded-md">35%</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-600">Scaling Value Ratios</span>
                      <strong className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded-md">20%</strong>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal pt-2 border-t border-slate-100">
                    Weights computed according to strict CPA enterprise standards matching global index parameters.
                  </p>
                </div>

                {/* Sticky skyscraper ad card */}
                <div className="sticky top-[100px] pt-4">
                  <AdContainer layoutType="sidebar-sticky" slotId="home-sticky-skyscraper" />
                </div>

              </aside>

            </div>

          </div>
        </section>

        {/* SECTION 3: PREMIUM INSIDER DISPATCH */}
        <section id="homepage-newsletter-pitch" className="py-20 bg-slate-900 text-white relative overflow-hidden">
          {/* Neon warm blur background accent representing sunset hue */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-rose-500/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-full bg-slate-800 border border-slate-700 text-rose-400">
              <Award className="h-3.5 w-3.5" />
              SaaS Insider dispatch
            </span>
            
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Get weekly lab dispatch reports. <br />
              <span className="text-rose-400 italic font-sans">Zero sponsor bias.</span>
            </h2>
            
            <p className="text-xs text-slate-350 max-w-lg mx-auto leading-relaxed font-sans">
              Join 12,000+ stack auditors tracking real enterprise license modifications, pricing traps, and sandbox performance records directly.
            </p>

            <div className="pt-4">
              <Link
                id="cta-insider-dispatch-link"
                href="/newsletter"
                className="inline-flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-102 cursor-pointer"
              >
                Join the Dispatch Ledger &rarr;
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
