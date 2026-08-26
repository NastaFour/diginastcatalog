import { describe, it, expect } from "vitest";
import { translations } from "../i18n";

describe("i18n Translations Structure", () => {
  it("contains both 'es' and 'en' language dictionaries", () => {
    expect(translations).toHaveProperty("es");
    expect(translations).toHaveProperty("en");
  });

  it("verifies Spanish translations have complete essential keys", () => {
    const es = translations.es;
    expect(es.nav.products).toBe("Productos");
    expect(es.hero.badge).toBeDefined();
    expect(es.featured3D.titles.length).toBeGreaterThan(0);
    expect(es.experience3D.stages.length).toBe(3);
    expect(es.stats.products).toBeDefined();
    expect(es.modal.hoverZoom).toBeDefined();
    expect(es.search.placeholder).toBeDefined();
  });

  it("verifies English translations have complete matching keys", () => {
    const en = translations.en;
    expect(en.nav.products).toBe("Products");
    expect(en.hero.badge).toBeDefined();
    expect(en.featured3D.titles.length).toBeGreaterThan(0);
    expect(en.experience3D.stages.length).toBe(3);
    expect(en.stats.products).toBeDefined();
    expect(en.modal.hoverZoom).toBeDefined();
    expect(en.search.placeholder).toBeDefined();
  });
});
