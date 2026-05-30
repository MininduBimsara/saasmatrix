'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Check, Shield, AlertCircle, FileText, Send } from 'lucide-react';

export function Footer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company) {
      setErrorStatus('Please provide name, email, and company name.');
      return;
    }
    setErrorStatus('');
    setIsSubmitted(true);
    // Persist mock action / display conversion success
    setTimeout(() => {
      setFormData({ name: '', email: '', company: '', message: '' });
    }, 2500);
  };

  return (
    <footer id="footer-comp" className="bg-white border-t border-slate-100 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="footer-desktop-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link 
                href="/" 
                className="flex items-center gap-1 focus:outline-none mb-6"
              >
                <span className="font-sans font-black text-2xl tracking-tight text-rose-500">
                  saas<span className="text-slate-900 font-bold">rooms</span>
                </span>
                <span className="h-2 w-2 rounded-full bg-rose-500 block animate-pulse mt-1" />
              </Link>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mb-4">
                SaaSRooms is the leading B2B catalog dashboard and performance index delivering independent SaaS evaluations and structural side-by-side matrices. Designed for maximum load efficiency and clear choice frameworks.
              </p>
            </div>
            {/* Direct compliance badge info */}
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-4">
              <span>&middot; Independent compliance review. AdSense safety verified.</span>
            </div>
          </div>

          {/* Quick link sets */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-4">
            <div>
              <h3 className="text-[10px] font-mono font-bold text-slate-850 uppercase tracking-widest mb-4">
                Software Indices
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/" className="text-xs text-slate-650 hover:text-slate-900 transition-colors">
                    Accounting Catalogs
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-xs text-slate-650 hover:text-slate-900 transition-colors">
                    Project Collaboration
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-xs text-slate-650 hover:text-slate-900 transition-colors">
                    CRM & Pipeline Suite
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-xs text-slate-650 hover:text-slate-900 transition-colors">
                    HR & Payroll Systems
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-mono font-bold text-slate-850 uppercase tracking-widest mb-4">
                Platform Rules
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/privacy" className="text-xs text-slate-650 hover:text-slate-900 transition-colors flex items-center gap-1 focus:outline-none">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-xs text-slate-650 hover:text-slate-900 transition-colors flex items-center gap-1 focus:outline-none">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimers" className="text-xs text-slate-650 hover:text-slate-900 transition-colors flex items-center gap-1 focus:outline-none">
                    Advertiser Disclosure
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-xs text-slate-650 hover:text-slate-900 transition-colors">
                    Editorial Standards
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-xs text-slate-650 hover:text-slate-900 transition-colors">
                    Contact Desk
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Form Sponsor Submission */}
          <div id="footer-contact" className="lg:col-span-4 bg-white p-6 rounded-md border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.01)]">
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-900 uppercase mb-1">
              Want Your Software Listed?
            </h3>
            <p className="text-[11px] text-slate-500 mb-4 leading-normal font-sans">
              Get targeted leads by submitting your company profile to our editorial board. Use the form below for directory inclusion reviews.
            </p>

            {isSubmitted ? (
              <div id="form-success" className="bg-slate-50 border border-slate-300 p-4 rounded-sm flex items-start gap-2.5 text-slate-800 text-xs animate-fadeIn font-mono">
                <div>
                  <p className="font-bold uppercase tracking-wider text-slate-900">PROPOSAL REGISTERED</p>
                  <p className="text-[10px] text-slate-650 mt-1">
                    Our directory editors will evaluate your product metrics against standard competition benchmarks within 48 business hours.
                  </p>
                </div>
              </div>
            ) : (
              <form id="footer-contact-form" onSubmit={handleFormSubmit} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="contact-name" className="sr-only">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xs text-slate-850 placeholder-slate-400 font-mono focus:outline-none focus:ring-1 focus:ring-slate-950 focus:bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-company" className="sr-only">Company</label>
                    <input
                      id="contact-company"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Company"
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xs text-slate-850 placeholder-slate-400 font-mono focus:outline-none focus:ring-1 focus:ring-slate-950 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-email" className="sr-only">Email address</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Work Email"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xs text-slate-850 placeholder-slate-400 font-mono focus:outline-none focus:ring-1 focus:ring-slate-950 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="sr-only">Brief message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={2}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Briefly describe your software niche..."
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xs text-slate-850 placeholder-slate-400 font-mono focus:outline-none focus:ring-1 focus:ring-slate-950 focus:bg-white resize-none"
                  />
                </div>

                {errorStatus && (
                  <p className="text-[10px] text-rose-600 font-bold font-mono">
                    {errorStatus.toUpperCase()}
                  </p>
                )}

                <button
                  id="submit-form-button"
                  type="submit"
                  className="w-full flex items-center justify-center bg-slate-900 hover:bg-slate-800 hover:cursor-pointer text-white text-[10px] font-mono uppercase tracking-widest font-bold py-2.5 rounded-sm transition-colors focus:ring-1 focus:ring-slate-950"
                >
                  REQUEST BOARD AUDIT
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Outer Bottom Strip */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} SaaSRooms Directory Network Inc. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Terms of Service</Link>
            <Link href="/disclaimers" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Advertiser Disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
