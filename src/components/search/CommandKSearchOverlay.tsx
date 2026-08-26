"use client";

import { useEffect, useState, useRef } from "react";
import { Search, X, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n-store";
import type { Product } from "@/lib/schemas";

interface CommandKSearchOverlayProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export function CommandKSearchOverlay({
  products,
  isOpen,
  onClose,
  onSelectProduct,
}: CommandKSearchOverlayProps) {
  const { lang, t } = useI18n();
  const tr = t().search;
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const results = normalizedQuery.length >= 2
    ? products.filter((p) => {
        const title = (lang === "en" && p.tituloEn ? p.tituloEn : p.titulo).toLowerCase();
        const cat = (lang === "en" && p.categoryEn ? p.categoryEn : p.category).toLowerCase();
        const desc = (lang === "en" && p.descripcionEn ? p.descripcionEn : p.descripcion).toLowerCase();
        const specs = (lang === "en" && p.caracteristicasEn ? p.caracteristicasEn : p.caracteristicas).join(" ").toLowerCase();

        return (
          title.includes(normalizedQuery) ||
          cat.includes(normalizedQuery) ||
          desc.includes(normalizedQuery) ||
          specs.includes(normalizedQuery)
        );
      })
    : [];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1400] bg-black/85 backdrop-blur-xl flex items-start justify-center pt-24 px-4 overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[var(--carbon-lift)] border border-[var(--borde-fuego)] rounded-2xl overflow-hidden shadow-[0_20px_70px_rgba(249,115,22,0.25)] space-y-4 p-4"
      >
        {/* Search Input Box */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[var(--carbon)] rounded-xl border border-[var(--carbon-border)] focus-within:border-[var(--naranja-glow)] transition-colors">
          <Search className="w-5 h-5 text-[var(--naranja-glow)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr.placeholder}
            className="w-full bg-transparent text-[var(--crema)] text-sm md:text-base outline-none font-mono placeholder:text-[var(--gris-texto)]"
          />
          <button
            onClick={onClose}
            className="p-1 text-[var(--gris-texto)] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
          {normalizedQuery.length >= 2 ? (
            results.length > 0 ? (
              results.map((product) => {
                const title = (lang === "en" && product.tituloEn) ? product.tituloEn : product.titulo;
                const category = (lang === "en" && product.categoryEn) ? product.categoryEn : product.category;

                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--carbon)] hover:bg-[rgba(249,115,22,0.12)] border border-[var(--carbon-border)] hover:border-[var(--borde-fuego)] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.foto || "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=200&h=200&fit=crop"}
                        alt={title}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-mono text-[var(--naranja-glow)] uppercase">
                          {category}
                        </div>
                        <h4 className="text-sm font-bold text-[var(--crema)] group-hover:text-white truncate">
                          {title}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-3">
                      <div className="font-mono text-sm font-bold text-[var(--naranja-glow)]">
                        ${product.precio.toLocaleString()}
                      </div>
                      <span className="text-[10px] font-mono text-[var(--gris-texto)] underline">
                        {tr.viewProduct}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs font-mono text-[var(--gris-texto)]">
                {tr.noResults}
              </div>
            )
          ) : (
            <div className="py-8 text-center text-xs font-mono text-[var(--gris-texto)]">
              {tr.shortcutHint}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
