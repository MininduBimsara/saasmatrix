import { Tool, Review, BlogPost, TOOLS, REVIEWS, BLOG_POSTS } from "./data";
import {
  getPublishedBlogPosts as getPublishedBlogPostsByDate,
  getScheduledBlogPosts as getScheduledBlogPostsByDate,
} from "./blogSchedule";

// Local storage key constants
const KEY_TOOLS = "saasrooms_custom_tools";
const KEY_REVIEWS = "saasrooms_custom_reviews";
const KEY_BLOGS = "saasrooms_custom_blog";

// Generic localStorage wrappers to avoid node rendering issues during hydration
function getStorageItem<T>(key: string, defaultValue: T): T {
  if (globalThis.window === undefined) return defaultValue;
  try {
    let raw = globalThis.window.localStorage.getItem(key);
    // Backward compatibility automatic brand migration
    if (!raw) {
      const oldKey = key.replace("saasrooms_", "saasmatrix_");
      raw = globalThis.window.localStorage.getItem(oldKey);
      if (raw) {
        // Migrate to new key instantly
        globalThis.window.localStorage.setItem(key, raw);
        globalThis.window.localStorage.removeItem(oldKey);
      }
    }
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.warn(`Error reading localStorage key "${key}":`, e);
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (globalThis.window === undefined) return;
  try {
    globalThis.window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing localStorage key "${key}":`, e);
  }
}

/* ==========================================
   DEVELOPMENT STORAGE INTERFACES & MUTATORS
   ========================================== */

// 1. Tool entities
export function getCustomTools(): Tool[] {
  return getStorageItem<Tool[]>(KEY_TOOLS, []);
}

export function saveCustomTool(tool: Tool): void {
  const current = getCustomTools();
  const index = current.findIndex((t) => t.slug === tool.slug);
  if (index >= 0) {
    current[index] = tool; // Edit
  } else {
    current.push(tool); // Create
  }
  setStorageItem(KEY_TOOLS, current);
}

export function deleteCustomTool(slug: string): void {
  const current = getCustomTools();
  const updated = current.filter((t) => t.slug !== slug);
  setStorageItem(KEY_TOOLS, updated);
}

export function getMergedTools(): Tool[] {
  const custom = getCustomTools();
  // Filter core static tools that got mutated / edited by slug
  const staticFiltered = TOOLS.filter(
    (t) => !custom.some((c) => c.slug === t.slug),
  );
  return [...staticFiltered, ...custom];
}

// 2. Comparative Reviews
export function getCustomReviews(): Review[] {
  return getStorageItem<Review[]>(KEY_REVIEWS, []);
}

export function saveCustomReview(review: Review): void {
  const current = getCustomReviews();
  const index = current.findIndex((r) => r.slug === review.slug);
  if (index >= 0) {
    current[index] = review; // Edit
  } else {
    current.push(review); // Create
  }
  setStorageItem(KEY_REVIEWS, current);
}

export function deleteCustomReview(slug: string): void {
  const current = getCustomReviews();
  const updated = current.filter((r) => r.slug !== slug);
  setStorageItem(KEY_REVIEWS, updated);
}

export function getMergedReviews(): Review[] {
  const custom = getCustomReviews();
  const staticFiltered = REVIEWS.filter(
    (r) => !custom.some((c) => c.slug === r.slug),
  );
  return [...staticFiltered, ...custom];
}

// 3. Blog Posts
export function getCustomBlogPosts(): BlogPost[] {
  return getStorageItem<BlogPost[]>(KEY_BLOGS, []);
}

export function saveCustomBlogPost(post: BlogPost): void {
  const current = getCustomBlogPosts();
  const index = current.findIndex((p) => p.slug === post.slug);
  if (index >= 0) {
    current[index] = post; // Edit
  } else {
    current.push(post); // Create
  }
  setStorageItem(KEY_BLOGS, current);
}

export function saveCustomBlogPosts(posts: BlogPost[]): void {
  if (posts.length === 0) return;

  const current = getCustomBlogPosts();
  const merged = new Map<string, BlogPost>();

  current.forEach((post) => merged.set(post.slug, post));
  posts.forEach((post) => merged.set(post.slug, post));

  setStorageItem(KEY_BLOGS, Array.from(merged.values()));
}

export function deleteCustomBlogPost(slug: string): void {
  const current = getCustomBlogPosts();
  const updated = current.filter((p) => p.slug !== slug);
  setStorageItem(KEY_BLOGS, updated);
}

export function getMergedBlogPosts(): BlogPost[] {
  const custom = getCustomBlogPosts();
  const staticFiltered = BLOG_POSTS.filter(
    (p) => !custom.some((c) => c.slug === p.slug),
  );
  return [...staticFiltered, ...custom];
}

export function getPublishedBlogPosts(): BlogPost[] {
  return getPublishedBlogPostsByDate(getMergedBlogPosts());
}

export function getScheduledBlogPosts(): BlogPost[] {
  return getScheduledBlogPostsByDate(getMergedBlogPosts());
}
