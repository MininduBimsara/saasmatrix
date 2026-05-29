'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckCircle2, ArrowRight, ShieldCheck, Check, Sparkles, BookOpen } from 'lucide-react';

function RealSuccessContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId') || 'Subscription Plan';
  const billingCycle = searchParams.get('cycle') || 'yearly';

  return (
    <div className="max-w-2xl mx-auto px-4 text-center py-8">
      
      {/* Premium Sparkle Top Accent */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest mb-6 animate-pulse">
        <Sparkles className="h-3 w-3 text-emerald-650" />
        Transaction Matrix Securely Logged
      </div>

      <div className="flex justify-center mb-6">
        <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-full">
          <CheckCircle2 className="h-12 w-12 text-emerald-650" />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-905 tracking-tight mb-4">
        Thank You for Your Order!
      </h1>
      
      <p className="text-sm text-slate-650 leading-relaxed mb-8 max-w-lg mx-auto">
        Your payment was processed successfully via Lemon Squeezy. Your corporate dashboard access has been initialized and registered under active session caches.
      </p>

      {/* Dynamic Lemon Squeezy ID Card */}
      <div className="bg-slate-50 border border-slate-205 rounded-2xl p-6 text-left space-y-4 mb-8">
        <h3 className="text-xs uppercase font-mono tracking-wider font-extrabold text-slate-400">
          Lemon Squeezy Order Parameters
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <span className="text-slate-400 block font-mono text-[10px] uppercase">Plan Catalog</span>
            <strong className="text-slate-900 block capitalize mt-0.5">{planId.replace('-', ' ')}</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-mono text-[10px] uppercase">Billing Cycle</span>
            <strong className="text-slate-900 block capitalize mt-0.5">{billingCycle}</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-mono text-[10px] uppercase">Merchant Partner</span>
            <strong className="text-slate-900 block mt-0.5">Lemon Squeezy (MoR)</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-mono text-[10px] uppercase">Verification Status</span>
            <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-250 text-emerald-850 font-mono text-[9px] rounded-full uppercase font-black mt-1 inline-block">
              CHARGED
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer"
        >
          Return to Matrix Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link 
          href="/blog" 
          className="inline-flex items-center justify-center bg-white border border-slate-205 text-slate-700 hover:bg-slate-50 font-sans text-xs font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer gap-2"
        >
          <BookOpen className="h-4 w-4 text-slate-500" />
          Read Premium Dispatch
        </Link>
      </div>

    </div>
  );
}

export default function RealSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main id="lemonsqueezy-success-root" className="flex-grow py-16 md:py-20 font-sans">
        <Suspense fallback={
          <div className="max-w-2xl mx-auto text-center py-12 font-mono text-xs text-slate-400">
            LOCATING ACTIVE SECURE PAYMENT TOKENS...
          </div>
        }>
          <RealSuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
