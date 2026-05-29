import { BlogPost } from "./data";

export interface BulkBlogDraft {
  title: string;
  slug?: string;
  excerpt: string;
  readTime?: string;
  category: string;
  contentMarkdown: string;
  issueNumber?: number;
}

export const DEFAULT_BLOG_QUEUE_INTERVAL_HOURS = 10;

export function slugifyBlogText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getBlogPublicationTimestamp(
  publicationDate: string,
): number | null {
  if (!publicationDate) return null;

  const timestamp = Date.parse(publicationDate);
  return Number.isNaN(timestamp) ? null : timestamp;
}

export function isBlogPublished(
  post: Pick<BlogPost, "publicationDate">,
  now: Date = new Date(),
): boolean {
  const timestamp = getBlogPublicationTimestamp(post.publicationDate);
  if (timestamp === null) return true;
  return timestamp <= now.getTime();
}

export function formatBlogPublicationDate(publicationDate: string): string {
  const timestamp = getBlogPublicationTimestamp(publicationDate);
  if (timestamp === null) return publicationDate;

  const looksLikeIsoStamp =
    /T\d{2}:\d{2}/.test(publicationDate) ||
    /^\d{4}-\d{2}-\d{2}/.test(publicationDate);
  if (!looksLikeIsoStamp) return publicationDate;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function sortBlogPostsByPublishDate(
  posts: BlogPost[],
  direction: "asc" | "desc" = "desc",
): BlogPost[] {
  const directionFactor = direction === "asc" ? 1 : -1;

  return [...posts].sort((left, right) => {
    const leftTimestamp =
      getBlogPublicationTimestamp(left.publicationDate) ?? 0;
    const rightTimestamp =
      getBlogPublicationTimestamp(right.publicationDate) ?? 0;
    return (leftTimestamp - rightTimestamp) * directionFactor;
  });
}

export function getPublishedBlogPosts(
  posts: BlogPost[],
  now: Date = new Date(),
): BlogPost[] {
  return sortBlogPostsByPublishDate(
    posts.filter((post) => isBlogPublished(post, now)),
    "desc",
  );
}

export function getScheduledBlogPosts(
  posts: BlogPost[],
  now: Date = new Date(),
): BlogPost[] {
  return sortBlogPostsByPublishDate(
    posts.filter((post) => !isBlogPublished(post, now)),
    "asc",
  );
}

export function buildScheduledBlogPosts(
  drafts: BulkBlogDraft[],
  startAt: Date,
  intervalHours: number,
  startingIssueNumber: number,
): BlogPost[] {
  return drafts.map((draft, index) => {
    const publishAt = new Date(
      startAt.getTime() + index * intervalHours * 60 * 60 * 1000,
    );

    return {
      slug: draft.slug?.trim() || slugifyBlogText(draft.title),
      title: draft.title.trim(),
      issueNumber: draft.issueNumber ?? startingIssueNumber + index,
      excerpt: draft.excerpt.trim(),
      readTime: draft.readTime?.trim() || "5 min read",
      publicationDate: publishAt.toISOString(),
      category: draft.category.trim(),
      contentMarkdown: draft.contentMarkdown.trim(),
    };
  });
}
