"use client";

import { useState } from "react";
import type { Product, CustomSection, AppConfig } from "@/lib/schemas";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { InteractiveCursor } from "@/components/ui/InteractiveCursor";
import { BackgroundParticles } from "@/components/ui/BackgroundParticles";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/hero/Hero";
import { StickyFeatured3D } from "@/components/section/StickyFeatured3D";
import { LiveStatsSection } from "@/components/section/LiveStatsSection";
import { CategoryStrip } from "@/components/category/CategoryStrip";
import { ProductGrid } from "@/components/product/ProductGrid";
import { StickyExperience3D } from "@/components/section/StickyExperience3D";
import { PromosSection } from "@/components/section/PromosSection";
import { CustomSectionView } from "@/components/section/CustomSection";
import { CTASection } from "@/components/section/CTASection";
import { Footer } from "@/components/layout/Footer";
import { CommandKSearchOverlay } from "@/components/search/CommandKSearchOverlay";
import { DetailZoomModal } from "@/components/detail/DetailZoomModal";

interface StorefrontViewProps {
  config: AppConfig | null;
  products: Product[];
  sections: CustomSection[];
}

export function StorefrontView({ config, products, sections }: StorefrontViewProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  const aboveSections = sections
    .filter((s) => s.active && s.position === "above")
    .sort((a, b) => a.order - b.order);
  const belowSections = sections
    .filter((s) => s.active && s.position === "below")
    .sort((a, b) => a.order - b.order);

  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[var(--carbon)] text-[var(--crema)] selection:bg-[var(--naranja-primario)] selection:text-[var(--carbon)]">
        {/* Entrance Cyber Loading Screen */}
        <LoadingScreen />

        {/* 2D Interactive Background & Helpers */}
        <BackgroundParticles />
        <InteractiveCursor />
        <ScrollProgressBar />

        {/* Global Fixed Header */}
        <Header config={config} onOpenSearch={() => setIsSearchOpen(true)} />

        <main className="relative z-10">
          {/* 1. Hero with 3D Tilt & Flip Card */}
          <Hero config={config} />

          {/* 2. 360° PC Rig Hardware Inspection with Three.js */}
          <StickyFeatured3D />

          {/* 3. Live Animated Stats */}
          <LiveStatsSection />

          {/* 4. Category Strip */}
          <CategoryStrip categories={config?.categories || []} />

          {/* Above Custom Sections */}
          {aboveSections.map((section) => (
            <CustomSectionView key={section.id} section={section} products={products} config={config} />
          ))}

          {/* 5. Main Catalog Grid & Filters */}
          <ProductGrid products={products} config={config} />

          {/* 6. 3D Visual Experience Core (Icosahedron & Orbital Rings) */}
          <StickyExperience3D />

          {/* Promos & Workshop Services */}
          <PromosSection config={config} />

          {/* Below Custom Sections */}
          {belowSections.map((section) => (
            <CustomSectionView key={section.id} section={section} products={products} config={config} />
          ))}

          {/* 7. Call To Action (CTA) */}
          <CTASection config={config} />
        </main>

        {/* Footer */}
        <Footer config={config} />

        {/* Command+K Global Search Overlay */}
        <CommandKSearchOverlay
          products={products}
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectProduct={(p) => setModalProduct(p)}
        />

        {/* Optical Zoom Lens Detail Modal */}
        {modalProduct && (
          <DetailZoomModal
            product={modalProduct}
            config={config}
            onClose={() => setModalProduct(null)}
          />
        )}
      </div>
    </SmoothScrollProvider>
  );
}
