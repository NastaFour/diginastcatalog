import { getConfig, getProducts, getSections } from "@/lib/data";
import { ensureSeed } from "@/lib/ensureSeed";
import { StorefrontView } from "@/components/storefront/StorefrontView";

export default async function HomePage() {
  await ensureSeed();

  const [config, products, sections] = await Promise.all([
    getConfig(),
    getProducts(),
    getSections(),
  ]);

  return (
    <StorefrontView
      config={config}
      products={products}
      sections={sections}
    />
  );
}
