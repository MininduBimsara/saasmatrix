import { getSupabaseClient } from './supabase';

export type AuditAction = 'create' | 'update' | 'delete';
export type AuditEntity = 'tool' | 'review' | 'blog_post';

interface AuditEntry {
  action: AuditAction;
  entity: AuditEntity;
  entitySlug?: string;
  details?: Record<string, unknown>;
}

/**
 * Write a row to admin_audit_log.
 * Silently no-ops if Supabase is not configured or the insert fails,
 * so a logging failure never blocks the actual admin operation.
 */
export async function logAdminAction(entry: AuditEntry): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('admin_audit_log').insert({
      user_id: user?.id ?? null,
      user_email: user?.email ?? null,
      action: entry.action,
      entity: entry.entity,
      entity_slug: entry.entitySlug ?? null,
      details: entry.details ?? null,
    });
  } catch {
    // Never let audit logging break admin functionality
  }
}
