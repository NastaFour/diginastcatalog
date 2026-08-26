import { notFound } from "next/navigation";
import { getProducts, getConfig, getProduct } from "@/lib/data";
import { ensureSeed } from "@/lib/ensureSeed";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackgroundParticles } from "@/components/ui/BackgroundParticles";
import { InteractiveCursor } from "@/components/ui/InteractiveCursor";
import { StandaloneProductDetail } from "@/components/detail/StandaloneProductDetail";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await ensureSeed();
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Producto no encontrado — Diginast" };
  return { title: `${product.titulo} — Diginast`, description: product.descripcion.slice(0, 160) };
}

export default async function ProductDetailPage({ params }: PageProps) {
  await ensureSeed();
  const { id } = await params;

  const [product, products, config] = await Promise.all([
    getProduct(id),
    getProducts(),
    getConfig(),
  ]);

  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="relative min-h-screen bg-[var(--carbon)] text-[var(--crema)]">
      <BackgroundParticles />
      <InteractiveCursor />
      <Header config={config} />
      <main className="relative z-10">
        <StandaloneProductDetail
          product={product}
          related={related}
          config={config}
        />
      </main>
      <Footer config={config} />
    </div>
  );
}
