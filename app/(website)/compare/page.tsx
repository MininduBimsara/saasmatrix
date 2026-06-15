import React from "react";
import { getPublishedReviews, getPublishedTools } from "@/lib/contentSource";
import ComparePageClient from "@/components/ComparePageClient";
import { Review, Tool } from "@/lib/data";

// Render per-request so pre-fetched tools/reviews reflect drip-publish timing
// and pipeline pause/resume immediately (still full server-rendered HTML).
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Custom Compare Generator | SaaSPebble",
  description:
    "Design your own side-by-side SaaS comparison matrix. Compare direct sandbox pricing models, entry plans, trial access, and known limits.",
  alternates: { canonical: "https://saaspebble.tech/compare" },
};

export default async function Page() {
  let initialReviews: Review[] = [];
  let initialTools: Tool[] = [];

  try {
    const [reviews, tools] = await Promise.all([
      getPublishedReviews(),
      getPublishedTools(),
    ]);
    initialReviews = reviews;
    initialTools = tools;
  } catch (error) {
    console.error("Compare page server pre-fetch error:", error);
  }


  return (
    <ComparePageClient
      initialReviews={initialReviews}
      initialTools={initialTools}
    />
  );
}
