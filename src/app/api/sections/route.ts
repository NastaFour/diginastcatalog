import { NextRequest, NextResponse } from "next/server";
import { getSections, saveSections } from "@/lib/data";
import { NewCustomSectionSchema } from "@/lib/schemas";
import { sanitizeSectionFields } from "@/lib/sanitize";
import { isAuthenticated } from "@/lib/auth-check";
import { checkMutationLimit } from "@/lib/ratelimit";
import { logAudit } from "@/lib/audit";
import type { CustomSection } from "@/lib/schemas";

// GET /api/sections — público
export async function GET(): Promise<NextResponse> {
  const sections = await getSections();
  return NextResponse.json({ data: sections });
}

// POST /api/sections — auth + rate limit + sanitize
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
  const parsed = NewCustomSectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const sanitized = sanitizeSectionFields(parsed.data);
  const sections = await getSections();

  const newSection: CustomSection = {
    ...sanitized,
    id: sanitized.id || crypto.randomUUID(),
  } as CustomSection;

  sections.push(newSection);
  const saved = await saveSections(sections);
  if (!saved) {
    return NextResponse.json({ error: "Storage no disponible" }, { status: 503 });
  }

  await logAudit("section-create", ip, true, { id: newSection.id });
  return NextResponse.json({ data: newSection }, { status: 201 });
}
