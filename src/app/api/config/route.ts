import { NextRequest, NextResponse } from "next/server";
import { getConfig, saveConfig } from "@/lib/data";
import { AppConfigSchema } from "@/lib/schemas";
import { sanitizeConfigFields } from "@/lib/sanitize";
import { isAuthenticated } from "@/lib/auth-check";
import { checkMutationLimit } from "@/lib/ratelimit";
import { logAudit } from "@/lib/audit";
import type { AppConfig } from "@/lib/schemas";

// GET /api/config — público
export async function GET(): Promise<NextResponse> {
  const config = await getConfig();
  if (!config) {
    return NextResponse.json({ error: "Config no disponible" }, { status: 503 });
  }
  return NextResponse.json({ data: config });
}

// PUT /api/config — auth + rate limit + sanitize
export async function PUT(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const auth = await isAuthenticated();
  if (!auth.authenticated) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const limit = await checkMutationLimit(ip);
  if (!limit.success) {
    return NextResponse.json({ error: "Rate limit excedido" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = AppConfigSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const sanitized = sanitizeConfigFields(parsed.data) as AppConfig;
  const saved = await saveConfig(sanitized);
  if (!saved) {
    return NextResponse.json({ error: "Storage no disponible" }, { status: 503 });
  }

  await logAudit("config-update", ip, true);
  return NextResponse.json({ data: sanitized });
}
