"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonRenderer } from "@/components/ui/ButtonRenderer";
import type { Product, AppConfig, FeaturedSection as FeaturedSectionType } from "@/lib/schemas";

interface FeaturedSectionProps {
  products: Product[];
  featuredConfig: FeaturedSectionType;
  config: AppConfig | null;
}

export function FeaturedSection({ products, featuredConfig, config }: FeaturedSectionProps) {
  const reduced = useReducedMotion();

  if (!featuredConfig.visible || products.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden border-y border-dgn-base-800 py-16"
      style={{
        backgroundColor: featuredConfig.accentColor || undefined,
      }}
    >
      {featuredConfig.background && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${featuredConfig.background})` }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "hsl(240 10% 3%)",
              opacity: featuredConfig.overlayOpacity,
            }}
          />
        </>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-dgn-accent-400" />
            <h2
              className="text-3xl font-bold"
              style={{ color: featuredConfig.titleColor || "var(--color-dgn-text-50)" }}
            >
              {featuredConfig.title}
            </h2>
          </div>
          {config?.buttons?.order && (
            <ButtonRenderer button={config.buttons.order} config={config} />
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={reduced ? undefined : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
