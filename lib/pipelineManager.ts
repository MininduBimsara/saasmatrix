import {
  getCustomTools,
  saveCustomTool,
  getCustomReviews,
  saveCustomReview,
  getCustomBlogPosts,
  saveCustomBlogPosts,
} from "./clientDb";
import { getSupabaseClient } from "./supabase";
import { pushToolsBatch, pushReviewsBatch, pushBlogsBatch } from "./supabaseDb";

export interface FrozenItem {
  slug: string;
  /** The item's real publication date, captured at the moment of pausing. */
  originalDate: string;
}

export interface ContentPipeline {
  id: string;
  name: string;
  type: "blog" | "review" | "tool";
  status: "active" | "paused";
  itemSlugs: string[];
  pausedAt?: string | null;
  /**
   * Snapshot of the scheduled items' real publication dates taken when the
   * pipeline was paused. While paused, those items' live dates are pushed to
   * a far-future sentinel (synced to Supabase) so they stay hidden for ALL
   * visitors; resume restores these dates shifted forward by the pause length.
   */
  frozenItems?: FrozenItem[];
  createdAt: string;
}

const KEY_PIPELINES = "saasrooms_pipelines";

// Far-future sentinel used to "freeze" a scheduled item while its pipeline is
// paused. It is pushed to Supabase so the item is withheld from every visitor,
// not just the admin's browser. The real date lives in `frozenItems`.
const FROZEN_SENTINEL_DATE = "9999-01-01T00:00:00.000Z";

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.warn(`Error reading localStorage key "${key}":`, e);
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing localStorage key "${key}":`, e);
  }
}

export function getPipelines(): ContentPipeline[] {
  return getStorageItem<ContentPipeline[]>(KEY_PIPELINES, []);
}

export function savePipeline(pipeline: ContentPipeline): void {
  const current = getPipelines();
  const index = current.findIndex((p) => p.id === pipeline.id);
  if (index >= 0) {
    current[index] = pipeline;
  } else {
    current.push(pipeline);
  }
  setStorageItem(KEY_PIPELINES, current);
}

export function createPipeline(
  name: string,
  type: "blog" | "review" | "tool",
  itemSlugs: string[],
): ContentPipeline {
  const pipeline: ContentPipeline = {
    id: `pipeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    type,
    status: "active",
    itemSlugs,
    createdAt: new Date().toISOString(),
  };
  savePipeline(pipeline);
  return pipeline;
}

export function deletePipeline(id: string): void {
  const current = getPipelines();
  const updated = current.filter((p) => p.id !== id);
  setStorageItem(KEY_PIPELINES, updated);
}

export function isItemInPausedPipeline(slug: string): boolean {
  const pipelines = getPipelines();
  return pipelines.some(
    (p) => p.status === "paused" && p.itemSlugs.includes(slug)
  );
}

/** Read the locally-stored items for a given pipeline type. */
function getItemsByType(
  type: ContentPipeline["type"],
): Array<{ slug: string; publicationDate?: string }> {
  if (type === "tool") return getCustomTools();
  if (type === "review") return getCustomReviews();
  return getCustomBlogPosts();
}

/**
 * Apply new publication dates (slug → ISO date) to the stored items of a
 * given type, persisting both locally and — when Supabase is configured — to
 * the cloud so the change is visible to every visitor.
 */
async function applyPublicationDates(
  type: ContentPipeline["type"],
  updates: Map<string, string>,
): Promise<void> {
  if (updates.size === 0) return;
  const supabase = getSupabaseClient();

  if (type === "tool") {
    const affected = getCustomTools()
      .filter((t) => updates.has(t.slug))
      .map((t) => ({ ...t, publicationDate: updates.get(t.slug)! }));
    affected.forEach((t) => saveCustomTool(t));
    if (supabase) await pushToolsBatch(affected);
  } else if (type === "review") {
    const affected = getCustomReviews()
      .filter((r) => updates.has(r.slug))
      .map((r) => ({ ...r, publicationDate: updates.get(r.slug)! }));
    affected.forEach((r) => saveCustomReview(r));
    if (supabase) await pushReviewsBatch(affected);
  } else {
    const affected = getCustomBlogPosts()
      .filter((b) => updates.has(b.slug))
      .map((b) => ({ ...b, publicationDate: updates.get(b.slug)! }));
    saveCustomBlogPosts(affected);
    if (supabase) await pushBlogsBatch(affected);
  }
}

