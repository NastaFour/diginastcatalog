"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Tag, Check, X, MessageSquare, ZoomIn, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n-store";
import type { Product, AppConfig } from "@/lib/schemas";
import { ProductCard } from "@/components/product/ProductCard";
import { DetailZoomModal } from "@/components/detail/DetailZoomModal";

interface StandaloneProductDetailProps {
  product: Product;
  related: Product[];
  config: AppConfig | null;
}

export function StandaloneProductDetail({
  product,
  related,
  config,
}: StandaloneProductDetailProps) {
  const { lang, t } = useI18n();
  const tr = t().modal;
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  const title = (lang === "en" && product.tituloEn) ? product.tituloEn : product.titulo;
  const description = (lang === "en" && product.descripcionEn) ? product.descripcionEn : product.descripcion;
  const specs = (lang === "en" && product.caracteristicasEn && product.caracteristicasEn.length > 0)
    ? product.caracteristicasEn
    : product.caracteristicas;
  const category = (lang === "en" && product.categoryEn) ? product.categoryEn : product.category;

  const phone = config?.whatsapp?.phone || "584127670871";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    lang === "en"
      ? `Hello Diginast, I would like to request a quote for: ${title} ($${product.precio.toLocaleString()} USD)`
      : `Hola Diginast, me gustaría cotizar el producto: ${title} ($${product.precio.toLocaleString()} USD)`
  )}`;

  return (
    <div className="min-h-screen bg-[var(--carbon)] text-[var(--crema)] pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--gris-texto)] hover:text-[var(--naranja-glow)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === "en" ? "Back to catalog" : "Volver al catálogo"}</span>
        </Link>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Media / Zoom Preview */}
          <div className="lg:col-span-7 glass-panel rounded-3xl overflow-hidden border border-[var(--borde-fuego)] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <div
              onClick={() => setActiveModalProduct(product)}
              className="relative aspect-[16/10] w-full bg-[var(--carbon)] cursor-pointer group overflow-hidden"
            >
              <img
                src={product.foto || "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&h=800&fit=crop"}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--carbon-lift)] via-transparent to-transparent opacity-60" />

              <div className="absolute top-4 left-4 hud-tag flex items-center gap-1.5 pointer-events-none">
                <ZoomIn className="w-3.5 h-3.5 text-[var(--naranja-glow)]" />
                <span className="text-[11px]">{tr.hoverZoom}</span>
              </div>
            </div>
          </div>

          {/* Product Meta & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[var(--naranja-glow)] tracking-wider">
                {category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[var(--crema)]">
                {title}
              </h1>
            </div>

            <div className="font-mono text-3xl sm:text-4xl font-black text-[var(--naranja-glow)]">
              ${product.precio.toLocaleString()} <span className="text-sm text-[var(--gris-texto)] font-normal">USD</span>
            </div>

            {/* Specs Grid */}
            {specs && specs.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase text-[var(--gris-texto)] tracking-wider">
                  {tr.specLabel}s
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {specs.map((s, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-[rgba(249,115,22,0.06)] border border-[rgba(249,115,22,0.2)] text-xs font-mono text-[var(--crema)]"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-[var(--gris-texto)] tracking-wider">
                {lang === "en" ? "Description" : "Descripción"}
              </div>
              <p className="text-sm md:text-base text-[var(--gris-texto)] leading-relaxed">
                {description}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-flame px-8 py-4 rounded-xl flex items-center justify-center gap-2.5 text-sm font-bold w-full sm:w-auto"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>{tr.quoteNow}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="pt-16 border-t border-[var(--carbon-border)] space-y-6">
            <h3 className="text-2xl font-bold text-[var(--crema)]">
              {lang === "en" ? `More from ${category}` : `Más de ${category}`}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onOpenModal={(prod) => setActiveModalProduct(prod)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail Zoom Modal */}
      {activeModalProduct && (
        <DetailZoomModal
          product={activeModalProduct}
          config={config}
          onClose={() => setActiveModalProduct(null)}
        />
      )}
    </div>
  );
}
