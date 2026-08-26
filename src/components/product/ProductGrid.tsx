"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n-store";
import type { Product, AppConfig } from "@/lib/schemas";
import { ProductCard } from "@/components/product/ProductCard";
import { DetailZoomModal } from "@/components/detail/DetailZoomModal";

interface ProductGridProps {
  products: Product[];
  config?: AppConfig | null;
}

export function ProductGrid({ products, config = null }: ProductGridProps) {
  const { lang, t } = useI18n();
  const tr = t().catalog;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Extract distinct categories
  const categories = Array.from(
    new Set(products.map((p) => (lang === "en" && p.categoryEn ? p.categoryEn : p.category)))
  );

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => {
          const cat = lang === "en" && p.categoryEn ? p.categoryEn : p.category;
          return cat.toLowerCase() === selectedCategory.toLowerCase();
        });

  return (
    <section id="catalogo" className="py-24 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-mono text-[var(--naranja-glow)] uppercase tracking-widest">
          {tr.tag}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--crema)]">
          {tr.title}
        </h2>
        <p className="text-sm md:text-base text-[var(--gris-texto)] max-w-2xl mx-auto">
          {tr.subtitle}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-5 py-2 rounded-xl text-xs md:text-sm font-mono font-bold transition-all duration-300 cursor-pointer ${
            selectedCategory === "all"
              ? "bg-[var(--naranja-primario)] text-[var(--carbon)] shadow-[0_0_20px_rgba(249,115,22,0.4)]"
              : "bg-[var(--carbon-lift)] border border-[var(--carbon-border)] text-[var(--gris-texto)] hover:border-[var(--borde-fuego)] hover:text-[var(--crema)]"
          }`}
        >
          {tr.allFilter}
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-xl text-xs md:text-sm font-mono font-bold transition-all duration-300 cursor-pointer ${
              selectedCategory.toLowerCase() === cat.toLowerCase()
                ? "bg-[var(--naranja-primario)] text-[var(--carbon)] shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                : "bg-[var(--carbon-lift)] border border-[var(--carbon-border)] text-[var(--gris-texto)] hover:border-[var(--borde-fuego)] hover:text-[var(--crema)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenModal={(p) => setActiveProduct(p)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-[var(--gris-texto)] font-mono text-sm">
          {lang === "en" ? "No products found in this category." : "No se encontraron productos en esta categoría."}
        </div>
      )}

      {/* Detail Zoom Modal */}
      {activeProduct && (
        <DetailZoomModal
          product={activeProduct}
          config={config}
          onClose={() => setActiveProduct(null)}
        />
      )}
    </section>
  );
}
