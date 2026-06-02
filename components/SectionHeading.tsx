'use client';

import React from 'react';

export interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  emphasized?: string;
  meta?: string;
  as?: 'h1' | 'h2';
}

export function SectionHeading({ title, eyebrow, emphasized, meta, as: Tag = 'h2' }: SectionHeadingProps) {
  // Split title manually at the emphasized substring to render it in high-contrast neutral emphasis
  const renderTitle = () => {
    if (!emphasized || !title.toLowerCase().includes(emphasized.toLowerCase())) {
      return <span className="font-sans font-extrabold text-slate-900">{title}</span>;
    }

    const index = title.toLowerCase().indexOf(emphasized.toLowerCase());
    const before = title.substring(0, index);
    const match = title.substring(index, index + emphasized.length);
    const after = title.substring(index + emphasized.length);

    return (
      <span className="font-sans font-extrabold text-slate-950 tracking-tight uppercase">
        {before}
        <span className="text-slate-500 font-light pr-1">
          {match}
        </span>
        {after}
      </span>
    );
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-8 pb-3 border-b border-slate-200/60 flex-wrap">
      <div className="flex flex-col gap-1 max-w-2xl">
        {/* Optional Eyebrow with leading colored rule */}
        {eyebrow && (
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-6 h-[1.5px] bg-slate-400" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold">
              {eyebrow}
            </span>
          </div>
        )}
        
        {/* Main Heading */}
        <Tag className="text-lg md:text-xl font-extrabold tracking-tight text-slate-950 uppercase">
          {renderTitle()}
        </Tag>
      </div>

      {/* Optional Metadata suffix on the right */}
      {meta && (
        <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 font-bold md:mb-1">
          {"// INDEX_METRIC: "}{meta}
        </span>
      )}
    </div>
  );
}

