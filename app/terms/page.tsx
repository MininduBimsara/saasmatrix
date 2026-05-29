import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Scale, FileSpreadsheet, Lock, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | SaaSMatrix',
  description: 'Operating guidelines, product comparison matrices disclaimer, editorial standards, and liability bounds of SaaSMatrix.',
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main id="terms-root" className="flex-grow py-12 md:py-16 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-xs text-slate-400 font-mono">
            <Link href="/" className="hover:text-blue-600">HOME</Link> / TERMS OF SERVICE
          </nav>

          <header className="mb-10 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1 px-2.5 bg-slate-900 border border-slate-800 rounded-full text-[10px] uppercase font-mono tracking-widest font-black text-slate-300 flex items-center gap-1.5">
                <Scale className="h-3 w-3 text-slate-400" />
                Legal Agreement & Terms
              </span>
              <span className="text-slate-400 font-mono text-[10px]">Updated: May 28, 2026</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-905 tracking-tight leading-tight">
              Terms of Directory Service
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-slate-650 mt-3">
              Agreement governing your interaction with SaaSMatrix matrices, specs comparison grids, and calculators.
            </p>
          </header>

          <section className="space-y-8 text-xs md:text-sm text-slate-650 leading-relaxed font-sans">
            {/* Disclaimer Callout Box */}
            <div className="p-5 border border-slate-200 bg-slate-50 rounded-xl flex items-start gap-3 text-slate-800">
              <AlertCircle className="h-5 w-5 text-slate-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs">Non-Reliance Disclaimer</p>
                <p className="text-[11px] leading-relaxed mt-1 text-slate-600">
                  All subscription amounts, starting license prices, performance matrices, and spec sheets listed across SaasMatrix directories are sourced recursively from vendor pricing grids and guest sandbox tests. Prices are indicative only and fluctuate based on custom contracts and subscription terms.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                1. Directory Information Accuracy
              </h2>
              <p>
                The database tables represent editor-driven subjective evaluations. While we carry out automated and manual verification checkups on sandboxed virtual machine instances, we cannot guarantee that the software platforms listed have not altered their pricing tiers, API hooks, user seat limits, or contract clauses subsequent to our review publishing times.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-600" />
                2. User License and Sandbox Scraping
              </h2>
              <p>
                You are granted a limited, personal, non-transferable license to access our comparison listings and compute pricing matrices using our interactive ROI Calculator. You are strictly forbidden from executing automated web crawler scripts, data scraping algorithms, or AI training queries against our directory pages without explicit, notarized licensing consents.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Scale className="h-4 w-4 text-blue-600" />
                3. Third Party Links and Commission Redirection
              </h2>
              <p>
                Our matrices contain outgoing hyperlinks that redirect to B2B partner sites. SaaSMatrix acts solely as an independent publication indexing service. We hold zero liability for the outcomes, server performance, transaction security, or software operation contracts signed on third-party domains. Click redirects at your own operational risk.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                4. Limit of Commercial Liability
              </h2>
              <p>
                SaaSMatrix, its developers, authors, and partner agencies shall not be liable for any financial losses, budget overruns, operational delays, data leaks, or missed business opportunities emerging from the implementation of software tools recommended, categorized, or compared on this website.
              </p>
            </div>

            <div className="space-y-3 pt-4 font-mono text-[10px] text-slate-400">
              If you have operational questions or require directory corrections, please file an official request to the engineering desk at support@saasmatrix.co.
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
