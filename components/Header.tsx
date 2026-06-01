'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { label: 'Calculator', href: '/calculator', id: 'mobile-link-calculator' },
    { label: 'About', href: '/about', id: 'mobile-link-about' },
  ];

  // Quick action helper to trigger scrolling/focus to search field
  const handleSearchPillClick = () => {
    const searchInput = document.getElementById('search-input-box');
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        searchInput.focus();
      }, 500);
    } else {
      const gridElem = document.getElementById('directory-grid');
      if (gridElem) {
        gridElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        router.push('/compare');
      }
    }
  };

  return (
    <header 
      id="main-app-header" 
      className="sticky top-0 z-50 w-full h-20 bg-white border-b border-slate-100 flex items-center shadow-xs"
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left Section: Airbnb-Style Elegant Logo with dot accent */}
        <div className="flex items-center">
          <Link 
            id="header-logo-link"
            href="/" 
            className="flex items-center gap-1 focus:outline-none"
          >
            <span className="font-sans font-black text-xl md:text-2xl tracking-tight text-rose-500">
              SaaS<span className="text-slate-900 font-bold">Pebble</span>
            </span>
            <span className="h-2 w-2 rounded-full bg-rose-500 block animate-pulse mt-1" />
          </Link>
        </div>

        {/* Middle Section: Famous Airbnb Search Pill */}
        <div className="hidden md:block">
          <div 
            className="flex items-center bg-white border border-slate-200 hover:border-slate-300 rounded-full py-2 px-3 pl-5 shadow-sm hover:shadow-md transition-all select-none"
          >
            <Link href="/compare" className="text-xs font-bold text-slate-800 pr-4 border-r border-slate-100 hover:text-blue-600 transition-colors cursor-pointer">
              Compare
            </Link>
            <Link href="/reviews" className="text-xs font-bold text-slate-800 px-4 border-r border-slate-100 hover:text-blue-600 transition-colors cursor-pointer">
              Review
            </Link>
            <Link href="/blog" className="text-xs font-bold text-slate-800 px-4 border-r border-slate-100 hover:text-blue-600 transition-colors cursor-pointer">
              Blog
            </Link>
            <button type="button" onClick={handleSearchPillClick} className="text-xs font-medium text-slate-400 pl-4 pr-1 flex items-center gap-3 cursor-pointer outline-none hover:text-slate-600 bg-transparent border-none">
              Find comparisons
              <span className="h-8 w-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs hover:scale-105 transition-transform">
                <Search className="h-4 w-4 stroke-[3]" />
              </span>
            </button>
          </div>
        </div>

        {/* Right Section: Interactive User Profile Cluster */}
        <div className="flex items-center gap-3">
          
          {/* Subtle text link */}
          <Link
            id="header-become-auditor"
            href="/about"
            className="hidden lg:block text-xs font-bold text-slate-700 hover:bg-slate-50 py-2 px-3 rounded-full transition-colors"
          >
            Become an Auditor
          </Link>


          {/* Airbnb profile pill button */}
          <div className="flex items-center gap-2">
            <button
              id="header-profile-menu-pill"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-3 border border-slate-200 hover:shadow-md py-1.5 pl-3 pr-1.5 rounded-full bg-white transition-all cursor-pointer min-h-[44px] select-none touch-manipulation"
            >
              <Menu className="h-4 w-4 text-slate-600" />
              {/* Decorative aesthetic icon */}
              <div className="h-7 w-7 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation and Shortcut Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 top-20 bg-slate-900 z-40"
          />
        )}

        {isMobileMenuOpen && (
          <motion.div 
            key="drawer"
            id="mobile-navigation-drawer"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-20 right-4 sm:right-8 w-[280px] bg-white border border-slate-100 rounded-3xl shadow-xl z-50 flex flex-col p-4 gap-2 mr-3"
          >
              <div className="flex flex-col py-1 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSearchPillClick();
                  }}
                  className="px-4 min-h-[44px] flex items-center gap-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors text-left"
                >
                  <Search className="h-4 w-4 text-slate-400" />
                  Search & Compare
                </button>
              </div>

              <div className="flex flex-col py-1 border-b border-slate-100">
                <Link
                  href="/newsletter"
                  id="mobile-link-join-dispatch"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 min-h-[44px] flex items-center text-xs font-bold text-rose-500 hover:bg-slate-50 rounded-xl transition-colors text-left"
                >
                  Join Weekly Dispatch
                </Link>
                <Link
                  href="/about"
                  id="mobile-link-manifesto"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 min-h-[44px] flex items-center text-xs font-bold text-slate-900 hover:bg-slate-50 rounded-xl transition-colors text-left"
                >
                  Auditing Manifesto
                </Link>
              </div>

              <div className="flex flex-col py-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                  return (
                    <Link
                      key={link.href}
                      id={link.id}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 min-h-[44px] flex items-center text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors text-left ${
                        isActive ? 'text-slate-950 font-bold bg-slate-50' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="bg-slate-50 rounded-2xl p-3.5 mt-1 border border-slate-100 text-[10px] leading-relaxed text-slate-400">
                SAASPEBBLE runs an independent software laboratory using certified auditing procedures. No paid referral loops.
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
