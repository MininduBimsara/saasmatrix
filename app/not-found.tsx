import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-slate-50 border border-slate-100 text-slate-400 mb-8 shadow-sm">
            <FileQuestion className="h-10 w-10" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            404
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-base text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
            The directory index or page you're looking for doesn't exist. It might have been moved, renamed, or the link may be broken.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mt-2">
            <Link
              href="/"
              className="inline-flex justify-center items-center w-full sm:w-auto rounded-full bg-slate-900 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Return Home
            </Link>
            <Link
              href="/compare"
              className="inline-flex justify-center items-center w-full sm:w-auto rounded-full border border-slate-300 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Explore Software
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
