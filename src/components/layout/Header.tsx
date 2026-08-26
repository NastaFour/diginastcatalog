"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, Search, Globe, Menu, X, MessageSquare } from "lucide-react";
import { useI18n } from "@/lib/i18n-store";
import type { AppConfig } from "@/lib/schemas";

interface HeaderProps {
  config: AppConfig | null;
  onOpenSearch?: () => void;
}

export function Header({ config, onOpenSearch }: HeaderProps) {
  const { lang, toggleLang, t } = useI18n();
  const tr = t().nav;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const phone = config?.whatsapp?.phone || "584127670871";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    lang === "en"
      ? "Hello Diginast, I would like to request a quote."
      : "Hola Diginast, me gustaría solicitar una cotización."
  )}`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] h-[var(--nav-height)] transition-all duration-300 flex items-center px-4 md:px-8 ${
          scrolled
            ? "bg-[rgba(10,10,11,0.92)] backdrop-blur-xl border-b border-[var(--borde-fuego)] shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 text-xl font-black text-[var(--crema)] tracking-tight group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--naranja-primario)] to-[var(--naranja-deep)] flex items-center justify-center shadow-[var(--sombra-glow-sm)] group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-5 h-5 text-[var(--carbon)] fill-current" />
            </div>
            <span>Diginast</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <a
              href="#catalogo"
              className="text-sm font-medium text-[var(--gris-texto)] hover:text-[var(--crema)] transition-colors duration-200"
            >
              {tr.products}
            </a>
            <a
              href="#categorias"
              className="text-sm font-medium text-[var(--gris-texto)] hover:text-[var(--crema)] transition-colors duration-200"
            >
              {tr.categories}
            </a>

            {/* Search Trigger Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[rgba(20,20,22,0.6)] border border-[var(--carbon-border)] hover:border-[var(--borde-fuego)] text-[var(--gris-texto)] hover:text-[var(--crema)] transition-all text-xs font-mono cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[var(--naranja-glow)]" />
              <span>{tr.search}</span>
              <kbd className="hidden xl:inline px-1.5 py-0.5 rounded bg-[var(--carbon-lift)] text-[10px] text-[var(--gris-texto)] border border-[var(--carbon-border)]">
                Ctrl+K
              </kbd>
            </button>
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgba(20,20,22,0.6)] border border-[var(--carbon-border)] hover:border-[var(--naranja-glow)] text-xs font-mono font-bold text-[var(--crema)] transition-all cursor-pointer"
              title="Cambiar idioma / Change language"
            >
              <Globe className="w-3.5 h-3.5 text-[var(--naranja-glow)]" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Quote Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-flame px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold cursor-pointer"
            >
              <span>{tr.quote}</span>
              <Zap className="w-3.5 h-3.5 fill-current" />
            </a>
          </div>

          {/* Mobile Actions Cluster */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Language Switcher Mobile */}
            <button
              onClick={toggleLang}
              className="px-2.5 py-1 rounded-lg bg-[rgba(20,20,22,0.6)] border border-[var(--carbon-border)] text-xs font-mono font-bold text-[var(--crema)]"
            >
              {lang.toUpperCase()}
            </button>

            {/* Search Icon Mobile */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[var(--gris-texto)] hover:text-white"
            >
              <Search className="w-5 h-5 text-[var(--naranja-glow)]" />
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--crema)]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[var(--nav-height)] z-[999] bg-[rgba(10,10,11,0.98)] backdrop-blur-2xl border-b border-[var(--borde-fuego)] p-6 flex flex-col gap-4 animate-fade-in lg:hidden">
          <a
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="p-4 rounded-xl bg-[var(--carbon-lift)] border border-[var(--carbon-border)] text-base font-bold text-[var(--crema)] flex items-center justify-between"
          >
            <span>{tr.products}</span>
            <Zap className="w-4 h-4 text-[var(--naranja-glow)]" />
          </a>

          <a
            href="#categorias"
            onClick={() => setMobileMenuOpen(false)}
            className="p-4 rounded-xl bg-[var(--carbon-lift)] border border-[var(--carbon-border)] text-base font-bold text-[var(--crema)] flex items-center justify-between"
          >
            <span>{tr.categories}</span>
            <Zap className="w-4 h-4 text-[var(--naranja-glow)]" />
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-flame p-4 rounded-xl text-center font-bold text-base flex items-center justify-center gap-2"
          >
            <span>{tr.quote}</span>
            <MessageSquare className="w-4 h-4 fill-current" />
          </a>
        </div>
      )}
    </>
  );
}
