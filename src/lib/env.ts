import bcrypt from "bcryptjs";
import { z } from "zod";
import { EnvSchema, type Env } from "@/lib/schemas";

// ============================================================
// validateEnv — validación de entorno al boot
// En production: throw si falta required (fail-fast)
// En development: warning + permitir sin UPSTASH
// ============================================================

let cachedEnv: Env | null = null;
let cachedHashedPassword: string | null = null;

function getEnvRaw(): Partial<Env> {
  return {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV as Env["NODE_ENV"] | undefined,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    NEXT_PUBLIC_UPLOADTHING_APP_ID: process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID,
  };
}

export function validateEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const raw = getEnvRaw();

  const devResult = EnvSchema.safeParse({
    ADMIN_PASSWORD: raw.ADMIN_PASSWORD || "devpassword123",
    ADMIN_JWT_SECRET: raw.ADMIN_JWT_SECRET || "dev-secret-not-for-production-use-at-least-32-chars",
    UPSTASH_REDIS_REST_URL: raw.UPSTASH_REDIS_REST_URL || "",
    UPSTASH_REDIS_REST_TOKEN: raw.UPSTASH_REDIS_REST_TOKEN || "",
    NEXT_PUBLIC_SITE_URL: raw.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    NODE_ENV: raw.NODE_ENV || "development",
    UPLOADTHING_SECRET: raw.UPLOADTHING_SECRET,
    NEXT_PUBLIC_UPLOADTHING_APP_ID: raw.NEXT_PUBLIC_UPLOADTHING_APP_ID,
  });

  if (!devResult.success) {
    cachedEnv = {
      ADMIN_PASSWORD: raw.ADMIN_PASSWORD || "devpassword123",
      ADMIN_JWT_SECRET: raw.ADMIN_JWT_SECRET || "dev-secret-not-for-production-use-at-least-32-chars",
      UPSTASH_REDIS_REST_URL: raw.UPSTASH_REDIS_REST_URL || "",
      UPSTASH_REDIS_REST_TOKEN: raw.UPSTASH_REDIS_REST_TOKEN || "",
      NEXT_PUBLIC_SITE_URL: raw.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      NODE_ENV: "development",
      UPLOADTHING_SECRET: raw.UPLOADTHING_SECRET,
      NEXT_PUBLIC_UPLOADTHING_APP_ID: raw.NEXT_PUBLIC_UPLOADTHING_APP_ID,
    };
    return cachedEnv;
  }

  cachedEnv = devResult.data;
  return cachedEnv;
}

export function getHashedAdminPassword(): string {
  if (cachedHashedPassword) return cachedHashedPassword;
  const env = validateEnv();
  // Si ya es un hash bcrypt ($2a$, $2b$, $2y$), usar directo
  if (env.ADMIN_PASSWORD.startsWith("$2")) {
    cachedHashedPassword = env.ADMIN_PASSWORD;
  } else {
    // Hashear con bcrypt(12) — defense-in-depth
    cachedHashedPassword = bcrypt.hashSync(env.ADMIN_PASSWORD, 12);
  }
  return cachedHashedPassword;
}

export function isProduction(): boolean {
  return validateEnv().NODE_ENV === "production";
}

export function hasUpstash(): boolean {
  const env = validateEnv();
  return Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);
}
