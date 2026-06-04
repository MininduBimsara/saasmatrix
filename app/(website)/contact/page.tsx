'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdContainer } from '@/components/AdContainer';
import { Mail, Check, MessageSquare, ShieldCheck, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    niche: 'general',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company || !formData.message) {
      setErrorText('Please populate all required fields so we can index your request correctly.');
      return;
    }
    setErrorText('');
    setIsLoading(true);
    try {
      const res = await fetch('https://formsubmit.co/ajax/minindufreelance@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...formData,
          _subject: 'New Contact Inquiry - SaaSPebble',
          _captcha: 'false',
          _honey: '',
        }),
      });
      const data = await res.json();
      if (data.success === 'true' || data.success === true) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', company: '', niche: 'general', message: '' });
      } else {
        setErrorText(data.message || 'Submission failed. Please try again or email us directly.');
      }
    } catch {
      setErrorText('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main id="contact-root-screen" className="flex-grow py-12 md:py-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="mb-6 text-xs text-slate-400 font-mono">
            <Link href="/" className="hover:text-blue-600">HOME</Link> / CONTACT US
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Human connection context (5 of 12) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase font-mono tracking-widest bg-blue-50 border border-blue-105 rounded-full text-blue-650 font-bold mb-3">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Direct Editorial Lines
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-905 tracking-tight leading-1.1">
                  How can we help your <span className="text-rose-500 italic font-sans">procurement</span> team?
                </h1>
                <p className="text-xs md:text-sm text-slate-650 leading-relaxed mt-4">
                  Have a suggestion for a comparative matrix, spotted pricing discrepancies, or want to submit your B2B application to our sandbox VM test pipeline? Fill the secure matrix on the right.
                </p>
              </div>

              {/* Verified Contact Details Grid */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase font-sans tracking-wide">Editorial Proposals</h4>
                    <p className="text-xs text-slate-500 mt-0.5">vetting@saaspebble.tech</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase font-sans tracking-wide">Compliance & AdSense Networks</h4>
                    <p className="text-xs text-slate-500 mt-0.5">compliance@saaspebble.tech</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-slate-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase font-sans tracking-wide">HQ Coordinates</h4>
                    <p className="text-xs text-slate-500 mt-0.5">SaaSPebble Network Inc., 100 Pine Street, San Francisco, CA 94111</p>
                  </div>
                </div>
              </div>

              {/* Proportional AdSense warning */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] text-slate-500 leading-normal">
                <strong>Google AdSense Compliance Safeguard</strong>: Listing applications in our B2B matrix arrays does NOT require fee payouts. All software packages undergo identical sandbox verification runs regardless of submission channels.
              </div>
            </div>

            {/* Right Column: Interaction Form widget container (7 of 12) */}
            <div id="contact-form-card" className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-slate-205 shadow-xs">
              
              <h3 className="text-base font-extrabold text-slate-900 mb-2">
                Secure Listing & General Inquiry Matrix
              </h3>
              <p className="text-xs text-slate-500 mb-6 leading-normal">
                Populate your details. Valid submissions are logged in our editorial registry and dispatched immediately to active reviewers.
              </p>

              {isSubmitted ? (
                <div id="submission-confirmation" className="bg-emerald-50 border border-emerald-150 p-6 rounded-xl flex items-start gap-3 text-emerald-900 animate-fadeIn">
                  <Check className="h-5 w-5 text-emerald-650 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-sm">Inquiry Secured!</h4>
                    <p className="text-xs text-emerald-705 mt-1 leading-relaxed">
                      Your query has been recorded. Our CPA audit team and platform content writers typically dispatch diagnostic reviews within two business days. Please monitor your corporate inbox.
                    </p>
                  </div>
                </div>
              ) : (
                <form id="contact-extended-form" onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-form-name" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Your Full Name <span className="text-blue-600">*</span>
                      </label>
                      <input
                        id="contact-form-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-form-company" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Corporate Company <span className="text-blue-600">*</span>
                      </label>
                      <input
                        id="contact-form-company"
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Acme Tech OS"
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-form-email" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Business E-mail Address <span className="text-blue-600">*</span>
                    </label>
                    <input
                      id="contact-form-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. sarah@acmetech.com"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-form-niche" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Vertical Directory Segment <span className="text-blue-600">*</span>
                    </label>
                    <select
                      id="contact-form-niche"
                      name="niche"
                      value={formData.niche}
                      onChange={handleChange}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white font-medium cursor-pointer"
                    >
                      <option value="general">General Corporate Inquiry</option>
                      <option value="accounting">Accounting & Finance Ledger</option>
                      <option value="project-management">Project & Operations Suite</option>
                      <option value="crm">CRM & Lead Pipeline</option>
                      <option value="hr-payroll">HR Compliance & Payroll</option>
                      <option value="developer">Developer Platforms & CDN</option>
                      <option value="other">Other High CPC Niche</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-form-message" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Detailed message / Listing specifications <span className="text-blue-600">*</span>
                    </label>
                    <textarea
                      id="contact-form-message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your SaaS product, target user seats pricing model, or spot reviews corrections..."
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white resize-y"
                      required
                    />
                  </div>

                  {errorText && (
                    <p className="text-[11px] font-bold text-rose-600 font-sans">
                      {errorText}
                    </p>
                  )}

                  <button
                    id="contact-submit-trigger"
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-805 text-white font-sans font-bold text-xs py-3.5 rounded-lg transition-colors hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Transmitting...' : 'Send Secured Transmission'}
                  </button>

                </form>
              )}

            </div>

          </div>

          {/* Leaderboard ad slot for monetization validation */}
          <div className="mt-12">
            <AdContainer layoutType="top-banner" slotId="contact-leaderboard-bottom" />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
