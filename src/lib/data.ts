import { z } from "zod";
import { getStorage, KEYS } from "@/lib/store";
import {
  ProductSchema,
  CustomSectionSchema,
  AppConfigSchema,
  MediaItemSchema,
  AuditEntrySchema,
  type Product,
  type CustomSection,
  type AppConfig,
  type MediaItem,
  type AuditEntry,
} from "@/lib/schemas";
import { diginastSeed } from "@/lib/seed";

// ============================================================
// Data layer — CRUD products/sections/config/media + audit
// ============================================================

export async function getProducts(): Promise<Product[]> {
  const store = getStorage();
  const raw = await store.get<Product[]>(KEYS.products);
  if (!raw || raw.length === 0) {
    // Retornar COPIA del seed — nunca la referencia directa
    // para evitar mutaciones accidentales en los POST routes
    return diginastSeed.products.map((p) => ({ ...p }));
  }
  const parsed = z.array(ProductSchema).safeParse(raw);
  return parsed.success ? parsed.data : diginastSeed.products.map((p) => ({ ...p }));
}

export async function getProduct(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function saveProducts(products: Product[]): Promise<boolean> {
  const store = getStorage();
  return store.set(KEYS.products, products);
}

export async function getSections(): Promise<CustomSection[]> {
  const store = getStorage();
  const raw = await store.get<CustomSection[]>(KEYS.sections);
  if (!raw) return [];
  const parsed = z.array(CustomSectionSchema).safeParse(raw);
  return parsed.success ? parsed.data : [];
}

export async function saveSections(sections: CustomSection[]): Promise<boolean> {
  const store = getStorage();
  return store.set(KEYS.sections, sections);
}

export async function getConfig(): Promise<AppConfig | null> {
  const store = getStorage();
  const raw = await store.get<AppConfig>(KEYS.config);
  if (!raw) return { ...diginastSeed.config };
  const parsed = AppConfigSchema.safeParse(raw);
  return parsed.success ? parsed.data : { ...diginastSeed.config };
}

export async function saveConfig(config: AppConfig): Promise<boolean> {
  const store = getStorage();
  return store.set(KEYS.config, config);
}

export async function getMedia(): Promise<MediaItem[]> {
  const store = getStorage();
  const raw = await store.get<MediaItem[]>(KEYS.media);
  if (!raw) return [];
  const parsed = z.array(MediaItemSchema).safeParse(raw);
  return parsed.success ? parsed.data : [];
}

export async function saveMedia(media: MediaItem[]): Promise<boolean> {
  const store = getStorage();
  return store.set(KEYS.media, media);
}

export async function getAuditLog(): Promise<AuditEntry[]> {
  const store = getStorage();
  const raw = await store.get<AuditEntry[]>(KEYS.audit);
  if (!raw) return [];
  const parsed = z.array(AuditEntrySchema).safeParse(raw);
  return parsed.success ? parsed.data : [];
}

export async function appendAudit(entry: AuditEntry): Promise<boolean> {
  const store = getStorage();
  const log = await getAuditLog();
  log.unshift(entry); // newest first
  // Cap at 500 entries
  const capped = log.slice(0, 500);
  return store.set(KEYS.audit, capped);
}
