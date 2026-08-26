"use client";

import { useAdminStore } from "@/lib/admin-store";
import { useRouter } from "next/navigation";

// ============================================================
// admin-fetch — wrapper de fetch para mutaciones admin
// Inyecta header x-csrf-token, maneja 401 y 429
// ============================================================

export function useAdminFetch() {
  const router = useRouter();
  const csrfToken = useAdminStore((s) => s.csrfToken);
  const logout = useAdminStore((s) => s.logout);

  async function adminFetch<T = unknown>(
    path: string,
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: string; status: number }> {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    if (csrfToken) {
      headers.set("x-csrf-token", csrfToken);
    }

    const res = await fetch(path, { ...options, headers });

    if (res.status === 401) {
      logout();
      router.push("/admin");
      return { error: "No autorizado", status: 401 };
    }

    if (res.status === 429) {
      return { error: "Demasiadas peticiones. Espera un momento.", status: 429 };
    }

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { error: json.error || "Error desconocido", status: res.status };
    }

    return { data: json.data ?? json, status: res.status };
  }

  return { adminFetch };
}
