"use client";

import { useEffect, ReactNode } from "react";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    let lenisInstance: {
      raf: (time: number) => void;
      destroy: () => void;
    } | null = null;
    let rafId: number;

    // Dynamic import to support SSR and client-only execution safely
    import("lenis")
      .then((mod) => {
        const LenisConstructor = mod.default || mod;
        lenisInstance = new LenisConstructor({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 1.05,
          touchMultiplier: 2,
          infinite: false,
        });

        (window as unknown as { lenis: typeof lenisInstance }).lenis = lenisInstance;

        function raf(time: number) {
          if (lenisInstance) {
            lenisInstance.raf(time);
          }
          rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);
      })
      .catch(() => {
        // Fallback gracefully to native smooth scroll if lenis fails
        document.documentElement.style.scrollBehavior = "smooth";
      });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenisInstance) lenisInstance.destroy();
      delete (window as unknown as { lenis?: unknown }).lenis;
    };
  }, []);

  return <>{children}</>;
}
