"use client";

import { useI18n } from "@/lib/i18n-store";
import type { AppConfig } from "@/lib/schemas";
import { Zap, MessageSquare } from "lucide-react";

interface CTASectionProps {
  config: AppConfig | null;
}

export function CTASection({ config }: CTASectionProps) {
  const { lang, t } = useI18n();
  const tr = t().cta;

  const phone = config?.whatsapp?.phone || "584127670871";
  const message = encodeURIComponent(
    lang === "en"
      ? "Hello Diginast, I would like to request a quote for custom high-end hardware / workstations."
      : "Hola Diginast, me gustaría solicitar una cotización de hardware de alto rendimiento / workstation a medida."
  );
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <section id="cotizar" className="relative py-28 px-4 md:px-8 overflow-hidden text-center bg-[var(--carbon-lift)] border-t border-[var(--carbon-border)]">
      {/* Floating Glowing Orbs */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.15),transparent_70%)] animate-orb pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.12),transparent_70%)] animate-orb pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.3)] text-xs font-mono text-[var(--naranja-glow)]">
          <Zap className="w-3.5 h-3.5 text-[var(--naranja-primario)]" />
          <span>DIGINAST CUSTOM ENGINEERING</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[var(--crema)] tracking-tight leading-tight">
          {tr.titlePrefix} <span className="gradient-text-flame">{tr.titleHighlight}</span>
        </h2>

        <p className="text-base sm:text-lg text-[var(--gris-texto)] max-w-xl mx-auto leading-relaxed">
          {tr.subtitle}
        </p>

        <div className="pt-4 flex justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-flame px-8 py-4 rounded-xl flex items-center gap-3 text-base font-bold cursor-pointer shadow-[0_10px_35px_rgba(249,115,22,0.35)]"
          >
            <span>{tr.quoteBtn}</span>
            <Zap className="w-5 h-5 fill-current" />
          </a>
        </div>
      </div>
    </section>
  );
}
