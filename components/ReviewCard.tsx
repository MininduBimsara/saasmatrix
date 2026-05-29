'use client';

import React from 'react';
import Link from 'next/link';
import { Review } from '@/lib/data';

export interface ReviewCardProps {
  review: Review;
  variant?: 'default' | 'featured' | 'cobalt' | 'mint' | 'dark';
  theme?: 'swiss' | 'editorial' | 'cyber' | 'bento' | 'brutalist';
}

export function ReviewCard({ review, variant = 'default', theme = 'swiss' }: ReviewCardProps) {
  const [toolA, setToolA] = React.useState<any>(null);
  const [toolB, setToolB] = React.useState<any>(null);

  React.useEffect(() => {
    import('@/lib/clientDb').then((db) => {
      const allTools = db.getMergedTools();
      setToolA(allTools.find(t => t.slug === review.toolA) || null);
      setToolB(allTools.find(t => t.slug === review.toolB) || null);
    });
  }, [review.toolA, review.toolB]);

  const categoryLabel = review.category.replace('-', ' ');

  // Overlapping tool logo badge generator representing real-world comparison indicators
  const renderToolLogos = () => {
    const getToolDetails = (slug: string) => {
      switch (slug) {
        case 'quickbooks': return { bg: 'bg-[#2ca01c]', text: 'text-white', initials: 'QB' };
        case 'freshbooks': return { bg: 'bg-[#0075eb]', text: 'text-white', initials: 'FB' };
        case 'asana': return { bg: 'bg-[#f06a6c]', text: 'text-white', initials: 'AS' };
        case 'clickup': return { bg: 'bg-[#7b68ee]', text: 'text-white', initials: 'CU' };
        case 'salesforce': return { bg: 'bg-[#00a1e0]', text: 'text-white', initials: 'SF' };
        case 'hubspot': return { bg: 'bg-[#ff7a59]', text: 'text-white', initials: 'HS' };
        case 'monday': return { bg: 'bg-[#00ca72]', text: 'text-white', initials: 'MO' };
        case 'jira': return { bg: 'bg-[#0052cc]', text: 'text-white', initials: 'JI' };
        default: return { bg: 'bg-rose-600', text: 'text-white', initials: (slug || 'TL').substring(0, 2).toUpperCase() };
      }
    };

    const detailsA = getToolDetails(review.toolA);
    const detailsB = getToolDetails(review.toolB);

    return (
      <div className="flex items-center gap-1.5 select-none my-1">
        <div className="relative flex items-center h-10">
          {toolA?.iconUrl ? (
            <img 
              src={toolA.iconUrl} 
              alt={toolA.name} 
              className="relative h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-105 z-20" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={`relative h-9 w-9 rounded-full ${detailsA.bg} ${detailsA.text} border-2 border-white flex items-center justify-center font-mono text-[10px] font-black uppercase shadow-sm transition-transform duration-300 group-hover:scale-105 z-20`}>
              {detailsA.initials}
            </div>
          )}

          {toolB?.iconUrl ? (
            <img 
              src={toolB.iconUrl} 
              alt={toolB.name} 
              className="relative h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-105 -ml-2.5 z-10" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={`relative h-9 w-9 rounded-full ${detailsB.bg} ${detailsB.text} border-2 border-white flex items-center justify-center font-mono text-[10px] font-black uppercase shadow-sm transition-transform duration-300 group-hover:scale-105 -ml-2.5 z-10`}>
              {detailsB.initials}
            </div>
          )}
        </div>
        <span className="text-[9px] bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 font-mono font-bold uppercase tracking-wider border border-slate-200 transition-colors group-hover:bg-rose-50 group-hover:text-rose-600 group-hover:border-rose-200">
          VS
        </span>
      </div>
    );
  };

  // Professional textual verdict indicators instead of colorful badged icons
  const getVerdictLabel = () => {
    switch (review.verdict) {
      case 'editor-pick':
        return 'EDITOR’S SELECTION';
      case 'hot-take':
        return 'ACQUISITION INSIGHT';
      case 'skip':
        return 'RE-EVALUATION ADVISED';
      case 'tie':
        return 'EQUAL UTILITY TIE';
      default:
        return 'COMPARATIVE STUDY';
    }
  };

  const cardClass = 'bg-white border border-slate-200/90 p-7 rounded-[24.5px] hover:shadow-xl hover:border-rose-500 hover:-translate-y-1 transition-all duration-300 text-slate-900 flex flex-col justify-between h-full';
  const titleClass = 'text-base font-bold tracking-tight text-slate-950 group-hover:text-rose-500 transition-colors duration-200 mt-2';
  const metaClass = 'pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-sans text-slate-550';
  const textClass = 'text-xs text-slate-500 leading-relaxed mt-2.5 mb-6 line-clamp-3';
  const buttonText = 'Reveal Report →';

  return (
    <Link
      id={`review-card-elem-${review.slug}`}
      href={`/reviews/${review.slug}`}
      className={`group block h-full ${cardClass}`}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
          {/* Custom Airbnb pink/rose indicator pill for organic premium look */}
          <span className="text-[10px] tracking-wider text-rose-600 font-extrabold uppercase bg-rose-50 px-3 py-1 rounded-full">
            {categoryLabel}
          </span>
          <span className="text-[10px] tracking-widest text-slate-500 font-semibold uppercase flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {getVerdictLabel()}
          </span>
        </div>

        <div className="mb-2">
          {renderToolLogos()}
        </div>

        {/* Styled Comparison Heading */}
        <h3 className={titleClass}>
          <span className="font-extrabold text-slate-950">{toolA?.name || 'Tool A'}</span> 
          <span className="text-slate-400 font-light mx-2">vs</span>
          <span className="font-extrabold text-slate-950">{toolB?.name || 'Tool B'}</span>
        </h3>
        
        {/* Sub-heading Case Description */}
        <p className="text-[11px] font-mono font-bold text-slate-400 mt-1 uppercase tracking-wider">
          {review.title}
        </p>

        {/* Excerpt Paragraph with highly balanced typography */}
        <p className={textClass}>
          {review.excerpt}
        </p>
      </div>

      {/* Footing metrics with elegant rounded button */}
      <div className={metaClass}>
        <span className="font-medium text-slate-405">{review.readTimeMinutes} min study</span>
        <span className="inline-flex items-center justify-center bg-rose-500 group-hover:bg-rose-600 text-white text-[11px] font-bold px-4 py-2 rounded-full transition-all shadow-xs group-hover:shadow-md group-hover:scale-102">
          {buttonText}
        </span>
      </div>
    </Link>
  );
}
