import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStorage, KEYS } from "@/lib/store";
import { forceSeed } from "@/lib/ensureSeed";
import { isAuthenticated } from "@/lib/auth-check";
import { logAudit } from "@/lib/audit";

const ResetSchema = z.object({ confirm: z.literal("RESET") });

// POST /api/backup/reset — requiere confirm: "RESET"
export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const auth = await isAuthenticated();
  if (!auth.authenticated) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = ResetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Confirmación requerida: envía { confirm: "RESET" }' },
      { status: 400 }
    );
  }

  // Borrar todas las claves
  const store = getStorage();
  await store.del(KEYS.products);
  await store.del(KEYS.sections);
  await store.del(KEYS.config);
  await store.del(KEYS.media);

  // Re-inyectar seed forzadamente (bypass del flag seedApplied)
  await forceSeed();

  await logAudit("backup-reset", ip, true);
  return NextResponse.json({ ok: true, message: "Datos reseteados a seed de fábrica" });
}
