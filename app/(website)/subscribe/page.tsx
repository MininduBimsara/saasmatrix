'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdContainer } from '@/components/AdContainer';
import { 
  Check, 
  HelpCircle, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Info, 
  Lock, 
  CreditCard, 
  DollarSign, 
  ChevronDown, 
  ChevronUp,
  Award
} from 'lucide-react';

// FAQ data structure for interactive client toggles
interface FAQItem {
  q: string;
  a: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    q: "How does the Founder Pro backlink index boost B2B organic traffic?",
    a: "SaaSMatrix maintains high authority and clean Core Web Vitals. Placing your software in our matrix structures drives powerful Tier-1 referral and parasite SEO links, allowing you to bypass sandboxing phases and rank for high-intent search queries."
  },
  {
    q: "Can I cancel my subscription or update product sheets later?",
    a: "Yes. All subscriptions are self-serve is connected directly to billing systems. You can update pricing lists, starting seats, pros/cons sheets, and screenshot logs at any point in time from your profile board."
  },
  {
    q: "Do you offer localized pricing indices for APAC or EMEA teams?",
    a: "We bill strictly in US Dollars (USD). Google AdSense cookie pools and our premium outbound referrals prioritize Tier-1 high-intent purchasing agents, ensuring maximum commercial return."
  },
  {
    q: "How does Lemon Squeezy secure my enterprise transaction?",
    a: "We utilize Lemon Squeezy's secure Merchant of Record (MoR) checkout architecture. Lemon Squeezy processes, protects, and audits all payments, handling global TAX/VAT collection seamlessly under strict PCI-DSS regulations."
  }
];

