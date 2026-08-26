"use client";

import { useEffect, useState } from "react";
import { useAdminFetch } from "@/lib/admin-fetch";
import type { CustomSection, NewCustomSection, Product } from "@/lib/schemas";

const EMPTY_SECTION: NewCustomSection = {
  title: "",
  background: null,
  position: "below",
  productIds: [],
  active: true,
  order: 0,
  accentColor: null,
  overlayOpacity: 0.55,
  titleColor: null,
  autoComplementary: true,
  buttonColor: null,
};

export function SectionManager() {
  const { adminFetch } = useAdminFetch();
  const [sections, setSections] = useState<CustomSection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<NewCustomSection | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [secRes, prodRes] = await Promise.all([fetch("/api/sections"), fetch("/api/products")]);
    const secJson = await secRes.json();
    const prodJson = await prodRes.json();
    setSections(secJson.data || []);
    setProducts(prodJson.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    const existing = sections.some((s) => s.id === editing.id);
    if (existing && editing.id) {
      await adminFetch(`/api/sections/${editing.id}`, { method: "PUT", body: JSON.stringify(editing) });
    } else {
      await adminFetch("/api/sections", { method: "POST", body: JSON.stringify(editing) });
    }
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta sección?")) return;
    await adminFetch(`/api/sections/${id}`, { method: "DELETE" });
    load();
  };

  const toggleProduct = (pid: string) => {
    if (!editing) return;
    const ids = editing.productIds.includes(pid)
      ? editing.productIds.filter((x) => x !== pid)
      : [...editing.productIds, pid];
    setEditing({ ...editing, productIds: ids });
  };

  if (loading) return <p className="text-dgn-text-500">Cargando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Secciones</h1>
        <button onClick={() => setEditing({ ...EMPTY_SECTION })} className="rounded-lg bg-dgn-primary-600 px-4 py-2 text-sm hover:bg-dgn-primary-500">
          + Nueva sección
        </button>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="flex items-center justify-between rounded-lg border border-dgn-base-700 bg-dgn-base-900/60 p-4">
            <div>
              <p className="font-medium text-dgn-text-50">{section.title}</p>
              <p className="text-sm text-dgn-text-300">
                {section.position} · {section.productIds.length} productos · {section.active ? "activa" : "inactiva"}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing({ ...section })} className="rounded-lg border border-dgn-base-700 px-3 py-1.5 text-sm hover:border-dgn-accent-500">Editar</button>
              <button onClick={() => handleDelete(section.id)} className="rounded-lg border border-red-900/50 px-3 py-1.5 text-sm text-red-400 hover:bg-red-950/30">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dgn-base-950/80 p-4" onClick={() => setEditing(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-dgn-base-700 bg-dgn-base-900 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-lg font-bold">{editing.id ? "Editar" : "Nueva"} sección</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm text-dgn-text-300">Título</span>
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-dgn-text-300">Posición</span>
                <select value={editing.position} onChange={(e) => setEditing({ ...editing, position: e.target.value as "above" | "below" })} className="input">
                  <option value="above">Arriba (above)</option>
                  <option value="below">Abajo (below)</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-dgn-text-300">Orden</span>
                <input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} className="input" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-dgn-text-300">Opacidad overlay ({editing.overlayOpacity})</span>
                <input type="range" min={0} max={1} step={0.05} value={editing.overlayOpacity} onChange={(e) => setEditing({ ...editing, overlayOpacity: Number(e.target.value) })} className="w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-dgn-text-300">Background URL</span>
                <input value={editing.background ?? ""} onChange={(e) => setEditing({ ...editing, background: e.target.value || null })} className="input" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-dgn-text-300">Accent color</span>
                <input value={editing.accentColor ?? ""} onChange={(e) => setEditing({ ...editing, accentColor: e.target.value || null })} className="input" placeholder="hsl(...) o #hex" />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Activa
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.autoComplementary} onChange={(e) => setEditing({ ...editing, autoComplementary: e.target.checked })} /> Auto-complementar
              </label>
            </div>
            <div className="mt-4">
              <span className="mb-2 block text-sm text-dgn-text-300">Productos ({editing.productIds.length} seleccionados)</span>
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-dgn-base-700 p-2">
                {products.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={editing.productIds.includes(p.id)} onChange={() => toggleProduct(p.id)} />
                    {p.titulo}
                  </label>
                ))}
              </div>
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
