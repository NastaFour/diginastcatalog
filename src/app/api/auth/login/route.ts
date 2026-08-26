import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PasswordSchema } from "@/lib/schemas";
import { createSessionToken } from "@/lib/auth";
import { getHashedAdminPassword } from "@/lib/env";
import { checkLoginLimit } from "@/lib/ratelimit";
import { generateCsrfToken } from "@/lib/csrf";
import { logAudit } from "@/lib/audit";
import { SESSION_COOKIE, CSRF_COOKIE, SESSION_MAX_AGE } from "@/lib/constants";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // Rate limit
  const limitResult = await checkLoginLimit(ip);
  if (!limitResult.success) {
    await logAudit("login-failed", ip, false, { reason: "rate-limited" });
    return NextResponse.json(
      { error: "Demasiados intentos. Intenta de nuevo en 15 minutos." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((limitResult.reset - Date.now()) / 1000)) },
      }
    );
  }

  // Parse body
  const body = await request.json().catch(() => null);
  const parsed = PasswordSchema.safeParse(body);
  if (!parsed.success) {
    await logAudit("login-failed", ip, false, { reason: "invalid-body" });
    return NextResponse.json({ error: "Password requerido" }, { status: 400 });
  }

  // Verify password contra hash bcrypt (async — no bloquea el event loop)
  const hashed = getHashedAdminPassword();
  const isValid = await bcrypt.compare(parsed.data.password, hashed);

  if (!isValid) {
    await logAudit("login-failed", ip, false, { reason: "wrong-password" });
    return NextResponse.json({ error: "Password incorrecto" }, { status: 401 });
  }

  // Crear sesión JWT
  const token = await createSessionToken();
  const csrfToken = generateCsrfToken();

  // Setear cookies
  const response = NextResponse.json({ ok: true, csrfToken });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  // Set CSRF cookie (no-httpOnly para que el cliente la lea)
  response.cookies.set(CSRF_COOKIE, csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  await logAudit("login-success", ip, true);
  return response;
}
