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
// LUMINA — Europa Explorer
// Cold, mysterious moon with subsurface ocean and fractured ice shell.
// ─────────────────────────────────────────────────────────────────────────────

const EUROPA_HOTSPOTS = [
  {
    id: "ocean",
    label: "Subsurface Ocean",
    // lat 0°, lon 90°E, r=1.4
    position: [1.4, 0, 0] as [number, number, number],
    accentColor: "#60AAFF",
    info: {
      title: "Subsurface Ocean",
      subtitle: "100 km Below the Ice",
      description:
        "Beneath a shell of fractured ice lies an ocean twice the volume of all Earth's oceans combined. Tidal heating from Jupiter keeps it liquid — and potentially habitable.",
      stats: [
        { label: "Depth", value: ">100 km" },
        { label: "Volume", value: "2× Earth" },
        { label: "Temp", value: "~-2°C" },
        { label: "Salinity", value: "Unknown" },
      ],
      accentColor: "#60AAFF",
    } satisfies HotspotInfo,
  },
  {
    id: "linea",
    label: "Conamara Chaos",
    // lat 9°N, lon 274°E, r=1.4
    position: [-1.364, 0.219, 0.233] as [number, number, number],
    accentColor: "#A0D8FF",
    info: {
      title: "Conamara Chaos",
      subtitle: "Fractured Ice Field",
      description:
        "A 90×80 km region where the ice shell broke apart and refroze, leaving icebergs stranded in a matrix of slush. Evidence of recent interaction between the surface and the ocean below.",
      stats: [
        { label: "Area", value: "90×80 km" },
        { label: "Ice thick", value: "~3 km" },
        { label: "Feature", value: "Chaos" },
        { label: "Age", value: "<50 Ma" },
      ],
      accentColor: "#A0D8FF",
    } satisfies HotspotInfo,
  },
  {
    id: "plumes",
    label: "Water Plumes",
    // lat -70°S, lon 180°E, r=1.4
    position: [0, -1.316, -0.479] as [number, number, number],
    accentColor: "#E0F4FF",
    info: {
      title: "Water Plumes",
      subtitle: "Southern Region",
      description:
        "Hubble detected water vapor erupting 200 km above Europa's south pole. These plumes may offer a direct sample of the subsurface ocean — without drilling through kilometres of ice.",
      stats: [
        { label: "Height", value: "200 km" },
        { label: "Rate", value: "~7,000 kg/s" },
        { label: "Comp.", value: "H₂O vapor" },
        { label: "Source", value: "Ocean?" },
      ],
      accentColor: "#E0F4FF",
    } satisfies HotspotInfo,
  },
] as const;

// Subsurface ocean glow — inner sphere with additive blue light
function OceanGlow({ radius = 1.4 }: { radius?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.12 + Math.sin(clock.elapsedTime * 0.6) * 0.04;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius * 0.93, 24, 16]} />
      <meshBasicMaterial
        color="#4080FF"
        transparent
        opacity={0.14}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// Drifting ice particles
function IceParticles() {
  const meshRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 200;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const θ = Math.random() * Math.PI * 2;
      const φ = Math.acos(2 * Math.random() - 1);
      const r = 1.55 + Math.random() * 0.5;
      arr[i * 3] = r * Math.sin(φ) * Math.cos(θ);
      arr[i * 3 + 1] = r * Math.sin(φ) * Math.sin(θ);
      arr[i * 3 + 2] = r * Math.cos(φ);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.007;
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.004) * 0.05;
    }
  });

  return (
    <points ref={meshRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#C0E4FF"
        size={0.012}
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

interface EuropaSceneProps {
  isDraggingRef: React.MutableRefObject<boolean>;
  controllerRef: React.MutableRefObject<OrbitControllerHandle | null>;
  onHotspotClick: (info: HotspotInfo) => void;
}

function EuropaScene({ isDraggingRef, controllerRef, onHotspotClick }: EuropaSceneProps) {
  const planetGroupRef = useRef<THREE.Group>(null);
  const europaConfig = useMemo(
    () => ({ ...PLANET_CONFIGS.europa, rotationSpeed: 0 }),
    []
  );

  return (
    <>
      <StarField count={2400} radius={80} speed={0.006} size={1.2} color="#C0D8FF" />

      <directionalLight position={[7, 2, 4]} intensity={0.9} color="#C8D8FF" />
      <pointLight position={[-8, 0, -4]} intensity={0.3} color="#4060FF" />
      <ambientLight intensity={0.06} />

      <group ref={planetGroupRef}>
        <PlanetMesh config={europaConfig} sunDirection={[7, 2, 4]} />
        <OceanGlow />
        {EUROPA_HOTSPOTS.map((h) => (
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

      <IceParticles />

      <OrbitCameraController
        planetGroupRef={planetGroupRef}
        isDraggingRef={isDraggingRef}
        controllerRef={controllerRef}
        orbitDistance={5.5}
        autoRotateSpeed={0.04}
      />

      <EffectComposer>
        <Bloom
          kernelSize={KernelSize.MEDIUM}
          intensity={0.9}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  );
}

export function EuropaExplorer() {
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
        camera={{ position: [0, 0, 5.5], fov: 55, near: 0.1, far: 500 }}
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        style={{ background: "radial-gradient(ellipse at 40% 50%, #020412 0%, #010208 100%)" }}
      >
        <EuropaScene
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
