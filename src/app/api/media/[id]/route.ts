import { NextRequest, NextResponse } from "next/server";
import { getMedia, saveMedia } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth-check";
import { checkMutationLimit } from "@/lib/ratelimit";
import { logAudit } from "@/lib/audit";

// DELETE /api/media/[id]
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

  const media = await getMedia();
  const index = media.findIndex((m) => m.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Media no encontrado" }, { status: 404 });
  }

  const item = media[index];

  // Si tiene utKey, eliminar de UploadThing
  if (item.utKey) {
    try {
      const { UTApi } = await import("uploadthing/server");
      const utapi = new UTApi();
      await utapi.deleteFiles(item.utKey);
    } catch (err) {
      console.error("[media] Failed to delete from UploadThing:", err);
    }
  }

  media.splice(index, 1);
  const saved = await saveMedia(media);
  if (!saved) {
    return NextResponse.json({ error: "Storage no disponible" }, { status: 503 });
  }

  await logAudit("media-delete", ip, true, { id, utKey: item.utKey });
  return NextResponse.json({ ok: true });
}
