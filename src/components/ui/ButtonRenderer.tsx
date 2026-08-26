"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, MessageCircle, ShoppingCart, Info } from "lucide-react";
import type { ButtonDef, AppConfig } from "@/lib/schemas";
import { cn } from "@/lib/cn";

interface ButtonRendererProps {
  button: ButtonDef;
  config: AppConfig | null;
  product?: { titulo: string; precio: number };
}

const VARIANT_CLASSES: Record<ButtonDef["variant"], string> = {
  "solid-primary":
    "bg-dgn-primary-600 text-dgn-text-50 hover:bg-dgn-primary-500 shadow-lg shadow-dgn-primary-900/50",
  "outline-primary":
    "border border-dgn-primary-600 text-dgn-primary-400 hover:bg-dgn-primary-950/50",
  "solid-accent":
    "bg-dgn-accent-500 text-dgn-base-950 hover:bg-dgn-accent-400 shadow-lg shadow-dgn-accent-900/50",
  ghost: "text-dgn-text-300 hover:bg-dgn-base-800 hover:text-dgn-text-50",
};

function getActionIcon(action: ButtonDef["action"]) {
  switch (action) {
    case "whatsapp-order":
      return <ShoppingCart className="h-4 w-4" />;
    case "whatsapp-info":
      return <MessageCircle className="h-4 w-4" />;
    case "back":
      return <ArrowLeft className="h-4 w-4" />;
    case "link":
      return <ExternalLink className="h-4 w-4" />;
    case "scroll":
      return <Info className="h-4 w-4" />;
    default:
      return null;
  }
}

export function ButtonRenderer({ button, config, product }: ButtonRendererProps) {
  const router = useRouter();

  if (!button.visible) return null;

  const phone = config?.whatsapp?.phone?.replace(/\D/g, "") || "";
  const baseClasses = cn(
    "dgn-ripple inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all",
    VARIANT_CLASSES[button.variant]
  );

  const handleClick = () => {
    switch (button.action) {
      case "back":
        router.back();
        break;
      case "scroll":
        if (button.href) {
          document.querySelector(button.href)?.scrollIntoView({ behavior: "smooth" });
        }
        break;
      case "link":
        if (button.href) {
          window.open(button.href, "_blank", "noopener,noreferrer");
        }
        break;
      default:
        break;
    }
  };

  // WhatsApp actions → render <a>
  if (button.action === "whatsapp-order" || button.action === "whatsapp-info") {
    let message = button.whatsappTemplate || "";
    if (product && button.action === "whatsapp-order") {
      message = `${button.whatsappTemplate}${product.titulo} — $${product.precio}`;
    }
    const waUrl = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : "#";
    return (
      <a href={waUrl} target="_blank" rel="noopener noreferrer" className={baseClasses}>
        {getActionIcon(button.action)}
        {button.label}
      </a>
    );
  }

  // All other actions (link, back, scroll) → render <button>
  return (
    <button onClick={handleClick} className={baseClasses}>
      {getActionIcon(button.action)}
      {button.label}
    </button>
  );
}
