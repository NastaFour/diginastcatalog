import { NextRequest, NextResponse } from "next/server";
import { getMedia, saveMedia } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth-check";
import { checkMutationLimit } from "@/lib/ratelimit";
import { logAudit } from "@/lib/audit";
import { MediaItemSchema, type MediaItem } from "@/lib/schemas";

// GET /api/media — auth requerido
export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await isAuthenticated();
  if (!auth.authenticated) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const media = await getMedia();
  return NextResponse.json({ data: media });
}

// POST /api/media — guardar metadata del upload
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
  const parsed = MediaItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const media = await getMedia();
  const newItem: MediaItem = {
    ...parsed.data,
    id: parsed.data.id || crypto.randomUUID(),
    uploadedAt: parsed.data.uploadedAt || new Date().toISOString(),
  };

  // Prepend to show newest uploads first
  media.unshift(newItem);
  const saved = await saveMedia(media);
  if (!saved) {
    return NextResponse.json({ error: "Storage no disponible" }, { status: 503 });
  }

  await logAudit("media-upload", ip, true, { id: newItem.id, name: newItem.name, url: newItem.url });
  return NextResponse.json({ data: newItem }, { status: 201 });
}
