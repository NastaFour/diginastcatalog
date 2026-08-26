import { NextRequest, NextResponse } from "next/server";
import { getAuditLog } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth-check";

// GET /api/audit — auth requerido, retorna log de auditoría
export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await isAuthenticated();
  if (!auth.authenticated) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const log = await getAuditLog();
  return NextResponse.json({ data: log });
}
