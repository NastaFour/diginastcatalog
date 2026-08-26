"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAdminStore } from "@/lib/admin-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const setCsrfToken = useAdminStore((s) => s.setCsrfToken);
  const setAuthed = useAdminStore((s) => s.setAuthed);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already authed
    fetch("/api/auth/me").then((r) => {
      if (r.ok) {
        setAuthed(true);
        router.push("/admin/dashboard");
      }
    });
  }, [router, setAuthed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const json = await res.json();

    if (res.ok && json.csrfToken) {
      setCsrfToken(json.csrfToken);
      setAuthed(true);
      router.push("/admin/dashboard");
    } else {
      setError(json.error || "Error al iniciar sesión");
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-dgn-base-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-sm space-y-6 rounded-xl border border-dgn-base-700 bg-dgn-base-900/60 p-8"
      >
        <div className="text-center">
          <span className="font-mono text-2xl text-dgn-primary-400">{"{diginast}"}</span>
          <h1 className="mt-2 text-xl font-bold text-dgn-text-50">Panel Admin</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-dgn-text-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-dgn-primary-600 px-4 py-2.5 text-sm font-medium text-dgn-text-50 hover:bg-dgn-primary-500 disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
