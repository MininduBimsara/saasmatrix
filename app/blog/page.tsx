"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdContainer } from "@/components/AdContainer";
import { SectionHeading } from "@/components/SectionHeading";
import { BlogPost } from "@/lib/data";
import { formatBlogPublicationDate } from "@/lib/blogSchedule";

export default function BlogIndexPage() {
  const [activePosts, setActivePosts] = React.useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    import("@/lib/contentSource").then(async (src) => {
      setActivePosts(await src.getPublishedBlogPosts());
      setIsLoading(false);
    });
  }, []);

  let content;

  if (isLoading) {
    content = (
      <div className="p-12 text-center text-xs font-mono text-slate-400">
        Refactoring matrix indexes...
      </div>
    );
  } else if (activePosts.length > 0) {
    content = activePosts.map((post) => (
      <Link
        id={`blog-post-row-${post.slug}`}
        key={post.slug}
        href={`/blog/${post.slug}`}
        className="block p-6 hover:bg-slate-50/70 transition-colors duration-150 group"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-3">
            <span className="block text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-1">
              Issue #{post.issueNumber}
            </span>
            <span className="inline-block text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase font-mono tracking-wider">
              {post.category}
            </span>
          </div>

          <div className="md:col-span-7 space-y-1">
            <h4 className="text-base font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">
              {post.title}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-2 md:line-clamp-none">
              {post.excerpt}
            </p>
          </div>

          <div className="md:col-span-2 text-left md:text-right">
            <span className="block text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase">
              {post.readTime}
            </span>
            <span className="block text-xs text-slate-500 mt-0.5 font-medium">
              {formatBlogPublicationDate(post.publicationDate)}
            </span>
          </div>
        </div>
      </Link>
    ));
  } else {
    content = (
      <div className="p-12 text-center text-xs font-mono text-slate-400">
        No issues registered in the workspace index.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main id="blog-index-root" className="flex-grow py-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-xs text-slate-400 font-mono">
            <Link href="/" className="hover:text-blue-605">
              HOME
            </Link>{" "}
            / THE DISPATCH ESSAYS
          </nav>

          {/* Section Heading */}
          <SectionHeading
            title="The Dispatch: Analytical Essays & Procurement Audits"
            eyebrow="Insider Analysis"
            emphasized="Dispatch"
            meta={`${activePosts.length} Issues Issued`}
          />

          {/* Introductory layout containing soft escape cross-links */}
          <div className="max-w-3xl mb-12">
            <p className="text-sm leading-relaxed text-slate-600">
              Unlike our side-by-side matrices which serve buyers in active
              decision-making processes, the Dispatch explore larger procurement
              philosophies, licensing traps, and future SaaS pricing loops. Read
              our{" "}
              <Link
                href="/reviews"
                className="text-blue-600 font-semibold hover:underline"
              >
                Reviews index
              </Link>{" "}
              to research specific products, or{" "}
              <Link
                href="/newsletter"
                className="text-blue-600 font-semibold hover:underline"
              >
                Register on the weekly loop
              </Link>{" "}
              to receive PDF transcripts automatically.
            </p>
          </div>

          {/* Vertical Stack Listings */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white mb-12">
            <div className="divide-y divide-slate-100 animate-fade-in">
              {content}
            </div>
          </div>

          {/* Above Footer Advertisement Block */}
          <div className="border-t border-slate-150 pt-8">
            <AdContainer
              layoutType="top-banner"
              slotId="blog-index-bottom-banner"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
