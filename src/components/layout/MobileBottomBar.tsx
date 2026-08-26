"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, MessageCircle } from "lucide-react";
import type { AppConfig } from "@/lib/schemas";

interface MobileBottomBarProps {
  config: AppConfig | null;
}

export function MobileBottomBar({ config }: MobileBottomBarProps) {
  const pathname = usePathname();

  // Don't render on admin dashboard
  if (pathname.startsWith("/admin")) return null;

  const phone = config?.whatsapp?.phone?.replace(/\D/g, "") || "";
  const waUrl = phone ? `https://wa.me/${phone}?text=${encodeURIComponent("Hola, me gustaría más información sobre sus servicios.")}` : "#";

  return (
    <div className="dgn-safe-bottom fixed bottom-0 left-0 right-0 z-40 border-t border-dgn-base-800 bg-dgn-base-950/95 backdrop-blur-lg md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 px-3 py-1 text-[11px] transition-colors ${
            pathname === "/" ? "text-dgn-accent-400 font-semibold" : "text-dgn-text-400 hover:text-dgn-text-200"
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Inicio</span>
        </Link>

        <Link
          href="/#catalogo"
          className="flex flex-col items-center gap-1 px-3 py-1 text-[11px] text-dgn-text-400 transition-colors hover:text-dgn-text-200"
        >
          <Package className="h-5 w-5" />
          <span>Catálogo</span>
        </Link>

        {phone && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 px-3 py-1 text-[11px] text-emerald-400 transition-colors hover:text-emerald-300"
          >
            <MessageCircle className="h-5 w-5" />
            <span>WhatsApp</span>
          </a>
        )}
      </div>
    </div>
  );
}
