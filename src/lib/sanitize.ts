import type { Product, CustomSection, AppConfig } from "@/lib/schemas";

// ============================================================
// Sanitización anti-XSS
// Strips ALL HTML tags (catalog is plain text, not rich text)
// ============================================================

export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]*>?/gm, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

export function sanitizeProductFields(product: Partial<Product>): Partial<Product> {
  const sanitized: Partial<Product> = { ...product };
  if (sanitized.titulo) sanitized.titulo = sanitizeHtml(sanitized.titulo);
  if (sanitized.descripcion) sanitized.descripcion = sanitizeHtml(sanitized.descripcion);
  if (sanitized.tag) sanitized.tag = sanitizeHtml(sanitized.tag);
  if (sanitized.caracteristicas) {
    sanitized.caracteristicas = sanitized.caracteristicas.map((c) => sanitizeHtml(c));
  }
  return sanitized;
}

export function sanitizeSectionFields(section: Partial<CustomSection>): Partial<CustomSection> {
  const sanitized: Partial<CustomSection> = { ...section };
  if (sanitized.title) sanitized.title = sanitizeHtml(sanitized.title);
  return sanitized;
}

export function sanitizeConfigFields(config: Partial<AppConfig>): Partial<AppConfig> {
  const sanitized: Partial<AppConfig> = { ...config };
  if (sanitized.brandName) sanitized.brandName = sanitizeHtml(sanitized.brandName);
  if (sanitized.heroTitle) sanitized.heroTitle = sanitizeHtml(sanitized.heroTitle);
  if (sanitized.heroSubtitle) sanitized.heroSubtitle = sanitizeHtml(sanitized.heroSubtitle);
  return sanitized;
}