export async function pausePipeline(id: string): Promise<void> {
  const pipelines = getPipelines();
  const pipeline = pipelines.find((p) => p.id === id);
  if (!pipeline || pipeline.status === "paused") return;

  const pausedAt = new Date();
  const pausedAtMs = pausedAt.getTime();

  // Freeze every item still waiting to publish by pushing its live date to a
  // far-future sentinel (synced to Supabase). Already-published items are left
  // live. The real dates are remembered so resume can restore + shift them.
  const updates = new Map<string, string>();
  const frozenItems: FrozenItem[] = [];
  for (const item of getItemsByType(pipeline.type)) {
    if (!pipeline.itemSlugs.includes(item.slug) || !item.publicationDate) continue;
    const pubMs = Date.parse(item.publicationDate);
    if (Number.isNaN(pubMs) || pubMs <= pausedAtMs) continue; // already live
    updates.set(item.slug, FROZEN_SENTINEL_DATE);
    frozenItems.push({ slug: item.slug, originalDate: item.publicationDate });
  }

  await applyPublicationDates(pipeline.type, updates);

  pipeline.status = "paused";
  pipeline.pausedAt = pausedAt.toISOString();
  pipeline.frozenItems = frozenItems;
  savePipeline(pipeline);
}

/**
 * Build the slug → new-date map for resuming a pipeline: each frozen item's
 * real date pushed forward by `shiftMs`. Falls back to shifting the items'
 * current future dates for pipelines paused before freezing was introduced.
 */
function buildResumeUpdates(
  pipeline: ContentPipeline,
  pausedAtMs: number,
  shiftMs: number,
): Map<string, string> {
  const updates = new Map<string, string>();

  if (pipeline.frozenItems && pipeline.frozenItems.length > 0) {
    for (const frozen of pipeline.frozenItems) {
      const originalMs = Date.parse(frozen.originalDate);
      if (!Number.isNaN(originalMs)) {
        updates.set(frozen.slug, new Date(originalMs + shiftMs).toISOString());
      }
    }
    return updates;
  }

  // Legacy fallback: pipelines paused before freezing was introduced still
  // hold their real future dates, so shift those forward directly.
  for (const item of getItemsByType(pipeline.type)) {
    if (!pipeline.itemSlugs.includes(item.slug) || !item.publicationDate) continue;
    const pubMs = Date.parse(item.publicationDate);
    if (Number.isNaN(pubMs) || pubMs <= pausedAtMs) continue;
    updates.set(item.slug, new Date(pubMs + shiftMs).toISOString());
  }
  return updates;
}

export async function resumePipeline(id: string): Promise<void> {
  const pipelines = getPipelines();
  const pipeline = pipelines.find((p) => p.id === id);
  if (!pipeline || pipeline.status === "active" || !pipeline.pausedAt) return;

  const pausedAtMs = new Date(pipeline.pausedAt).getTime();
  const shiftMs = Math.max(0, Date.now() - pausedAtMs);

  // Restore the real dates that were frozen at pause time, each pushed forward
  // by the pause duration to preserve the staggering of the remaining drops.
  await applyPublicationDates(
    pipeline.type,
    buildResumeUpdates(pipeline, pausedAtMs, shiftMs),
  );

  pipeline.status = "active";
  pipeline.pausedAt = null;
  pipeline.frozenItems = [];
  savePipeline(pipeline);
}
