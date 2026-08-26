import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/data";
import { NewProductSchema } from "@/lib/schemas";
import { sanitizeProductFields } from "@/lib/sanitize";
import { isAuthenticated } from "@/lib/auth-check";
import { checkMutationLimit } from "@/lib/ratelimit";
import { logAudit } from "@/lib/audit";
import { getStorage, NullStore } from "@/lib/store";
import type { Product } from "@/lib/schemas";

// GET /api/products — público
export async function GET(): Promise<NextResponse> {
  const products = await getProducts();
  const isDegraded = getStorage() instanceof NullStore;
  const headers: Record<string, string> = {};
  if (isDegraded) headers["X-Storage-Status"] = "degraded";
  return NextResponse.json({ data: products }, { headers });
}

// POST /api/products — auth + rate limit + sanitize
export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const auth = await isAuthenticated();
  if (!auth.authenticated) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const limit = await checkMutationLimit(ip);
  if (!limit.success) {
    return NextResponse.json({ error: "Rate limit excedido" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = NewProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const sanitized = sanitizeProductFields(parsed.data);
  const products = await getProducts();

  const newProduct: Product = {
    ...sanitized,
    id: sanitized.id || crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
  } as Product;

  products.push(newProduct);
  const saved = await saveProducts(products);
  if (!saved) {
    return NextResponse.json({ error: "Storage no disponible" }, { status: 503 });
  }

  await logAudit("product-create", ip, true, { id: newProduct.id });
  return NextResponse.json({ data: newProduct }, { status: 201 });
}
