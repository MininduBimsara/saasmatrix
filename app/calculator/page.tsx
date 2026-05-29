'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdContainer } from '@/components/AdContainer';
import { SectionHeading } from '@/components/SectionHeading';
import { HelpCircle, ChevronRight, TrendingUp, AlertCircle, Check, ArrowRight } from 'lucide-react';

export default function CalculatorPage() {
  const [hoursSaved, setHoursSaved] = useState<number>(5);
  const [hourlyRate, setHourlyRate] = useState<number>(45);
  const [seatCost, setSeatCost] = useState<number>(12);
  const [teamSize, setTeamSize] = useState<number>(8);

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
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main id="roi-calculator-root" className="flex-grow py-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="mb-6 text-xs text-slate-400 font-mono">
            <Link href="/" className="hover:text-blue-600">HOME</Link> / ROI CALCULATOR
          </nav>

          <SectionHeading 
            title="SaaS Subscription Return-On-Spend Calculator" 
            eyebrow="Lead Generation Utility" 
            emphasized="Return-On-Spend" 
          />

          <p className="text-sm text-slate-600 max-w-3xl mb-12">
            Calculate if premium license costs translate to measurable productivity yield. Toggle hourly saves and rate matrices below to calculate payback velocities.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
            
            {/* Left Column: Sliders Controllers (7 / 12 width) */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-205/60 p-6 md:p-8 rounded-2xl flex flex-col justify-between gap-6">
              
              <h3 className="text-sm font-extrabold text-slate-905 tracking-wider uppercase font-mono pb-3 border-b border-slate-200">
                Hourly and Resource Sliders
              </h3>

              {/* Slider 1: Hours saved per week */}
              <div id="slider-hours-saved" className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700">Hours Saved Per Week (Team Avg)</span>
                  <span className="text-lg font-sans italic font-bold text-rose-500">{hoursSaved} hrs</span>
                </div>
                <input
                  id="input-hours-saved"
                  type="range"
                  min="1"
                  max="40"
                  value={hoursSaved}
                  onChange={(e) => setHoursSaved(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 HR</span>
                  <span>40 HRS</span>
                </div>
              </div>

              {/* Slider 2: Average Hourly Rate */}
              <div id="slider-hourly-rate" className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700">Average Blended Hourly Rate</span>
                  <span className="text-lg font-sans italic font-bold text-rose-500">${hourlyRate}/hr</span>
                </div>
                <input
                  id="input-hourly-rate"
                  type="range"
                  min="15"
                  max="150"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>$15/HR</span>
                  <span>$150/HR</span>
                </div>
              </div>

              {/* Slider 3: Starting Seat Fee */}
              <div id="slider-seat-cost" className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700">Tool Monthly Cost Per Seat</span>
                  <span className="text-lg font-sans italic font-bold text-rose-500">${seatCost}/mo</span>
                </div>
                <input
                  id="input-seat-cost"
                  type="range"
                  min="5"
                  max="120"
                  value={seatCost}
                  onChange={(e) => setSeatCost(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>$5</span>
                  <span>$120</span>
                </div>
              </div>

              {/* Slider 4: Team size */}
              <div id="slider-team-size" className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700">Active Team Seats Count</span>
                  <span className="text-lg font-sans italic font-bold text-rose-500">{teamSize} seats</span>
                </div>
                <input
                  id="input-team-size"
                  type="range"
                  min="1"
                  max="100"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 SEAT</span>
                  <span>100 SEATS</span>
                </div>
              </div>

            </div>

            {/* Right Column: Outcomes in dark theme layout (5 / 12 width) */}
            <div id="calculator-receipt" className="lg:col-span-5 bg-slate-900 text-white p-6 md:p-8 rounded-2xl border border-slate-800 flex flex-col justify-between gap-6 shadow-md">
              
              {/* Output Header with dynamic verdict */}
              <div>
                <span className="text-[10px] uppercase tracking-widest font-mono text-slate-400 block mb-1">
                  SaaS Evaluation Decision Verdict
                </span>
                
                <div className={`p-4 rounded-xl border ${verdict.bg} mb-4`}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs uppercase font-mono font-bold tracking-wider">Estimated Outlook:</span>
                    <span className={`text-[10px] uppercase tracking-widest font-black px-2.5 py-0.5 rounded-full ${verdict.badge}`}>
                      {verdict.label}
                    </span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed">
                    {verdict.summary}
                  </p>
                </div>
              </div>

              {/* Key calculated yields and variables */}
              <div className="space-y-4">
                
                {/* Monthly cost */}
                <div className="flex justify-between items-end pb-2 border-b border-slate-800">
                  <span className="text-xs text-slate-400">Monthly Licensing Cost:</span>
                  <span className="text-sm font-bold font-mono text-white">${report.monthlyCost}</span>
                </div>

                {/* Value created */}
                <div className="flex justify-between items-end pb-2 border-b border-slate-800">
                  <span className="text-xs text-slate-400">Monthly Time Value Recaptured:</span>
                  <span className="text-sm font-bold font-mono text-blue-400">${report.monthlyValue}</span>
                </div>

                {/* Net Benefit */}
                <div className="flex justify-between items-end pb-2 border-b border-slate-800">
                  <span className="text-xs text-slate-400">Net Monthly Business Profit:</span>
                  <span className="text-base font-extrabold font-mono text-emerald-400">${report.netBenefit}</span>
                </div>

                {/* ROI % */}
                <div className="flex justify-between items-end pb-2 border-b border-slate-800">
                  <span className="text-xs text-slate-400">Estimated Yield Return (ROI %):</span>
                  <span className="text-base font-extrabold font-mono text-amber-400">{report.roiPercentage}%</span>
                </div>

                {/* Payback period */}
                <div className="flex justify-between items-end pb-1">
                  <span className="text-xs text-slate-400">Break-Even Velocity Period:</span>
                  <span className="text-xs font-bold font-mono text-white">~ {report.paybackDays} days</span>
                </div>

              </div>

              <div className="text-[10px] text-slate-500 font-mono text-center leading-normal pt-2 border-t border-slate-800">
                *Values are estimated assuming 4.33 weeks per calendar month.
              </div>

            </div>

          </div>

          {/* Bottom Card calling list with payback indexes */}
          <section id="payback-index-cta" className="bg-slate-50 border border-slate-205 py-6 px-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Ready to shop by verified turnaround pacing?
              </h4>
              <p className="text-xs text-slate-500">
                Consult our side-by-side matrices filtered by lowest subscription overhead structures and rapid audit verification.
              </p>
            </div>
            
            <Link
              id="calculator-go-reviews-index"
              href="/reviews"
              className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-805 text-white text-xs font-semibold px-4 py-2.5 rounded-lg whitespace-nowrap"
            >
              Browse active reviews
              <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
            </Link>
          </section>

          {/* Google Adsense compliance placement */}
          <div className="mt-8">
            <AdContainer layoutType="top-banner" slotId="calculator-leaderboard-bottom" />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
