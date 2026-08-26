import { NextRequest, NextResponse } from "next/server";
import { getProducts, getSections, getConfig, getMedia } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth-check";
import { logAudit } from "@/lib/audit";

// GET /api/backup/export — descarga JSON completo
export async function GET(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const auth = await isAuthenticated();
  if (!auth.authenticated) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const [products, sections, config, media] = await Promise.all([
    getProducts(),
    getSections(),
    getConfig(),
    getMedia(),
  ]);

  const backup = { products, sections, config, media, exportedAt: new Date().toISOString() };

  await logAudit("backup-export", ip, true);

  return new NextResponse(JSON.stringify(backup, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="diginast-backup-${Date.now()}.json"`,
    },
  });
}
