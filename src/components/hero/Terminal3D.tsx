"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Text } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import type { Mesh } from "three";

// ============================================================
// Terminal3D — signature element de Diginast
// Terminal flotante 3D con código de Diginast + cursor parpadeante
// ============================================================

const CODE_LINES = [
  "$ diginast --create",
  "> init project...",
  "✓ Next.js 15 + React 19",
  "✓ Tailwind 4 + Three.js",
  "✓ Upstash Redis (secure)",
  "✓ JWT auth + rate limit",
  "✓ CSP + CSRF + HSTS",
  "> deploy ready ✓",
];

function TerminalMesh({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current || reduced) return;
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
  });

  return (
    <Float speed={reduced ? 0 : 1.5} rotationIntensity={reduced ? 0 : 0.2} floatIntensity={reduced ? 0 : 0.5}>
      <group ref={meshRef}>
        {/* Terminal body */}
        <RoundedBox args={[3.5, 2.4, 0.15]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color="hsl(240 6% 6%)" metalness={0.8} roughness={0.3} />
        </RoundedBox>

        {/* Title bar */}
        <mesh position={[0, 1.0, 0.08]}>
          <planeGeometry args={[3.5, 0.3]} />
          <meshStandardMaterial color="hsl(240 8% 16%)" />
        </mesh>

        {/* Traffic lights */}
        <mesh position={[-1.45, 1.0, 0.09]}>
          <circleGeometry args={[0.06, 16]} />
          <meshStandardMaterial color="hsl(0 80% 60%)" />
        </mesh>
        <mesh position={[-1.25, 1.0, 0.09]}>
          <circleGeometry args={[0.06, 16]} />
          <meshStandardMaterial color="hsl(40 80% 60%)" />
        </mesh>
        <mesh position={[-1.05, 1.0, 0.09]}>
          <circleGeometry args={[0.06, 16]} />
          <meshStandardMaterial color="hsl(150 70% 50%)" />
        </mesh>

        {/* Code text lines */}
        {CODE_LINES.map((line, i) => (
          <Text
            key={i}
            position={[-1.55, 0.65 - i * 0.22, 0.09]}
            fontSize={0.12}
            color={line.startsWith("✓") ? "hsl(190 85% 55%)" : "hsl(265 80% 70%)"}
            anchorX="left"
            anchorY="middle"
          >
            {line}
          </Text>
        ))}

        {/* Blinking cursor */}
        <mesh position={[1.2, -0.95, 0.09]}>
          <planeGeometry args={[0.08, 0.15]} />
          <meshStandardMaterial color="hsl(190 90% 55%)" />
        </mesh>
      </group>
    </Float>
  );
}

export function Terminal3D() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-[400px] w-full" />;
  }

  return (
    <div className="h-[400px] w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="hsl(265 80% 70%)" />
        <pointLight position={[-5, -3, 3]} intensity={0.4} color="hsl(190 90% 55%)" />
        <TerminalMesh reduced={!!reduced} />
      </Canvas>
    </div>
  );
}
