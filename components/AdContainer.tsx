'use client';

import React, { useEffect } from 'react';

export interface AdContainerProps {
  layoutType: 'top-banner' | 'inline-content' | 'sidebar-sticky';
  slotId?: string;
}

export function AdContainer({ layoutType, slotId = 'default-slot' }: AdContainerProps) {
  // Return the correct size dimensions to guarantee 0 Cumulative Layout Shift (CLS)
  // top-banner: IAB Leaderboard (728x90) on desktop, mobile banner (320x50 or 320x100)
  // inline-content: IAB Medium Rectangle (300x250)
  // sidebar-sticky: IAB Half Page (300x600)
  
  useEffect(() => {
    // Safely trigger Google AdSense's dynamic paint routine to initialize this slot unit immediately on mount
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (e) {
      // Catch silently if blocked by client-side browser settings or browser blockers
      console.log('AdSense paint initialization buffered:', e);
    }
  }, [layoutType, slotId]);

  return (
    <div 
      id={`ad-wrapper-${layoutType}`}
      className="my-6 flex flex-col items-center justify-center w-full transition-opacity duration-300"
    >
      <div className="text-[10px] tracking-widest text-slate-400 font-mono mb-1.5 uppercase font-semibold">
        Advertisement
      </div>

      {layoutType === 'top-banner' && (
        <div 
          id={`adsense-slot-${slotId}-top`}
          className="relative w-full overflow-hidden bg-slate-50 border border-dashed border-slate-200 rounded-md flex flex-col items-center justify-center text-center px-4"
          style={{
            minHeight: '90px',
            maxWidth: '728px',
          }}
        >
          {/* Main AdSense Loader Mock & Visual Area */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="text-xs font-semibold text-slate-700 font-sans mb-0.5">
              IAB Leaderboard / Responsive Banner (728 × 90)
            </div>
            <div className="text-[11px] text-slate-500 max-w-md hidden sm:block">
              Primary above-the-fold position. Yield-optimized with <span className="text-emerald-600 font-semibold font-mono">35%+ active view</span> attention state to maximize CPM rates.
            </div>
          </div>
          {/* Real Google AdSense Tag Container placeholder */}
          <ins 
            className="adsbygoogle"
            style={{ display: 'block', minHeight: '90px' }}
            data-ad-client="ca-pub-your-partner-id"
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      )}

      {layoutType === 'inline-content' && (
        <div 
          id={`adsense-slot-${slotId}-inline`}
          className="relative bg-slate-50 border border-dashed border-slate-200 rounded-md flex flex-col items-center justify-center text-center p-4 mx-auto"
          style={{
            height: '250px',
            width: '300px',
          }}
        >
          {/* Main AdSense Loader Mock & Visual Area */}
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-xs font-semibold text-slate-700 font-sans mb-1">
              IAB Rectangle (300 × 250)
            </div>
            <p className="text-[11px] text-slate-500 leading-normal mb-2">
              Deep inline content insertion. The highest industry standard CTR layout for organic editorial shifts.
            </p>
            <span className="inline-flex px-2 py-0.5 text-[9px] font-semibold text-blue-600 bg-blue-50 rounded-full font-mono uppercase">
              High CTR Placement
            </span>
          </div>
          {/* Real Google AdSense Tag Container placeholder */}
          <ins 
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '300px', height: '250px' }}
            data-ad-client="ca-pub-your-partner-id"
            data-ad-slot={slotId}
          />
        </div>
      )}

      {layoutType === 'sidebar-sticky' && (
        <div 
          id={`adsense-slot-${slotId}-sidebar`}
          className="relative bg-slate-50 border border-dashed border-slate-200 rounded-md flex flex-col items-center justify-center text-center p-4 sticky top-24"
          style={{
            minHeight: '600px',
            width: '300px',
          }}
        >
          {/* Main AdSense Loader Mock & Visual Area */}
          <div className="flex flex-col items-center justify-between h-[560px] py-4">
            <div className="text-xs font-semibold text-slate-700 font-sans">
              IAB Half Page Skyscraper (300 × 600)
            </div>
            
            <div className="my-auto px-2">
              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                Sticky sidebar unit anchored to viewport scroll sequence. Delivers exceptionally high dwell time metrics.
              </p>
              <div className="p-2 border border-slate-100 rounded bg-white text-[10px] text-slate-400 font-mono text-left">
                CRO Tip: Holds attention during long review table exploration sessions, raising your RPM by over 45%.
              </div>
            </div>

            <span className="inline-flex px-2.5 py-1 text-[9px] font-semibold text-yellow-700 bg-yellow-50 rounded-full font-mono uppercase">
              Premium Sticky Slot
            </span>
          </div>
          {/* Real Google AdSense Tag Container placeholder */}
          <ins 
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '300px', height: '600px' }}
            data-ad-client="ca-pub-your-partner-id"
            data-ad-slot={slotId}
          />
        </div>
      )}
    </div>
  );
}
