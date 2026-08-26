"use client";

import { useState, useRef, MouseEvent } from "react";
import { Zap, ChevronDown, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n-store";
import type { AppConfig } from "@/lib/schemas";

interface HeroProps {
  config: AppConfig | null;
}

export function Hero({ config }: HeroProps) {
  const { t } = useI18n();
  const tr = t().hero;
  const [flipped, setFlipped] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (flipped || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    });
  };

  const handleMouseLeave = () => {
    if (flipped) return;
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    });
  };

  const handleCardClick = () => {
    setFlipped(!flipped);
  };

  return (
    <section id="inicio" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 md:px-8 overflow-hidden">
      {/* Background Cyber Glow Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(249,115,22,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141416_1px,transparent_1px),linear-gradient(to_bottom,#141416_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Hero Typography & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.3)] shadow-[0_0_20px_rgba(249,115,22,0.15)] text-xs md:text-sm font-mono text-[var(--naranja-glow)]">
            <Zap className="w-4 h-4 text-[var(--naranja-primario)] animate-bolt" />
            <span>{tr.badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-[var(--crema)]">
            {tr.titleLine1} <br />
            <span className="gradient-text-flame">{tr.titleLine2}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-[var(--gris-texto)] max-w-xl leading-relaxed font-light">
            {tr.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4 w-full sm:w-auto">
            <a
              href="#catalogo"
              className="btn-flame px-7 py-3.5 rounded-xl flex items-center justify-center gap-2.5 text-base font-bold cursor-pointer transition-all duration-300 w-full sm:w-auto"
            >
              <span>{tr.exploreBtn}</span>
              <Zap className="w-4 h-4 fill-current" />
            </a>

            <a
              href="#categorias"
              className="btn-outline-flame px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 text-base font-medium cursor-pointer transition-all duration-300 w-full sm:w-auto"
            >
              <span>{tr.categoriesBtn}</span>
              <ChevronDown className="w-4 h-4 text-[var(--gris-texto)]" />
            </a>
          </div>
        </div>

        {/* Right Column: 3D Interactive Perspective Tilt & Flip Card */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
            style={flipped ? { transform: "perspective(1000px) rotateY(180deg)" } : tiltStyle}
            className="w-full max-w-[420px] aspect-[4/5] relative preserve-3d cursor-pointer transition-transform duration-500 rounded-2xl group select-none shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          >
            {/* Front Card Face */}
            <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden glass-panel backface-hidden flex flex-col justify-end p-6 border border-[var(--borde-fuego)] group-hover:border-[var(--naranja-glow)] transition-colors duration-300">
              <img
                src="https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&h=1000&fit=crop"
                alt="Setup Gaming Diginast"
                className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--carbon)] via-[rgba(10,10,11,0.6)] to-transparent" />

              {/* Floating Hologram Chip */}
              <div className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-[rgba(249,115,22,0.2)] border border-[var(--naranja-glow)] flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                <Zap className="w-5 h-5 text-[var(--naranja-glow)]" />
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 space-y-3">
                <span className="text-xs font-mono text-[var(--naranja-glow)] uppercase tracking-wider">
                  Flagship Rig
                </span>
                <h3 className="text-2xl font-bold text-[var(--crema)] leading-snug">
                  {tr.cardFrontTitle}
                </h3>

                {/* Specs Pills */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div className="bg-[rgba(10,10,11,0.8)] border border-[rgba(249,115,22,0.25)] rounded-lg py-1.5 px-1">
                    <div className="text-[10px] font-mono text-[var(--gris-texto)] uppercase">GPU</div>
                    <div className="text-xs font-mono font-bold text-[var(--naranja-glow)]">RTX 4090</div>
                  </div>
                  <div className="bg-[rgba(10,10,11,0.8)] border border-[rgba(249,115,22,0.25)] rounded-lg py-1.5 px-1">
                    <div className="text-[10px] font-mono text-[var(--gris-texto)] uppercase">CPU</div>
                    <div className="text-xs font-mono font-bold text-[var(--naranja-glow)]">i9 14900K</div>
                  </div>
                  <div className="bg-[rgba(10,10,11,0.8)] border border-[rgba(249,115,22,0.25)] rounded-lg py-1.5 px-1">
                    <div className="text-[10px] font-mono text-[var(--gris-texto)] uppercase">RAM</div>
                    <div className="text-xs font-mono font-bold text-[var(--naranja-glow)]">64GB DDR5</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.1)]">
                  <span className="text-2xl font-black font-mono text-[var(--naranja-glow)]">
                    $3,499 <span className="text-xs text-[var(--gris-texto)] font-normal">USD</span>
                  </span>
                  <span className="text-xs font-mono text-[var(--gris-texto)] underline decoration-dotted">
                    Click to flip 🔄
                  </span>
                </div>
              </div>
            </div>

            {/* Back Card Face */}
            <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden glass-panel rotate-y-180 backface-hidden p-8 flex flex-col justify-between border border-[var(--naranja-primario)] shadow-[var(--sombra-glow)] bg-[var(--carbon-lift)]">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(249,115,22,0.15)] border border-[var(--naranja-glow)] flex items-center justify-center">
                    <Zap className="w-5 h-5 text-[var(--naranja-primario)]" />
                  </div>
                  <h3 className="text-2xl font-black text-[var(--crema)]">
                    {tr.cardBackTitle}
                  </h3>
                </div>

                <ul className="space-y-4">
                  {tr.cardBackItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[var(--crema)]">
                      <CheckCircle2 className="w-5 h-5 text-[var(--naranja-glow)] shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[rgba(249,115,22,0.2)] flex items-center justify-between text-xs font-mono text-[var(--gris-texto)]">
                <span>DIGINAST ENGINE</span>
                <span className="text-[var(--naranja-glow)] underline">Click to flip ↩</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <a
        href="#destacado"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs font-mono text-[var(--gris-texto)] hover:text-[var(--naranja-glow)] transition-colors duration-300"
      >
        <span>{tr.scrollIndicator}</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[var(--naranja-primario)]" />
      </a>
    </section>
  );
}
