'use client';

import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

interface ReviewCardSkeletonProps {
  variant?: 'default' | 'featured' | 'cobalt' | 'mint' | 'dark';
}

const VARIANT_STYLES = {
  default: {
    wrapper: 'bg-white border border-slate-150 text-slate-300 md:col-span-4 h-[300px] md:h-[280px]',
    shimmer: 'bg-slate-200/80',
    titleShimmer: 'bg-slate-200',
    excerptShimmer: 'bg-slate-100/90',
    eyebrowShimmer: 'bg-slate-100',
    borderStyle: 'border-slate-100',
  },
  featured: {
    wrapper: 'bg-amber-50/40 border border-amber-200 text-amber-200 md:col-span-6 h-[300px] md:h-[280px]',
    shimmer: 'bg-amber-200/50',
    titleShimmer: 'bg-amber-200/65',
    excerptShimmer: 'bg-amber-100/50',
    eyebrowShimmer: 'bg-amber-100/70',
    borderStyle: 'border-amber-200/40',
  },
  cobalt: {
    wrapper: 'bg-blue-600 border border-blue-700 text-blue-300 md:col-span-6 h-[300px] md:h-[280px]',
    shimmer: 'bg-blue-500/60',
    titleShimmer: 'bg-blue-500/80',
    excerptShimmer: 'bg-blue-500/40',
    eyebrowShimmer: 'bg-blue-700/60',
    borderStyle: 'border-blue-500/30',
  },
  mint: {
    wrapper: 'bg-emerald-600 border border-emerald-700 text-emerald-300 md:col-span-4 h-[300px] md:h-[280px]',
    shimmer: 'bg-emerald-500/60',
    titleShimmer: 'bg-emerald-500/80',
    excerptShimmer: 'bg-emerald-500/40',
    eyebrowShimmer: 'bg-emerald-700/60',
    borderStyle: 'border-emerald-500/30',
  },
  dark: {
    wrapper: 'bg-slate-900 border border-slate-800 text-slate-700 md:col-span-4 h-[300px] md:h-[280px]',
    shimmer: 'bg-slate-800',
    titleShimmer: 'bg-slate-700',
    excerptShimmer: 'bg-slate-800/60',
    eyebrowShimmer: 'bg-slate-800',
    borderStyle: 'border-slate-800',
  },
};

/**
 * ReviewCardSkeleton
 * Replicates the Review Card component structurally to prevent Cumulative Layout Shift (CLS).
 * Standardized across all 5 distinct design variants.
 */
export function ReviewCardSkeleton({ variant = 'default' }: ReviewCardSkeletonProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={`flex flex-col p-5 md:p-6 rounded-xl animate-pulse col-span-12 ${styles.wrapper}`}
    >
      {/* Simulated Editorial Verdict Badge */}
      <div className="flex gap-1.5 mb-3.5">
        <div className={`h-[22px] w-28 rounded-full ${styles.eyebrowShimmer}`} />
      </div>

      {/* Simulated Category Eyebrow */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`h-[20px] w-16 rounded ${styles.eyebrowShimmer}`} />
      </div>

      {/* Simulated Title and vs Separator */}
      <div className="space-y-2.5 mb-2">
        <div className="flex items-center gap-2">
          <div className={`h-5 w-24 rounded-md ${styles.titleShimmer}`} />
          <span className="text-xs italic font-sans opacity-40">vs</span>
          <div className={`h-5 w-24 rounded-md ${styles.titleShimmer}`} />
        </div>
        <div className={`h-4 w-[85%] rounded ${styles.shimmer}`} />
      </div>

      {/* Simulated Excerpt Lines */}
      <div className="space-y-1.5 mt-2 mb-6">
        <div className={`h-3 w-full rounded ${styles.excerptShimmer}`} />
        <div className={`h-3 w-[95%] rounded ${styles.excerptShimmer}`} />
        <div className={`h-3 w-[60%] rounded ${styles.excerptShimmer}`} />
      </div>

      {/* Bottom Sticky Metadata Section */}
      <div className={`mt-auto pt-3 border-t flex items-center justify-between text-[11px] ${styles.borderStyle}`}>
        <span className="flex items-center gap-1 font-sans font-medium opacity-50">
          <Clock className="h-3 w-3" />
          <div className={`h-3 w-10 rounded ${styles.shimmer}`} />
        </span>
        
        <span className="inline-flex items-center gap-1 font-semibold opacity-65">
          <div className={`h-3 w-20 rounded ${styles.shimmer}`} />
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}

interface TableSkeletonProps {
  rowsCount?: number;
  columnsCount?: number;
  theme?: 'silver' | 'amber' | 'slate';
}

