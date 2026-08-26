"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { translations, type Language, type Translations } from "@/lib/i18n";

interface I18nStore {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: () => Translations;
}

export const useI18n = create<I18nStore>()(
  persist(
    (set, get) => ({
      lang: "es",
      setLang: (lang) => set({ lang }),
      toggleLang: () => set({ lang: get().lang === "es" ? "en" : "es" }),
      t: () => translations[get().lang] || translations.es,
    }),
    {
      name: "diginast-language-pref",
    }
  )
);
