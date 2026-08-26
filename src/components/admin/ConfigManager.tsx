"use client";

import { useEffect, useState } from "react";
import { useAdminFetch } from "@/lib/admin-fetch";
import type { AppConfig } from "@/lib/schemas";

export function ConfigManager() {
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

  const handleSave = async () => {
    if (!config) return;
    await adminFetch("/api/config", { method: "PUT", body: JSON.stringify(config) });
    load();
  };

  const update = (field: keyof AppConfig, value: string) => {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  };

  if (loading || !config) return <p className="text-dgn-text-500">Cargando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Configuración</h1>
        <button onClick={handleSave} className="rounded-lg bg-dgn-primary-600 px-4 py-2 text-sm hover:bg-dgn-primary-500">
          Guardar cambios
        </button>
      </div>

      <div className="rounded-xl border border-dgn-base-700 bg-dgn-base-900/60 p-6">
        <h2 className="mb-4 text-lg font-semibold">Marca</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm text-dgn-text-300">Nombre de marca</span>
            <input value={config.brandName} onChange={(e) => update("brandName", e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-dgn-text-300">Page title</span>
            <input value={config.pageTitle} onChange={(e) => update("pageTitle", e.target.value)} className="input" />
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-dgn-base-700 bg-dgn-base-900/60 p-6">
        <h2 className="mb-4 text-lg font-semibold">Hero</h2>
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-1 block text-sm text-dgn-text-300">Hero title</span>
            <input value={config.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-dgn-text-300">Hero subtitle</span>
            <input value={config.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-dgn-text-300">Hero background URL</span>
            <input value={config.heroBackgroundUrl} onChange={(e) => update("heroBackgroundUrl", e.target.value)} className="input" />
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-dgn-base-700 bg-dgn-base-900/60 p-6">
        <h2 className="mb-4 text-lg font-semibold">WhatsApp</h2>
        <label className="block">
          <span className="mb-1 block text-sm text-dgn-text-300">Teléfono (con código de país, sin +)</span>
          <input
            value={config.whatsapp.phone}
            onChange={(e) => setConfig({ ...config, whatsapp: { phone: e.target.value } })}
            className="input"
            placeholder="521234567890"
          />
        </label>
      </div>
    </div>
  );
}
