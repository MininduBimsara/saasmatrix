"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdContainer } from "@/components/AdContainer";
import { SectionHeading } from "@/components/SectionHeading";
import { CompareGridSkeleton } from "@/components/Skeletons";
import { TOOLS, REVIEWS, CATEGORIES, Tool, Review } from "@/lib/data";
import {
  Sparkles,
  ArrowRight,
  ArrowLeftRight,
  Check,
  Bell,
  Filter,
} from "lucide-react";

export default function ComparePage() {
  const initialCategory = TOOLS[0]?.category ?? "";
  const initialTools = initialCategory
    ? TOOLS.filter((t) => t.category === initialCategory)
    : [];

  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);
  const [slugA, setSlugA] = useState<string>(initialTools[0]?.slug ?? "");
  const [slugB, setSlugB] = useState<string>(initialTools[1]?.slug ?? "");

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tools, setTools] = useState<Tool[]>(TOOLS);
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);

  useEffect(() => {
    import("@/lib/contentSource").then(async (src) => {
      const [publishedTools, publishedReviews] = await Promise.all([
        src.getPublishedTools(),
        src.getPublishedReviews(),
      ]);
      setTools(publishedTools);
      setReviews(publishedReviews);
      setIsLoading(false);
    });
  }, []);

  const availableCategories = useMemo(() => {
    return CATEGORIES.filter(
      (c) => tools.filter((t) => t.category === c.slug).length >= 2,
    );
  }, [tools]);

  const filteredTools = useMemo(() => {
    return tools.filter((t) => t.category === selectedCategory);
  }, [selectedCategory, tools]);

  // Lookup full tool entities
  const toolA = useMemo(() => {
    return tools.find((t) => t.slug === slugA) || tools[0] || null;
  }, [slugA, tools]);

  const toolB = useMemo(() => {
    return tools.find((t) => t.slug === slugB) || tools[1] || null;
  }, [slugB, tools]);

  const toolAName = toolA?.name ?? "Tool A";
  const toolBName = toolB?.name ?? "Tool B";
  const toolACategory = toolA?.category ?? selectedCategory;
  const toolBCategory = toolB?.category ?? selectedCategory;
  const toolAStartingPrice = toolA?.startingPrice ?? "N/A";
  const toolBStartingPrice = toolB?.startingPrice ?? "N/A";
  const toolANumericPrice = toolA?.numericPrice ?? Number.POSITIVE_INFINITY;
  const toolBNumericPrice = toolB?.numericPrice ?? Number.POSITIVE_INFINITY;
  const toolAPricingModel = toolA?.pricingModel ?? null;
  const toolBPricingModel = toolB?.pricingModel ?? null;
  const toolATierName = toolA?.tierName ?? null;
  const toolBTierName = toolB?.tierName ?? null;
  const toolAFreeTrial = toolA?.freeTrial ?? null;
  const toolBFreeTrial = toolB?.freeTrial ?? null;
  const toolAFreeForever = toolA?.freeForever ?? null;
  const toolBFreeForever = toolB?.freeForever ?? null;
  const toolAAiIncluded = toolA?.aiIncluded ?? null;
  const toolBAiIncluded = toolB?.aiIncluded ?? null;
  const toolAAiCost = toolA?.aiCost ?? null;
  const toolBAiCost = toolB?.aiCost ?? null;
  const toolAKeyFeatures = toolA?.keyFeatures ?? [];
  const toolBKeyFeatures = toolB?.keyFeatures ?? [];
  const toolALimitations = toolA?.limitations ?? [];
  const toolBLimitations = toolB?.limitations ?? [];

  // Check if published review exists for this pairing
  const existingReview = useMemo(() => {
    return reviews.find(
      (r) =>
        (r.toolA === slugA && r.toolB === slugB) ||
        (r.toolA === slugB && r.toolB === slugA),
    );
  }, [slugA, slugB, reviews]);

  // Handle mock subscription logic for publishing notifications
  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmailInput("");
    }, 2000);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value;
    setSelectedCategory(newCat);
    setIsLoading(true);
    const newTools = tools.filter((t) => t.category === newCat);
    if (newTools.length >= 2) {
      setSlugA(newTools[0].slug);
      setSlugB(newTools[1].slug);
    }
  };

  if (!isLoading && tools.length < 2) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />

        <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-800 shadow-sm">
            <SectionHeading
              title="Comparison tools will appear here once your catalog is loaded"
              eyebrow="Empty catalog"
              emphasized="No tools yet"
              meta="Connect Supabase or add tools in /admin"
            />
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              You removed the seeded demo catalog, so the compare page is
              waiting for live tool rows from Supabase or browser-local admin
              entries.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-slate-300 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-700"
              >
                Back Home
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main id="interactive-compare-root" className="flex-grow py-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <SectionHeading
            as="h1"
            title="Design Your Own Side-by-Side Comparison Matrix"
            eyebrow="Interactive Workspace"
            emphasized="Comparison"
            meta="Client Side Engine"
          />

          <p className="text-sm text-slate-600 max-w-3xl mb-12">
            Select any two platforms from our verified index to construct custom
            side-by-side matrices. Compare sandbox pricing structures,
            integration hooks, and performance ratings instantly.
          </p>

          {/* Top Banner Advertisement Block */}
          <div className="mb-8">
            <AdContainer
              layoutType="top-banner"
              slotId="compare-top"
            />
          </div>

          {/* Selector Board row */}
          <section
            id="selector-board"
            className="bg-slate-50 border border-slate-205/80 p-6 rounded-2xl mb-10"
          >
            {/* Category Filter */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Filter by Category:</span>
              </div>
              <select
                id="select-category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full sm:w-auto text-sm font-sans font-medium bg-white text-slate-800 py-2.5 px-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 cursor-pointer"
              >
                {availableCategories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Option A Selector */}
              <div className="w-full lg:w-5/12">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono mb-2">
                  Select Competitor Alpha:
                </label>
                <select
                  id="select-alpha"
                  value={slugA}
                  onChange={(e) => {
                    setIsLoading(true);
                    setSlugA(e.target.value);
                  }}
                  className="w-full text-sm font-sans font-bold bg-white text-slate-800 p-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 cursor-pointer"
                >
                  {filteredTools.map((t) => (
                    <option
                      key={t.slug}
                      value={t.slug}
                      disabled={t.slug === slugB}
                    >
                      {t.name} (Starting {t.startingPrice})
                    </option>
                  ))}
                </select>
              </div>

              {/* Middle versus separator */}
              <div className="flex flex-col items-center justify-center">
                <span className="h-10 w-10 bg-white border border-slate-200 shadow-xs rounded-full flex items-center justify-center">
                  <ArrowLeftRight className="h-4 w-4 text-blue-605" />
                </span>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase mt-1">
                  vs
                </span>
              </div>

              {/* Option B Selector */}
              <div className="w-full lg:w-5/12">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono mb-2">
                  Select Competitor Beta:
                </label>
                <select
                  id="select-beta"
                  value={slugB}
                  onChange={(e) => {
                    setIsLoading(true);
                    setSlugB(e.target.value);
                  }}
                  className="w-full text-sm font-sans font-bold bg-white text-slate-800 p-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 cursor-pointer"
                >
                  {filteredTools.map((t) => (
                    <option
                      key={t.slug}
                      value={t.slug}
                      disabled={t.slug === slugA}
                    >
                      {t.name} (Starting {t.startingPrice})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {isLoading ? (
            <div className="mb-12">
              <CompareGridSkeleton />
            </div>
          ) : (
            <>
              {/* Side-by-Side Tool card representation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {/* Box A - Butter Yellow highlight */}
                <div className="p-6 md:p-8 rounded-2xl bg-amber-50/60 border border-amber-205 text-slate-800 relative shadow-sm">
                  <span className="absolute top-4 right-4 text-xs font-bold text-amber-700 uppercase font-mono bg-amber-100 px-2 py-0.5 rounded">
                    Product A Option
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-mono text-amber-800/80 block mb-1">
                    {toolACategory.replace("-", " ")}
                  </span>
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mb-3">
                    {toolAName}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600 mb-4">
                    {toolA?.oneLineOpinion ?? "No tool has been loaded yet."}
                  </p>
                  <div className="text-xs">
                    <span className="text-slate-400 font-medium">
                      Starting License Price:{" "}
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {toolAStartingPrice}
                    </span>
                  </div>
                </div>

                {/* Box B - Clean Default theme off-white */}
                <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 text-slate-800 relative shadow-sm">
                  <span className="absolute top-4 right-4 text-xs font-bold text-slate-400 uppercase font-mono bg-slate-100 px-2 py-0.5 rounded">
                    Product B Option
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-mono text-slate-550 block mb-1">
                    {toolBCategory.replace("-", " ")}
                  </span>
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-905 tracking-tight mb-3">
                    {toolBName}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600 mb-4">
                    {toolB?.oneLineOpinion ?? "No tool has been loaded yet."}
                  </p>
                  <div className="text-xs">
                    <span className="text-slate-400 font-medium">
                      Starting License Price:{" "}
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {toolBStartingPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Spec sheets table rows */}
              <section id="spec-sheet" className="mb-12">
                <SectionHeading
                  title="Synthetic Metrics Comparison Grid"
                  eyebrow="Side-by-side matrices"
                  emphasized="Metrics"
                />

                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                  <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-4 font-bold text-slate-800">
                    <div>Parameter Feature</div>
                    <div>{toolAName} Spec</div>
                    <div>{toolBName} Spec</div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {/* Row: Starting price */}
                    <div className="grid grid-cols-3 p-4 items-center gap-2">
                      <div className="font-semibold text-slate-800 text-xs">
                        Starting monthly price
                      </div>
                      <div
                        className={`p-1.5 rounded ${toolANumericPrice <= toolBNumericPrice ? "bg-amber-100/50 font-bold text-slate-900" : "text-slate-600"}`}
                      >
                        {toolAStartingPrice}{" "}
                        {toolANumericPrice <= toolBNumericPrice && (
                          <span className="text-[10px] text-amber-800 font-mono">
                            (Cheaper)
                          </span>
                        )}
                      </div>
                      <div
                        className={`p-1.5 rounded ${toolBNumericPrice <= toolANumericPrice ? "bg-amber-100/50 font-bold text-slate-900" : "text-slate-600"}`}
                      >
                        {toolBStartingPrice}{" "}
                        {toolBNumericPrice <= toolANumericPrice && (
                          <span className="text-[10px] text-amber-800 font-mono">
                            (Cheaper)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row: Pricing model */}
                    {(toolAPricingModel || toolBPricingModel) && (
                      <div className="grid grid-cols-3 p-4 items-center gap-2">
                        <div className="font-semibold text-slate-800 text-xs">
                          Pricing model
                        </div>
                        <div className="text-slate-600 capitalize">
                          {toolAPricingModel ?? "—"}
                        </div>
                        <div className="text-slate-600 capitalize">
                          {toolBPricingModel ?? "—"}
                        </div>
                      </div>
                    )}

                    {/* Row: Entry tier name */}
                    {(toolATierName || toolBTierName) && (
                      <div className="grid grid-cols-3 p-4 items-center gap-2">
                        <div className="font-semibold text-slate-800 text-xs">
                          Entry-level plan name
                        </div>
                        <div className="text-slate-600">
                          {toolATierName ?? "—"}
                        </div>
                        <div className="text-slate-600">
                          {toolBTierName ?? "—"}
                        </div>
                      </div>
                    )}

                    {/* Row: Free trial */}
                    {(toolAFreeTrial !== null || toolBFreeTrial !== null) && (
                      <div className="grid grid-cols-3 p-4 items-center gap-2">
                        <div className="font-semibold text-slate-800 text-xs">
                          Free trial
                        </div>
                        <div>
                          {toolAFreeTrial === null ? (
                            <span className="text-slate-400">—</span>
                          ) : toolAFreeTrial ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              ✓ Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              ✗ No
                            </span>
                          )}
                        </div>
                        <div>
                          {toolBFreeTrial === null ? (
                            <span className="text-slate-400">—</span>
                          ) : toolBFreeTrial ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              ✓ Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              ✗ No
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Row: Free forever plan */}
                    {(toolAFreeForever !== null || toolBFreeForever !== null) && (
                      <div className="grid grid-cols-3 p-4 items-center gap-2">
                        <div className="font-semibold text-slate-800 text-xs">
                          Free forever plan
                        </div>
                        <div>
                          {toolAFreeForever === null ? (
                            <span className="text-slate-400">—</span>
                          ) : toolAFreeForever ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              ✓ Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              ✗ No
                            </span>
                          )}
                        </div>
                        <div>
                          {toolBFreeForever === null ? (
                            <span className="text-slate-400">—</span>
                          ) : toolBFreeForever ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              ✓ Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              ✗ No
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Row: AI included */}
                    {(toolAAiIncluded !== null || toolBAiIncluded !== null) && (
                      <div className="grid grid-cols-3 p-4 items-center gap-2">
                        <div className="font-semibold text-slate-800 text-xs">
                          AI features included
                        </div>
                        <div>
                          {toolAAiIncluded === null ? (
                            <span className="text-slate-400">—</span>
                          ) : toolAAiIncluded ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                              ✓ Included
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              ✗ Not included
                            </span>
                          )}
                        </div>
                        <div>
                          {toolBAiIncluded === null ? (
                            <span className="text-slate-400">—</span>
                          ) : toolBAiIncluded ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                              ✓ Included
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              ✗ Not included
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Row: AI add-on cost */}
                    {(toolAAiCost || toolBAiCost) && (
                      <div className="grid grid-cols-3 p-4 items-center gap-2">
                        <div className="font-semibold text-slate-800 text-xs">
                          AI add-on cost
                        </div>
                        <div className="text-slate-600">
                          {toolAAiCost ?? "—"}
                        </div>
                        <div className="text-slate-600">
                          {toolBAiCost ?? "—"}
                        </div>
                      </div>
                    )}

                    {/* Row: Category */}
                    <div className="grid grid-cols-3 p-4 items-center gap-2">
                      <div className="font-semibold text-slate-800 text-xs">
                        Category
                      </div>
                      <div className="text-slate-600 capitalize">
                        {toolACategory.replace(/-/g, " ")}
                      </div>
                      <div className="text-slate-600 capitalize">
                        {toolBCategory.replace(/-/g, " ")}
                      </div>
                    </div>

                    {/* Row: Key features */}
                    {(toolAKeyFeatures.length > 0 || toolBKeyFeatures.length > 0) && (
                      <div className="grid grid-cols-3 p-4 items-start gap-2">
                        <div className="font-semibold text-slate-800 text-xs pt-0.5">
                          Key features
                        </div>
                        <ul className="space-y-1">
                          {toolAKeyFeatures.length > 0 ? toolAKeyFeatures.map((f, i) => (
                            <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1">
                              <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                              {f}
                            </li>
                          )) : <li className="text-slate-400 text-[11px]">—</li>}
                        </ul>
                        <ul className="space-y-1">
                          {toolBKeyFeatures.length > 0 ? toolBKeyFeatures.map((f, i) => (
                            <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1">
                              <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                              {f}
                            </li>
                          )) : <li className="text-slate-400 text-[11px]">—</li>}
                        </ul>
                      </div>
                    )}

                    {/* Row: Limitations */}
                    {(toolALimitations.length > 0 || toolBLimitations.length > 0) && (
                      <div className="grid grid-cols-3 p-4 items-start gap-2">
                        <div className="font-semibold text-slate-800 text-xs pt-0.5">
                          Known limitations
                        </div>
                        <ul className="space-y-1">
                          {toolALimitations.length > 0 ? toolALimitations.map((l, i) => (
                            <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1">
                              <span className="text-red-400 mt-0.5 shrink-0">•</span>
                              {l}
                            </li>
                          )) : <li className="text-slate-400 text-[11px]">—</li>}
                        </ul>
                        <ul className="space-y-1">
                          {toolBLimitations.length > 0 ? toolBLimitations.map((l, i) => (
                            <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1">
                              <span className="text-red-400 mt-0.5 shrink-0">•</span>
                              {l}
                            </li>
                          )) : <li className="text-slate-400 text-[11px]">—</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Contextual Bottom Call To Action block */}
          <section id="compare-cta" className="mb-12">
            {existingReview ? (
              <div className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest font-mono text-blue-400 bg-slate-800 px-2.5 py-1 rounded-full uppercase">
                    <Sparkles className="h-3 w-3" />
                    Verified Editorial Article on file
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                    Read our complete {toolAName} vs {toolBName} deep diagnostic
                    review!
                  </h3>
                  <p className="text-xs text-slate-400 leading-normal">
                    Proceed to the comprehensive verified article covering our
                    stress sandbox metrics, CPA inspections, and direct
                    recommendations.
                  </p>
                </div>
                <Link
                  id="go-review-matrix-link"
                  href={`/reviews/${existingReview.slug}`}
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white text-xs font-bold px-5 py-3 rounded-lg transition-colors shadow-md shrink-0 whitespace-nowrap"
                >
                  Read Side-by-Side Review
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-2xl">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                    <Bell className="h-3.5 w-3.5 text-blue-500" />
                    Join Waiting list queue
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 tracking-tight mb-2">
                    Let us compile a verified review for {toolAName} and{" "}
                    {toolBName}!
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Our engineering board is constantly expanding verification
                    sandbox environments. Subscribe to receive an alerts payload
                    the moment our editorial comparative analytics drop.
                  </p>

                  {isSubscribed ? (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3 rounded-lg font-semibold inline-flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-emerald-600" />
                      We saved your request. We will alert you about this
                      compare matrix!
                    </div>
                  ) : (
                    <form
                      onSubmit={handleNotifyMe}
                      className="flex flex-col sm:flex-row gap-2 max-w-md"
                    >
                      <input
                        id="compare-notify-email"
                        type="email"
                        placeholder="Your corporate email address"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="text-xs px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white w-full"
                        required
                      />
                      <button
                        id="compare-notify-btn"
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors"
                      >
                        Request Review Alert
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Side rail banner advertisement slot */}
          <AdContainer layoutType="top-banner" slotId="compare-bottom" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
