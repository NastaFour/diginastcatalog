import { z } from "zod";

// ============================================================
// Zod Schemas — Catálogo Diginast
// Design.md §1 — 10 schemas mejorados
// ============================================================

// --- 1.1 ProductSchema ---
export const ProductSchema = z.object({
  id: z.string().min(1),
  foto: z.string().url().or(z.literal("")).default(""),
  titulo: z.string().min(1).max(120),
  tituloEn: z.string().max(120).optional().nullable().default(null),
  caracteristicas: z.array(z.string().min(1).max(200)).max(8).default([]),
  caracteristicasEn: z.array(z.string().min(1).max(200)).max(8).optional().nullable().default(null),
  descripcion: z.string().min(1).max(5000),
  descripcionEn: z.string().max(5000).optional().nullable().default(null),
  precio: z.number().nonnegative(),
  oldPrice: z.number().nonnegative().nullable().default(null),
  tag: z.string().max(60).default(""),
  tagEn: z.string().max(60).optional().nullable().default(null),
  featured: z.boolean().default(false),
  category: z.string().max(80).default("General"),
  categoryEn: z.string().max(80).optional().nullable().default(null),
  inStock: z.boolean().default(true),
  stockCount: z.number().int().nonnegative().nullable().optional().default(null),
  videoUrl: z.string().url().nullable().optional().default(null),
  updatedAt: z.string().default(() => new Date().toISOString()),
});
export type Product = z.infer<typeof ProductSchema>;

export const NewProductSchema = ProductSchema.omit({ id: true, updatedAt: true }).extend({
  id: z.string().min(1).optional(),
});
export type NewProduct = z.infer<typeof NewProductSchema>;

// --- 1.2 CustomSectionSchema ---
export const CustomSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(120),
  background: z.string().url().nullable().default(null),
  position: z.enum(["above", "below"]).default("below"),
  productIds: z.array(z.string()).default([]),
  active: z.boolean().default(true),
  order: z.number().int().default(0),
  accentColor: z.string().nullable().default(null),
  overlayOpacity: z.number().min(0).max(1).default(0.55),
  titleColor: z.string().nullable().default(null),
  autoComplementary: z.boolean().default(true),
  buttonColor: z.string().nullable().default(null),
});
export type CustomSection = z.infer<typeof CustomSectionSchema>;

export const NewCustomSectionSchema = CustomSectionSchema.omit({ id: true }).extend({
  id: z.string().min(1).optional(),
});
export type NewCustomSection = z.infer<typeof NewCustomSectionSchema>;

// --- 1.3 ButtonDefSchema ---
export const ButtonDefSchema = z.object({
  label: z.string().min(1).max(80),
  action: z.enum(["link", "whatsapp-order", "whatsapp-info", "back", "scroll"]).default("link"),
  href: z.string().max(500).default(""),
  variant: z.enum(["solid-primary", "outline-primary", "solid-accent", "ghost"]).default("solid-primary"),
  visible: z.boolean().default(true),
  whatsappTemplate: z.string().max(500).default(""),
});
export type ButtonDef = z.infer<typeof ButtonDefSchema>;

// --- 1.4 CategoryDefSchema ---
export const CategoryDefSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(80),
  imageUrl: z.string().url().nullable().default(null),
  order: z.number().int().default(0),
});
export type CategoryDef = z.infer<typeof CategoryDefSchema>;

// --- 1.10 PromosConfigSchema + FeaturedSectionSchema (needed by AppConfig) ---
export const PromosConfigSchema = z.object({
  flashVisible: z.boolean().default(true),
  flashBtnLabel: z.string().min(1).default("Ver Ofertas"),
  specialVisible: z.boolean().default(true),
  specialBtnLabel: z.string().min(1).default("Saber Más"),
  specialBg: z.string().nullable().default(null),
});
export type PromosConfig = z.infer<typeof PromosConfigSchema>;

export const FeaturedSectionSchema = z.object({
  title: z.string().min(1).max(120).default("Destacados"),
  background: z.string().url().nullable().default(null),
  accentColor: z.string().nullable().default(null),
  overlayOpacity: z.number().min(0).max(1).default(0.55),
  titleColor: z.string().nullable().default(null),
  buttonColor: z.string().nullable().default(null),
  autoComplementary: z.boolean().default(true),
  order: z.number().int().default(50),
  visible: z.boolean().default(true),
});
export type FeaturedSection = z.infer<typeof FeaturedSectionSchema>;

// --- 1.5 AppConfigSchema ---
// zod v3: z.record toma 1 arg (el value type)
export const AppConfigSchema = z.object({
  brandName: z.string().default("Diginast"),
  pageTitle: z.string().default("Diginast — Hardware de Alto Rendimiento"),
  heroTitle: z.string().default("Hardware Extremo para Creadores y Gamers"),
  heroSubtitle: z.string().default("Equipos ensamblados a medida, workstations para render/IA y componentes de vanguardia con ingeniería térmica avanzada."),
  heroBackgroundUrl: z.string().url().default(""),
  whatsapp: z.object({
    phone: z.string().default(""),
  }),
  buttons: z.record(ButtonDefSchema),
  categories: z.array(CategoryDefSchema).default([]),
  promos: PromosConfigSchema.default({}),
  featuredSection: FeaturedSectionSchema.default({}),
});
export type AppConfig = z.infer<typeof AppConfigSchema>;

// --- 1.6 MediaItemSchema ---
export const MediaItemSchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  name: z.string().min(1).max(200),
  uploadedAt: z.string(),
  utKey: z.string().optional(),
});
export type MediaItem = z.infer<typeof MediaItemSchema>;

// --- 1.7 AuditEntrySchema (NUEVO) ---
export const AuditEntrySchema = z.object({
  id: z.string().min(1),
  action: z.enum([
    "login-success",
    "login-failed",
    "logout",
    "product-create",
    "product-update",
    "product-delete",
    "section-create",
    "section-update",
    "section-delete",
    "category-create",
    "category-update",
    "category-delete",
    "config-update",
    "media-upload",
    "media-delete",
    "backup-export",
    "backup-reset",
  ]),
  ip: z.string().default(""),
  timestamp: z.string().default(() => new Date().toISOString()),
  success: z.boolean().default(true),
  meta: z.record(z.unknown()).optional(),
});
export type AuditEntry = z.infer<typeof AuditEntrySchema>;

// --- 1.8 EnvSchema (NUEVO) ---
export const EnvSchema = z.object({
  ADMIN_PASSWORD: z.string().min(8),
  ADMIN_JWT_SECRET: z.string().min(32),
  UPSTASH_REDIS_REST_URL: z.string().url().or(z.literal("")).optional().default(""),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional().default(""),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  UPLOADTHING_SECRET: z.string().optional(),
  NEXT_PUBLIC_UPLOADTHING_APP_ID: z.string().optional(),
});
export type Env = z.infer<typeof EnvSchema>;

// --- 1.9 PasswordSchema ---
export const PasswordSchema = z.object({
  password: z.string().min(1),
});
