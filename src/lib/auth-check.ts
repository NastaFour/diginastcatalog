import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/constants";

// ============================================================
// auth-check — verifica sesión desde request/cookies
// ============================================================

export interface AuthResult {
  authenticated: boolean;
  payload?: unknown;
}

export async function isAuthenticated(): Promise<AuthResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return { authenticated: false };

  const payload = await verifyToken(token);
  if (!payload) return { authenticated: false };

  return { authenticated: true, payload };
}

export async function requireAuth(): Promise<AuthResult> {
  const result = await isAuthenticated();
  if (!result.authenticated) {
    throw new Error("Unauthorized");
  }
  return result;
}
