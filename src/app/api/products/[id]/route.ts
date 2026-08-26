import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/data";
import { NewProductSchema } from "@/lib/schemas";
import { sanitizeProductFields } from "@/lib/sanitize";
import { isAuthenticated } from "@/lib/auth-check";
import { checkMutationLimit } from "@/lib/ratelimit";
import { logAudit } from "@/lib/audit";
import type { Product } from "@/lib/schemas";

// PUT /api/products/[id] — actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
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
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  products[index] = {
    ...products[index],
    ...sanitized,
    id,
    updatedAt: new Date().toISOString(),
  } as Product;

  const saved = await saveProducts(products);
  if (!saved) {
    return NextResponse.json({ error: "Storage no disponible" }, { status: 503 });
  }

  await logAudit("product-update", ip, true, { id });
  return NextResponse.json({ data: products[index] });
}

// DELETE /api/products/[id] — eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const auth = await isAuthenticated();
  if (!auth.authenticated) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const limit = await checkMutationLimit(ip);
  if (!limit.success) {
    return NextResponse.json({ error: "Rate limit excedido" }, { status: 429 });
  }

  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  products.splice(index, 1);
  const saved = await saveProducts(products);
  if (!saved) {
    return NextResponse.json({ error: "Storage no disponible" }, { status: 503 });
  }

  await logAudit("product-delete", ip, true, { id });
  return NextResponse.json({ ok: true });
}
