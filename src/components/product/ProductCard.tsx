"use client";

import { useI18n } from "@/lib/i18n-store";
import type { Product } from "@/lib/schemas";
import { Zap, Eye, Check } from "lucide-react";

import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  onOpenModal?: (product: Product) => void;
}

export function ProductCard({ product, onOpenModal }: ProductCardProps) {
  const router = useRouter();
  const { lang, t } = useI18n();
  const tr = t().catalog;

  const title = (lang === "en" && product.tituloEn) ? product.tituloEn : product.titulo;
  const tag = (lang === "en" && product.tagEn) ? product.tagEn : product.tag;
  const category = (lang === "en" && product.categoryEn) ? product.categoryEn : product.category;
  const specs = (lang === "en" && product.caracteristicasEn && product.caracteristicasEn.length > 0)
    ? product.caracteristicasEn
    : product.caracteristicas;

  const handleAction = () => {
    if (onOpenModal) {
      onOpenModal(product);
    } else {
      router.push(`/producto/${product.id}`);
    }
  };

  return (
    <article
      onClick={handleAction}
      className="group glass-panel rounded-2xl overflow-hidden border border-[var(--carbon-border)] hover:border-[var(--naranja-glow)] transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-md hover:shadow-[var(--sombra-glow)]"
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[var(--carbon)]">
        <img
          src={product.foto || "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&h=600&fit=crop"}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--carbon-lift)] via-transparent to-transparent opacity-60" />

        {/* Tag Badge */}
        {tag && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-[rgba(10,10,11,0.85)] border border-[var(--borde-fuego)] text-[var(--naranja-glow)] backdrop-blur-md">
            {tag}
          </span>
        )}

        {/* Category Pill */}
        <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-black/75 text-[var(--gris-texto)] border border-[rgba(255,255,255,0.1)]">
          {category}
        </span>
      </div>

      {/* Product Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-[var(--crema)] group-hover:text-[var(--naranja-glow)] transition-colors duration-200 line-clamp-1">
            {title}
          </h3>

          {/* Specs Snippets */}
          {specs && specs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {specs.slice(0, 3).map((spec, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-[rgba(249,115,22,0.06)] border border-[rgba(249,115,22,0.2)] text-[11px] font-mono text-[var(--gris-texto)]"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-[var(--carbon-border)] flex items-center justify-between">
          <div className="font-mono text-xl font-black text-[var(--naranja-glow)]">
            ${product.precio.toLocaleString()} <span className="text-xs text-[var(--gris-texto)] font-normal">USD</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction();
            }}
            className="px-3.5 py-2 rounded-xl bg-[rgba(249,115,22,0.1)] border border-[var(--borde-fuego)] hover:border-[var(--naranja-primario)] hover:bg-[rgba(249,115,22,0.2)] text-[var(--naranja-glow)] hover:text-white transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{tr.viewDetails}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
