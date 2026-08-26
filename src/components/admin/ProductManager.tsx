"use client";

import { useEffect, useState } from "react";
import { useAdminFetch } from "@/lib/admin-fetch";
import type { Product, NewProduct } from "@/lib/schemas";

const EMPTY_PRODUCT: NewProduct = {
  foto: "",
  titulo: "",
  tituloEn: null,
  caracteristicas: [],
  caracteristicasEn: null,
  descripcion: "",
  descripcionEn: null,
  precio: 0,
  oldPrice: null,
  tag: "",
  tagEn: null,
  featured: false,
  category: "General",
  categoryEn: null,
  inStock: true,
  stockCount: null,
  videoUrl: null,
};

export function ProductManager() {
  const { adminFetch } = useAdminFetch();
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<NewProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/products");
    const json = await res.json();
    setProducts(json.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    const isEditing = products.some((p) => p.id === editing.id);
    if (isEditing && editing.id) {
      await adminFetch(`/api/products/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(editing),
      });
    } else {
      await adminFetch("/api/products", {
        method: "POST",
        body: JSON.stringify(editing),
      });
    }
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await adminFetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  };

  if (loading) return <p className="text-dgn-text-500">Cargando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <button
          onClick={() => setEditing({ ...EMPTY_PRODUCT })}
          className="rounded-lg bg-dgn-primary-600 px-4 py-2 text-sm hover:bg-dgn-primary-500"
        >
          + Nuevo producto
        </button>
      </div>

      {/* Product list */}
      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded-lg border border-dgn-base-700 bg-dgn-base-900/60 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-dgn-base-800">
                {product.foto ? (
                  <img src={product.foto} alt="" className="h-12 w-12 rounded-lg object-cover" />
                ) : (
                  <span className="font-mono text-xs text-dgn-primary-800">{"</>"}</span>
                )}
              </div>
              <div>
                <p className="font-medium text-dgn-text-50">{product.titulo}</p>
                <p className="text-sm text-dgn-text-300">${product.precio} · {product.category}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing({ ...product })}
                className="rounded-lg border border-dgn-base-700 px-3 py-1.5 text-sm hover:border-dgn-accent-500"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="rounded-lg border border-red-900/50 px-3 py-1.5 text-sm text-red-400 hover:bg-red-950/30"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dgn-base-950/80 p-4" onClick={() => setEditing(null)}>
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-dgn-base-700 bg-dgn-base-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-bold">{editing.id ? "Editar" : "Nuevo"} producto</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Título">
                <input value={editing.titulo} onChange={(e) => setEditing({ ...editing, titulo: e.target.value })}
                  className="input" />
              </Field>
              <Field label="Precio">
                <input type="number" value={editing.precio} onChange={(e) => setEditing({ ...editing, precio: Number(e.target.value) })}
                  className="input" />
              </Field>
              <Field label="Precio anterior (opcional)">
                <input type="number" value={editing.oldPrice ?? ""} onChange={(e) => setEditing({ ...editing, oldPrice: e.target.value ? Number(e.target.value) : null })}
                  className="input" />
              </Field>
              <Field label="Categoría">
                <input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="input" />
              </Field>
              <Field label="Tag">
                <input value={editing.tag} onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                  className="input" />
              </Field>
              <Field label="Foto URL">
                <input value={editing.foto} onChange={(e) => setEditing({ ...editing, foto: e.target.value })}
                  className="input" placeholder="https://..." />
              </Field>
              <Field label="Características (una por línea, máx 5)">
                <textarea
                  value={editing.caracteristicas.join("\n")}
                  onChange={(e) => setEditing({ ...editing, caracteristicas: e.target.value.split("\n").filter(Boolean).slice(0, 5) })}
                  className="input min-h-[80px]"
                />
              </Field>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                  Destacado
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.inStock} onChange={(e) => setEditing({ ...editing, inStock: e.target.checked })} />
                  En stock
                </label>
              </div>
              <div className="sm:col-span-2">
                <Field label="Descripción">
                  <textarea value={editing.descripcion} onChange={(e) => setEditing({ ...editing, descripcion: e.target.value })}
                    className="input min-h-[120px]" />
                </Field>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} className="rounded-lg bg-dgn-primary-600 px-4 py-2 text-sm hover:bg-dgn-primary-500">
                Guardar
              </button>
              <button onClick={() => setEditing(null)} className="rounded-lg border border-dgn-base-700 px-4 py-2 text-sm">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-dgn-text-300">{label}</span>
      {children}
    </label>
  );
}
