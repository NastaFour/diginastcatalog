"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Layers } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product, CustomSection, AppConfig } from "@/lib/schemas";

interface CustomSectionProps {
  section: CustomSection;
  products: Product[];
  config: AppConfig | null;
}

export function CustomSectionView({ section, products, config }: CustomSectionProps) {
  const reduced = useReducedMotion();

  // Filter products by section's productIds or complementary
  let sectionProducts = products.filter((p) => section.productIds.includes(p.id));
  if (section.autoComplementary && sectionProducts.length < 3) {
    const complementary = products.filter((p) => !section.productIds.includes(p.id));
    sectionProducts = [...sectionProducts, ...complementary].slice(0, 3);
  }

  return (
    <section
      className="relative overflow-hidden border-b border-dgn-base-800 py-16"
      style={{
        backgroundColor: section.accentColor || undefined,
      }}
    >
      {section.background && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${section.background})` }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "hsl(240 10% 3%)",
              opacity: section.overlayOpacity,
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
          className="mb-8 flex items-center gap-3"
        >
          <Layers className="h-7 w-7 text-dgn-accent-400" />
          <h2
            className="text-3xl font-bold"
            style={{ color: section.titleColor || "var(--color-dgn-text-50)" }}
          >
            {section.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sectionProducts.map((product, i) => (
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
