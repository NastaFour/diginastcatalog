import { describe, it, expect } from "vitest";
import {
  ProductSchema,
  NewProductSchema,
  CustomSectionSchema,
  AppConfigSchema,
  MediaItemSchema,
  AuditEntrySchema,
  EnvSchema,
} from "../schemas";
import { sanitizeHtml, sanitizeProductFields } from "../sanitize";
import { timingSafeEqual, verifyCsrfToken } from "../csrf";

describe("ProductSchema Validation", () => {
  it("validates a valid product", () => {
    const validProduct = {
      id: "prod-1",
      foto: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
      titulo: "Landing Page SaaS",
      caracteristicas: ["Next.js 15", "Tailwind 4", "SEO"],
      descripcion: "Landing page de alta conversión para proyectos SaaS.",
      precio: 499,
      oldPrice: 799,
      tag: "Popular",
      featured: true,
      category: "Web",
      inStock: true,
      stockCount: 5,
      videoUrl: null,
      updatedAt: new Date().toISOString(),
    };

    const result = ProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("fails on negative price", () => {
    const invalidProduct = {
      id: "prod-2",
      foto: "",
      titulo: "Producto Inválido",
      descripcion: "Descripción de prueba",
      precio: -100,
    };

    const result = ProductSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });

  it("fails when caracteristicas exceeds 8 items", () => {
    const invalidProduct = {
      id: "prod-3",
      foto: "",
      titulo: "Producto con muchos tags",
      descripcion: "Descripción de prueba",
      precio: 100,
      caracteristicas: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    };

    const result = ProductSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });
});

describe("Sanitization and Security", () => {
  it("strips malicious script tags from strings", () => {
    const maliciousInput = '<script>alert("XSS")</script>Hello World';
    const cleaned = sanitizeHtml(maliciousInput);
    expect(cleaned).toBe("Hello World");
    expect(cleaned).not.toContain("<script>");
  });

  it("sanitizes product fields against XSS payloads", () => {
    const raw = {
      titulo: '<img src="x" onerror="alert(1)">Sistema Seguro',
      descripcion: '<b onclick="evil()">Click</b> para comprar',
      tag: "<script>hack()</script>Premium",
    };

    const sanitized = sanitizeProductFields(raw);
    expect(sanitized.titulo).toBe("Sistema Seguro");
    expect(sanitized.descripcion).toBe("Click para comprar");
    expect(sanitized.tag).toBe("Premium");
  });

  it("verifies timing-safe CSRF comparison correctly", () => {
    const token = "secure-random-token-12345";
    expect(timingSafeEqual(token, token)).toBe(true);
    expect(timingSafeEqual(token, "wrong-token")).toBe(false);
    expect(verifyCsrfToken(token, token)).toBe(true);
    expect(verifyCsrfToken(token, undefined)).toBe(false);
  });
});

describe("EnvSchema Validation", () => {
  it("validates environment object correctly", () => {
    const validEnv = {
      ADMIN_PASSWORD: "securepassword123",
      ADMIN_JWT_SECRET: "12345678901234567890123456789012",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      NODE_ENV: "development",
    };

    const result = EnvSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
  });

  it("fails if password is shorter than 8 chars", () => {
    const invalidEnv = {
      ADMIN_PASSWORD: "short",
      ADMIN_JWT_SECRET: "12345678901234567890123456789012",
    };

    const result = EnvSchema.safeParse(invalidEnv);
    expect(result.success).toBe(false);
  });
});
