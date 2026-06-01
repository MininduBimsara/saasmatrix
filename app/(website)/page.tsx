"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdContainer } from "@/components/AdContainer";
import { Hero3DScene } from "@/components/Hero3DScene";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewCardSkeleton } from "@/components/Skeletons";
import { SectionHeading } from "@/components/SectionHeading";
import { CATEGORIES, Category, Review, Tool } from "@/lib/data";
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
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  accounting: Coins,
  "project-management": Layers,
  crm: Users,
  "hr-payroll": ClipboardList,
  communications: MessageSquare,
  "developer-tools": Cpu,
  marketing: Megaphone,
  design: Palette,
};

export default function Page() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeReviews, setActiveReviews] = useState<Review[]>([]);
  const [activeTools, setActiveTools] = useState<Tool[]>([]);
  const [selectedQuickReview, setSelectedQuickReview] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    import("@/lib/contentSource").then(async (src) => {
      const [reviews, tools] = await Promise.all([
        src.getPublishedReviews(),
        src.getPublishedTools(),
      ]);
      setActiveReviews(reviews);
      setActiveTools(tools);
      setIsLoading(false);
    });
  }, []);

  // Compute selected review and details
  const selectedReviewObj = useMemo(() => {
    if (!selectedQuickReview) return null;
    return activeReviews.find((r) => r.slug === selectedQuickReview) || null;
  }, [selectedQuickReview, activeReviews]);

  const resolvedToolA = useMemo(() => {
    if (!selectedReviewObj) return null;
    return activeTools.find((t) => t.slug === selectedReviewObj.toolA) || null;
  }, [selectedReviewObj, activeTools]);

  const resolvedToolB = useMemo(() => {
    if (!selectedReviewObj) return null;
    return activeTools.find((t) => t.slug === selectedReviewObj.toolB) || null;
  }, [selectedReviewObj, activeTools]);

  // Extract categories lists
  const filterCategories = useMemo(() => {
    return ["All", ...CATEGORIES.map((c) => c.name)];
  }, []);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return activeReviews.filter((review) => {
      const categoryObj = CATEGORIES.find((c) => c.slug === review.category);
      const categoryName = categoryObj ? categoryObj.name : "All";

      const matchesCategory =
        selectedCategory === "All" || categoryName === selectedCategory;
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
        <section className="relative bg-white pt-16 pb-16 lg:py-24 border-b border-slate-100 overflow-hidden text-center">
          {/* Subtle warm architectural backdrop circle */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50/20 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-12 w-[300px] h-[300px] bg-amber-50/30 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            {/* Premium & Free tags */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-500 px-4 py-1.5 rounded-full select-none">
                <Sparkles className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  SAAS COMPARISON REMADE
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-500 px-4 py-1.5 rounded-full select-none">
                <CheckCircle2 className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  100% FREE OF CHARGE
                </span>
              </div>
            </div>

            <div className="space-y-6 mb-10 w-full">
              <h1 className="text-4xl md:text-6xl lg:text-[72px] font-black text-slate-900 leading-[1.05] tracking-tight">
                Remaking the way <br />
                we compare{" "}
                <span className="text-rose-500 italic font-serif font-normal">
                  SaaS tools
                </span>
                .
              </h1>
              <p className="text-sm md:text-base leading-relaxed text-slate-500 max-w-2xl mx-auto font-medium">
                Analytical side-by-side matrices comparing accurate performance
                loads, licensing price traps, and legal GAAP compliance &mdash;
                audited objectively in our clean-room laboratory.
              </p>
            </div>

            {/* Airbnb-style Dynamic Search Form console card */}
            <div className="bg-white border border-slate-200/80 rounded-[28px] p-2 shadow-sm w-full max-w-2xl mx-auto relative z-20">
              <form
                onSubmit={handleQuickCompareGo}
                className="flex flex-col sm:flex-row items-center w-full gap-2"
              >
                {/* Dropdown to select matrix comparison */}
                <div className="w-full relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full text-left flex items-center justify-between text-sm font-semibold bg-white rounded-[20px] py-3.5 px-5 text-slate-800 transition-colors focus:outline-none cursor-pointer"
                  >
                    <span className="truncate text-slate-600 font-medium">
                      {selectedQuickReview
                        ? activeReviews.find(
                            (r) => r.slug === selectedQuickReview,
                          )?.title
                        : "Choose an active study..."}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <ul className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl max-h-64 overflow-y-auto py-2 text-left">
                        <li
                          onClick={() => {
                            setSelectedQuickReview("");
                            setIsDropdownOpen(false);
                          }}
                          className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-500"
                        >
                          Choose an active study...
                        </li>
                        {activeReviews.map((r) => {
                          const toolA = activeTools.find(
                            (t) => t.slug === r.toolA,
                          );
                          const toolB = activeTools.find(
                            (t) => t.slug === r.toolB,
                          );
                          return (
                            <li
                              key={r.slug}
                              onClick={() => {
                                setSelectedQuickReview(r.slug);
                                setIsDropdownOpen(false);
                              }}
                              className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors border-t border-slate-50 first:border-0"
                            >
                              <div className="flex items-center -space-x-2 shrink-0">
                                {toolA?.iconUrl ? (
                                  <img
                                    src={toolA.iconUrl}
                                    alt={toolA.name}
                                    className="h-6 w-6 rounded-full object-contain bg-white border border-slate-200 z-10"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="h-6 w-6 rounded-full bg-rose-500 text-white flex items-center justify-center font-mono text-[8px] font-black uppercase z-10 border border-slate-200">
                                    {toolA?.name
                                      ?.substring(0, 2)
                                      .toUpperCase() || "A"}
                                  </div>
                                )}
                                {toolB?.iconUrl ? (
                                  <img
                                    src={toolB.iconUrl}
                                    alt={toolB.name}
                                    className="h-6 w-6 rounded-full object-contain bg-white border border-slate-200 z-0"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="h-6 w-6 rounded-full bg-slate-700 text-white flex items-center justify-center font-mono text-[8px] font-black uppercase z-0 border border-slate-200">
                                    {toolB?.name
                                      ?.substring(0, 2)
                                      .toUpperCase() || "B"}
                                  </div>
                                )}
                              </div>
                              <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                                {r.title}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </div>

                {/* Direct query trigger */}
                <div className="w-full sm:w-auto shrink-0 pr-1">
                  <button
                    type="submit"
                    disabled={!selectedQuickReview}
                    style={{ minHeight: "44px" }}
                    className={`w-full sm:w-auto text-[11px] font-bold uppercase tracking-widest bg-slate-950 border border-transparent text-white px-8 rounded-full hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      !selectedQuickReview
                        ? "opacity-50 cursor-not-allowed bg-slate-800"
                        : ""
                    }`}
                  >
                    Compare
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-center gap-6 mt-4 pb-3 text-[11px] text-slate-600 font-medium">
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

            {/* Real-time Dynamic Comparison Preview */}
            {selectedReviewObj && resolvedToolA && resolvedToolB && (
              <div className="mt-8 p-5 border border-rose-100 bg-rose-50/20 rounded-[28px] animate-fade-in space-y-4 max-w-2xl w-full text-left relative z-10">
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-rose-500 tracking-wider">
                  <span>Live Sandbox Preview</span>
                  <span>{selectedReviewObj.readTimeMinutes} min study</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-11 items-center gap-3">
                  {/* Tool A */}
                  <div className="sm:col-span-5 bg-white p-4 rounded-2xl border border-slate-150 shadow-xs flex flex-col gap-1.5">
                    <div className="flex items-center gap-2.5">
                      {resolvedToolA.iconUrl ? (
                        <img
                          src={resolvedToolA.iconUrl}
                          alt={resolvedToolA.name}
                          className="h-8 w-8 rounded-full object-contain shrink-0 border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-mono text-[10px] font-black uppercase shrink-0">
                          {resolvedToolA.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {resolvedToolA.name}
                      </h4>
                    </div>
                    <span className="inline-block self-start text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {resolvedToolA.startingPrice}
                    </span>
                    <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                      {resolvedToolA.oneLineOpinion}
                    </p>
                  </div>

                  {/* VS Divider */}
                  <div className="sm:col-span-1 flex justify-center">
                    <span className="text-[11px] font-mono font-black text-rose-600 bg-rose-100 rounded-full h-7 w-7 flex items-center justify-center border border-rose-200">
                      VS
                    </span>
                  </div>

                  {/* Tool B */}
                  <div className="sm:col-span-5 bg-white p-4 rounded-2xl border border-slate-150 shadow-xs flex flex-col gap-1.5">
                    <div className="flex items-center gap-2.5">
                      {resolvedToolB.iconUrl ? (
                        <img
                          src={resolvedToolB.iconUrl}
                          alt={resolvedToolB.name}
                          className="h-8 w-8 rounded-full object-contain shrink-0 border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-mono text-[10px] font-black uppercase shrink-0">
                          {resolvedToolB.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {resolvedToolB.name}
                      </h4>
                    </div>
                    <span className="inline-block self-start text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {resolvedToolB.startingPrice}
                    </span>
                    <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                      {resolvedToolB.oneLineOpinion}
                    </p>
                  </div>
                </div>

                {/* Excerpt context and quick insights */}
                <div className="bg-white border border-slate-150 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed font-sans">
                  <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block mb-1 text-rose-500">
                    Comparative Focus:
                  </span>
                  {selectedReviewObj.excerpt}
                </div>
              </div>
            )}

            {/* Trust Row */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-slate-400 mt-16 sm:mt-20">
              <span>TRUSTED BY 2,400+ BUYERS</span>
              <span className="h-1 w-1 rounded-full bg-slate-300 hidden sm:block"></span>
              <span>{activeTools.length} AUDITED TOOLS</span>
              <span className="h-1 w-1 rounded-full bg-slate-300 hidden sm:block"></span>
              <span>0 SPONSORED PLACEMENTS</span>
            </div>
          </div>
        </section>

        {/* SPECIALITIES SECTION */}
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                Our Platform Specialities
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Created by a highly professional team of auditors, our platform
                provides powerful features designed to help you analyze and
                discover the perfect tools for your stack.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Compare Tools",
                  desc: "Side-by-side matrices of top SaaS products to evaluate performance and pricing.",
                  href: "/compare",
                  icon: <SlidersHorizontal className="h-6 w-6 text-rose-500" />,
                },
                {
                  title: "Detailed Reviews",
                  desc: "In-depth analysis from our expert auditing team, ensuring GAAP compliance.",
                  href: "/reviews",
                  icon: <ClipboardList className="h-6 w-6 text-emerald-500" />,
                },
                {
                  title: "ROI Calculator",
                  desc: "Compute costs and find savings with real-time scaling scenarios.",
                  href: "/calculator",
                  icon: <Coins className="h-6 w-6 text-blue-500" />,
                },
                {
                  title: "Auditor Blog",
                  desc: "Insights and actionable trends from the SaaS industry professionals.",
                  href: "/blog",
                  icon: <Megaphone className="h-6 w-6 text-amber-500" />,
                },
              ].map((spec) => (
                <Link
                  key={spec.title}
                  href={spec.href}
                  className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-rose-200 transition-all cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-rose-50 transition-all shadow-sm">
                    {spec.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {spec.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {spec.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: AIRBNB CATEGORIES STRIP BAR & DIRECTORY MATRIX EXPLORER */}
        <section
          id="directory"
          className="py-14 bg-[#FCFCFA] border-b border-slate-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
                Explore Evaluated Stacks
              </h2>
              <p className="text-sm text-slate-500">
                Choose a vertical below to instantly inspect verified
                comparisons. Each score tracks actual transaction speed, direct
                payment transparency, and team scaling multipliers.
              </p>
            </div>

            {/* AIRBNB-STYLE CATEGORIES HORIZONTAL NAVIGATION STRIP */}
            <div className="sticky top-20 bg-[#FCFCFA] z-20 py-4 border-b border-slate-200 mb-8 overflow-hidden select-none">
              <div className="flex items-center justify-between gap-6 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex items-center gap-8 md:gap-10">
                  {filterCategories.map((name) => {
                    const isSelected = selectedCategory === name;

                    // Match slug for icon identification
                    const categoryObj = CATEGORIES.find((c) => c.name === name);
                    const slug = categoryObj ? categoryObj.slug : "all";
                    const IconComponent =
                      slug === "all" ? Grid : CATEGORY_ICONS[slug] || Zap;

                    return (
                      <button
                        key={name}
                        onClick={() => setSelectedCategory(name)}
                        className={`flex flex-col items-center gap-2 pb-3.5 transition-all outline-none cursor-pointer border-b-2 ${
                          isSelected
                            ? "border-rose-500 text-rose-600 font-bold scale-102"
                            : "border-transparent text-slate-450 hover:text-slate-800 hover:border-slate-350"
                        }`}
                      >
                        <IconComponent
                          className={`h-6 w-6 transition-transform group-hover:scale-105 ${
                            isSelected ? "text-rose-500" : "text-slate-400"
                          }`}
                        />
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
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchTerm("");
                    }}
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
                Showing {filteredReviews.length} verified comparisons in{" "}
                <span className="text-rose-600 font-black">
                  [{selectedCategory.toUpperCase()}]
                </span>
              </div>

              {/* Dynamic search box */}
              <div className="relative w-full max-w-sm">
                <input
                  id="search-input-box"
                  type="text"
                  placeholder="Seach active evaluations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs font-semibold pl-10 pr-4 py-3 min-h-[44px] rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800 transition-all placeholder:text-slate-400"
                />
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </span>
              </div>
            </div>

            {/* AD CONTAINER AT TOP OF THE FOLD */}
            <div className="max-w-7xl mx-auto mb-8">
              <AdContainer
                layoutType="top-banner"
                slotId="homepage-leaderboard"
              />
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
                  <div
                    id="no-reviews-box"
                    className="text-center py-24 px-6 bg-white border border-slate-200/90 rounded-[28px] space-y-4"
                  >
                    <SlidersHorizontal className="h-10 w-10 text-slate-300 mx-auto animate-pulse" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
                      No matching studies found
                    </h3>
                    <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
                      We haven&apos;t indexed this exact SaaS pair in our lab
                      yet. Let us know what we should benchmark next!
                    </p>
                    <button
                      id="clear-all-params-btn"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("All");
                      }}
                      className="text-xs font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors inline-block pt-1 cursor-pointer"
                    >
                      Reset active search filters
                    </button>
                  </div>
                )}

                {/* Inline advertisement */}
                <div className="pt-2">
                  <AdContainer
                    layoutType="inline-content"
                    slotId="home-inline-middle"
                  />
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
                    Test different direct license tiers, compute team cost
                    metrics, or estimate stack overhead in real-time.
                  </p>

                  <div className="flex flex-col gap-2 pt-2">
                    <Link
                      id="sidebar-link-compare"
                      href="/compare"
                      className="flex items-center justify-between text-xs font-bold text-slate-850 bg-slate-50 hover:bg-slate-100 py-3.5 px-4 rounded-xl transition-all border border-slate-200 hover:border-slate-300"
                    >
                      <span>Custom Compare Generator</span>
                      <span className="text-rose-500 font-extrabold">
                        &rarr;
                      </span>
                    </Link>

                    <Link
                      id="sidebar-link-calculator"
                      href="/calculator"
                      className="flex items-center justify-between text-xs font-bold text-slate-850 bg-slate-50 hover:bg-slate-100 py-3.5 px-4 rounded-xl transition-all border border-slate-200 hover:border-slate-300"
                    >
                      <span>Compute SaaS ROI Core</span>
                      <span className="text-rose-500 font-extrabold">
                        &rarr;
                      </span>
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
                      <span className="font-medium text-slate-600">
                        Integrations Load Metrics
                      </span>
                      <strong className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                        45%
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-600">
                        Financial Transparency
                      </span>
                      <strong className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                        35%
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-600">
                        Scaling Value Ratios
                      </span>
                      <strong className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                        20%
                      </strong>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal pt-2 border-t border-slate-100">
                    Weights computed according to strict CPA enterprise
                    standards matching global index parameters.
                  </p>
                </div>

                {/* Sticky skyscraper ad card */}
                <div className="sticky top-[100px] pt-4">
                  <AdContainer
                    layoutType="sidebar-sticky"
                    slotId="home-sticky-skyscraper"
                  />
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* SECTION 3: PREMIUM INSIDER DISPATCH */}
        <section
          id="homepage-newsletter-pitch"
          className="py-20 bg-slate-900 text-white relative overflow-hidden"
        >
          {/* Neon warm blur background accent representing sunset hue */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-rose-500/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-full bg-slate-800 border border-slate-700 text-rose-400">
              <Award className="h-3.5 w-3.5" />
              SaaS Insider dispatch
            </span>

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Get weekly lab dispatch reports. <br />
              <span className="text-rose-400 italic font-sans">
                Zero sponsor bias.
              </span>
            </h2>

            <p className="text-xs text-slate-350 max-w-lg mx-auto leading-relaxed font-sans">
              Join 12,000+ stack auditors tracking real enterprise license
              modifications, pricing traps, and sandbox performance records
              directly.
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
