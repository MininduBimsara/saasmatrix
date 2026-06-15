import React from "react";
import { getPublishedReviews, getPublishedTools } from "@/lib/contentSource";
import HomepageClient from "@/components/HomepageClient";
import { Review, Tool } from "@/lib/data";

// Render per-request so the homepage directory reflects drip-publish timing and
// pipeline pause/resume immediately (still full server-rendered HTML for SEO).
export const dynamic = "force-dynamic";

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
    console.error("Homepage server pre-fetch error:", error);
  }


  return (
    <HomepageClient
      initialReviews={initialReviews}
      initialTools={initialTools}
    />
  );
}
