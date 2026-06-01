import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AlertCircle, Landmark, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Advertiser Disclosure & FTC Compliance | SaaSMatrix',
  description: 'How SaaSMatrix guarantees editorial transparency, our funding model, and AdSense and affiliate compliance matrices.',
};

export default function DisclaimersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main id="disclaimers-root" className="flex-grow py-12 md:py-16 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-xs text-slate-400 font-mono">
            <Link href="/" className="hover:text-blue-600">HOME</Link> / ADVERTISER DISCLOSURE
          </nav>

          <header className="mb-10 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1 px-2.5 bg-amber-50 border border-amber-100 rounded-full text-[10px] uppercase font-mono tracking-widest font-black text-amber-700 flex items-center gap-1.5">
                <Landmark className="h-3 w-3 text-amber-600" />
                Sponsorship Transparency Matrix
              </span>
              <span className="text-slate-400 font-mono text-[10px]">Updated: May 28, 2026</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-905 tracking-tight leading-tight">
              Advertiser & Affiliate Disclosure
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-slate-650 mt-3">
              Total publication transparency is our highest-yielding metric. Learn how SaasMatrix finances its sandbox VM diagnostic review loops.
            </p>
          </header>

          <section className="space-y-8 text-xs md:text-sm text-slate-650 leading-relaxed font-sans">
            {/* Quick Summary Statement */}
            <div className="p-6 border border-blue-150 bg-blue-50/50 rounded-2xl">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                The Core Funding Guarantee
              </h3>
              <p className="text-xs text-slate-705 leading-relaxed">
                We will NEVER rank a software platform higher, nor grant a positive verdict tag, simply because they pay us. We refuse paid reviews or sponsored content placements that bypass our validation sandbox VMs. All star grades, comparison margins, and editorial commentary are determined with total autonomy.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                What is an Affiliate / Partner Link?
              </h2>
              <p>
                When reading comparisons or viewing our high-density indexes, you may select checkout or demo buttons. Some of these outbound redirects are embedded with referral track tags. If you click on one of these partner links and subsequently purchase a subscription tier within a specified cookie dwell timeframe, SaaSMatrix receives a minor licensing referral fee from the vendor.
              </p>
              <p>
                This referral happens entirely at no extra cost to your organization. Indeed, in many instances, our integration partnerships grant our readers exclusive promo codes that lower standard entry seats pricing by 10% to 20%.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                How AdSense Placements Integrate Safely
              </h2>
              <p>
                To offset the high processing overhead of running continuous diagnostic tests, sandbox container VMs, and GAAP audit checkups, we display programmatic ads via Google AdSense. These layouts are placed strictly in non-obtrusive banners to preserve sub-second CLS (Cumulative Layout Shift) speed metrics. We strictly adhere to AdSense placement policies and never reward clicks, hide links with confusing structures, or prompt users to engage with banners artificially.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                FTC Guidelines Conformity
              </h2>
              <p>
                In alignment with United States Federal Trade Commission (FTC) guidelines, we assure complete disclosure on every page displaying directory options. We believe transparent economics are essential to building highly resilient long-term user authority.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-8 text-[11px] text-slate-400">
              For corporate legal inquiries or to review our software testing sandboxes directly, please reach out to operations@saasmatrix.co.
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
