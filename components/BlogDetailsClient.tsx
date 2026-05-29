"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdContainer } from "@/components/AdContainer";
import { ArrowLeft, Clock } from "lucide-react";
import { formatBlogPublicationDate } from "@/lib/blogSchedule";

interface BlogDetailsClientProps {
  staticPost: any | null;
  slug: string;
}

export default function BlogDetailsClient({
  staticPost,
  slug,
}: BlogDetailsClientProps) {
  const [post, setPost] = useState<any | null>(staticPost);
  const [isLoading, setIsLoading] = useState<boolean>(!staticPost);

  useEffect(() => {
    import("@/lib/clientDb").then((db) => {
      const allPosts = db.getPublishedBlogPosts();
      const found = allPosts.find((p) => p.slug === slug);
      if (found) {
        setPost(found);
      } else if (!staticPost) {
        setPost(null);
      }
      setIsLoading(false);
    });
  }, [slug, staticPost]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow py-32 text-center font-mono text-xs text-slate-400">
          Syncing article metadata...
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow py-24 text-center space-y-4 font-sans">
          <h2 className="text-xl font-bold text-slate-900">
            Dispatch File Not Found
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            The requested procurement analytical sheet has not been indexed yet
            or lives in a different directory.
          </p>
          <Link
            href="/blog"
            className="inline-block text-xs font-bold text-blue-600 hover:underline"
          >
            Return to Dispatch general list
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Parse custom markdown blocks securely on the client
  const textBlocks = post.contentMarkdown
    ? post.contentMarkdown.split("\n\n")
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main id="blog-post-root" className="flex-grow py-12 font-sans bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb back link */}
          <nav className="mb-6 flex items-center gap-1 text-xs text-slate-400 font-mono">
            <Link href="/" className="hover:text-blue-605">
              HOME
            </Link>{" "}
            /
            <Link href="/blog" className="hover:text-blue-605 uppercase ml-1">
              THE DISPATCH
            </Link>{" "}
            /
            <span className="truncate max-w-[200px] font-medium text-slate-500 ml-1 font-mono">
              ISSUE #{post.issueNumber}
            </span>
          </nav>

          <Link
            id="back-blog-index-btn"
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-606 mb-8 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Insider Dispatch list
          </Link>

          {/* Article Header */}
          <header className="mb-10 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-blue-605 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded uppercase font-mono tracking-widest">
                Issue #{post.issueNumber}
              </span>
              <span className="flex items-center gap-1 text-xs font-mono text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime} &bull;{" "}
                {formatBlogPublicationDate(post.publicationDate)}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* Subheading excerpt - magazine pull quote style */}
            <div className="p-4 border-l-4 border-slate-300 bg-slate-50 rounded-r-lg font-sans italic text-base text-slate-600 leading-relaxed mt-4">
              &ldquo;{post.excerpt}&rdquo;
            </div>
          </header>

          {/* Above-content AdSense slot */}
          <AdContainer
            layoutType="top-banner"
            slotId={`blog-${post.slug}-above-post`}
          />

          {/* Prose body (narrow 680px visual width) */}
          <section
            id="prose-body"
            className="prose prose-slate prose-sm md:prose-base max-w-prose text-slate-700 leading-relaxed my-8 space-y-5"
          >
            {textBlocks.map((block: string, idx: number) => {
              // Convert simple markdowns
              const cleanBlock = block.trim();
              if (cleanBlock.startsWith("###")) {
                // Section heading
                const headingText = cleanBlock.replace("###", "").trim();
                return (
                  <div key={idx}>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight mt-6 mb-3">
                      {headingText}
                    </h3>

                    {/* Inject AdContainer specifically after the second section heading */}
                    {idx === 4 && (
                      <div className="my-6">
                        <AdContainer
                          layoutType="inline-content"
                          slotId={`blog-${post.slug}-inline-ad`}
                        />
                      </div>
                    )}
                  </div>
                );
              }

              if (
                cleanBlock.startsWith("1.") ||
                cleanBlock.startsWith("2.") ||
                cleanBlock.startsWith("3.")
              ) {
                // Numbered lists
                const items = cleanBlock.split("\n");
                return (
                  <ol
                    key={idx}
                    className="list-decimal pl-5 space-y-2 my-4 text-sm leading-relaxed text-slate-600"
                  >
                    {items.map((item, idy) => {
                      const text = item.replace(/^\d+\.\s+/, "").trim();
                      const boldMatch = text.match(/^\*\*(.*?)\*\*(.*)/);
                      if (boldMatch) {
                        return (
                          <li key={idy}>
                            <strong>{boldMatch[1]}</strong>
                            {boldMatch[2]}
                          </li>
                        );
                      }
                      return <li key={idy}>{text}</li>;
                    })}
                  </ol>
                );
              }

              // Simple bold formatting replacement inside normal paragraphs
              let formattedBlock = cleanBlock;
              // Simple regex for bold **phrase**
              const boldRegex = /\*\*(.*?)\*\*/g;
              const matches = formattedBlock.split(boldRegex);

              return (
                <p
                  key={idx}
                  className="text-sm md:text-base leading-relaxed text-slate-600 text-justify"
                >
                  {matches.map((chunk, isOdd) => {
                    if (isOdd % 2 === 1) {
                      return (
                        <strong
                          key={isOdd}
                          className="font-extrabold text-slate-900"
                        >
                          {chunk}
                        </strong>
                      );
                    }
                    return chunk;
                  })}
                </p>
              );
            })}

            {/* Custom Bottom Pull-Quote left-border in the brand orange and italic serif typography */}
            <div
              id="visual-peak-quote"
              className="p-6 my-8 border-l-4 border-amber-500 bg-amber-50/50 rounded-r-xl"
            >
              <span className="text-[10.5px] uppercase font-mono tracking-widest text-amber-800 font-bold block mb-1">
                Insider Sourcing Alert
              </span>
              <p className="font-sans italic text-base leading-relaxed text-slate-800">
                Always audit per-user overhead traps prior to scaling developer
                resources. Hidden thresholds trigger over 2.5x license hikes
                during active collaborative spurts.
              </p>
            </div>
          </section>

          {/* Simple bottom back link to index */}
          <footer className="border-t border-slate-100 pt-8 mt-12 flex items-center justify-between">
            <Link
              id="footer-back-blog"
              href="/blog"
              className="text-xs font-bold text-blue-605 flex items-center gap-1 hover:underline"
            >
              &larr; Return to general Dispatch essays
            </Link>

            <span className="text-[10px] text-slate-450 font-mono tracking-wider uppercase font-mono">
              {"// NO RELATED RECOMMENDATIONS INJECTED BY DESIGN"}
            </span>
          </footer>
        </div>
      </main>

      <Footer />
    </div>
  );
}
