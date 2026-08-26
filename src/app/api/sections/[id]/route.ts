import { NextRequest, NextResponse } from "next/server";
import { getSections, saveSections } from "@/lib/data";
import { NewCustomSectionSchema } from "@/lib/schemas";
import { sanitizeSectionFields } from "@/lib/sanitize";
import { isAuthenticated } from "@/lib/auth-check";
import { checkMutationLimit } from "@/lib/ratelimit";
import { logAudit } from "@/lib/audit";
import type { CustomSection } from "@/lib/schemas";

// PUT /api/sections/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
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
  const index = sections.findIndex((s) => s.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Sección no encontrada" }, { status: 404 });
  }

  sections[index] = { ...sections[index], ...sanitized, id } as CustomSection;
  const saved = await saveSections(sections);
  if (!saved) {
    return NextResponse.json({ error: "Storage no disponible" }, { status: 503 });
  }

  await logAudit("section-update", ip, true, { id });
  return NextResponse.json({ data: sections[index] });
}

// DELETE /api/sections/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const auth = await isAuthenticated();
  if (!auth.authenticated) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const limit = await checkMutationLimit(ip);
  if (!limit.success) {
    return NextResponse.json({ error: "Rate limit excedido" }, { status: 429 });
  }

  const sections = await getSections();
  const index = sections.findIndex((s) => s.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Sección no encontrada" }, { status: 404 });
  }

  sections.splice(index, 1);
  const saved = await saveSections(sections);
  if (!saved) {
    return NextResponse.json({ error: "Storage no disponible" }, { status: 503 });
  }

  await logAudit("section-delete", ip, true, { id });
  return NextResponse.json({ ok: true });
}
