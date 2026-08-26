import { NextRequest, NextResponse } from "next/server";
import { getConfig, saveConfig } from "@/lib/data";
import { CategoryDefSchema } from "@/lib/schemas";
import { isAuthenticated } from "@/lib/auth-check";
import { checkMutationLimit } from "@/lib/ratelimit";
import { logAudit } from "@/lib/audit";
import type { CategoryDef } from "@/lib/schemas";

// GET /api/categories — público
export async function GET(): Promise<NextResponse> {
  const config = await getConfig();
  return NextResponse.json({ data: config?.categories || [] });
}

// POST /api/categories — auth + rate limit
export async function POST(request: NextRequest): Promise<NextResponse> {
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
  const parsed = CategoryDefSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const config = await getConfig();
  if (!config) {
    return NextResponse.json({ error: "Config no disponible" }, { status: 503 });
  }

  const newCategory: CategoryDef = { ...parsed.data, id: parsed.data.id || crypto.randomUUID() };
  config.categories.push(newCategory);
  const saved = await saveConfig(config);
  if (!saved) {
    return NextResponse.json({ error: "Storage no disponible" }, { status: 503 });
  }

  await logAudit("category-create", ip, true, { id: newCategory.id });
  return NextResponse.json({ data: newCategory }, { status: 201 });
}
