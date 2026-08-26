import { getStorage, KEYS } from "@/lib/store";
import { diginastSeed } from "@/lib/seed";

// ============================================================
// ensureSeed — idempotente
// Si storage vacío → escribe seed
// Si ya hay datos → no sobrescribe
// ============================================================

let seedApplied = false;

export async function ensureSeed(): Promise<void> {
  if (seedApplied) return;

  const store = getStorage();

  // Verificar si ya hay productos guardados en el storage
  const rawProducts = await store.get<unknown[]>(KEYS.products);

  // Si ya hay productos reales en el storage, no inyectar seed
  if (rawProducts && Array.isArray(rawProducts) && rawProducts.length > 0) {
    seedApplied = true;
    return;
  }

  // Storage vacío → inyectar seed completo
  await store.set(KEYS.products, diginastSeed.products);
  await store.set(KEYS.sections, diginastSeed.sections);
  await store.set(KEYS.config, diginastSeed.config);
  await store.set(KEYS.media, diginastSeed.media);

  seedApplied = true;
  console.log("[ensureSeed] Seed data applied to storage.");
}

/** Fuerza la re-inyección del seed (usado por backup/reset) */
export async function forceSeed(): Promise<void> {
  const store = getStorage();
  await store.set(KEYS.products, diginastSeed.products);
  await store.set(KEYS.sections, diginastSeed.sections);
  await store.set(KEYS.config, diginastSeed.config);
  await store.set(KEYS.media, diginastSeed.media);
  seedApplied = true;
  console.log("[forceSeed] Seed data re-injected after reset.");
}
