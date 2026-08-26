"use client";

import { useI18n } from "@/lib/i18n-store";
import type { CategoryDef } from "@/lib/schemas";
import { Gamepad2, Monitor, Laptop, Cpu, Disc3, Headphones, Layers } from "lucide-react";

interface CategoryStripProps {
  categories: CategoryDef[];
  onSelectCategory?: (catId: string) => void;
}

const defaultCategoryVisuals: Record<
  string,
  { icon: typeof Gamepad2; img: string; count: number }
> = {
  gaming: {
    icon: Gamepad2,
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=800&fit=crop",
    count: 45,
  },
  workstation: {
    icon: Monitor,
    img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&h=800&fit=crop",
    count: 32,
  },
  laptops: {
    icon: Laptop,
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=800&fit=crop",
    count: 38,
  },
  componentes: {
    icon: Cpu,
    img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&h=800&fit=crop",
    count: 65,
  },
  monitores: {
    icon: Disc3,
    img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=800&fit=crop",
    count: 34,
  },
  audio: {
    icon: Headphones,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=800&fit=crop",
    count: 28,
  },
};

export function CategoryStrip({ categories, onSelectCategory }: CategoryStripProps) {
  const { t } = useI18n();
  const tr = t().categoriesSection;

  const handleCategoryClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    const catalogEl = document.getElementById("catalogo");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="categorias" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-14">
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

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => {
          const key = cat.id.toLowerCase();
          const visual = defaultCategoryVisuals[key] || {
            icon: Layers,
            img: cat.imageUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=800&fit=crop",
            count: 20,
          };
          const Icon = visual.icon;

          return (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden glass-panel border border-[var(--carbon-border)] hover:border-[var(--naranja-glow)] transition-all duration-500 cursor-pointer shadow-lg hover:shadow-[var(--sombra-glow)] flex flex-col justify-end p-4"
            >
              {/* Category Background Image */}
              <img
                src={visual.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-110 group-hover:opacity-75 transition-all duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--carbon)] via-[rgba(10,10,11,0.6)] to-transparent" />

              {/* Content Overlay */}
              <div className="relative z-10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[rgba(249,115,22,0.15)] border border-[rgba(249,115,22,0.3)] flex items-center justify-center text-[var(--naranja-glow)] group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--crema)] group-hover:text-[var(--naranja-glow)] transition-colors duration-300">
                  {cat.name}
                </h3>
                <div className="text-xs font-mono text-[var(--gris-texto)]">
                  {visual.count} {tr.productsCount}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
