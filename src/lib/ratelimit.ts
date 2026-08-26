import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "@/lib/redis";

// ============================================================
// Rate limiting — Upstash Ratelimit
// loginLimit: fixedWindow 5 intentos / 15 min
// mutationLimit: slidingWindow 30 / 1 min
// Si no hay Redis → no-op (permiten todo en dev)
// ============================================================

type NoopLimit = {
  limit: (id: string) => Promise<{ success: boolean; limit: number; remaining: number; reset: number }>;
};

const noopLimiter: NoopLimit = {
  limit: async () => ({ success: true, limit: 0, remaining: 0, reset: 0 }),
};

let loginLimiter: Ratelimit | NoopLimit | null = null;
let mutationLimiter: Ratelimit | NoopLimit | null = null;

export function getLoginLimiter(): Ratelimit | NoopLimit {
  if (loginLimiter) return loginLimiter;
  const redis = getRedis();
  if (!redis) {
    loginLimiter = noopLimiter;
    return loginLimiter;
  }
  loginLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(5, "15 m"),
    prefix: "rl:login",
    analytics: true,
  });
  return loginLimiter;
}

export function getMutationLimiter(): Ratelimit | NoopLimit {
  if (mutationLimiter) return mutationLimiter;
  const redis = getRedis();
  if (!redis) {
    mutationLimiter = noopLimiter;
    return mutationLimiter;
  }
  mutationLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    prefix: "rl:mut",
    analytics: true,
  });
  return mutationLimiter;
}

export async function checkLoginLimit(ip: string): Promise<{ success: boolean; remaining: number; reset: number }> {
  const limiter = getLoginLimiter();
  const result = await limiter.limit(ip);
  return { success: result.success, remaining: result.remaining, reset: result.reset };
}

export async function checkMutationLimit(ip: string): Promise<{ success: boolean; remaining: number; reset: number }> {
  const limiter = getMutationLimiter();
  const result = await limiter.limit(ip);
  return { success: result.success, remaining: result.remaining, reset: result.reset };
}
