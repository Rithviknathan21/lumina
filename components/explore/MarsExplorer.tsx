"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import * as THREE from "three";
import { PlanetMesh, PLANET_CONFIGS } from "@/components/three/PlanetMesh";
import { StarField } from "@/components/three/StarField";
import { PlanetHotspot } from "./PlanetHotspot";
import { OrbitCameraController } from "./OrbitCameraController";
import type { OrbitControllerHandle } from "./OrbitCameraController";
import { InfoPanel } from "./InfoPanel";
import type { HotspotInfo } from "./InfoPanel";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Mars Explorer
// Cinematic orbit of Mars with three explorable surface hotspots.
// ─────────────────────────────────────────────────────────────────────────────

const MARS_HOTSPOTS = [
  {
    id: "olympus",
    label: "Olympus Mons",
    // lat 18°N, lon 226°E, r=1.5
    position: [-1.027, 0.463, -0.992] as [number, number, number],
    accentColor: "#FF6040",
    info: {
      title: "Olympus Mons",
      subtitle: "Tharsis Region · 18°N 226°E",
      description:
        "The largest volcano in the solar system rises 22 km above the Martian plains — nearly 3× the height of Everest. Its caldera could swallow the island of Hawaii.",
      stats: [
        { label: "Height", value: "22 km" },
        { label: "Width", value: "600 km" },
        { label: "Caldera", value: "80 km" },
        { label: "Age", value: "~3.5 Ga" },
      ],
      accentColor: "#FF6040",
    } satisfies HotspotInfo,
  },
  {
    id: "valles",
    label: "Valles Marineris",
    // lat -13°, lon 300°E, r=1.5
    position: [-1.265, -0.338, 0.731] as [number, number, number],
    accentColor: "#E88030",
    info: {
      title: "Valles Marineris",
      subtitle: "Equatorial Rift · 13°S 300°E",
      description:
        "A rift canyon stretching 4,000 km — long enough to span North America. At its deepest, 7 km below the surrounding terrain, it dwarfs Earth's Grand Canyon by orders of magnitude.",
      stats: [
        { label: "Length", value: "4,000 km" },
        { label: "Width", value: "200 km" },
        { label: "Depth", value: "7 km" },
        { label: "Origin", value: "Tectonic" },
      ],
      accentColor: "#E88030",
    } satisfies HotspotInfo,
  },
  {
    id: "polar",
    label: "North Polar Cap",
    // lat 80°N, lon 180°E, r=1.5
    position: [0, 1.477, -0.261] as [number, number, number],
    accentColor: "#C0DCFF",
    info: {
      title: "North Polar Cap",
      subtitle: "Planum Boreum · 80°N",
      description:
        "A 1,000 km disc of layered water ice and frozen CO₂, concealing ancient climate records in its strata. Seasonal sublimation exposes new geological layers every Martian year.",
      stats: [
        { label: "Diameter", value: "1,000 km" },
        { label: "Thickness", value: "3 km" },
        { label: "Volume", value: "1.6M km³" },
        { label: "Comp.", value: "H₂O + CO₂" },
      ],
      accentColor: "#C0DCFF",
    } satisfies HotspotInfo,
  },
] as const;

// Mars dust particles — thin haze around equatorial band
function MarsDust() {
  const meshRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 280;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const θ = Math.random() * Math.PI * 2;
      const φ = (Math.random() - 0.5) * 0.8;
      const r = 1.65 + Math.random() * 0.35;
      arr[i * 3] = r * Math.cos(φ) * Math.cos(θ);
      arr[i * 3 + 1] = r * Math.sin(φ);
      arr[i * 3 + 2] = r * Math.cos(φ) * Math.sin(θ);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.012;
    }
  });

  return (
    <points ref={meshRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#C87040"
        size={0.018}
        transparent
        opacity={0.22}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// Thin orbit ring around Mars
function OrbitRing({ radius = 2.4 }: { radius?: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius, radius + 0.006, 96]} />
      <meshBasicMaterial
        color="#FF6040"
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// Small satellite orbiting the planet
function Satellite({ speed = 0.7, r = 2.1, offset = 0 }: { speed?: number; r?: number; offset?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime * speed + offset;
    meshRef.current.position.set(
      r * Math.cos(t),
      r * Math.sin(t) * 0.18,
      r * Math.sin(t)
    );
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.018, 5, 4]} />
      <meshBasicMaterial color="#FF9060" />
    </mesh>
  );
}

// ── Inner 3D scene (rendered inside Canvas) ───────────────────────────────
interface MarsSceneProps {
  isDraggingRef: React.MutableRefObject<boolean>;
  controllerRef: React.MutableRefObject<OrbitControllerHandle | null>;
  onHotspotClick: (info: HotspotInfo) => void;
}

function MarsScene({ isDraggingRef, controllerRef, onHotspotClick }: MarsSceneProps) {
  const planetGroupRef = useRef<THREE.Group>(null);
  const marsConfig = useMemo(
    () => ({ ...PLANET_CONFIGS.mars, rotationSpeed: 0 }),
    []
  );

  return (
    <>
      <StarField count={2200} radius={80} speed={0.008} size={1.2} />

      {/* Sun direction light */}
      <directionalLight position={[8, 4, 6]} intensity={1.4} color="#FFF5E0" />
      <ambientLight intensity={0.04} />

      {/* Planet group — rotation is driven by OrbitCameraController */}
      <group ref={planetGroupRef}>
        <PlanetMesh config={marsConfig} sunDirection={[8, 4, 6]} />

        {/* Surface hotspots — inside group so they co-rotate */}
        {MARS_HOTSPOTS.map((h) => (
          <PlanetHotspot
            key={h.id}
            position={h.position}
            label={h.label}
            accentColor={h.accentColor}
            isDraggingRef={isDraggingRef}
            onClick={() => onHotspotClick(h.info)}
          />
        ))}
      </group>

      <OrbitRing />
      <Satellite speed={0.55} r={2.05} offset={0} />
      <Satellite speed={0.9} r={1.9} offset={2.1} />
      <MarsDust />

      <OrbitCameraController
        planetGroupRef={planetGroupRef}
        isDraggingRef={isDraggingRef}
        controllerRef={controllerRef}
        orbitDistance={6.0}
        autoRotateSpeed={0.05}
      />

      <EffectComposer>
        <Bloom
          kernelSize={KernelSize.MEDIUM}
          intensity={0.7}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.8}
        />
      </EffectComposer>
    </>
  );
}

// ── Public export ─────────────────────────────────────────────────────────
export function MarsExplorer() {
  const [activeInfo, setActiveInfo] = useState<HotspotInfo | null>(null);
  const isDraggingRef = useRef(false);
  const controllerRef = useRef<OrbitControllerHandle | null>(null);

  const handleClose = () => {
    setActiveInfo(null);
    controllerRef.current?.returnToOrbit();
  };

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 500 }}
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        style={{ background: "radial-gradient(ellipse at center, #0A0204 0%, #020106 100%)" }}
      >
        <MarsScene
          isDraggingRef={isDraggingRef}
          controllerRef={controllerRef}
          onHotspotClick={setActiveInfo}
        />
      </Canvas>

      {/* DOM overlay — InfoPanel */}
      <InfoPanel info={activeInfo} onClose={handleClose} />

      {/* Hint */}
      {!activeInfo && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.3em] text-white/22 pointer-events-none select-none"
        >
          Drag to orbit · Click hotspots to explore
        </div>
      )}
    </div>
  );
}
