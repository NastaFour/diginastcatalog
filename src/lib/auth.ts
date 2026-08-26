import { SignJWT, jwtVerify } from "jose";
import { SESSION_MAX_AGE } from "@/lib/constants";

// ============================================================
// Auth — JWT HS256 con jose
// Cookie httpOnly, secure, sameSite=strict, maxAge=8h
// ============================================================

const encoder = new TextEncoder();

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET || "dev-secret-not-for-production-use-at-least-32-chars";
  return encoder.encode(secret);
}

export interface SessionPayload {
  role: "admin";
  iat: number;
  exp: number;
}

export async function createSessionToken(): Promise<string> {
  const secret = getSecret();
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_MAX_AGE)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
