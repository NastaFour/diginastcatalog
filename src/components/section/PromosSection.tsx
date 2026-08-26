"use client";

import Link from "next/link";
import { Zap, Cpu, ArrowRight, ShieldCheck, Flame } from "lucide-react";
import type { AppConfig } from "@/lib/schemas";
import { useI18n } from "@/lib/i18n-store";

interface PromosSectionProps {
  config: AppConfig | null;
}

export function PromosSection({ config }: PromosSectionProps) {
  const { lang } = useI18n();
  const promos = config?.promos;
  if (!promos || (!promos.flashVisible && !promos.specialVisible)) {
    return null;
  }

  const phone = config?.whatsapp?.phone?.replace(/\D/g, "") || "";
  const waUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(
        lang === "en"
          ? "Hello Diginast, I am interested in your custom PC building & hardware optimization service."
          : "Hola Diginast, me interesa el servicio de ensamble profesional y optimización de hardware."
      )}`
    : "/#catalogo";

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Flash Promo: Ensamble Profesional */}
        {promos.flashVisible && (
          <div className="glass-panel relative overflow-hidden rounded-2xl border border-[var(--borde-fuego)] p-6 sm:p-8 hover:border-[var(--naranja-glow)] transition-all duration-300 shadow-lg">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--naranja-glow)]">
              <Zap className="h-4 w-4 text-[var(--naranja-primario)]" />
              <span>{lang === "en" ? "HARDWARE ENGINEERING" : "INGENIERÍA DE HARDWARE"}</span>
            </div>
            <h3 className="mt-3 text-2xl font-bold text-[var(--crema)]">
              {lang === "en" ? "Pro Assembly & Stress Testing" : "Ensamble Pro & Pruebas de Estrés"}
            </h3>
            <p className="mt-2 text-sm text-[var(--gris-texto)] leading-relaxed">
              {lang === "en"
                ? "24-hour stability testing, precision cable management, thermal imaging inspection, and BIOS tuning."
                : "Pruebas de estabilidad de 24 horas, cable management de precisión, inspección térmica y calibración de BIOS."}
            </p>
            <div className="mt-6">
              <Link
                href="/#catalogo"
                className="btn-flame inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl"
              >
                <span>{promos.flashBtnLabel || (lang === "en" ? "View Rigs" : "Ver Equipos")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Special Promo: Custom Watercooling & Overclocking */}
        {promos.specialVisible && (
          <div className="glass-panel relative overflow-hidden rounded-2xl border border-[var(--carbon-border)] p-6 sm:p-8 hover:border-[var(--borde-fuego)] transition-all duration-300 shadow-lg">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--naranja-glow)]">
              <Flame className="h-4 w-4 text-[var(--naranja-deep)]" />
              <span>{lang === "en" ? "PREMIUM WORKSHOP" : "TALLER ESPECIALIZADO"}</span>
            </div>
            <h3 className="mt-3 text-2xl font-bold text-[var(--crema)]">
              {lang === "en" ? "Custom Liquid Cooling & Safe OC" : "Refrigeración Líquida & Overclocking"}
            </h3>
            <p className="mt-2 text-sm text-[var(--gris-texto)] leading-relaxed">
              {lang === "en"
                ? "Custom hard-tube liquid loops, high-pressure leak testing, and verified thermal profiles for maximum clock speeds."
                : "Circuitos de refrigeración custom rígidos, pruebas de estanqueidad a presión y perfiles térmicos garantizados."}
            </p>
            <div className="mt-6">
              <a
                href={waUrl}
                target={phone ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="btn-outline-flame inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium rounded-xl"
              >
                <span>{promos.specialBtnLabel || (lang === "en" ? "Request Quote" : "Consultar Taller")}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
