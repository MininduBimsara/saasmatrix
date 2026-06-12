// ============================================================
// Generic, content-type-agnostic scheduling utilities.
// ------------------------------------------------------------
// Shared by blogs, reviews, and tools. An item is considered
// "published" once its publication timestamp is <= now. Items
// with a missing / blank / unparseable publication date are
// treated as already published — this keeps the always-on
// static baseline catalogue visible at all times.
//
// This is the engine behind drip-feed auto-publishing: a bulk
// batch is staged with staggered future publication dates, and
// each public page only renders the items whose moment has
// arrived. No cron job is required — every page load simply
// re-evaluates "now" against each item's publication date.
// ============================================================

import { isItemInPausedPipeline } from "./pipelineManager";

export interface Schedulable {
  publicationDate?: string;
}

/** Default gap (in hours) between consecutive drops in a queued batch. */
export const DEFAULT_QUEUE_INTERVAL_HOURS = 10;

export function getPublicationTimestamp(
  publicationDate?: string | null,
): number | null {
  if (!publicationDate) return null;
  const timestamp = Date.parse(publicationDate);
  return Number.isNaN(timestamp) ? null : timestamp;
}

export function isPublished(
  item: Schedulable,
  now: Date = new Date(),
): boolean {
  if (item && "slug" in item && typeof (item as any).slug === "string") {
    if (isItemInPausedPipeline((item as any).slug)) {
      return false;
    }
  }
  const timestamp = getPublicationTimestamp(item.publicationDate);
  if (timestamp === null) return true;
  return timestamp <= now.getTime();
}

export function sortBySchedule<T extends Schedulable>(
  items: T[],
  direction: "asc" | "desc" = "desc",
): T[] {
  const directionFactor = direction === "asc" ? 1 : -1;
  return [...items].sort((left, right) => {
    const leftTimestamp = getPublicationTimestamp(left.publicationDate) ?? 0;
    const rightTimestamp = getPublicationTimestamp(right.publicationDate) ?? 0;
    return (leftTimestamp - rightTimestamp) * directionFactor;
  });
}

/** Items whose publication moment has already passed (newest first). */
export function filterPublished<T extends Schedulable>(
  items: T[],
  now: Date = new Date(),
): T[] {
  return sortBySchedule(
    items.filter((item) => isPublished(item, now)),
    "desc",
  );
}

/** Items still waiting in the pipeline (soonest first). */
export function filterScheduled<T extends Schedulable>(
  items: T[],
  now: Date = new Date(),
): T[] {
  return sortBySchedule(
    items.filter((item) => !isPublished(item, now)),
    "asc",
  );
}

/**
 * Stamp a batch of items with publication dates spaced `intervalHours`
 * apart, beginning at `startAt`. Returns new objects (does not mutate).
 */
export function staggerPublicationDates<T extends Schedulable>(
  items: T[],
  startAt: Date,
  intervalHours: number,
): T[] {
  const safeInterval = intervalHours > 0 ? intervalHours : DEFAULT_QUEUE_INTERVAL_HOURS;
  return items.map((item, index) => ({
    ...item,
    publicationDate: new Date(
      startAt.getTime() + index * safeInterval * 60 * 60 * 1000,
    ).toISOString(),
  }));
}

/** Re-stagger only the items still scheduled, preserving their order. */
export function rescheduleItems<T extends Schedulable>(
  scheduledItems: T[],
  startAt: Date,
  intervalHours: number,
): T[] {
  return staggerPublicationDates(
    sortBySchedule(scheduledItems, "asc"),
    startAt,
    intervalHours,
  );
}

export function formatScheduleDate(publicationDate?: string): string {
  const timestamp = getPublicationTimestamp(publicationDate);
  if (timestamp === null) return publicationDate || "—";

  const looksLikeIsoStamp =
    /T\d{2}:\d{2}/.test(publicationDate as string) ||
    /^\d{4}-\d{2}-\d{2}/.test(publicationDate as string);
  if (!looksLikeIsoStamp) return publicationDate as string;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

/** Whole hours from now until an item's publication moment (>= 0). */
export function hoursUntilPublish(
  publicationDate?: string,
  now: Date = new Date(),
): number {
  const timestamp = getPublicationTimestamp(publicationDate);
  if (timestamp === null) return 0;
  return Math.max(0, Math.round((timestamp - now.getTime()) / (1000 * 60 * 60)));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
