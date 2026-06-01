"use client";

import { useEffect, useState, useRef } from "react";

interface AdContainerProps {
  slotId: string;
  layoutType?: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical";
  responsive?: boolean;
  className?: string;
}

export function AdContainer({
  slotId,
  layoutType,
  format = "auto",
  responsive = true,
  className = "",
}: AdContainerProps) {
  const [adFailed, setAdFailed] = useState(false);
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Prevent execution cycles during server-side compilation passes
    if (typeof window !== "undefined") {
      try {
        if (insRef.current && !insRef.current.dataset.adsbygoogleStatus) {
          // Hydrate the universal script array
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error("AdSense Telemetry Execution Blocked:", error);
        setAdFailed(true);
      }
    }
  }, []);

  if (adFailed) {
    // Gracefully collapse into a clean, minimal brand-accent block if blocked or failed
    return null;
  }

  return (
    <div className={`w-full my-6 mx-auto flex flex-col items-center justify-center ${className}`}>
      {/* Disclaimer tag to guarantee compliance with premium ad network regulations */}
      <span className="text-[10px] tracking-wider text-slate-400 uppercase mb-1.5 block select-none">
        Sponsored Resource
      </span>
      
      {/* Semantic structural container wrapper ensuring structural height safety boundaries */}
      <div className="w-full bg-slate-50/50 border border-dashed border-slate-200/60 rounded-xl overflow-hidden flex items-center justify-center p-2 min-h-[90px] transition-all">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your verified vendor index
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </div>
  );
}
