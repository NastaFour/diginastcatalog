"use client";

import { useEffect, useState } from "react";
import { useAdminFetch } from "@/lib/admin-fetch";
import type { CategoryDef } from "@/lib/schemas";

export function CategoryManager() {
  const { adminFetch } = useAdminFetch();
  const [categories, setCategories] = useState<CategoryDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<CategoryDef> | null>(null);

  const load = async () => {
    const res = await fetch("/api/categories");
    const json = await res.json();
    setCategories(json.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    const existing = categories.some((c) => c.id === editing.id);
    if (existing && editing.id) {
      await adminFetch(`/api/categories/${editing.id}`, { method: "PUT", body: JSON.stringify(editing) });
    } else {
      await adminFetch("/api/categories", { method: "POST", body: JSON.stringify(editing) });
    }
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    await adminFetch(`/api/categories/${id}`, { method: "DELETE" });
    load();
  };

  if (loading) return <p className="text-dgn-text-500">Cargando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <button onClick={() => setEditing({ name: "", imageUrl: null, order: 0 })} className="rounded-lg bg-dgn-primary-600 px-4 py-2 text-sm hover:bg-dgn-primary-500">
          + Nueva categoría
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between rounded-lg border border-dgn-base-700 bg-dgn-base-900/60 p-4">
            <div className="flex items-center gap-3">
              {cat.imageUrl ? <img src={cat.imageUrl} alt="" className="h-8 w-8 rounded-full" /> : <span className="h-8 w-8 rounded-full bg-dgn-base-800" />}
              <div>
                <p className="font-medium text-dgn-text-50">{cat.name}</p>
                <p className="text-sm text-dgn-text-300">Orden: {cat.order}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing({ ...cat })} className="rounded-lg border border-dgn-base-700 px-3 py-1.5 text-sm hover:border-dgn-accent-500">Editar</button>
              <button onClick={() => handleDelete(cat.id)} className="rounded-lg border border-red-900/50 px-3 py-1.5 text-sm text-red-400 hover:bg-red-950/30">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dgn-base-950/80 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md rounded-xl border border-dgn-base-700 bg-dgn-base-900 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-lg font-bold">{editing.id ? "Editar" : "Nueva"} categoría</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm text-dgn-text-300">Nombre</span>
                <input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-dgn-text-300">Imagen URL (opcional)</span>
                <input value={editing.imageUrl ?? ""} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value || null })} className="input" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-dgn-text-300">Orden</span>
                <input type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} className="input" />
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} className="rounded-lg bg-dgn-primary-600 px-4 py-2 text-sm hover:bg-dgn-primary-500">Guardar</button>
              <button onClick={() => setEditing(null)} className="rounded-lg border border-dgn-base-700 px-4 py-2 text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
