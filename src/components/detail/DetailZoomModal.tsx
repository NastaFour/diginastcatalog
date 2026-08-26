"use client";

import { useEffect, useRef, useState, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import { X, ZoomIn, MessageSquare, Check, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n-store";
import type { Product, AppConfig } from "@/lib/schemas";

interface DetailZoomModalProps {
  product: Product | null;
  config: AppConfig | null;
  onClose: () => void;
}

export function DetailZoomModal({ product, config, onClose }: DetailZoomModalProps) {
  const { lang, t } = useI18n();
  const tr = t().modal;
  const zoomContainerRef = useRef<HTMLDivElement>(null);
  const zoomImageRef = useRef<HTMLImageElement>(null);
  const zoomLensRef = useRef<HTMLDivElement>(null);

  const [isZoomActive, setIsZoomActive] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  if (!product) return null;

  const title = (lang === "en" && product.tituloEn) ? product.tituloEn : product.titulo;
  const description = (lang === "en" && product.descripcionEn) ? product.descripcionEn : product.descripcion;
  const specs = (lang === "en" && product.caracteristicasEn && product.caracteristicasEn.length > 0)
    ? product.caracteristicasEn
    : product.caracteristicas;
  const category = (lang === "en" && product.categoryEn) ? product.categoryEn : product.category;

  // Desktop Mouse Zoom
  const handleMouseEnter = () => {
    if (isTouchDevice) return;
    setIsZoomActive(true);
    setZoomLevel(2.5);
  };

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !zoomContainerRef.current) return;
    const rect = zoomContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomOrigin({ x, y });

    if (zoomLensRef.current) {
      zoomLensRef.current.style.left = `${e.clientX - rect.left - 55}px`;
      zoomLensRef.current.style.top = `${e.clientY - rect.top - 55}px`;
    }
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    setIsZoomActive(false);
    setZoomLevel(1);
    setZoomOrigin({ x: 50, y: 50 });
  };

  const handleClickToggle = () => {
    if (isTouchDevice) return;
    if (zoomLevel === 2.5) {
      setZoomLevel(4);
    } else if (zoomLevel === 4) {
      setZoomLevel(1);
      setIsZoomActive(false);
    } else {
      setZoomLevel(2.5);
      setIsZoomActive(true);
    }
  };

  // WhatsApp Quote Builder
  const whatsappPhone = config?.whatsapp?.phone || "584127670871";
  const whatsappMessage = encodeURIComponent(
    lang === "en"
      ? `Hello Diginast, I would like to request a quote for the following item: ${title} ($${product.precio.toLocaleString()} USD)`
      : `Hola Diginast, me gustaría cotizar el siguiente producto: ${title} ($${product.precio.toLocaleString()} USD)`
  );
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1300] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[var(--carbon-lift)] border border-[var(--borde-fuego)] rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9)] my-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={tr.close}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-[rgba(10,10,11,0.8)] border border-[var(--carbon-border)] flex items-center justify-center text-[var(--gris-texto)] hover:text-[var(--naranja-glow)] hover:border-[var(--naranja-primario)] transition-all duration-200 cursor-pointer shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Optical Zoom Image Container */}
        <div
          ref={zoomContainerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClickToggle}
          className="zoom-container relative w-full aspect-[16/10] bg-[var(--carbon)] border-b border-[var(--carbon-border)]"
        >
          <img
            ref={zoomImageRef}
            src={product.foto || "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&h=800&fit=crop"}
            alt={title}
            className="zoom-image w-full h-full object-cover"
            style={{
              transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
              transform: isZoomActive ? `scale(${zoomLevel})` : "scale(1)",
            }}
          />

          {/* Zoom Lens Element (Desktop) */}
          <div
            ref={zoomLensRef}
            className={`zoom-lens ${isZoomActive && !isTouchDevice ? "active" : ""}`}
          />

          {/* Zoom Mode Indicator Tag */}
          <div className="absolute top-4 left-4 hud-tag flex items-center gap-1.5 pointer-events-none">
            <ZoomIn className="w-3.5 h-3.5 text-[var(--naranja-glow)]" />
            <span className="text-[11px]">
              {isTouchDevice ? tr.touchZoom : tr.hoverZoom}
            </span>
          </div>

          {/* Stock Badge */}
          <div className="absolute bottom-4 right-4 hud-tag flex items-center gap-1.5 pointer-events-none bg-black/90">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-emerald-400">
              {product.inStock ? (lang === "en" ? "In Stock" : "En Stock") : (lang === "en" ? "Sold Out" : "Agotado")}
            </span>
          </div>
        </div>

        {/* Product Details Content */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--naranja-glow)]">
              {category}
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[var(--crema)]">
              {title}
            </h3>
            <p className="text-sm md:text-base text-[var(--gris-texto)] leading-relaxed">
              {description}
            </p>
          </div>

          {/* Specs Grid */}
          {specs && specs.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-[var(--gris-texto)] tracking-wider">
                {tr.specLabel}s
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {specs.map((spec, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-[rgba(249,115,22,0.05)] border border-[rgba(249,115,22,0.25)] text-center text-xs font-mono text-[var(--crema)]"
                  >
                    {spec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer (Price + WhatsApp Quote CTA) */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--carbon-border)]">
            <div>
              <div className="text-xs font-mono text-[var(--gris-texto)] uppercase">Precio</div>
              <div className="text-3xl font-black font-mono text-[var(--naranja-glow)]">
                ${product.precio.toLocaleString()} <span className="text-xs text-[var(--gris-texto)] font-normal">USD</span>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-flame px-7 py-3.5 rounded-xl flex items-center gap-2.5 text-sm font-bold cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>{tr.quoteNow}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
