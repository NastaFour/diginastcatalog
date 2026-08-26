import { CSRF_COOKIE } from "@/lib/constants";

// ============================================================
// CSRF — token same-origin para mutaciones
// Cookie csrf_token (sameSite=strict, no-httpOnly para cliente)
// ============================================================

export function generateCsrfToken(): string {
  return crypto.randomUUID();
}

/** Timing-safe comparison — sin dependencias de next/headers */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function verifyCsrfToken(cookieValue: string | null | undefined, headerValue: string | null | undefined): boolean {
  if (!cookieValue || !headerValue) return false;
  return timingSafeEqual(cookieValue, headerValue);
}

/** Set CSRF cookie from route handler — requiere next/headers */
export async function setCsrfCookie(token: string): Promise<void> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE, token, {
    httpOnly: false, // client needs to read it
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 60 * 60, // 8h
  });
}

/** Get CSRF token from cookie */
export async function getCsrfTokenFromCookie(): Promise<string | undefined> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE)?.value;
}

export { CSRF_COOKIE };
