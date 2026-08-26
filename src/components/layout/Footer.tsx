"use client";

import Link from "next/link";
import { Zap, ShieldCheck, Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n-store";
import type { AppConfig } from "@/lib/schemas";

interface FooterProps {
  config: AppConfig | null;
}

export function Footer({ config }: FooterProps) {
  const { lang, t } = useI18n();
  const tr = t().footer;

  return (
    <footer className="relative bg-[var(--carbon)] border-t border-[var(--carbon-border)] pt-16 pb-12 px-4 md:px-8 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[var(--carbon-border)]">
        {/* Brand Col */}
        <div className="md:col-span-5 space-y-4">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-black text-[var(--crema)] tracking-tight">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--naranja-primario)] to-[var(--naranja-deep)] flex items-center justify-center shadow-[var(--sombra-glow-sm)]">
              <Zap className="w-4 h-4 text-[var(--carbon)] fill-current" />
            </div>
            <span>Diginast</span>
          </Link>
          <p className="text-[var(--gris-texto)] max-w-sm leading-relaxed text-xs md:text-sm">
            {tr.tagline}
          </p>
        </div>

        {/* Categories Col */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="font-mono text-xs font-bold text-[var(--naranja-glow)] uppercase tracking-wider">
            {tr.categoriesTitle}
          </h4>
          <ul className="space-y-2 text-xs md:text-sm text-[var(--gris-texto)]">
            <li><a href="#catalogo" className="hover:text-[var(--crema)] transition-colors">Gaming Rigs & Setups</a></li>
            <li><a href="#catalogo" className="hover:text-[var(--crema)] transition-colors">Workstations & AI Compute</a></li>
            <li><a href="#catalogo" className="hover:text-[var(--crema)] transition-colors">Laptops Ultra Creator</a></li>
            <li><a href="#catalogo" className="hover:text-[var(--crema)] transition-colors">GPUs & High-End Hardware</a></li>
          </ul>
        </div>

        {/* Quick Links Col */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-mono text-xs font-bold text-[var(--naranja-glow)] uppercase tracking-wider">
            {tr.linksTitle}
          </h4>
          <ul className="space-y-2 text-xs md:text-sm text-[var(--gris-texto)]">
            <li><a href="#inicio" className="hover:text-[var(--crema)] transition-colors">Inicio</a></li>
            <li><a href="#destacado" className="hover:text-[var(--crema)] transition-colors">Hardware 360°</a></li>
            <li><a href="#experiencia" className="hover:text-[var(--crema)] transition-colors">3D Experience</a></li>
            <li><a href="#catalogo" className="hover:text-[var(--crema)] transition-colors">Catálogo</a></li>
            <li><Link href="/admin" className="text-[var(--naranja-glow)] hover:underline">Panel de Administración</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--gris-texto)]">
        <div>
          &copy; {new Date().getFullYear()} {tr.rights}
        </div>
        <div className="flex items-center gap-2">
          <span>Engineered with precision by</span>
          <span className="text-[var(--naranja-glow)] font-bold">Diginast</span>
        </div>
      </div>
    </footer>
  );
}
