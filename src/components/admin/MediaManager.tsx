"use client";

import { useEffect, useState } from "react";
import { useAdminFetch } from "@/lib/admin-fetch";
import type { MediaItem } from "@/lib/schemas";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing/core";

export function MediaManager() {
  const { adminFetch } = useAdminFetch();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/media");
    const json = await res.json();
    setMedia(json.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este archivo de media?")) return;
    await adminFetch(`/api/media/${id}`, { method: "DELETE" });
    load();
  };

  if (loading) return <p className="text-dgn-text-500">Cargando...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Media</h1>

      <div className="rounded-xl border border-dgn-base-700 bg-dgn-base-900/60 p-6">
        <p className="mb-4 text-sm text-dgn-text-300">
          Sube imágenes directamente con UploadThing. Las URLs generadas se guardarán en la galería para usarlas en productos o secciones.
        </p>

        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-dgn-base-700 p-8 text-center bg-dgn-base-950/40">
          <UploadButton<OurFileRouter, "imageUploader">
            endpoint="imageUploader"
            appearance={{
              button: "bg-dgn-primary-600 hover:bg-dgn-primary-500 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors",
              allowedContent: "text-xs text-dgn-text-500 mt-2",
            }}
            onClientUploadComplete={async (res) => {
              setUploadError(null);
              if (res && res[0]) {
                await adminFetch("/api/media", {
                  method: "POST",
                  body: JSON.stringify({
                    id: crypto.randomUUID(),
                    url: res[0].url,
                    name: res[0].name,
                    uploadedAt: new Date().toISOString(),
                    utKey: res[0].key,
                  }),
                });
                await load();
              }
            }}
            onUploadError={(error: Error) => {
              setUploadError(error.message);
            }}
          />

          {uploadError && (
            <p className="mt-3 text-xs text-red-400">
              Error al subir: {uploadError}
            </p>
          )}

          <p className="mt-4 text-xs text-dgn-text-500">
            Formatos aceptados: JPEG, PNG, WebP, GIF (Máx. 4MB).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {media.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-lg border border-dgn-base-700 bg-dgn-base-900/60">
            <div className="aspect-square bg-dgn-base-800">
              <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-3">
              <p className="truncate text-xs text-dgn-text-300">{item.name}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => { navigator.clipboard.writeText(item.url); }}
                  className="flex-1 rounded border border-dgn-base-700 px-2 py-1 text-xs hover:border-dgn-accent-500"
                >
                  Copiar URL
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded border border-red-900/50 px-2 py-1 text-xs text-red-400 hover:bg-red-950/30"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
