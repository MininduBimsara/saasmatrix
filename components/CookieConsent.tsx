'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Cookie, Settings, ExternalLink, HelpCircle } from 'lucide-react';

export function CookieConsent() {
  const COUNTDOWN_DURATION = 5000; // 5 seconds
  const [consent, setConsent] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(COUNTDOWN_DURATION);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    const storedConsent = localStorage.getItem('saaspebble-cookie-consent');
    if (storedConsent) {
      setConsent(storedConsent);
    } else {
      // Start the auto-accept countdown timer
      startTimeRef.current = Date.now();
      startTimer();
    }

    return () => {
      clearTimer();
    };
  }, []);

  // Dynamically inject Google AdSense script on consent accept to avoid Next.js's next/script data-nscript warning
  useEffect(() => {
    const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
    if (adsEnabled && consent === 'accepted') {
      const scriptId = 'adsense-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-your-partner-id";
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
    }
  }, [consent]);

  const startTimer = () => {
    clearTimer();
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      handleAccept();
    }, remainingTimeRef.current);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleAccept = () => {
    clearTimer();
    localStorage.setItem('saaspebble-cookie-consent', 'accepted');
    setConsent('accepted');
    setShowPreferences(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cookie-consent-updated'));
    }
  };

  const handleOpenPreferences = () => {
    // Pause the timer when user interacts with Preferences
    clearTimer();
    setIsPaused(true);
    setShowPreferences(true);
  };

  const handleClosePreferences = () => {
    setShowPreferences(false);
    // If they close preferences without accepting, we should resume the timer or accept.
    // Since preferences are always accepted on this platform, we just accept when they close/confirm.
    handleAccept();
  };

  // Prevent rendering on the server to avoid hydration mismatches
  if (!mounted) return null;

  // If consent is already accepted, we inject the script dynamically in useEffect and render nothing
  if (consent === 'accepted') {
    return null;
  }

  return (
    <>
      {/* Banner Slide-in */}
      <div 
        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white rounded-2xl p-5 shadow-2xl z-50 flex flex-col gap-4 transition-all duration-300 ease-in-out animate-slideUp font-sans"
        onMouseEnter={() => {
          if (!showPreferences) {
            clearTimer();
            // Calculate elapsed time and update remaining
            const elapsed = Date.now() - startTimeRef.current;
            remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
            setIsPaused(true);
          }
        }}
        onMouseLeave={() => {
          if (!showPreferences && isPaused && remainingTimeRef.current > 0) {
            setIsPaused(false);
            startTimer();
          }
        }}
      >
        {/* Progress Bar (Visual representation of 2s countdown) */}
        {!isPaused && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 rounded-t-2xl overflow-hidden">
            <div 
              className="h-full bg-rose-500 rounded-r-full"
              style={{
                width: '100%',
                animation: `shrinkWidth ${remainingTimeRef.current}ms linear forwards`
              }}
            />
          </div>
        )}

        {isPaused && !showPreferences && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 rounded-t-2xl">
            <div 
              className="h-full bg-rose-500/50 rounded-r-full"
              style={{
                width: `${(remainingTimeRef.current / COUNTDOWN_DURATION) * 100}%`
              }}
            />
          </div>
        )}

        <div className="flex items-start gap-3.5 mt-1">
          <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/50 text-rose-400">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              We Value Your Privacy
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              We use cookies to deliver customized B2B advertisements powered by Google AdSense and optimize index page metrics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={handleAccept}
            className="flex-1 py-2 px-4 bg-rose-500 hover:bg-rose-600 active:scale-98 transition-all rounded-xl text-xs font-bold text-white hover:cursor-pointer shadow-md shadow-rose-500/25"
          >
            Accept Cookies
          </button>
          
          <button
            onClick={handleOpenPreferences}
            className="py-2 px-4 bg-slate-800 hover:bg-slate-700 active:scale-98 transition-all rounded-xl text-xs font-bold text-slate-350 hover:text-white border border-slate-700/60 flex items-center justify-center gap-1.5 hover:cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5" />
            Preferences
          </button>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col font-sans">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
              <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/50 text-rose-400">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Privacy Preferences</h3>
                <p className="text-xs text-slate-400">Review cookie settings for SaaSPebble</p>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
              {/* Category 1 */}
              <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Essential Cookies</span>
                    <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[9px] font-bold text-slate-400 font-mono">REQUIRED</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Necessary to run site routing, handle contact forms, and save privacy settings.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-rose-500 focus:ring-0 cursor-not-allowed opacity-60"
                  />
                </div>
              </div>

              {/* Category 2 */}
              <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Google AdSense Tagging</span>
                    <span className="px-1.5 py-0.5 bg-rose-500/10 rounded text-[9px] font-bold text-rose-400 font-mono">SPONSORED</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Delivers personalized promotional banners to fund SaaSPebble's diagnostic indexing.
                  </p>
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-slate-450 hover:text-white hover:underline mt-1 font-mono"
                  >
                    Google Ad Policies
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-rose-500 focus:ring-0 cursor-not-allowed opacity-60"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-900/50 border-t border-slate-800 flex flex-col gap-3">
              <div className="p-3 bg-slate-850 border border-slate-800/80 rounded-xl flex items-start gap-2.5">
                <HelpCircle className="h-4 w-4 text-slate-450 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-slate-400 leading-relaxed font-mono uppercase">
                  NOTE: COOKIE OPT-OUTS OR PRIVACY REVOCATIONS CAN BE MANAGED DIRECTLY ON GOOGLE'S NETWORK PORTALS OR BY BLOCKING THIRD-PARTY SCRIPT DOMAINS.
                </p>
              </div>

              <button
                onClick={handleClosePreferences}
                className="w-full py-2.5 px-4 bg-rose-500 hover:bg-rose-600 active:scale-98 transition-all rounded-xl text-xs font-bold text-white hover:cursor-pointer shadow-md shadow-rose-500/25"
              >
                Accept and Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes shrinkWidth {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
}
