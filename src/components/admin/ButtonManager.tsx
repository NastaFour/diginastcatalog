"use client";

import { useEffect, useState } from "react";
import { useAdminFetch } from "@/lib/admin-fetch";
import { ButtonRenderer } from "@/components/ui/ButtonRenderer";
import type { AppConfig, ButtonDef } from "@/lib/schemas";

export function ButtonManager() {
  const { adminFetch } = useAdminFetch();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/config");
    const json = await res.json();
    setConfig(json.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateButton = (key: string, field: keyof ButtonDef, value: string | boolean) => {
    if (!config) return;
    const buttons = { ...config.buttons };
    buttons[key] = { ...buttons[key], [field]: value };
    setConfig({ ...config, buttons });
  };

  const handleSave = async () => {
    if (!config) return;
    await adminFetch("/api/config", { method: "PUT", body: JSON.stringify(config) });
    load();
  };

  if (loading || !config) return <p className="text-dgn-text-500">Cargando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Botones</h1>
        <button onClick={handleSave} className="rounded-lg bg-dgn-primary-600 px-4 py-2 text-sm hover:bg-dgn-primary-500">
          Guardar cambios
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(config.buttons).map(([key, button]) => (
          <div key={key} className="rounded-lg border border-dgn-base-700 bg-dgn-base-900/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-sm text-dgn-accent-400">{key}</span>
              <ButtonRenderer button={button} config={config} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block">
                <span className="mb-1 block text-xs text-dgn-text-300">Label</span>
                <input value={button.label} onChange={(e) => updateButton(key, "label", e.target.value)} className="input" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-dgn-text-300">Acción</span>
                <select value={button.action} onChange={(e) => updateButton(key, "action", e.target.value)} className="input">
                  <option value="link">Link</option>
                  <option value="whatsapp-order">WhatsApp (pedido)</option>
                  <option value="whatsapp-info">WhatsApp (info)</option>
                  <option value="back">Volver</option>
                  <option value="scroll">Scroll</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-dgn-text-300">Variante</span>
                <select value={button.variant} onChange={(e) => updateButton(key, "variant", e.target.value)} className="input">
                  <option value="solid-primary">Solid Primary</option>
                  <option value="outline-primary">Outline Primary</option>
                  <option value="solid-accent">Solid Accent</option>
                  <option value="ghost">Ghost</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-dgn-text-300">Href</span>
                <input value={button.href} onChange={(e) => updateButton(key, "href", e.target.value)} className="input" />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs text-dgn-text-300">WhatsApp template</span>
                <input value={button.whatsappTemplate} onChange={(e) => updateButton(key, "whatsappTemplate", e.target.value)} className="input" />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={button.visible} onChange={(e) => updateButton(key, "visible", e.target.checked)} /> Visible
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
