"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useI18n } from "@/lib/i18n-store";
import { Zap, ChevronDown, Cpu, Sparkles } from "lucide-react";

export function StickyFeatured3D() {
  const { t } = useI18n();
  const tr = t().featured3D;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [is3DSupported, setIs3DSupported] = useState(true);

  useEffect(() => {
    // Detectar si el dispositivo es capaz de renderizar Three.js
    const isMobile = window.innerWidth < 768;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animId: number;

    try {
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0A0A0B, 0.02);

      const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 11);

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Lights
      scene.add(new THREE.AmbientLight(0x404040, 1.2));
      const flameLight = new THREE.DirectionalLight(0xF97316, 3);
      flameLight.position.set(5, 5, 5);
      scene.add(flameLight);

      const glowLight = new THREE.PointLight(0xFB923C, 2, 20);
      glowLight.position.set(-4, -2, 3);
      scene.add(glowLight);

      // PC Chassis Assembly
      const chassisGroup = new THREE.Group();

      // Main Case Body
      const bodyGeo = new THREE.BoxGeometry(2.8, 4.2, 2);
      const bodyMat = new THREE.MeshPhongMaterial({
        color: 0x141416,
        emissive: 0xF97316,
        emissiveIntensity: 0.08,
        transparent: true,
        opacity: 0.88,
      });
      chassisGroup.add(new THREE.Mesh(bodyGeo, bodyMat));

      // Neon Edges
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(bodyGeo),
        new THREE.LineBasicMaterial({ color: 0xF97316, linewidth: 2, transparent: true, opacity: 0.9 })
      );
      chassisGroup.add(edges);

      // Spinning RGB Cooling Fans
      const fansGroup = new THREE.Group();
      const fanMaterials: THREE.MeshBasicMaterial[] = [];

      for (let i = 0; i < 3; i++) {
        const fanGeo = new THREE.TorusGeometry(0.42, 0.07, 8, 28);
        const fanMat = new THREE.MeshBasicMaterial({
          color: 0xFB923C,
          transparent: true,
          opacity: 0.85,
        });
        fanMaterials.push(fanMat);
        const fan = new THREE.Mesh(fanGeo, fanMat);
        fan.position.set(0, 1.2 - i * 0.95, 0.95);
        fansGroup.add(fan);
      }
      chassisGroup.add(fansGroup);

      // Internal GPU Block
      const gpuGeo = new THREE.BoxGeometry(2.2, 0.4, 0.9);
      const gpuMat = new THREE.MeshPhongMaterial({
        color: 0x262628,
        emissive: 0xEA580C,
        emissiveIntensity: 0.2,
      });
      const gpuMesh = new THREE.Mesh(gpuGeo, gpuMat);
      gpuMesh.position.set(0, -0.6, 0);
      chassisGroup.add(gpuMesh);

      scene.add(chassisGroup);

      let currentProgress = 0;

      const handleScroll = () => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const total = container.offsetHeight - window.innerHeight;
        const progress = Math.min(1, Math.max(0, -rect.top / total));
        currentProgress = progress;
        setScrollProgress(progress);
      };

      const animate = () => {
        animId = requestAnimationFrame(animate);

        // Smooth continuous fan rotation + scroll-driven 360 rotation
        chassisGroup.rotation.y = currentProgress * Math.PI * 3.5;
        chassisGroup.rotation.x = Math.sin(currentProgress * Math.PI * 2) * 0.25;

        fansGroup.children.forEach((f) => {
          f.rotation.z += 0.06;
        });

        if (renderer) {
          renderer.render(scene, camera);
        }
      };

      const handleResize = () => {
        if (!container || !renderer) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleResize);
      animate();

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animId);
        if (renderer) {
          renderer.dispose();
        }
      };
    } catch {
      setIs3DSupported(false);
    }
  }, []);

  const specChunks = [
    { label: "CPU", val: tr.specs.cpu },
    { label: "GPU", val: tr.specs.gpu },
    { label: "RAM", val: tr.specs.ram },
    { label: "SSD", val: tr.specs.ssd },
    { label: "Cooling", val: tr.specs.cooling },
    { label: "Price", val: tr.specs.price },
  ];

  const activeTitleIndex = Math.min(
    tr.titles.length - 1,
    Math.floor(scrollProgress * tr.titles.length)
  );

  return (
    <section
      id="destacado"
      ref={containerRef}
      className="relative h-[240vh] w-full bg-[var(--carbon)] text-[var(--crema)]"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 md:px-8">
        {/* Background Ambience */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.08),transparent_70%)] pointer-events-none" />

        {/* 3D Canvas / Fallback */}
        {is3DSupported ? (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>
        ) : (
          <div className="relative w-64 h-64 flex items-center justify-center animate-pulse">
            <div className="w-48 h-48 rounded-full border-2 border-[var(--naranja-glow)] animate-spin" />
            <Cpu className="w-16 h-16 text-[var(--naranja-primario)] absolute" />
          </div>
        )}

        {/* Dynamic Hardware Specs Chunks (Overlay around the 3D PC) */}
        <div className="absolute inset-0 pointer-events-none max-w-6xl mx-auto flex flex-col justify-between py-24 px-4">
          {/* Header Tag */}
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-[var(--naranja-glow)] uppercase tracking-widest">
              {tr.tag}
            </span>
            <h2 className="text-3xl md:text-5xl font-black gradient-text-flame transition-all duration-300">
              {tr.titles[activeTitleIndex] || tr.title}
            </h2>
            <p className="text-sm md:text-base text-[var(--gris-texto)] font-mono">
              {tr.subtitle}
            </p>
          </div>

          {/* Floating Hardware Chunks Left & Right */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto w-full pt-8">
            {specChunks.map((chunk, idx) => {
              const chunkThreshold = idx / specChunks.length;
              const isVisible = scrollProgress >= chunkThreshold - 0.05;

              return (
                <div
                  key={idx}
                  className={`glass-panel p-3 md:p-4 rounded-xl text-center border transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-y-0 border-[var(--naranja-glow)] shadow-[var(--sombra-glow-sm)]"
                      : "opacity-30 translate-y-4 border-[var(--carbon-border)]"
                  }`}
                >
                  <div className="text-[10px] md:text-xs font-mono uppercase text-[var(--gris-texto)] tracking-wider">
                    {chunk.label}
                  </div>
                  <div className="text-xs md:text-base font-mono font-bold text-[var(--crema)] mt-1">
                    {chunk.val}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Scroll Dots */}
          <div className="flex items-center justify-center gap-2 pt-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  scrollProgress >= i * 0.2
                    ? "w-8 bg-[var(--naranja-primario)] shadow-[0_0_10px_var(--naranja-glow)]"
                    : "w-2 bg-[var(--carbon-border)]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
