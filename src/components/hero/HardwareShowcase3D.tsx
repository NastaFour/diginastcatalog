"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Text, Torus, TorusKnot, Sparkles } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import type { Mesh, Group } from "three";

// ============================================================
// HardwareShowcase3D — elementos de ferreteria animados
// Tuerca + arandela + tornillo + chispas flotando con luces
// Version mejorada: mas vistosa, con Environment y Sparkles
// ============================================================

function Gear({ reduced }: { reduced: boolean }) {
  const outerRef = useRef<Mesh>(null);
  const innerRef = useRef<Mesh>(null);
  const knotRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (reduced) return;
    if (outerRef.current) {
      outerRef.current.rotation.z -= delta * 0.4;
    }
    if (innerRef.current) {
      innerRef.current.rotation.z += delta * 0.6;
    }
    if (knotRef.current) {
      knotRef.current.rotation.x += delta * 0.3;
      knotRef.current.rotation.y += delta * 0.2;
      knotRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Torus grande — aro/arandela */}
      <Float speed={reduced ? 0 : 1.2} floatIntensity={reduced ? 0 : 0.4}>
        <mesh ref={outerRef} position={[0, 0, 0]}>
          <Torus args={[1.6, 0.28, 6, 12]} />
          <meshStandardMaterial
            color="#c0793a"
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>
      </Float>

      {/* Torus interior mas fino */}
      <Float speed={reduced ? 0 : 2} floatIntensity={reduced ? 0 : 0.2}>
        <mesh ref={innerRef} position={[0, 0, 0.05]}>
          <Torus args={[0.85, 0.12, 6, 12]} />
          <meshStandardMaterial
            color="#e8a84a"
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Centro — tornillo / knot */}
      <mesh ref={knotRef} position={[0, 0.5, 1]}>
        <TorusKnot args={[0.35, 0.1, 64, 12, 2, 3]} />
        <meshStandardMaterial
          color="#8ab4f8"
          metalness={0.95}
          roughness={0.1}
          emissive="#1a3a6a"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Texto flotante — etiqueta ferreteria */}
      <Float speed={reduced ? 0 : 0.8} floatIntensity={reduced ? 0 : 0.6} position={[0, -2.4, 0]}>
        <Text
          fontSize={0.28}
          color="#f0a040"
          anchorX="center"
          anchorY="middle"
          font={undefined}
        >
          DIGINAST FERRETERIA
        </Text>
      </Float>

      {/* Badge precio */}
      <Float speed={reduced ? 0 : 1.5} floatIntensity={reduced ? 0 : 0.5} position={[2.1, 1.2, 0.5]}>
        <group>
          <RoundedBox args={[1.2, 0.5, 0.08]} radius={0.1} smoothness={4}>
            <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.6} />
          </RoundedBox>
          <Text
            position={[0, 0, 0.05]}
            fontSize={0.15}
            color="#f0a040"
            anchorX="center"
            anchorY="middle"
          >
            OFERTA HOY
          </Text>
        </group>
      </Float>

      {/* Chispas / Sparkles (reemplaza las particulas manuales) */}
      {!reduced && (
        <Sparkles
          count={40}
          scale={[6, 6, 4]}
          size={3}
          speed={0.5}
          color="#f0a040"
          opacity={0.8}
        />
      )}
    </group>
  );
}

export function HardwareShowcase3D() {
  const reduced = useReducedMotion();

  return (
    <div className="h-[380px] w-full sm:h-[420px] lg:h-[480px]">
      <Canvas camera={{ position: [0, 0, 6.5], fov: 48 }} dpr={[1, 2]}>
        <ambientLight intensity={0.3} />
        <pointLight position={[4, 4, 4]} intensity={1.2} color="#f8c060" />
        <pointLight position={[-4, -3, 3]} intensity={0.6} color="#4090ff" />
        <pointLight position={[0, -4, 2]} intensity={0.4} color="#ff6030" />
        <pointLight position={[0, 4, 4]} intensity={0.8} color="#ffffff" />
        <Gear reduced={!!reduced} />
      </Canvas>
    </div>
  );
}
