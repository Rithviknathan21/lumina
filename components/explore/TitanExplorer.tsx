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
// LUMINA — Titan Explorer
// Saturn's moon: thick orange haze, methane lakes, Saturn in background.
// ─────────────────────────────────────────────────────────────────────────────

const TITAN_HOTSPOTS = [
  {
    id: "ligeia",
    label: "Ligeia Mare",
    // lat 79°N, lon 250°E, r=2.0
    position: [-0.33, 1.965, -0.40] as [number, number, number],
    accentColor: "#E08830",
    info: {
      title: "Ligeia Mare",
      subtitle: "Northern Methane Sea",
      description:
        "The second-largest body of liquid on Titan — a dark sea of liquid methane and ethane the size of Lake Huron. Radar images show calm, glassy surface with no visible waves.",
      stats: [
        { label: "Area", value: "126,000 km²" },
        { label: "Depth", value: "~170 m" },
        { label: "Comp.", value: "CH₄ + C₂H₆" },
        { label: "Temp", value: "-179°C" },
      ],
      accentColor: "#E08830",
    } satisfies HotspotInfo,
  },
  {
    id: "huygens",
    label: "Huygens Landing",
    // lat -10°S, lon 192°E, r=2.0
    position: [-1.968, -0.347, -0.253] as [number, number, number],
    accentColor: "#FFB040",
    info: {
      title: "Huygens Landing Site",
      subtitle: "Adiri Region · 10°S",
      description:
        "In 2005, ESA's Huygens probe descended through 1,270 km of orange haze over 2.5 hours, landing near rounded ice pebbles shaped by ancient methane rivers. First landing in the outer solar system.",
      stats: [
        { label: "Year", value: "2005" },
        { label: "Descent", value: "2.5 hrs" },
        { label: "Agency", value: "ESA" },
        { label: "First", value: "Outer SS" },
      ],
      accentColor: "#FFB040",
    } satisfies HotspotInfo,
  },
  {
    id: "kraken",
    label: "Kraken Mare",
    // lat 68°N, lon 310°E, r=2.0
    position: [-0.893, 1.854, 0.766] as [number, number, number],
    accentColor: "#C07820",
    info: {
      title: "Kraken Mare",
      subtitle: "Largest Titan Sea",
      description:
        "Larger than Earth's Caspian Sea, Kraken Mare is Titan's largest hydrocarbon sea. Its 400,000 km² of liquid methane and ethane may harbor exotic chemistry — or life beyond our imagination.",
      stats: [
        { label: "Area", value: "400,000 km²" },
        { label: "Depth", value: "~300 m" },
        { label: "Season", value: "Summer N." },
        { label: "Waves", value: "Possible" },
      ],
      accentColor: "#C07820",
    } satisfies HotspotInfo,
  },
] as const;

// Thick haze / fog shell around Titan
function TitanHaze({ radius = 2.0 }: { radius?: number }) {
  const outer = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!outer.current) return;
    const mat = outer.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.28 + Math.sin(clock.elapsedTime * 0.25) * 0.04;
  });

  return (
    <>
      {/* Inner warm glow */}
      <mesh>
        <sphereGeometry args={[radius * 1.04, 32, 20]} />
        <meshBasicMaterial
          color="#C07020"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Outer haze */}
      <mesh ref={outer}>
        <sphereGeometry args={[radius * 1.12, 32, 20]} />
        <meshBasicMaterial
          color="#904810"
          transparent
          opacity={0.30}
          depthWrite={false}
          blending={THREE.NormalBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}

// Saturn in the distant background
function DistantSaturn() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.008;
    }
  });

  return (
    <group position={[-14, 3, -22]} rotation={[0.2, 0.3, 0.12]}>
      {/* Saturn body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[3.2, 24, 16]} />
        <meshStandardMaterial
          color="#C4A860"
          roughness={0.7}
          metalness={0.0}
          emissive="#604820"
          emissiveIntensity={0.08}
        />
      </mesh>
      {/* Rings */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
        <ringGeometry args={[3.8, 6.4, 64]} />
        <meshBasicMaterial
          color="#B09848"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Ring shadow */}
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <ringGeometry args={[3.5, 6.2, 64]} />
        <meshBasicMaterial
          color="#605028"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// Orange smog particles
function TitanSmog() {
  const meshRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 350;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const θ = Math.random() * Math.PI * 2;
      const φ = Math.acos(2 * Math.random() - 1);
      const r = 2.2 + Math.random() * 0.55;
      arr[i * 3] = r * Math.sin(φ) * Math.cos(θ);
      arr[i * 3 + 1] = r * Math.sin(φ) * Math.sin(θ);
      arr[i * 3 + 2] = r * Math.cos(φ);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={meshRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#C07030"
        size={0.022}
        transparent
        opacity={0.18}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

interface TitanSceneProps {
  isDraggingRef: React.MutableRefObject<boolean>;
  controllerRef: React.MutableRefObject<OrbitControllerHandle | null>;
  onHotspotClick: (info: HotspotInfo) => void;
}

function TitanScene({ isDraggingRef, controllerRef, onHotspotClick }: TitanSceneProps) {
  const planetGroupRef = useRef<THREE.Group>(null);
  const titanConfig = useMemo(
    () => ({ ...PLANET_CONFIGS.titan, rotationSpeed: 0 }),
    []
  );

  return (
    <>
      <StarField count={2000} radius={80} speed={0.005} size={1.0} color="#FFD080" />

      <directionalLight position={[6, 1, 4]} intensity={0.7} color="#FFD090" />
      <pointLight position={[-14, 3, -22]} intensity={0.2} color="#C4A860" />
      <ambientLight intensity={0.1} />

      <DistantSaturn />

      <group ref={planetGroupRef}>
        <PlanetMesh config={titanConfig} sunDirection={[6, 1, 4]} />
        <TitanHaze />
        {TITAN_HOTSPOTS.map((h) => (
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

      <TitanSmog />

      <OrbitCameraController
        planetGroupRef={planetGroupRef}
        isDraggingRef={isDraggingRef}
        controllerRef={controllerRef}
        orbitDistance={7.0}
        autoRotateSpeed={0.035}
      />

      <EffectComposer>
        <Bloom
          kernelSize={KernelSize.MEDIUM}
          intensity={0.65}
          luminanceThreshold={0.45}
          luminanceSmoothing={0.8}
        />
      </EffectComposer>
    </>
  );
}

export function TitanExplorer() {
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
        camera={{ position: [0, 0, 7], fov: 55, near: 0.1, far: 500 }}
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        style={{ background: "radial-gradient(ellipse at 50% 60%, #0E0500 0%, #060200 100%)" }}
      >
        <TitanScene
          isDraggingRef={isDraggingRef}
          controllerRef={controllerRef}
          onHotspotClick={setActiveInfo}
        />
      </Canvas>

      <InfoPanel info={activeInfo} onClose={handleClose} />

      {!activeInfo && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.3em] text-white/22 pointer-events-none select-none">
          Drag to orbit · Click hotspots to explore
        </div>
      )}
    </div>
  );
}
