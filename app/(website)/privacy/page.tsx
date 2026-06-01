import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ShieldAlert, Fingerprint, RefreshCw, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | SaaSPebble',
  description: 'Detailed details on Google AdSense third-party cookie tags, GDPR rights, CCPA opt-outs, and database logging compliance matrices.',
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main id="privacy-root" className="flex-grow py-12 md:py-16 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-xs text-slate-400 font-mono">
            <Link href="/" className="hover:text-blue-600">HOME</Link> / PRIVACY POLICY
          </nav>

          <header className="mb-10 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1 px-2.5 bg-blue-50 border border-blue-100 rounded-full text-[10px] uppercase font-mono tracking-widest font-black text-blue-650 flex items-center gap-1.5">
                <Fingerprint className="h-3 w-3 text-blue-600" />
                Compliance Framework 2026
              </span>
              <span className="text-slate-400 font-mono text-[10px]">Updated: May 28, 2026</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-905 tracking-tight leading-tight">
              Privacy & Cookie Services Policy
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-slate-650 mt-3">
              Understanding how your user data indexes are monitored on our sandboxed B2B directory servers.
            </p>
          </header>

          <section className="space-y-8 text-xs md:text-sm text-slate-650 leading-relaxed font-sans">
            {/* AdSense Opt-in Warning Callout */}
            <div className="p-5 border border-amber-200 bg-amber-50/50 rounded-xl flex items-start gap-3 text-amber-900">
              <ShieldAlert className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs">AdSense Third-Party Cookies Notice</p>
                <p className="text-[11px] leading-relaxed mt-1 text-slate-700">
                  Google AdSense utilizes specialized DART cookies to index and display relevant personalized advertisements on this platform based on your previous B2B software exploration history across other digital portals.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                1. Information Sourced Automatically
              </h2>
              <p>
                We collect standard metadata metrics generated during connection cycles, including IP addresses, Web Browser specifications, referring redirect urls, time clock indexes, and active pageview intervals. This data helps optimize response latency matrix scores and prevent Sybil system traffic logs.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                2. Third-Party Publisher Partners & Network Advertising Cookies
              </h2>
              <p>
                Our platform leverages third-party programmatic networks (specifically Google AdSense) that deploy web cookies, system identifiers, and edge telemetry to display dynamic user-behavior targeted promotions. The use of these cookies enables our partners to serve ads based on visits to SaaSPebble and other sites on the Internet.
              </p>
              <p>
                Users can review their advertising permissions or completely opt-out of personalized cookie delivery strategies by visiting the{' '}
                <a 
                  href="https://policies.google.com/technologies/ads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-650 hover:underline font-bold"
                >
                  Google Ad Policies Hub
                </a>.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                3. Lead Submission Forms and Private Ledger Storage
              </h2>
              <p>
                If you choose to submit a SaaS listing proposal via our interactive Footer Contact portal, we securely store the business name, representative work e-mail address, and product details. This information is processed exclusively for vetting purposes and is never bartered or shared with competitor software operations or spam registries.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                4. General Data Protection Regulation (GDPR) and California Consumer Rights (CCPA)
              </h2>
              <p>
                Under localized data frameworks, European Union and California residents hold legal rights to:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-4 text-slate-600 my-2">
                <li>Request access index outputs containing our active records on file.</li>
                <li>Demand complete and unrecoverable deletion of your submission logs.</li>
                <li>Decline automated marketing profiling loops.</li>
                <li>Revoke cookie caching privileges at any point in time.</li>
              </ul>
              <p>
                To trigger an automated CCPA Do-Not-Sell query or GDPR delete script, please address your legal team coordinates directly to our compliance officer at <span className="font-mono bg-slate-50 border border-slate-150 rounded px-1.5 p-0.5">compliance@saaspebble.co</span>.
              </p>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-8 mt-8">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <RefreshCw className="h-3.5 w-3.5 animate-spin-slow text-slate-350" />
                <span>We periodically review this policy to reflect automated crawler rules.</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
