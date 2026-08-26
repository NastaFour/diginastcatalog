"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useI18n } from "@/lib/i18n-store";
import { Sparkles, Cpu, Flame, Snowflake, Zap } from "lucide-react";

export function StickyExperience3D() {
  const { t } = useI18n();
  const tr = t().experience3D;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [is3DSupported, setIs3DSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animId: number;
    let isActive = true;

    try {
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0A0A0B, 0.015);

      const camera = new THREE.PerspectiveCamera(
        55,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 15);

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Core Central Icosahedron Wireframe
      const central = new THREE.Mesh(
        new THREE.IcosahedronGeometry(3.2, 1),
        new THREE.MeshBasicMaterial({
          color: 0xF97316,
          wireframe: true,
          transparent: true,
          opacity: 0.65,
        })
      );
      scene.add(central);

      // Inner Pulsing Solid Octahedron
      const inner = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.6, 0),
        new THREE.MeshPhongMaterial({
          color: 0xFB923C,
          emissive: 0xEA580C,
          emissiveIntensity: 0.5,
        })
      );
      central.add(inner);

      // Multi-Axis Orbital Energy Rings
      const ringGroup = new THREE.Group();
      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(5.2 + i * 1.6, 0.03, 8, 80),
          new THREE.MeshBasicMaterial({
            color: 0xF97316,
            transparent: true,
            opacity: 0.45 - i * 0.1,
          })
        );
        if (i === 0) ring.rotation.x = Math.PI / 2;
        else if (i === 1) {
          ring.rotation.x = Math.PI / 3;
          ring.rotation.y = Math.PI / 4;
        } else {
          ring.rotation.x = -Math.PI / 4;
          ring.rotation.z = Math.PI / 6;
        }
        ringGroup.add(ring);
      }
      scene.add(ringGroup);

      // Floating Platonic Polyhedrons
      const shapes: THREE.Mesh[] = [];
      const configs: [string, number, [number, number, number]][] = [
        ["tetra", 0.5, [6, 2, -3]],
        ["tetra", 0.35, [-7, -1, -5]],
        ["octa", 0.45, [-5, 4, -6]],
        ["octa", 0.6, [8, 1, -10]],
        ["icosa", 0.5, [4, 5, -7]],
        ["icosa", 0.4, [-6, -2, -8]],
        ["dodeca", 0.6, [7, -4, -6]],
        ["dodeca", 0.4, [-4, 3, -9]],
      ];

      configs.forEach(([type, size, pos]) => {
        let geo: THREE.BufferGeometry;
        if (type === "tetra") geo = new THREE.TetrahedronGeometry(size, 0);
        else if (type === "octa") geo = new THREE.OctahedronGeometry(size, 0);
        else if (type === "icosa") geo = new THREE.IcosahedronGeometry(size, 0);
        else geo = new THREE.DodecahedronGeometry(size, 0);

        const mesh = new THREE.Mesh(
          geo,
          new THREE.MeshBasicMaterial({
            color: 0xF97316,
            wireframe: true,
            transparent: true,
            opacity: 0.5,
          })
        );
        mesh.position.set(...pos);
        mesh.userData = {
          baseY: pos[1],
          rSpeed: { x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02 },
          fOffset: Math.random() * Math.PI * 2,
          fSpeed: 0.5 + Math.random() * 0.5,
        };
        shapes.push(mesh);
        scene.add(mesh);
      });

      // Starfield Points
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(250 * 3);
      for (let i = 0; i < 250; i++) {
        starPos[i * 3] = (Math.random() - 0.5) * 40;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 30;
        starPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 8;
      }
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      const stars = new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({
          color: 0xFB923C,
          size: 0.09,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
        })
      );
      scene.add(stars);

      let currentProg = 0;

      const handleScroll = () => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const total = container.offsetHeight - window.innerHeight;
        const prog = Math.min(1, Math.max(0, -rect.top / total));
        currentProg = prog;
        setScrollProgress(prog);
      };

      const animate = () => {
        animId = requestAnimationFrame(animate);

        if (isActive) {
          const t = Date.now() * 0.001;
          central.rotation.y += 0.004;
          ringGroup.rotation.y += 0.003;
          inner.rotation.y -= 0.006;

          const pulse = 1 + Math.sin(t * 2.5) * 0.12;
          inner.scale.set(pulse, pulse, pulse);

          shapes.forEach((s) => {
            s.position.y =
              s.userData.baseY +
              Math.sin(t * s.userData.fSpeed + s.userData.fOffset) * 0.4;
            s.rotation.x += s.userData.rSpeed.x;
            s.rotation.y += s.userData.rSpeed.y;
          });

          stars.rotation.y += 0.0006;
          camera.position.z = 15 - currentProg * 4.5;
          camera.lookAt(0, 0, 0);

          if (renderer) {
            renderer.render(scene, camera);
          }
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

  const currentStageIndex =
    scrollProgress < 0.35 ? 0 : scrollProgress < 0.7 ? 1 : 2;
  const stage = tr.stages[currentStageIndex] || tr.stages[0];

  return (
    <section
      id="experiencia"
      ref={containerRef}
      className="relative h-[220vh] w-full bg-[var(--carbon)] text-[var(--crema)]"
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 md:px-8">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_70%)] pointer-events-none" />

        {/* 3D Scene */}
        {is3DSupported ? (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>
        ) : (
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-2 border-[var(--naranja-glow)] animate-ping opacity-30" />
            <Sparkles className="w-16 h-16 text-[var(--naranja-glow)]" />
          </div>
        )}

        {/* Floating Hologram HUD Badges */}
        <div className="absolute top-[22%] left-[6%] hud-tag flex items-center gap-2">
          <Zap className="w-4 h-4 text-[var(--naranja-primario)]" />
          <span>{tr.hud.compute}</span>
        </div>

        <div className="absolute top-[32%] right-[6%] hud-tag flex items-center gap-2">
          <Flame className="w-4 h-4 text-[var(--naranja-deep)]" />
          <span>{tr.hud.vram}</span>
        </div>

        <div className="absolute bottom-[24%] left-[10%] hud-tag flex items-center gap-2">
          <Snowflake className="w-4 h-4 text-cyan-400" />
          <span>{tr.hud.cooling}</span>
        </div>

        {/* Dynamic Center Title & Subtitle */}
        <div className="absolute inset-0 pointer-events-none max-w-4xl mx-auto flex flex-col justify-between py-24 px-4 text-center">
          <div className="space-y-4 max-w-2xl mx-auto mt-12">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight transition-all duration-300">
              {stage.title} <br />
              <span className="gradient-text-flame">{stage.titleHighlight}</span>
            </h2>
            <p className="text-sm sm:text-base text-[var(--gris-texto)] font-mono max-w-lg mx-auto">
              {stage.subtitle}
            </p>
          </div>

          {/* Bottom Progress Indicators */}
          <div className="flex items-center justify-center gap-3">
            {tr.stages.map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentStageIndex === i
                    ? "w-10 bg-[var(--naranja-primario)] shadow-[0_0_12px_var(--naranja-glow)]"
                    : "w-2.5 bg-[var(--carbon-border)]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
