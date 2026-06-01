'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-rose-50 border border-rose-100 text-rose-500 mb-8 shadow-sm">
            <AlertTriangle className="h-10 w-10" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            500
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">
            Internal Server Error
          </h2>
          
          <p className="text-base text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
            Oops, something went wrong on our end. We've been notified and are working to resolve the issue as quickly as possible.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mt-2">
            <button
              onClick={() => reset()}
              className="inline-flex justify-center items-center w-full sm:w-auto rounded-full bg-slate-900 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex justify-center items-center w-full sm:w-auto rounded-full border border-slate-300 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
