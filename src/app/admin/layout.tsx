"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Package, Layers, ToggleLeft, Tag, Image, Download,
  Settings, ScrollText, LogOut, Menu, X,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/productos", label: "Productos", icon: Package },
  { href: "/admin/dashboard/secciones", label: "Secciones", icon: Layers },
  { href: "/admin/dashboard/botones", label: "Botones", icon: ToggleLeft },
  { href: "/admin/dashboard/categorias", label: "Categorías", icon: Tag },
  { href: "/admin/dashboard/media", label: "Media", icon: Image },
  { href: "/admin/dashboard/backup", label: "Backup", icon: Download },
  { href: "/admin/dashboard/configuracion", label: "Config", icon: Settings },
  { href: "/admin/dashboard/auditoria", label: "Auditoría", icon: ScrollText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useAdminStore((s) => s.logout);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) {
          router.push("/admin");
        } else {
          useAdminStore.getState().setAuthed(true);
          setChecking(false);
        }
      })
      .catch(() => router.push("/admin"));
  }, [router]);

  // Don't render layout for login page
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dgn-base-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-dgn-primary-700 border-t-dgn-accent-400" />
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-dgn-base-950 text-dgn-text-50">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-dgn-base-800 bg-dgn-base-900/95 px-4 py-3 lg:hidden">
        <span className="font-mono text-lg font-bold text-dgn-primary-400">{"{diginast}"}</span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 text-dgn-text-300 hover:bg-dgn-base-800"
          aria-label="Menú"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar — desktop fija, móvil overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          className={`fixed top-0 left-0 z-50 h-screen w-64 shrink-0 border-r border-dgn-base-800 bg-dgn-base-900/95 transition-transform lg:sticky lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6">
            <span className="font-mono text-xl font-bold text-dgn-primary-400">{"{diginast}"}</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1 text-dgn-text-500 hover:bg-dgn-base-800 lg:hidden"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <nav className="space-y-1 overflow-y-auto px-3 pb-20" style={{ maxHeight: "calc(100vh - 120px)" }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-dgn-primary-950/50 text-dgn-primary-400"
                      : "text-dgn-text-300 hover:bg-dgn-base-800 hover:text-dgn-text-50"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dgn-base-700 px-3 py-2 text-sm text-dgn-text-300 hover:border-red-900/50 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
