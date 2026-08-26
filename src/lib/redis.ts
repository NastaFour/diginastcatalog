import { Redis } from "@upstash/redis";
import { hasUpstash } from "@/lib/env";

// ============================================================
// getRedis — singleton Upstash Redis
// Retorna instancia o null si no hay env configurado
// ============================================================

let redisInstance: Redis | null = null;

export function getRedis(): Redis | null {
  if (!hasUpstash()) return null;
  if (redisInstance) return redisInstance;

  redisInstance = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  return redisInstance;
}

// Claves Upstash — design.md §2
export const KEYS = {
  products: "catalog:products",
  sections: "catalog:sections",
  config: "catalog:config",
  media: "catalog:media",
  audit: "catalog:audit",
} as const;
