'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdContainer } from '@/components/AdContainer';
import { SectionHeading } from '@/components/SectionHeading';
import { Mail, Check, Star, CheckCircle, ArrowRight, Shield } from 'lucide-react';

export default function NewsletterPage() {
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const BENEFITS = [
    {
      title: 'Tuesday In-Depth Audits',
      desc: 'One enterprise software system completely dissected on sandboxed VMs every Tuesday morning.'
    },
    {
      title: 'Subscriber-Only Database Deep Dives',
      desc: 'Our complete historical latency and rate limit logs exported as interactive spreadsheets.'
    },
    {
      title: 'SaaS License Pricing Change Alerts',
      desc: 'Automatic email alerts the moment tracked platforms change license thresholds or hike fees.'
    },
    {
      title: 'First Read Access Passes',
      desc: 'Get early access draft transcripts for upcoming analytical essays, free from paywalls.'
    }
  ];

  const TESTIMONIALS = [
    {
      quote: 'We avoided a $35k multi-year licensing trap thanks to the Asana vs ClickUp seat limit guide.',
      author: 'Marcus Vance',
      role: 'VP Operations, ScaleFlow'
    },
    {
      quote: 'The dual-ledger analysis is extremely objective. Our accounting team now mandates QuickBooks Online.',
      author: 'Julia Chen',
      role: 'CFO, Apex Ventures'
    },
    {
      quote: 'Simple, direct, and zero promotional noise. Highly recommended for collaborative directors.',
      author: 'Aris Thorne',
      role: 'Director of Architecture, DevHop'
    }
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubmitError('');
    setIsLoading(true);
    try {
      const res = await fetch('https://formsubmit.co/ajax/minindufreelance@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          _subject: 'New Newsletter Subscription - SaaSPebble',
          _captcha: 'false',
          _honey: '',
        }),
      });
      const data = await res.json();
      if (data.success === 'true' || data.success === true) {
        setIsSubmitted(true);
      } else {
        setSubmitError(data.message || 'Subscription failed. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main id="newsletter-landing-root" className="flex-grow py-12 font-sans bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="mb-6 text-xs text-slate-400 font-mono">
            <Link href="/" className="hover:text-blue-600">HOME</Link> / THE DISPATCH NEWSLETTER
          </nav>

          <SectionHeading
            as="h1"
            title="The Insider Dispatch & SaaSPebble Resource Library"
            eyebrow="Subscriber Loop"
            emphasized="Dispatch"
          />

          {/* Two-Column Pitch and Sign-up row layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
            
            {/* Left Column: Premium Value Pitch Section (7 / 12 width) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 uppercase font-mono tracking-wider">
                  <Mail className="h-3.5 w-3.5" />
                  Premium Sandbox PDF Lead Magnet Included
                </span>
                
                <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  Claim Your Free Copy of the <span className="italic font-sans text-rose-500">&ldquo;SaaS Licensing Contract Safeguards&rdquo;</span> PDF.
                </h2>
                
                <p className="text-sm text-slate-600 leading-relaxed">
                  Join over 14,000 corporate procurement executives, tech scaleup founders, and analytical CFOs receiving diagnostic payloads directly.
                </p>

                {/* Bullets mapping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {BENEFITS.map((b) => (
                    <div id={`benefit-row-${b.title.toLowerCase().replace(/\s+/g, '-')}`} key={b.title} className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-900">{b.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal pl-5">
                        {b.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social proof baseline indicator */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-450">
                <span className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </span>
                <span>Trusted by over <strong>14,200</strong> active corporate decision-makers globally.</span>
              </div>
            </div>

            {/* Right Column: Dark Theme Form Card with FREE PDF decorative wheel (5 / 12 width) */}
            <div id="newsletter-form-container" className="lg:col-span-5 relative bg-slate-900 text-white p-6 md:p-8 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-md overflow-hidden">
              
              {/* Decorative custom Free PDF badge in the corner */}
              <div className="absolute -top-3 -right-3 h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-mono font-bold text-[10px] tracking-widest rotate-12 shadow-lg border border-slate-800 select-none z-10">
                FREE PDF
              </div>

              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block mb-1">
                  Secure Newsletter Dispatch Gate
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                  Subscribe to Insider Dispatch list
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Verify your coordinate values and claim your complimentary sandbox contract workbook download instantly.
                </p>
              </div>

              {isSubmitted ? (
                <div id="success-state-container" className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 p-5 rounded-xl space-y-3">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    Transcript Workbook Confirmed!
                  </div>
                  <p className="text-xs leading-relaxed text-emerald-300">
                    A secure PDF contract link is sent to <strong className="text-white font-mono">{emailInput}</strong>. Check your priority inbox filter or spam parameters in 2-3 minutes.
                  </p>
                </div>
              ) : (
                <form id="dispatch-form" onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono mb-2">
                      Your business email coordinates:
                    </label>
                    <input
                      id="input-newsletter-email"
                      type="email"
                      placeholder="e.g. decisionmaker@scalecorp.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full text-xs px-4 py-3 border border-slate-800 bg-slate-950 text-white rounded-xl placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-slate-950"
                      required
                    />
                  </div>

                  <button
                    id="submit-newsletter-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 px-4 rounded-xl cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Subscribing...' : 'Receive Free PDF Workbook & Join List'}
                    {!isLoading && <ArrowRight className="h-4 w-4" />}
                  </button>

                  {submitError && (
                    <p className="text-[10px] text-rose-400 font-bold text-center">{submitError}</p>
                  )}

                  <div className="flex items-center gap-1 text-[10px] text-slate-500 justify-center">
                    <Shield className="h-3 w-3" />
                    <span>No spam. Single-click subscription deactivations.</span>
                  </div>
                </form>
              )}

              <div className="border-t border-slate-800 pt-3 mt-4 text-[10px] text-slate-500 font-mono text-center">
                GAAP Standard Monitored Safe &bull; Updated today
              </div>

            </div>

          </div>

          {/* Bottom Testimonials Row (Bordered cards with pull-quote orange border) */}
          <section id="proof-testimonials">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono mb-6">
              Active Subscriber feedback
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, idx) => (
                <div 
                  id={`testimonial-card-${idx}`}
                  key={idx} 
                  className="bg-white border border-slate-200/80 p-5 rounded-xl border-l-4 border-l-blue-600 hover:border-slate-350 transition-all shadow-2xs"
                >
                  <p className="text-xs italic leading-relaxed text-slate-650 mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="text-[10px] font-mono leading-tight">
                    <strong className="block text-slate-900 uppercase">{t.author}</strong>
                    <span className="text-slate-400 text-[9px] block mt-0.5">{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Optional inline banner placements */}
          <div className="mt-12">
            <AdContainer layoutType="top-banner" slotId="newsletter-bottom" />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
