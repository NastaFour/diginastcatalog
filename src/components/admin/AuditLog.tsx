"use client";

import { useEffect, useState } from "react";
import type { AuditEntry } from "@/lib/schemas";

export function AuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = async () => {
    const res = await fetch("/api/audit");
    if (res.ok) {
      const json = await res.json();
      setEntries(json.data || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = filter
    ? entries.filter((e) => e.action.includes(filter))
    : entries;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Auditoría</h1>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input max-w-xs"
          placeholder="Filtrar por acción..."
        />
      </div>

      {loading ? (
        <p className="text-dgn-text-500">Cargando...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dgn-base-700 bg-dgn-base-900/60 p-8 text-center">
          <p className="text-dgn-text-300">No hay eventos de auditoría registrados todavía.</p>
          <p className="mt-2 text-sm text-dgn-text-500">
            Los eventos (login, create, update, delete) aparecen aquí cuando ocurren.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-dgn-base-700 bg-dgn-base-900/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dgn-base-700 text-left text-dgn-text-300">
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Acción</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-b border-dgn-base-800">
                  <td className="px-4 py-3 font-mono text-xs text-dgn-text-300">{new Date(entry.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3"><span className="font-mono text-dgn-accent-400">{entry.action}</span></td>
                  <td className="px-4 py-3 text-dgn-text-300">{entry.ip}</td>
                  <td className="px-4 py-3">
                    {entry.success ? (
                      <span className="rounded-full bg-dgn-accent-900/30 px-2 py-0.5 text-xs text-dgn-accent-400">OK</span>
                    ) : (
                      <span className="rounded-full bg-red-950/30 px-2 py-0.5 text-xs text-red-400">FAIL</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
