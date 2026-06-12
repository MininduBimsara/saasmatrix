// Mock localStorage and window for Node environment
const storage: Record<string, string> = {};
globalThis.window = {
  localStorage: {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => {
      storage[key] = value;
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
    clear: () => {
      for (const key in storage) delete storage[key];
    },
    length: 0,
    key: () => null,
  },
} as any;

import { saveCustomBlogPosts, getMergedBlogPosts } from "../lib/clientDb";
import { isBlogPublished } from "../lib/blogSchedule";
import {
  createPipeline,
  pausePipeline,
  resumePipeline,
  getPipelines,
  isItemInPausedPipeline,
  deletePipeline,
} from "../lib/pipelineManager";

async function runTests() {
  console.log("🚀 Starting Pipeline End-to-End Tests...\n");

  // 1. Setup mock blog posts
  console.log("Step 1: Setting up mock blog posts...");
  const now = new Date();
  const futureDate1 = new Date(now.getTime() + 1000 * 60 * 60).toISOString(); // 1 hour in future
  const futureDate2 = new Date(now.getTime() + 1000 * 60 * 120).toISOString(); // 2 hours in future

  const post1 = {
    slug: "post-1",
    title: "Post One",
    issueNumber: 1,
    excerpt: "Excerpt 1",
    readTime: "5 min read",
    publicationDate: futureDate1,
    category: "News",
    contentMarkdown: "Content 1",
  };

  const post2 = {
    slug: "post-2",
    title: "Post Two",
    issueNumber: 2,
    excerpt: "Excerpt 2",
    readTime: "5 min read",
    publicationDate: futureDate2,
    category: "News",
    contentMarkdown: "Content 2",
  };

  saveCustomBlogPosts([post1, post2]);
  console.log("✅ Mock blog posts saved.");

  // 2. Create pipeline
  console.log("\nStep 2: Creating a new pipeline...");
  const pipeline = createPipeline("Newsletter Campaign", "blog", ["post-1", "post-2"]);
  console.log(`✅ Pipeline created: ${pipeline.name} (ID: ${pipeline.id})`);
  console.log(`   Status: ${pipeline.status}`);
  console.log(`   Items: ${JSON.stringify(pipeline.itemSlugs)}`);

  // Verify it is active
  if (pipeline.status !== "active") {
    throw new Error("Pipeline should be active upon creation!");
  }

  // 3. Pause pipeline
  console.log("\nStep 3: Pausing the pipeline...");
  await pausePipeline(pipeline.id);
  const updatedPipelines = getPipelines();
  const pausedPipeline = updatedPipelines.find((p) => p.id === pipeline.id);
  console.log(`✅ Pipeline status: ${pausedPipeline?.status}`);
  console.log(`   Paused At: ${pausedPipeline?.pausedAt}`);

  if (pausedPipeline?.status !== "paused") {
    throw new Error("Pipeline should be paused!");
  }

  // Verify item is considered in paused pipeline
  const isPaused = isItemInPausedPipeline("post-1");
  console.log(`   Is post-1 blocked by pause: ${isPaused}`);
  if (!isPaused) {
    throw new Error("post-1 should be blocked by paused pipeline!");
  }

  // Verify isBlogPublished returns false even if time passes (we simulate current time being in the future)
  const farFuture = new Date(now.getTime() + 1000 * 60 * 300); // 5 hours in future
  const publishedState = isBlogPublished(post1, farFuture);
  console.log(`   Is post-1 published in 5 hours (while paused): ${publishedState}`);
  if (publishedState) {
    throw new Error("Post should NOT be published while pipeline is paused!");
  }

  // Verify the GLOBAL freeze: the stored publication date must be pushed far
  // into the future so visitors who don't have the local pause flag (i.e.
  // everyone but the admin) still can't see it.
  const frozenPost = getMergedBlogPosts().find((p) => p.slug === "post-1");
  const frozenYear = new Date(frozenPost!.publicationDate).getUTCFullYear();
  console.log(`   Stored (synced) publication year while paused: ${frozenYear}`);
  if (frozenYear < 9000) {
    throw new Error("Paused item's stored date should be frozen far-future for all visitors!");
  }

  // 4. Resume pipeline after simulating a delay
  console.log("\nStep 4: Resuming the pipeline...");
  // Modify pausedAt to be 10 minutes in the past to simulate pause duration
  const tenMinutesMs = 10 * 60 * 1000;
  if (pausedPipeline) {
    pausedPipeline.pausedAt = new Date(Date.now() - tenMinutesMs).toISOString();
    // Save state back to localStorage
    window.localStorage.setItem("saasrooms_pipelines", JSON.stringify([pausedPipeline]));
  }

  const originalPubTime1 = new Date(post1.publicationDate).getTime();
  await resumePipeline(pipeline.id);

  const finalPipelines = getPipelines();
  const resumedPipeline = finalPipelines.find((p) => p.id === pipeline.id);
  console.log(`✅ Pipeline status: ${resumedPipeline?.status}`);

  if (resumedPipeline?.status !== "active") {
    throw new Error("Pipeline should be active after resume!");
  }

  // Verify scheduled times shifted forward by 10 minutes
  const mergedPosts = getMergedBlogPosts();
  const updatedPost1 = mergedPosts.find((p) => p.slug === "post-1");
  const newPubTime1 = new Date(updatedPost1!.publicationDate).getTime();
  const actualShift = newPubTime1 - originalPubTime1;

  console.log(`   Original Publication Date: ${post1.publicationDate}`);
  console.log(`   Updated Publication Date:  ${updatedPost1?.publicationDate}`);
  console.log(`   Expected shift: ~600000ms (10 minutes)`);
  console.log(`   Actual shift:   ${actualShift}ms`);

  if (Math.abs(actualShift - tenMinutesMs) > 2000) {
    throw new Error("Publication date shift was not calculated/applied correctly!");
  }

  // 5. Test Deleting a paused pipeline (auto-resumes dates first)
  console.log("\nStep 5: Testing deletion of a paused pipeline...");
  // First, delete the first pipeline to release post-1 and post-2
  await deletePipeline(pipeline.id);

  const tempPipeline = createPipeline("Temp Deletion Campaign", "blog", ["post-2"]);
  await pausePipeline(tempPipeline.id);

  // Verify post-2 has year 9999 (frozen)
  const preDeletePost2 = getMergedBlogPosts().find((p) => p.slug === "post-2");
  const preDeleteYear = new Date(preDeletePost2!.publicationDate).getUTCFullYear();
  console.log(`   Pre-delete frozen year of post-2: ${preDeleteYear}`);
  if (preDeleteYear < 9000) {
    throw new Error("post-2 should be frozen before deletion!");
  }

  // Delete it
  await deletePipeline(tempPipeline.id);

  // Verify post-2 publication date is restored (not stuck at 9999)
  const postDeletePost2 = getMergedBlogPosts().find((p) => p.slug === "post-2");
  const postDeleteYear = new Date(postDeletePost2!.publicationDate).getUTCFullYear();
  console.log(`   Post-delete restored year of post-2: ${postDeleteYear}`);
  if (postDeleteYear >= 9000) {
    throw new Error("post-2 publication date should be restored after deleting the paused pipeline!");
  }
  console.log("   ✅ Deleting paused pipeline successfully restored frozen items.");

  // 6. Test Slug Overlap Guard
  console.log("\nStep 6: Testing slug overlap guard...");
  createPipeline("Active Campaign", "blog", ["post-1"]);
  try {
    createPipeline("Conflicting Campaign", "blog", ["post-1"]);
    throw new Error("Should not allow creating a pipeline with an overlapping slug!");
  } catch (err: any) {
    console.log(`   ✅ Overlap correctly rejected: "${err.message}"`);
  }

  console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
}

runTests().catch((err) => {
  console.error("\n❌ TEST FAILED:", err);
  process.exit(1);
});