/**
 * TableSkeleton
 * A premium database/table-style skeleton loader.
 * Mimics high-density index lists and evaluation matrices securely with zero CLS.
 */
export function TableSkeleton({ rowsCount = 4, columnsCount: _columnsCount = 3, theme = 'silver' }: TableSkeletonProps) {
  const isAmber = theme === 'amber';
  const isSlate = theme === 'slate';

  const bodyRows = Array.from({ length: rowsCount });

  return (
    <div 
      className={`border rounded-xl overflow-hidden animate-pulse bg-white 
        ${isAmber ? 'border-amber-200' : isSlate ? 'border-slate-800 bg-slate-900' : 'border-slate-200'}`}
    >
      {/* Table Header Shimmer */}
      <div 
        className={`grid grid-cols-1 md:grid-cols-12 border-b p-4 gap-4
          ${isAmber ? 'bg-amber-50/50 border-amber-200/60' : isSlate ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
      >
        <div className="md:col-span-3">
          <div className={`h-3.5 w-24 rounded ${isSlate ? 'bg-slate-800' : isAmber ? 'bg-amber-200/70' : 'bg-slate-205'}`} />
        </div>
        <div className="md:col-span-2">
          <div className={`h-3.5 w-16 rounded ${isSlate ? 'bg-slate-800' : isAmber ? 'bg-amber-200/70' : 'bg-slate-205'}`} />
        </div>
        <div className="md:col-span-7">
          <div className={`h-3.5 w-40 rounded ${isSlate ? 'bg-slate-800' : isAmber ? 'bg-amber-200/70' : 'bg-slate-205'}`} />
        </div>
      </div>

      {/* Table Body Rows Shimmer */}
      <div className={`divide-y ${isSlate ? 'divide-slate-800' : 'divide-slate-100'}`}>
        {bodyRows.map((_, index) => (
          <div 
            key={index} 
            className="grid grid-cols-1 md:grid-cols-12 p-4 items-center gap-4"
          >
            {/* Column 1 */}
            <div className="md:col-span-3 space-y-1">
              <div className={`h-4.5 w-32 rounded-md ${isSlate ? 'bg-slate-800' : 'bg-slate-200'}`} />
            </div>
            {/* Column 2 */}
            <div className="md:col-span-2">
              <div className={`h-4 w-20 rounded ${isSlate ? 'bg-slate-800/80' : 'bg-slate-100'}`} />
            </div>
            {/* Column 3 */}
            <div className="md:col-span-7 space-y-1.5">
              <div className={`h-3 w-full rounded ${isSlate ? 'bg-slate-800/60' : 'bg-slate-100/90'}`} />
              <div className={`h-3 w-[70%] rounded ${isSlate ? 'bg-slate-800/40' : 'bg-slate-100/60'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * CompareGridSkeleton
 * Custom visual representation for the Interactive Selector Compare matrices Board.
 * Keeps selectors and main product comparative panels in high-fidelity pulse before loading.
 */
export function CompareGridSkeleton() {
  return (
    <div className="animate-pulse space-y-10">
      {/* Dual Tool Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Product A Selector Shimmer Card (Amber shadow) */}
        <div className="p-6 md:p-8 rounded-2xl bg-amber-50/20 border border-amber-200/40 text-slate-300 relative">
          <div className="absolute top-4 right-4 h-5 w-24 rounded bg-amber-100/50" />
          <div className="h-3 w-28 rounded bg-amber-100/60 mb-2" />
          <div className="h-6 w-40 rounded bg-amber-200/50 mb-4" />
          <div className="space-y-1.5 mb-4">
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-[85%] rounded bg-slate-100" />
          </div>
          <div className="h-4.5 w-32 rounded bg-amber-100/40" />
        </div>

        {/* Product B Selector Shimmer Card */}
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-150 text-slate-300 relative">
          <div className="absolute top-4 right-4 h-5 w-24 rounded bg-slate-100" />
          <div className="h-3 w-28 rounded bg-slate-100 mb-2" />
          <div className="h-6 w-40 rounded bg-slate-200 mb-4" />
          <div className="space-y-1.5 mb-4">
            <div className="h-3 w-full rounded bg-slate-100/80" />
            <div className="h-3 w-[85%] rounded bg-slate-100/80" />
          </div>
          <div className="h-4.5 w-32 rounded bg-slate-100" />
        </div>

      </div>

      {/* Metrics Table */}
      <div className="space-y-4">
        <div className="h-5 w-48 rounded bg-slate-250 mb-2" />
        <TableSkeleton rowsCount={4} columnsCount={3} theme="silver" />
      </div>
    </div>
  );
}
