"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n-store";

export function LoadingScreen() {
  const { lang } = useI18n();
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => setVisible(false), 700);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] bg-[var(--carbon)] flex flex-col items-center justify-center transition-opacity duration-700 select-none ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Animated Bolt with Glow */}
      <div className="relative w-20 h-20 flex items-center justify-center animate-pulse">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.4),transparent_70%)] animate-ping" />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--naranja-primario)] to-[var(--naranja-deep)] flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.6)]">
          <Zap className="w-9 h-9 text-[var(--carbon)] fill-current" />
        </div>
      </div>

      {/* Cyber Loader Text */}
      <div className="mt-8 font-mono text-xs tracking-[0.25em] text-[var(--gris-texto)] uppercase text-center">
        DIGINAST // <span className="text-[var(--naranja-glow)] font-bold">{lang === "en" ? "HARDWARE CORE ENGINE" : "INICIALIZANDO HARDWARE"}</span>
      </div>

      {/* Progress Line */}
      <div className="mt-5 w-44 h-[3px] rounded-full bg-[var(--carbon-border)] overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-[var(--naranja-primario)] to-[var(--naranja-glow)] animate-[load-fill_1.2s_ease-out_forwards]" />
      </div>
    </div>
  );
}
