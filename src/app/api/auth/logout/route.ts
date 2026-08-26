import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth-check";
import { logAudit } from "@/lib/audit";
import { SESSION_COOKIE, CSRF_COOKIE } from "@/lib/constants";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const auth = await isAuthenticated();

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(CSRF_COOKIE);

  await logAudit("logout", ip, true);
  return response;
}
