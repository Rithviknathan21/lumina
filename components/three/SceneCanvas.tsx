"use client";

import { useMemo, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  DepthOfField,
} from "@react-three/postprocessing";
import { KernelSize, BlendFunction } from "postprocessing";
import * as THREE from "three";
import { Vector2 } from "three";
import { Earth3D } from "./Earth3D";
import { Moon3D } from "./Moon3D";
import { PlanetMesh, PLANET_CONFIGS } from "./PlanetMesh";
import { SaturnRings } from "./SaturnRings";
import { StarField } from "./StarField";
import { NebulaCloud } from "./NebulaCloud";
import { AsteroidBelt } from "./AsteroidBelt";
import { SpaceDebris } from "./SpaceDebris";
import { ScrollCameraController } from "./ScrollCameraController";
import { QUALITY_PRESETS, SCENE } from "@/lib/constants";
import type { GraphicsQuality } from "@/types";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Full Scene Canvas
// Solar system layout designed for the scroll camera flythrough:
//   Earth  @ [3.5, -0.5, -6]
//   Saturn @ [30,  0,    -22]
//   Jupiter @ [-20, 2,   -40]  (distant, visible in grand pullback)
// ─────────────────────────────────────────────────────────────────────────────

// Triggers gl.compile() after the scene is fully populated, forcing synchronous
// WebGL shader compilation before any visible frame. Without this, each shader
// program compiles on first use — StarField's simple shader finishes first,
// leaving NebulaCloud and Earth3D invisible for several frames (the "blink").
function SceneCompiler() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    gl.compile(scene, camera);
  }, [gl, scene, camera]);
  return null;
}

export interface SceneCanvasProps {
  quality?: GraphicsQuality;
  className?: string;
}

