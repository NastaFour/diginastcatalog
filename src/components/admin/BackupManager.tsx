"use client";

import { useState } from "react";
import { useAdminFetch } from "@/lib/admin-fetch";

export function BackupManager() {
  const { adminFetch } = useAdminFetch();
  const [showResetModal, setShowResetModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [message, setMessage] = useState("");

  const handleExport = async () => {
    const res = await fetch("/api/backup/export");
    if (!res.ok) { setMessage("Error al exportar"); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diginast-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Backup exportado correctamente");
  };

  const handleReset = async () => {
    if (confirmText !== "RESET") { setMessage("Debes escribir RESET para confirmar"); return; }
    const res = await adminFetch("/api/backup/reset", { method: "POST", body: JSON.stringify({ confirm: "RESET" }) });
    if (res.error) { setMessage(res.error); return; }
    setMessage("Datos reseteados a seed de fábrica");
    setShowResetModal(false);
    setConfirmText("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Backup</h1>

      {message && (
        <div className="rounded-lg border border-dgn-base-700 bg-dgn-base-900/60 px-4 py-3 text-sm text-dgn-accent-400">
          {message}
        </div>
      )}

      <div className="rounded-xl border border-dgn-base-700 bg-dgn-base-900/60 p-6">
        <h2 className="mb-2 text-lg font-semibold">Exportar datos</h2>
        <p className="mb-4 text-sm text-dgn-text-300">
          Descarga un JSON completo con todos los productos, secciones, config y media.
        </p>
        <button onClick={handleExport} className="rounded-lg bg-dgn-primary-600 px-4 py-2 text-sm hover:bg-dgn-primary-500">
          Descargar backup
        </button>
      </div>

      <div className="rounded-xl border border-red-900/30 bg-red-950/10 p-6">
        <h2 className="mb-2 text-lg font-semibold text-red-400">Zona de peligro</h2>
        <p className="mb-4 text-sm text-dgn-text-300">
          Reset a fábrica elimina TODOS los datos y los reemplaza con el seed inicial. Esta acción es irreversible.
        </p>
        <button
          onClick={() => setShowResetModal(true)}
          className="rounded-lg border border-red-900/50 px-4 py-2 text-sm text-red-400 hover:bg-red-950/30"
        >
          Reset a fábrica
        </button>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dgn-base-950/80 p-4" onClick={() => setShowResetModal(false)}>
          <div className="w-full max-w-md rounded-xl border border-red-900/50 bg-dgn-base-900 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-lg font-bold text-red-400">Confirmar reset</h3>
            <p className="mb-4 text-sm text-dgn-text-300">
              Escribe <code className="font-mono text-dgn-accent-400">RESET</code> para confirmar. Todos los datos se perderán.
            </p>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="input mb-4"
              placeholder="RESET"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={handleReset} className="rounded-lg bg-red-600 px-4 py-2 text-sm hover:bg-red-500">
                Confirmar reset
              </button>
              <button onClick={() => setShowResetModal(false)} className="rounded-lg border border-dgn-base-700 px-4 py-2 text-sm">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
