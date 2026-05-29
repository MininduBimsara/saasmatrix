'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckCircle, ArrowRight, ShieldCheck, Mail, ClipboardCheck, Sparkles } from 'lucide-react';

function SandboxSuccessContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId') || 'Founder Pro Directory Placement';
  const billingCycle = searchParams.get('cycle') || 'yearly';
  const amount = searchParams.get('amount') || '39';

  return (
    <div className="max-w-2xl mx-auto px-4 text-center py-8">
      
      {/* Visual Indicator of compliance simulation */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest mb-6">
        <Sparkles className="h-3 w-3 text-amber-600 animate-pulse" />
        Simulation Success Verification
      </div>

      <div className="flex justify-center mb-6">
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-full animate-bounce">
          <CheckCircle className="h-12 w-12 text-emerald-650" />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-905 tracking-tight leading-none mb-4">
        Simulated Checkout Complete!
      </h1>
      
      <p className="text-sm text-slate-650 leading-relaxed mb-8 max-w-lg mx-auto">
        Your subscription verification webhook has been emulated successfully. In a production state with live credentials, a webhook signal records this transaction securely and generates your corporate access index.
      </p>

      {/* Dynamic Summary Cards */}
      <div className="bg-slate-50 border border-slate-205 rounded-2xl p-6 text-left space-y-4 mb-8">
        <h3 className="text-xs uppercase font-mono tracking-wider font-extrabold text-slate-400">
          Simulation Receipt Metadata
        </h3>
        <div className="grid grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <span className="text-slate-400 block font-mono text-[10px] uppercase">Plan Class</span>
            <strong className="text-slate-900 block capitalize mt-0.5">{planId.replace('-', ' ')}</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-mono text-[10px] uppercase">Billing Iteration</span>
            <strong className="text-slate-900 block capitalize mt-0.5">{billingCycle}</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-mono text-[10px] uppercase">Emulated Charge</span>
            <strong className="text-slate-900 block mt-0.5">${amount} USD</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-mono text-[10px] uppercase">Status Check</span>
            <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-250 text-emerald-850 font-mono text-[9px] rounded-full uppercase font-black mt-1 inline-block">
              TEST_SUCCESS
            </span>
          </div>
        </div>
      </div>

      {/* Guide Callout Cards */}
      <div className="p-5 border border-slate-150 bg-slate-50/50 rounded-xl text-left space-y-3 mb-8">
        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase font-mono">
          <ClipboardCheck className="h-4 w-4 text-blue-600" />
          Transition to Live Lemon Squeezy Production:
        </h4>
        <p className="text-xs text-slate-600 leading-normal">
          To process live B2B payments globally, complete the configuration below:
        </p>
        <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1.5 pl-1">
          <li>Generate an API Key in your <strong>Lemon Squeezy Dashboard</strong> under Settings &gt; API.</li>
          <li>Set <code className="bg-white border rounded px-1.5 py-0.5 text-[10px] font-mono">LEMON_SQUEEZY_API_KEY</code> in the secrets parameters screen.</li>
          <li>Locate your Store ID and set <code className="bg-white border rounded px-1.5 py-0.5 text-[10px] font-mono">LEMON_SQUEEZY_STORE_ID</code> inside the same panel.</li>
          <li>Obtain variant IDs for your subscription packages and fill both <code className="bg-white border rounded px-1.5 py-0.5 text-[10px] font-mono">LEMON_SQUEEZY_VARIANT_FOUNDER_PRO</code> and <code className="bg-white border rounded px-1.5 py-0.5 text-[10px] font-mono">LEMON_SQUEEZY_VARIANT_ENTERPRISE_BUYER</code>!</li>
        </ol>
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
          href="/calculator" 
          className="inline-flex items-center justify-center bg-white border border-slate-205 text-slate-700 hover:bg-slate-50 font-sans text-xs font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer"
        >
          Open ROI Calculator
        </Link>
      </div>

    </div>
  );
}

export default function SandboxSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main id="success-screen-container" className="flex-grow py-16 md:py-20 font-sans">
        <Suspense fallback={
          <div className="max-w-2xl mx-auto text-center py-12 font-mono text-xs text-slate-400">
            LOADING SECURE WEBHOOK METADATA...
          </div>
        }>
          <SandboxSuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
