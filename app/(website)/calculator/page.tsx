'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdContainer } from '@/components/AdContainer';
import { TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

export default function CalculatorPage() {
  const [hoursSaved, setHoursSaved] = useState<number>(5);
  const [hourlyRate, setHourlyRate] = useState<number>(45);
  const [seatCost, setSeatCost] = useState<number>(12);
  const [teamSize, setTeamSize] = useState<number>(8);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);


  // Recompute full economic analysis when variables change
  const report = useMemo(() => {
    const weeklyValue = hoursSaved * hourlyRate * teamSize;
    const monthlyValue = Math.round(weeklyValue * 4.33);
    const monthlyCost = Math.round(seatCost * teamSize);
    const netBenefit = monthlyValue - monthlyCost;
    const roiPercentage = monthlyCost > 0 ? Math.round((netBenefit / monthlyCost) * 100) : 0;
    
    // Payback period (days)
    const dailyValueRate = (monthlyValue / 30);
    const paybackDays = dailyValueRate > 0 ? Math.max(1, Math.round(monthlyCost / dailyValueRate)) : 0;

    return {
      weeklyValue,
      monthlyValue,
      monthlyCost,
      netBenefit,
      roiPercentage,
      paybackDays
    };
  }, [hoursSaved, hourlyRate, seatCost, teamSize]);

  // Derive dynamic verdict labels based on net monthly benefit
  const verdict = useMemo(() => {
    const { netBenefit } = report;
    if (netBenefit <= 0) {
      return {
        label: 'Skip it',
        bg: 'bg-rose-950 border-rose-800 text-rose-300',
        badge: 'bg-rose-900 text-rose-100',
        summary: 'The software cost exceeds estimated human timezone efficiency gains.'
      };
    } else if (netBenefit < 250) {
      return {
        label: 'Marginal',
        bg: 'bg-amber-950 border-amber-800 text-amber-300',
        badge: 'bg-amber-900 text-amber-100',
        summary: 'Minor operational agility improvements, but margins remain tight.'
      };
    } else if (netBenefit < 1000) {
      return {
        label: 'Worth it',
        bg: 'bg-blue-950 border-blue-800 text-blue-300',
        badge: 'bg-blue-900 text-blue-100',
        summary: 'Substantial efficiency yield. Easily justifies license invoice fees.'
      };
    } else {
      return {
        label: 'No-brainer',
        bg: 'bg-emerald-950 border-emerald-800 text-emerald-300',
        badge: 'bg-emerald-900 text-emerald-100',
        summary: 'Phenomenal productivity yield. Highly recommended scaling accelerator.'
      };
    }
  }, [report]);

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-slate-800 transition-colors duration-300 font-sans selection:bg-rose-100 flex flex-col">
      <Header />

      <main id="roi-calculator-root" className="flex-grow pt-10 pb-16 lg:py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-12 w-[300px] h-[300px] bg-amber-50/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-14 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-full bg-rose-50 border border-rose-100 text-rose-500 mb-2">
              <TrendingUp className="h-3.5 w-3.5" />
              Lead Generation Utility
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.08] tracking-tight">
              Return-On-Spend <span className="text-rose-500 italic font-serif font-normal">Calculator</span>
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-slate-500 font-medium">
              Calculate if premium license costs translate to measurable productivity yield. Toggle hourly saves and rate matrices below to calculate payback velocities.
            </p>
          </div>

          {!isMounted ? (
            <div className="w-full h-96 animate-pulse bg-slate-100 rounded-xl mb-16" />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
              
              {/* Left Column: Sliders Controllers (7 / 12 width) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Slider 1: Hours saved per week */}
                <div className="bg-white border border-slate-200/80 p-6 rounded-[24px] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-900">Hours Saved Per Week (Team Avg)</span>
                    <span className="text-2xl font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-xl">{hoursSaved} <span className="text-xs text-rose-400 uppercase tracking-widest ml-0.5">hrs</span></span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={hoursSaved}
                    onChange={(e) => setHoursSaved(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-extrabold uppercase mt-3">
                    <span>1 HR</span>
                    <span>40 HRS</span>
                  </div>
                </div>

                {/* Slider 2: Average Hourly Rate */}
                <div className="bg-white border border-slate-200/80 p-6 rounded-[24px] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-900">Average Blended Hourly Rate</span>
                    <span className="text-2xl font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-xl"><span className="text-xs text-blue-400 mr-0.5">$</span>{hourlyRate}<span className="text-xs text-blue-400 uppercase tracking-widest ml-0.5">/hr</span></span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="150"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-extrabold uppercase mt-3">
                    <span>$15/HR</span>
                    <span>$150/HR</span>
                  </div>
                </div>

                {/* Slider 3: Starting Seat Fee */}
                <div className="bg-white border border-slate-200/80 p-6 rounded-[24px] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-900">Tool Monthly Cost Per Seat</span>
                    <span className="text-2xl font-black text-amber-500 bg-amber-50 px-3 py-1 rounded-xl"><span className="text-xs text-amber-400 mr-0.5">$</span>{seatCost}<span className="text-xs text-amber-400 uppercase tracking-widest ml-0.5">/mo</span></span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    value={seatCost}
                    onChange={(e) => setSeatCost(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-extrabold uppercase mt-3">
                    <span>$5</span>
                    <span>$120</span>
                  </div>
                </div>

                {/* Slider 4: Team size */}
                <div className="bg-white border border-slate-200/80 p-6 rounded-[24px] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-900">Active Team Seats Count</span>
                    <span className="text-2xl font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-xl">{teamSize} <span className="text-xs text-emerald-400 uppercase tracking-widest ml-0.5">seats</span></span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-extrabold uppercase mt-3">
                    <span>1 SEAT</span>
                    <span>100 SEATS</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Outcomes in dark theme layout (5 / 12 width) */}
              <div className="lg:col-span-5 relative">
                <div className="sticky top-28 bg-slate-900 text-white p-8 rounded-[32px] border border-slate-800 shadow-2xl flex flex-col gap-8">
                  
                  {/* Output Header with dynamic verdict */}
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Decision Verdict
                    </span>
                    
                    <div className={`p-5 rounded-2xl border ${verdict.bg}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs uppercase font-extrabold tracking-wider">Estimated Outlook:</span>
                        <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full ${verdict.badge}`}>
                          {verdict.label}
                        </span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed">
                        {verdict.summary}
                      </p>
                    </div>
                  </div>

                  {/* Key calculated yields and variables */}
                  <div className="space-y-6">
                    
                    {/* Monthly cost */}
                    <div className="flex justify-between items-center pb-4 border-b border-slate-800/80">
                      <span className="text-sm text-slate-400 font-medium">Monthly Licensing Cost:</span>
                      <span className="text-xl font-bold font-mono text-white">${report.monthlyCost}</span>
                    </div>

                    {/* Value created */}
                    <div className="flex justify-between items-center pb-4 border-b border-slate-800/80">
                      <span className="text-sm text-slate-400 font-medium">Monthly Time Value:</span>
                      <span className="text-xl font-bold font-mono text-blue-400">${report.monthlyValue}</span>
                    </div>

                    {/* Net Benefit */}
                    <div className="flex justify-between items-center pb-4 border-b border-slate-800/80">
                      <span className="text-sm text-slate-400 font-medium">Net Monthly Profit:</span>
                      <span className="text-2xl font-black font-mono text-emerald-400">${report.netBenefit}</span>
                    </div>

                    {/* ROI % & Payback */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                        <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">ROI Yield</span>
                        <span className="text-2xl font-black font-mono text-amber-400">{report.roiPercentage}%</span>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                        <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Break-Even</span>
                        <span className="text-2xl font-black font-mono text-white">{report.paybackDays} <span className="text-xs text-slate-400">days</span></span>
                      </div>
                    </div>

                  </div>

                  <div className="text-[10px] text-slate-500 font-medium text-center leading-normal">
                    *Values are estimated assuming 4.33 weeks per calendar month.
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* Bottom Card calling list with payback indexes */}
          <section id="payback-index-cta" className="bg-white border border-slate-200/80 shadow-sm py-8 px-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto mb-16">
            <div className="max-w-xl text-center md:text-left">
              <h4 className="text-xl font-black text-slate-900 mb-2">
                Ready to shop by verified turnaround pacing?
              </h4>
              <p className="text-sm text-slate-500 font-medium">
                Consult our side-by-side matrices filtered by lowest subscription overhead structures and rapid audit verification.
              </p>
            </div>
            
            <Link
              id="calculator-go-reviews-index"
              href="/reviews"
              className="inline-flex shrink-0 items-center gap-2 bg-slate-950 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all shadow-md hover:shadow-lg hover:scale-105"
            >
              Browse Reviews
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* Google Adsense compliance placement */}
          <div className="max-w-4xl mx-auto">
            <AdContainer layoutType="top-banner" slotId="calculator-leaderboard-bottom" />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
