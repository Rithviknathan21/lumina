"use client";

import { useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { X, ChevronRight } from "lucide-react";
import { PLANET_CONFIGS, PlanetMesh } from "@/components/three/PlanetMesh";
import { SaturnRings } from "@/components/three/SaturnRings";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Planet Experience
// Full-screen interactive planet exploration overlay.
// Supports Mars, Europa, Titan with planet-specific scenes.
// ─────────────────────────────────────────────────────────────────────────────

// ── Background star field ─────────────────────────────────────────────────────

function ExperienceStars() {
  const meshRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 300 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  const mat = useMemo(() => new THREE.PointsMaterial({
    color: "#C8DCFF",
    size: 0.9,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  }), []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return <points ref={meshRef} geometry={geo} material={mat} frustumCulled={false} />;
}

// ── Moon orbit ────────────────────────────────────────────────────────────────

interface OrbitingMoonProps {
  orbitRadius: number;
  orbitSpeed: number;
  moonRadius: number;
  color: string;
  tilt?: number;
  startAngle?: number;
}

function OrbitingMoon({ orbitRadius, orbitSpeed, moonRadius, color, tilt = 0, startAngle = 0 }: OrbitingMoonProps) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += orbitSpeed * delta;
  });
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.05 }), [color]);
  const geo = useMemo(() => new THREE.SphereGeometry(moonRadius, 16, 10), [moonRadius]);
  return (
    <group rotation={[tilt, startAngle, 0]}>
      <group ref={ref}>
        <mesh position={[orbitRadius, 0, 0]} geometry={geo} material={mat} />
      </group>
    </group>
  );
}

// ── Orbit ring (visual guide) ─────────────────────────────────────────────────

function OrbitRing({ radius, color }: { radius: number; color: string }) {
  const geo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [radius]);
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.12 }), [color]);
  return <lineLoop geometry={geo} material={mat} />;
}

// ── Camera fly-in ─────────────────────────────────────────────────────────────

function CameraFlyIn({ startZ, endZ }: { startZ: number; endZ: number }) {
  const { camera } = useThree();
  const t = useRef(0);
  useEffect(() => {
    camera.position.set(0, 0.8, startZ);
  }, [camera, startZ]);
  useFrame((_, delta) => {
    if (t.current < 1) {
      t.current = Math.min(t.current + delta * 0.55, 1);
      const ease = 1 - Math.pow(1 - t.current, 3);
      camera.position.z = startZ + (endZ - startZ) * ease;
      camera.position.y = 0.8 - 0.8 * ease;
    }
  });
  return null;
}

// ── Dust / particle haze ──────────────────────────────────────────────────────