function Scene({ quality }: { quality: GraphicsQuality }) {
  const preset = QUALITY_PRESETS[quality];
  const isLow = quality === "low";
  const isUltra = quality === "ultra";
  const isHigh = quality === "high" || isUltra;

  // Scale particle counts by quality tier
  const nebulaBase = isLow ? 30 : isUltra ? 170 : isHigh ? 120 : 60;
  const debrisCount = isLow ? 35 : isUltra ? 140 : isHigh ? 100 : 60;

  return (
    <>
      {/* ── Scroll-driven cinematic camera ── */}
      <ScrollCameraController />

      {/* ── Lighting ── */}
      {/* Sun — warm directional */}
      <directionalLight position={[5, 2, 3]} intensity={3.0} color="#FFF5E0" />
      {/* Deep space cold ambient */}
      <ambientLight intensity={0.08} color="#2040A0" />
      {/* Violet nebula fill */}
      <pointLight position={[-25, 8, -40]} intensity={1.1} color="#7B5EA7" distance={300} />
      {/* Blue rim */}
      <pointLight position={[-8, -4, 10]} intensity={0.35} color="#2060FF" distance={90} />
      {/* Saturn-area warm light (positions camera toward it) */}
      <pointLight position={[30, 2, -22]} intensity={0.6} color="#F5A623" distance={80} />

      {/* ── Star Field ── */}
      <StarField
        count={preset.starCount}
        radius={SCENE.STAR_FIELD_RADIUS}
        speed={0.010}
        size={1.6}
        sizeVariation={2.6}
        drift
      />

      {/* ── Volumetric Nebulae — counts scale with quality ── */}
      <NebulaCloud
        position={[0, 0, -420]}
        count={nebulaBase}
        spread={200}
        color="#7B5EA7"
        secondaryColor="#A8C8FF"
        opacity={0.07}
        size={130}
        speed={0.018}
      />
      <NebulaCloud
        position={[180, 60, -330]}
        count={Math.floor(nebulaBase * 0.7)}
        spread={150}
        color="#182870"
        secondaryColor="#4878FF"
        opacity={0.05}
        size={110}
        speed={0.015}
      />
      {!isLow && (
        <NebulaCloud
          position={[-150, -40, -370]}
          count={Math.floor(nebulaBase * 0.55)}
          spread={120}
          color="#5B2A87"
          secondaryColor="#C9A8FF"
          opacity={0.055}
          size={95}
          speed={0.025}
        />
      )}
      {isHigh && (
        <NebulaCloud
          position={[32, -5, -60]}
          count={Math.floor(nebulaBase * 0.4)}
          spread={80}
          color="#8B5E00"
          secondaryColor="#F5A623"
          opacity={0.035}
          size={70}
          speed={0.012}
        />
      )}

      {/* ── Earth & Moon ── */}
      <Earth3D
        position={[3.5, -0.5, -6]}
        radius={2.2}
        rotationSpeed={0.035}
        sunDirection={[5, 2, 3]}
      />
      <Moon3D
        earthPosition={[3.5, -0.5, -6]}
        orbitRadius={3.8}
        orbitSpeed={0.07}
        moonRadius={0.58}
      />

      {/* ── Saturn — scroll camera flies toward this ── */}
      <group position={[30, 0, -22]}>
        <PlanetMesh
          config={PLANET_CONFIGS.saturn}
          sunDirection={[5, 2, 3]}
        />
        <SaturnRings
          innerRadius={4.4}
          outerRadius={8.8}
          tilt={Math.PI * 0.22}
        />
      </group>

      {/* ── Jupiter — distant, visible in grand pullback ── */}
      <PlanetMesh
        config={PLANET_CONFIGS.jupiter}
        position={[-20, 2, -40]}
        sunDirection={[5, 2, 3]}
      />

      {/* ── Asteroid Belt ── */}
      {!isLow && (
        <AsteroidBelt
          count={isUltra ? 350 : isHigh ? 180 : 80}
          innerRadius={20}
          outerRadius={38}
          height={4}
          rotationSpeed={0.004}
        />
      )}

      {/* ── Foreground Space Debris ── */}
      <SpaceDebris count={debrisCount} spread={60} />

      {/* ── Post-Processing — 3 tiers ── */}
      {isUltra ? (
        <EffectComposer>
          <Bloom
            intensity={preset.bloomStrength}
            kernelSize={KernelSize.LARGE}
            luminanceThreshold={0.55}
            luminanceSmoothing={0.85}
            mipmapBlur
          />
          <DepthOfField
            focusDistance={0.01}
            focalLength={0.025}
            bokehScale={2}
            height={320}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new Vector2(0.0004, 0.0004)}
          />
          <Vignette offset={0.30} darkness={0.75} eskil={false} />
        </EffectComposer>
      ) : isHigh ? (
        <EffectComposer>
          <Bloom
            intensity={preset.bloomStrength}
            kernelSize={KernelSize.LARGE}
            luminanceThreshold={0.50}
            luminanceSmoothing={0.82}
            mipmapBlur
          />
          <Vignette offset={0.32} darkness={0.78} eskil={false} />
        </EffectComposer>
      ) : (
        <EffectComposer>
          <Bloom
            intensity={preset.bloomStrength}
            kernelSize={KernelSize.SMALL}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
            mipmapBlur={false}
          />
          <Vignette offset={0.25} darkness={0.65} eskil={false} />
        </EffectComposer>
      )}

      <SceneCompiler />
    </>
  );
}

export function SceneCanvas({
  quality = "high",
  className,
}: SceneCanvasProps) {
  const preset = QUALITY_PRESETS[quality];

  const dpr = useMemo((): [number, number] => {
    const deviceDpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
    const max = Math.min(preset.pixelRatio, deviceDpr, 1.5);
    return [1, max];
  }, [preset.pixelRatio]);

  // Stable references — R3F only reads camera/gl at Canvas creation, but
  // memoizing prevents new object identities on every SceneCanvas render.
  const cameraConfig = useMemo(() => ({
    position: [0, 1.5, 9] as [number, number, number],
    fov: SCENE.FOV,
    near: SCENE.NEAR,
    far: SCENE.FAR,
  }), []);

  const glConfig = useMemo(() => ({
    antialias: preset.antialias,
    alpha: false,
    powerPreference: "high-performance" as const,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.08,
  }), [preset.antialias]);

  return (
    <div
      id="lumina-canvas-wrapper"
      className={cn("fixed inset-0 z-0", className)}
      // Permanent GPU compositor layer — prevents flicker when overlaying
      // elements (WarpOverlay, CursorTrail) trigger compositor reordering.
      style={{ willChange: "transform" }}
      aria-hidden
    >
      <Canvas
        frameloop="always"
        dpr={dpr}
        camera={cameraConfig}
        gl={glConfig}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(SCENE.BACKGROUND));
        }}
      >
        <Scene quality={quality} />
      </Canvas>
    </div>
  );
}
