import { Redis } from "@upstash/redis";
import { getRedis, KEYS } from "@/lib/redis";
import { isProduction } from "@/lib/env";

// ============================================================
// KVStore — abstracción de persistencia
// RedisStore (producción) | MemoryStore (dev fallback)
// ============================================================

export interface KVStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, val: T): Promise<boolean>;
  del(key: string): Promise<boolean>;
}

// --- RedisStore ---
export class RedisStore implements KVStore {
  constructor(private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await this.redis.get<string>(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.error(`[RedisStore] get(${key}) failed:`, err);
      return null;
    }
  }

  async set<T>(key: string, val: T): Promise<boolean> {
    try {
      await this.redis.set(key, JSON.stringify(val));
      return true;
    } catch (err) {
      console.error(`[RedisStore] set(${key}) failed:`, err);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.redis.del(key);
      return true;
    } catch (err) {
      console.error(`[RedisStore] del(${key}) failed:`, err);
      return false;
    }
  }
}

// --- MemoryStore (dev fallback) ---
export class MemoryStore implements KVStore {
  private map = new Map<string, string>();

  async get<T>(key: string): Promise<T | null> {
    const raw = this.map.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  }

  async set<T>(key: string, val: T): Promise<boolean> {
    this.map.set(key, JSON.stringify(val));
    return true;
  }

  async del(key: string): Promise<boolean> {
    return this.map.delete(key);
  }
}

// --- NullStore (producción sin Redis — writes fallan) ---
export class NullStore implements KVStore {
  async get<T>(): Promise<T | null> {
    return null;
  }
  async set<T>(): Promise<boolean> {
    return false; // write rejected → 503
  }
  async del(): Promise<boolean> {
    return false;
  }
}

let storageInstance: KVStore | null = null;

export function getStorage(): KVStore {
  if (storageInstance) return storageInstance;

  const redis = getRedis();
  if (redis) {
    storageInstance = new RedisStore(redis);
  } else if (isProduction()) {
    storageInstance = new NullStore();
  } else {
    console.warn("[store] Using MemoryStore fallback — data will be lost on restart");
    storageInstance = new MemoryStore();
  }

  return storageInstance;
}

export { KEYS };
