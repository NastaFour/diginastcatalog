"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n-store";
import { Package, Layers, Users2, Award } from "lucide-react";

interface StatItem {
  icon: typeof Package;
  target: number;
  suffix: string;
  labelKey: "products" | "categories" | "clients" | "years";
}

const statsData: StatItem[] = [
  { icon: Package, target: 1000, suffix: "+", labelKey: "products" },
  { icon: Layers, target: 24, suffix: "+", labelKey: "categories" },
  { icon: Users2, target: 5000, suffix: "+", labelKey: "clients" },
  { icon: Award, target: 10, suffix: "+", labelKey: "years" },
];

export function LiveStatsSection() {
  const { t } = useI18n();
  const tr = t().stats;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 1600; // 1.6s
          const steps = 40;
          const intervalTime = duration / steps;
          let currentStep = 0;

          const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease-out

            setCounts(
              statsData.map((stat) => Math.floor(stat.target * easeOut))
            );

            if (currentStep >= steps) {
              setCounts(statsData.map((s) => s.target));
              clearInterval(timer);
            }
          }, intervalTime);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 md:px-8 border-y border-[var(--carbon-border)] bg-[var(--carbon-lift)] overflow-hidden"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.06),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon;
          const label = tr[stat.labelKey];

          return (
            <div
              key={idx}
              className="glass-panel p-6 md:p-8 rounded-2xl flex flex-col items-center text-center space-y-3 border border-[var(--carbon-border)] hover:border-[var(--borde-fuego)] transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.3)] flex items-center justify-center text-[var(--naranja-glow)] group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                <Icon className="w-6 h-6" />
              </div>

              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-[var(--crema)] tracking-tight">
                {counts[idx].toLocaleString()}
                <span className="text-[var(--naranja-glow)]">{stat.suffix}</span>
              </div>

              <div className="text-xs sm:text-sm font-medium text-[var(--gris-texto)] font-mono uppercase tracking-wider">
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
