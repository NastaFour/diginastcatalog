"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Layers, Tag, Image, Plus, FolderPlus, Download, ExternalLink } from "lucide-react";

interface DashboardStats {
  products: number;
  sections: number;
  categories: number;
  media: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/sections").then((r) => r.json()),
      fetch("/api/config").then((r) => r.json()),
      fetch("/api/media").then((r) => r.json()).catch(() => ({ data: [] })),
    ]).then(([products, sections, config, media]) => {
      setStats({
        products: products.data?.length || 0,
        sections: sections.data?.length || 0,
        categories: config.data?.categories?.length || 0,
        media: media.data?.length || 0,
      });
    });
  }, []);

  const cards = [
    { label: "Productos", value: stats?.products ?? "...", href: "/admin/dashboard/productos", color: "text-dgn-primary-400", icon: Package },
    { label: "Secciones", value: stats?.sections ?? "...", href: "/admin/dashboard/secciones", color: "text-dgn-accent-400", icon: Layers },
    { label: "Categorías", value: stats?.categories ?? "...", href: "/admin/dashboard/categorias", color: "text-dgn-primary-300", icon: Tag },
    { label: "Media", value: stats?.media ?? "...", href: "/admin/dashboard/media", color: "text-dgn-accent-300", icon: Image },
  ];

  const quickActions = [
    { label: "Nuevo producto", href: "/admin/dashboard/productos", icon: Plus },
    { label: "Nueva sección", href: "/admin/dashboard/secciones", icon: FolderPlus },
    { label: "Exportar datos", href: "/admin/dashboard/backup", icon: Download },
    { label: "Ver tienda", href: "/", icon: ExternalLink, external: true },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="dgn-border-glow group rounded-xl border border-dgn-base-700 bg-dgn-base-900/60 p-6 transition-all hover:border-dgn-primary-700 hover:shadow-lg hover:shadow-dgn-primary-950/30"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-dgn-text-300">{card.label}</p>
                <Icon className={`h-5 w-5 ${card.color} opacity-70 transition-opacity group-hover:opacity-100`} />
              </div>
              <p className={`mt-2 text-3xl font-bold ${card.color}`}>{card.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="rounded-xl border border-dgn-base-700 bg-dgn-base-900/60 p-6">
        <h2 className="mb-4 text-lg font-semibold">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                target={action.external ? "_blank" : undefined}
                className="group inline-flex items-center gap-2 rounded-lg bg-dgn-primary-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-dgn-primary-500"
              >
                <Icon className="h-4 w-4" />
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
