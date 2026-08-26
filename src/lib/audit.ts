import { appendAudit } from "@/lib/data";
import type { AuditEntry } from "@/lib/schemas";

// ============================================================
// Audit logging — fire-and-forget (no crashea si falla)
// ============================================================

export async function logAudit(
  action: AuditEntry["action"],
  ip: string,
  success: boolean,
  meta?: Record<string, unknown>
): Promise<void> {
  try {
    const entry: AuditEntry = {
      id: crypto.randomUUID(),
      action,
      ip,
      timestamp: new Date().toISOString(),
      success,
      meta,
    };
    await appendAudit(entry);
  } catch (err) {
    console.error("[audit] Failed to log audit entry:", err);
  }
}
