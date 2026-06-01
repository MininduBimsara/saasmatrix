'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdContainer } from '@/components/AdContainer';
import { SectionHeading } from '@/components/SectionHeading';
import { ArrowRight, CheckCircle, ShieldCheck, HelpCircle, Bookmark, Star } from 'lucide-react';

export default function AboutPage() {
  const PRINCIPLES = [
    {
      num: '01',
      title: 'Flawless Independent Sandbox Validation.',
      desc: 'We purchase our own product subscription seats using separate non-editorial credits. We perform system configuration runs and performance latency stress loops entirely on sandboxed guest client VMs.'
    },
    {
      num: '02',
      title: 'Zero Commission Override Standards.',
      desc: 'Commission payout tiers never influence star metrics or final verdicts. High-volume programs offering high affiliate margins receive identical rigor and are flagged aggressively if they fail user benchmarks.'
    },
    {
      num: '03',
      title: 'Audited Financial Compliance Focus.',
      desc: 'We weight GAAP ledger double-entry safety limits at 35% on all corporate directories. We explicitly flag systems operating simplified ledger mocks which risk accountant review friction.'
    },
    {
      num: '04',
      title: 'Absolute Layout Stability Metrics.',
      desc: 'We are committed to preserving sub-second load times. Our directory pages hold zero Cumulative Layout Shift (CLS) and run on automated static build deploys.'
    }
  ];

  const STEPS = [
    {
      step: 'STEP A',
      title: 'Blind Structural Acquisition',
      desc: 'Our procurement division obtains licenses anonymously without contacting vendor public relation networks.'
    },
    {
      step: 'STEP B',
      title: 'Sandbox VM System Latency Diagnostics',
      desc: 'We test performance load thresholds on standard container environments to measure API response pacing.'
    },
    {
      step: 'STEP C',
      title: 'GAAP and Financial Audit Integrity',
      desc: 'External accountants examine database transaction logs to verify strict dual-entry ledger compliance.'
    },
    {
      step: 'STEP D',
      title: 'Dual-Review Consensus Synthesis',
      desc: 'Two separate software evaluators verify feature claims independently prior to formulating matrix outcomes.'
    },
    {
      step: 'STEP E',
      title: 'Rolling Annual Re-Tests Trigger',
      desc: 'Every listed spreadsheet is reassessed on active sandboxes every 12 months to account for feature depreciation.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main id="about-methodology-root" className="flex-grow py-12 font-sans bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="mb-6 text-xs text-slate-400 font-mono">
            <Link href="/" className="hover:text-blue-600">HOME</Link> / EDITORIAL STANDARDS
          </nav>

          {/* Hero Section */}
          <section id="about-hero" className="mb-16 max-w-4xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-widest uppercase font-mono bg-blue-50 border border-blue-100 rounded-full text-blue-650">
              <ShieldCheck className="h-4 w-4" />
              Academic Standards Integrity
            </span>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-905 tracking-tight leading-[1.1]">
              We write the reviews we <span className="text-rose-500 italic font-sans animate-pulse">wish existed</span> when we were buying.
            </h1>

            <p className="text-base md:text-lg leading-relaxed text-slate-650 max-w-2xl pt-2">
              B2B procurement is riddled with sponsored top-ten arrays, copy-pasted marketing pitches, and hidden referral kickbacks. SaaSPebble rejects marketing fluff to deliver double-blind sandbox diagnostics.
            </p>
          </section>

          {/* Ad Container above main body blocks */}
          <AdContainer layoutType="top-banner" slotId="about-above-principles" />

          {/* 2x2 Principles Grid */}
          <section id="editorial-principles" className="my-16">
            <SectionHeading 
              title="Four Foundational Sourcing Ethics" 
              eyebrow="Editorial Trust" 
              emphasized="Sourcing Ethics" 
              meta="Core Principles"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {PRINCIPLES.map((p) => (
                <div 
                  id={`principle-card-${p.num}`}
                  key={p.num} 
                  className="bg-white border border-slate-200/80 p-6 rounded-xl hover:border-slate-350 transition-all duration-150 relative overflow-hidden"
                >
                  <span className="absolute top-4 right-6 font-sans italic font-extrabold text-slate-100 text-4xl select-none">
                    {p.num}
                  </span>
                  <span className="text-xs text-blue-600 font-mono font-bold uppercase tracking-wider block mb-2">
                    Principle {p.num}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 tracking-tight mb-2 pr-12">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Ordered vertical methodology stack */}
          <section id="sourcing-methodology" className="my-16">
            <SectionHeading 
              title="Step-by-Step Benchmarking Lifecycle" 
              eyebrow="Scientific Audit Process" 
              emphasized="Lifecycle" 
            />

            <div className="border border-slate-205 rounded-xl overflow-hidden divide-y divide-slate-150 bg-white">
              {STEPS.map((s) => (
                <div 
                  id={`methodology-run-${s.step}`}
                  key={s.step} 
                  className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-slate-50/50 transition-colors"
                >
                  <div className="md:col-span-3 text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">
                    {s.step}
                  </div>
                  <div className="md:col-span-9 space-y-1">
                    <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                      {s.title}
                    </h4>
                    <p className="text-xs text-slate-505 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Legal FTC and Affiliate Disclosure block */}
          <section id="ftc-legal-disclosure" className="p-6 md:p-8 border border-slate-200 bg-slate-50 rounded-2xl my-16 max-w-3xl">
            <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400 mb-2">
              FTC and Legal Compliance statement
            </h4>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              How SaaSPebble funds diagnostic operations safely
            </h3>
            <p className="text-xs leading-relaxed text-slate-505">
              Some links across reviews and compare lists are parsed. If a user click resolves in a vendor purchase tier, a minor licensing commission index is processed. These values never influence comparative metrics. We host Zero sponsored post programs. All pages undergo active supervision by monitoring CPA networks.
            </p>
          </section>

          {/* High contrast visual final CTA */}
          <section id="closing-cta" className="my-16 bg-slate-900 text-white p-8 md:p-12 rounded-2xl relative overflow-hidden text-center max-w-4xl mx-auto">
            <span className="absolute -bottom-8 -left-8 h-20 w-20 bg-blue-600/10 blur-xl rounded-full pointer-events-none" />
            
            <span className="inline-flex justify-center items-center gap-1 text-[10px] uppercase font-mono tracking-widest text-slate-350 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 mb-4">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              SaaSPebble Evaluator Networks
            </span>

            <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-4 max-w-xl mx-auto">
              Ready to find your next platform option?
            </h3>

            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
              Browse our directory archives or compute monthly ROI values inside our sandbox software evaluations instantly.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-3">
              <Link
                id="about-cta-reviews"
                href="/reviews"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors shadow-xs"
              >
                Browse verified matrices
              </Link>
              <Link
                id="about-cta-newsletter"
                href="/newsletter"
                className="inline-flex items-center justify-center bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold px-5 py-2.5 rounded-lg transition-colors border border-slate-700"
              >
                Join weekly list
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