function AtmosphereHaze({ color, count, spread, opacity }: { color: string; count: number; spread: number; opacity: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = spread * (0.5 + Math.random() * 0.7);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, [count, spread]);

  const mat = useMemo(() => new THREE.PointsMaterial({
    color,
    size: 0.08,
    sizeAttenuation: true,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [color, opacity]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += 0.03 * delta;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

// ── Distant background planet ─────────────────────────────────────────────────

function BackgroundPlanet({ planetKey, position }: { planetKey: string; position: [number, number, number] }) {
  const config = PLANET_CONFIGS[planetKey];
  if (!config) return null;
  return <PlanetMesh config={{ ...config, rotationSpeed: 0.008 }} position={position} sunDirection={[5, 3, 2]} />;
}

// ── Mars scene ────────────────────────────────────────────────────────────────

function MarsScene() {
  return (
    <>
      <ambientLight intensity={0.06} color="#2040A0" />
      <directionalLight position={[6, 3, 2]} intensity={3.0} color="#FFF5E0" />
      <pointLight position={[-4, 2, 4]} intensity={0.25} color="#FF6040" distance={20} />
      <ExperienceStars />
      <PlanetMesh config={PLANET_CONFIGS.mars} sunDirection={[6, 3, 2]} />
      <OrbitingMoon orbitRadius={3.0} orbitSpeed={2.2} moonRadius={0.12} color="#908070" tilt={0.05} startAngle={0} />
      <OrbitingMoon orbitRadius={4.8} orbitSpeed={0.7} moonRadius={0.07} color="#807868" tilt={-0.03} startAngle={1.6} />
      <OrbitRing radius={3.0} color="#FF8060" />
      <OrbitRing radius={4.8} color="#FF8060" />
      <AtmosphereHaze color="#FF6030" count={200} spread={2.8} opacity={0.18} />
    </>
  );
}

// ── Europa scene ──────────────────────────────────────────────────────────────

function EuropaScene() {
  return (
    <>
      <ambientLight intensity={0.06} color="#102040" />
      <directionalLight position={[8, 2, 3]} intensity={2.5} color="#FFF8F0" />
      <pointLight position={[0, 0, 0]} intensity={0.55} color="#3070FF" distance={5} />
      <pointLight position={[-8, 4, -12]} intensity={0.4} color="#4080FF" distance={30} />
      <ExperienceStars />
      <PlanetMesh config={PLANET_CONFIGS.europa} sunDirection={[8, 2, 3]} />
      <AtmosphereHaze color="#60A0FF" count={150} spread={2.2} opacity={0.12} />
      {/* Distant Jupiter */}
      <BackgroundPlanet planetKey="jupiter" position={[-18, 3, -30]} />
    </>
  );
}

// ── Titan scene ───────────────────────────────────────────────────────────────

function TitanScene() {
  return (
    <>
      <ambientLight intensity={0.05} color="#201008" />
      <directionalLight position={[7, 2, 2]} intensity={2.2} color="#FFE8C0" />
      <pointLight position={[0, 1, 2]} intensity={0.4} color="#E07020" distance={8} />
      <ExperienceStars />
      <PlanetMesh config={PLANET_CONFIGS.titan} sunDirection={[7, 2, 2]} />
      <AtmosphereHaze color="#E08030" count={300} spread={2.6} opacity={0.22} />
      {/* Distant Saturn with rings */}
      <group position={[22, 2, -35]} rotation={[0, -0.3, 0]}>
        <PlanetMesh config={{ ...PLANET_CONFIGS.saturn, rotationSpeed: 0.005 }} sunDirection={[7, 2, 2]} />
        <SaturnRings innerRadius={5.5} outerRadius={9.5} tilt={0.44} />
      </group>
    </>
  );
}

// ── Scene switcher ────────────────────────────────────────────────────────────

function PlanetScene({ planetKey }: { planetKey: string }) {
  if (planetKey === "mars") return <MarsScene />;
  if (planetKey === "europa") return <EuropaScene />;
  if (planetKey === "titan") return <TitanScene />;
  return null;
}

// ── Destination data ──────────────────────────────────────────────────────────

const PLANET_DATA: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  stats: { label: string; value: string }[];
}> = {
  mars: {
    title: "Mars",
    subtitle: "The Red Planet · Inner Solar System",
    description: "Rusty volcanic highlands, ancient river deltas, and the tallest mountain in the solar system. Mars preserves a 4-billion-year geological record — and whispers of ancient water.",
    accentColor: "#FF6040",
    stats: [
      { label: "Distance", value: "225M km" },
      { label: "Gravity", value: "3.72 m/s²" },
      { label: "Temperature", value: "−60 °C avg" },
      { label: "Day Length", value: "24h 37m" },
      { label: "Moons", value: "Phobos · Deimos" },
      { label: "Highlight", value: "Olympus Mons" },
    ],
  },
  europa: {
    title: "Europa",
    subtitle: "Galilean Moon · Jupiter System",
    description: "Beneath a 10-kilometre shell of fractured ice lies a liquid water ocean 100km deep — holding more water than all of Earth's oceans. The most promising harbour for extraterrestrial life.",
    accentColor: "#60AAFF",
    stats: [
      { label: "Distance", value: "628M km" },
      { label: "Gravity", value: "1.31 m/s²" },
      { label: "Temperature", value: "−160 °C" },
      { label: "Ocean Depth", value: "100+ km" },
      { label: "Host", value: "Jupiter" },
      { label: "Highlight", value: "Subsurface ocean" },
    ],
  },
  titan: {
    title: "Titan",
    subtitle: "Largest Moon · Saturn System",
    description: "An orange nitrogen haze denser than Earth's atmosphere shrouds methane seas and rivers of liquid hydrocarbons. The only world beyond Earth with stable surface liquids.",
    accentColor: "#E88030",
    stats: [
      { label: "Distance", value: "1.44B km" },
      { label: "Gravity", value: "1.35 m/s²" },
      { label: "Temperature", value: "−179 °C" },
      { label: "Atmosphere", value: "N₂ 98%" },
      { label: "Host", value: "Saturn" },
      { label: "Highlight", value: "Methane seas" },
    ],
  },
};

// ── Experience overlay ────────────────────────────────────────────────────────

interface PlanetExperienceProps {
  planetKey: string | null;
  onClose: () => void;
}

export function PlanetExperience({ planetKey, onClose }: PlanetExperienceProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const data = planetKey ? PLANET_DATA[planetKey] : null;

  return (
    <AnimatePresence>
      {planetKey && data && (
        <motion.div
          key={planetKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[500] flex"
          style={{ background: "rgba(1,2,6,0.97)" }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          {/* ── Canvas — full screen ───────────────────────────────── */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          >
            <Canvas
              dpr={[1, 1.5]}
              camera={{ position: [0, 0.8, 18], fov: 45, near: 0.1, far: 1000 }}
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: "high-performance",
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.1,
              }}
              onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x010206))}
            >
              <CameraFlyIn startZ={18} endZ={8} />
              <PlanetScene planetKey={planetKey} />
              <OrbitControls
                enablePan={false}
                minDistance={4}
                maxDistance={22}
                rotateSpeed={0.5}
                zoomSpeed={0.8}
                autoRotate
                autoRotateSpeed={0.25}
                enableDamping
                dampingFactor={0.06}
              />
            </Canvas>
          </motion.div>

          {/* ── Close button ──────────────────────────────────────── */}
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
            }}
            aria-label="Close"
          >
            <X size={18} className="text-white/70" />
          </motion.button>

          {/* ── Info panel — right side ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1], delay: 0.35 }}
            className="absolute top-0 right-0 bottom-0 w-80 z-10 flex flex-col justify-center pointer-events-none"
            style={{ padding: "3rem 2rem 3rem 1.5rem" }}
          >
            <div
              className="rounded-2xl p-7 h-auto pointer-events-auto"
              style={{
                background: "rgba(4,8,18,0.75)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(24px)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Planet name */}
              <div className="mb-6">
                <div
                  className="font-mono text-[9px] uppercase tracking-[0.35em] mb-2"
                  style={{ color: data.accentColor, opacity: 0.7 }}
                >
                  {data.subtitle}
                </div>
                <h2
                  className="font-display font-black text-4xl tracking-[-0.04em] text-white leading-none"
                >
                  {data.title}
                </h2>
              </div>

              {/* Description */}
              <p className="text-[0.8rem] leading-[1.75] text-white/40 mb-7">
                {data.description}
              </p>

              {/* Stats */}
              <div
                className="grid grid-cols-2 gap-3 mb-7"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem" }}
              >
                {data.stats.map(({ label, value }) => (
                  <div key={label}>
                    <div className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/25 mb-1">
                      {label}
                    </div>
                    <div className="font-mono text-[12px] font-bold text-white/70">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Interaction hint */}
              <div
                className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.2em] text-white/20"
              >
                <ChevronRight size={10} style={{ color: data.accentColor, opacity: 0.5 }} />
                Drag to rotate · Scroll to zoom
              </div>
            </div>
          </motion.div>

          {/* ── Planet name bottom-left ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="absolute bottom-10 left-10 z-10 pointer-events-none"
          >
            <div
              className="font-display font-black tracking-[-0.05em] leading-none"
              style={{
                fontSize: "clamp(3.5rem, 8vw, 7rem)",
                color: "transparent",
                WebkitTextStroke: `1px ${data.accentColor}30`,
              }}
            >
              {data.title.toUpperCase()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