export default function SubscribePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [setupTipsOpen, setSetupTipsOpen] = useState(true);

  // Read public key safely. Handle absence gracefully as mandated by environment guidelines.
  const handleCheckoutInitiation = async (planId: string) => {
    // Launch Phase redirect: All features are 100% free and sponsored by Google AdSense
    window.location.href = '/newsletter';
    return;
    
    /* 
    // Lemon Squeezy integration code preserved intact for future activation (1-2 months)
    setLoadingPlan(planId);
    try {
      const resp = await fetch('/api/lemonsqueezy/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          billingCycle,
          successUrl: window.location.origin + `/subscribe/success?planId=${planId}&cycle=${billingCycle}`,
          cancelUrl: window.location.origin + '/subscribe?cancel=true',
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || 'Connection pipeline failed.');
      }

      // Secure redirection to Lemon Squeezy (works for live and simulated sandboxes seamlessly)
      if (data.session && data.session.url) {
        window.location.href = data.session.url;
      } else {
        throw new Error('No checkout URL received from server.');
      }
    } catch (err: any) {
      console.error('Checkout transition failed:', err);
      alert(`Checkout Notice: ${err.message || err}. A simulated sandbox route is executing instead.`);
      // Ultimate local sandbox safety escape-hatch:
      window.location.href = `/subscribe/sandbox-success?planId=${planId}&cycle=${billingCycle}&amount=${planId === 'founder-pro' ? (billingCycle === 'yearly' ? 468 : 49) : (billingCycle === 'yearly' ? 180 : 19)}`;
    } finally {
      setLoadingPlan(null);
    }
    */
  };

  const toggleFaq = (idx: number) => {
    setSelectedFaq(selectedFaq === idx ? null : idx);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main id="subscription-page-root" className="flex-grow py-12 md:py-16 font-sans bg-white text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="mb-6 text-xs text-slate-400 font-mono">
            <Link href="/" className="hover:text-blue-600">HOME</Link> / PREMIUM SPONSORSHIPS & COGNITIVE ACCESS
          </nav>

          {/* Heading Pitch */}
          <header className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase font-mono tracking-widest bg-amber-50 border border-amber-200 rounded-full text-amber-750 font-black mb-3">
              <Sparkles className="h-3 w-3 text-amber-600 animate-spin-slow" />
              SaaSRooms Launch Phase: 100% Free Access
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-950 font-sans leading-tight">
              Acquire Tier-1 High-intent <span className="text-rose-500 font-sans italic">B2B Software</span> Traffic
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-slate-650 mt-4">
              Access directory index boosts, priority software reviews, custom ROI calculators, and our complete PDF safeguards workbook for **100% Free** during our ad-supported preview.
            </p>
          </header>

          {/* AdSense Notice Box detailing sponsored launch status */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl flex items-start gap-3.5">
              <Info className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-normal">
                <p className="font-extrabold text-amber-900 flex items-center gap-1.5 uppercase font-mono tracking-wider text-[10px]">
                  Google AdSense Sponsored Launch Campaign
                </p>
                <p className="mt-1">
                  We are currently delaying our direct, paid Lemon Squeezy subscription gates for the first 2-3 months to build the largest aggregate matrix library on the web! During this phase, all premium B2B listings, full software reviews, and exportable data matrix tools are completely free to read—fully subsidized by non-intrusive **Google AdSense** sponsorships. No credit card required. Simply claim your access by joining our free Insider Dispatch newsletter pool below.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Term Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-xs uppercase font-mono tracking-wider font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>
              Monthly Cycle
            </span>
            <button
              id="billing-cycle-switch"
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-8 bg-slate-900 hover:bg-slate-800 rounded-full p-1 transition-colors relative focus:outline-none cursor-pointer"
            >
              <div 
                className={`h-6 w-6 rounded-full bg-amber-500 absolute top-1 transition-all shadow ${billingCycle === 'yearly' ? 'left-7' : 'left-1'}`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs uppercase font-mono tracking-wider font-bold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>
                Yearly Cycle
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-200 text-emerald-850 font-mono text-[10px] rounded-full uppercase font-black">
                SAVE 20%
              </span>
            </div>
          </div>

          {/* Dual Main Pricing Cards Grid (Optimized for conversion/CRO) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            
            {/* Plan Card A: FOUNDER PRO */}
            <div 
              id="plan-card-founder"
              className="bg-white border-2 border-slate-900 p-8 rounded-2xl relative shadow-md flex flex-col justify-between"
            >
              <div>
                <span className="absolute -top-3.5 left-6 px-3 py-1 bg-amber-500 text-slate-950 font-mono text-[10px] uppercase tracking-wider font-black border border-slate-950 rounded-full flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" />
                  SaaS Founder Pick
                </span>

                <div className="mb-6 pt-2">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight uppercase font-sans">
                    Founder Pro Listing Boost
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Perfect for Micro-SaaS scaleups and individual developers to gain Tier-1 backlink power and commercial ad-free visibility vectors.
                  </p>
                </div>

                {/* Price Display */}
                <div id="price-founder-section" className="mb-6 pb-6 border-b border-slate-100 flex items-baseline gap-1.5">
                  <span className="text-5xl font-extrabold text-slate-950 tracking-tight line-through opacity-40">
                    ${billingCycle === 'yearly' ? '39' : '49'}
                  </span>
                  <span className="text-4xl font-extrabold text-amber-600 ml-1">
                    $0
                  </span>
                  <span className="text-xs uppercase font-mono text-slate-450 font-bold">
                    / FREE LAUNCH PHASE
                  </span>
                </div>

                {/* Benefits List */}
                <h4 className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold mb-4">
                  Everything Included in Founder Pro:
                </h4>
                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-start gap-3 text-xs leading-tight text-slate-700">
                    <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>1x Guaranteed Directory Position</strong> within selected high-CPC category arrays.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs leading-tight text-slate-700">
                    <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Verified High-Trust Backlink Index</strong> to feed Google crawler authority algorithms.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs leading-tight text-slate-700">
                    <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Self-Serve Schema Updates</strong> to edit pricing seat thresholds and pros/cons grids live.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs leading-tight text-slate-700">
                    <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>No Competitor Ads</strong> displayed directly on your review page.</span>
                  </li>
                </ul>
              </div>

              <button
                id="btn-trigger-checkout-founder"
                onClick={() => handleCheckoutInitiation('founder-pro')}
                className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs uppercase font-extrabold py-4 rounded-xl cursor-pointer transition-colors shadow-sm tracking-wider flex items-center justify-center gap-2"
              >
                <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>Claim Free Founder Spot (Ad-Sponsored)</span>
              </button>
            </div>

            {/* Plan Card B: ENTERPRISE BUYER */}
            <div 
              id="plan-card-enterprise"
              className="bg-white border border-slate-200 p-8 rounded-2xl relative shadow-xs flex flex-col justify-between hover:border-slate-350 transition-colors"
            >
              <div>
                <span className="absolute -top-3.5 left-6 px-3 py-1 bg-slate-900 text-slate-200 font-mono text-[10px] uppercase tracking-wider font-extrabold border border-slate-800 rounded-full flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-slate-450" />
                  Negotiator Intelligence
                </span>

                <div className="mb-6 pt-2">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight uppercase font-sans">
                    Buyer Procurement Intelligence
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Designed for operations leaders, CFOs, and tech procurement managers to compute real-world SLA multipliers and comparative ROI outputs.
                  </p>
                </div>

                {/* Price Display */}
                <div id="price-enterprise-section" className="mb-6 pb-6 border-b border-slate-100 flex items-baseline gap-1.5">
                  <span className="text-5xl font-extrabold text-slate-950 tracking-tight line-through opacity-40">
                    ${billingCycle === 'yearly' ? '15' : '19'}
                  </span>
                  <span className="text-4xl font-extrabold text-emerald-650 ml-1">
                    $0
                  </span>
                  <span className="text-xs uppercase font-mono text-slate-450 font-bold">
                    / FREE LAUNCH PHASE
                  </span>
                </div>

                {/* Benefits List */}
                <h4 className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold mb-4">
                  Everything Included in Intelligence Matrix:
                </h4>
                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-start gap-3 text-xs leading-tight text-slate-700">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Unthrottled Interactive ROI Formulas</strong> with localized custom parameter inputs.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs leading-tight text-slate-700">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Export Complete Comparison Grids</strong> as interactive CSV or formatted PDF briefs.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs leading-tight text-slate-700">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Ad-Free Reading Experience</strong> across all reviews, category grids, and dispatch blogs.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs leading-tight text-slate-700">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>E-mail Slack Alerts</strong> for localized pricing changes and competitor license breaches.</span>
                  </li>
                </ul>
              </div>

              <button
                id="btn-trigger-checkout-enterprise"
                onClick={() => handleCheckoutInitiation('enterprise-buyer')}
                className="w-full text-center bg-blue-650 hover:bg-blue-700 text-white font-sans text-xs uppercase font-extrabold py-4 rounded-xl cursor-pointer transition-colors shadow-sm tracking-wider flex items-center justify-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Claim Free Buyer Access (Ad-Sponsored)</span>
              </button>
            </div>

          </div>

          {/* Secure Lemon Squeezy Trust Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-6 border-t border-b border-slate-100 max-w-5xl mx-auto mb-16 text-xs text-slate-450 font-mono">
            <span className="flex items-center gap-1.5 uppercase font-bold text-[10px]">
              <ShieldCheck className="h-4 w-4 text-emerald-650" />
              Lemon Squeezy Merchant of Record Partner
            </span>
            <span className="hidden sm:inline text-slate-250">&bull;</span>
            <span className="flex items-center gap-1.5 uppercase font-bold text-[10px]">
              <Lock className="h-4 w-4 text-slate-400" />
              Sovereign Global TAX & VAT Handling
            </span>
            <span className="hidden sm:inline text-slate-250">&bull;</span>
            <span className="flex items-center gap-1.5 uppercase font-bold text-[10px]">
              <DollarSign className="h-4 w-4 text-blue-600" />
              PCI-DSS Secure Direct checkout Routing
            </span>
          </div>

          {/* FAQs Accordion Matrix */}
          <section id="subscription-faqs" className="max-w-3xl mx-auto mb-16">
            <h3 className="text-sm font-extrabold uppercase font-mono text-center tracking-widest text-slate-400 mb-8 flex items-center justify-center gap-2">
              <HelpCircle className="h-4 w-4 text-slate-400" />
              Frequently Asked Questions
            </h3>

            <div className="space-y-4">
              {FAQ_LIST.map((faq, idx) => (
                <div 
                  id={`faq-accordion-item-${idx}`}
                  key={idx} 
                  className="bg-slate-50 border border-slate-150 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 flex items-center justify-between text-xs md:text-sm font-extrabold text-slate-900 focus:outline-none cursor-pointer hover:bg-slate-100/50"
                  >
                    <span>{faq.q}</span>
                    {selectedFaq === idx ? (
                      <ChevronUp className="h-4 w-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    )}
                  </button>

                  {selectedFaq === idx && (
                    <div className="p-5 pt-0 text-xs md:text-sm text-slate-650 leading-relaxed border-t border-slate-150/50 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Ad Container above the bottom of page to double check monetization layout support */}
          <div className="mt-12">
            <AdContainer layoutType="top-banner" slotId="subscription-footer-ads" />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
