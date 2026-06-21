"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — PlanetHotspot
// A glowing 3D marker placed on the planet surface (inside the planet group
// so it co-rotates with the globe). Clicking triggers camera flyto.
// ─────────────────────────────────────────────────────────────────────────────

interface PlanetHotspotProps {
  /** Position in PLANET-GROUP local space (planet group handles rotation). */
  position: [number, number, number];
  label: string;
  accentColor: string;
  /** Shared ref — set true while mouse is dragging so clicks are ignored. */
  isDraggingRef: React.MutableRefObject<boolean>;
  /** Called with the hotspot's WORLD position at the moment of click. */
  onClick: (worldPos: THREE.Vector3) => void;
}

export function PlanetHotspot({
  position,
  label,
  accentColor,
  isDraggingRef,
  onClick,
}: PlanetHotspotProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const hoveredRef = useRef(false);
  const t = useRef(0);

  const coreMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: accentColor }),
    [accentColor]
  );
  const ringMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [accentColor]
  );
  const ring2Mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [accentColor]
  );
  const coreGeo = useMemo(() => new THREE.SphereGeometry(0.042, 8, 6), []);
  const ring1Geo = useMemo(() => new THREE.RingGeometry(0.07, 0.10, 28), []);
  const ring2Geo = useMemo(() => new THREE.RingGeometry(0.12, 0.15, 28), []);

  useFrame((state, delta) => {
    t.current += delta;
    const hov = hoveredRef.current;
    const s1 = 1 + Math.sin(t.current * 2.2) * 0.18 * (hov ? 1.5 : 1);
    const s2 = 1 + Math.sin(t.current * 2.2 + 1.4) * 0.28 * (hov ? 1.6 : 1);
    if (ring1Ref.current) ring1Ref.current.scale.setScalar(s1);
    if (ring2Ref.current) ring2Ref.current.scale.setScalar(s2);

    // Hide when on back side of planet (facing away from camera)
    if (groupRef.current) {
      const worldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPos);
      const surfaceNormal = worldPos.clone().normalize();
      const toCam = state.camera.position.clone().normalize();
      groupRef.current.visible = surfaceNormal.dot(toCam) > -0.05;
    }
  });

  const handleClick = (e: { stopPropagation?: () => void }) => {
    e.stopPropagation?.();
    if (isDraggingRef.current) return;
    if (!groupRef.current) return;
    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);
    onClick(worldPos);
  };

  const handleOver = (e: { stopPropagation?: () => void }) => {
    e.stopPropagation?.();
    hoveredRef.current = true;
    document.body.style.cursor = "pointer";
  };

  const handleOut = () => {
    hoveredRef.current = false;
    document.body.style.cursor = "default";
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
    >
      {/* Core sphere */}
      <mesh geometry={coreGeo} material={coreMat} />

      {/* Pulse ring 1 — equatorial plane */}
      <mesh
        ref={ring1Ref}
        rotation={[Math.PI / 2, 0, 0]}
        geometry={ring1Geo}
        material={ringMat}
      />

      {/* Pulse ring 2 — wider, slower */}
      <mesh
        ref={ring2Ref}
        rotation={[Math.PI / 2, 0, 0]}
        geometry={ring2Geo}
        material={ring2Mat}
      />

      {/* Point glow */}
      <pointLight color={accentColor} intensity={0.8} distance={0.7} decay={2} />

      {/* HTML label — always faces camera (drei Html is billboarded) */}
      <Html
        distanceFactor={7}
        position={[0, 0.2, 0]}
        center
        style={{ pointerEvents: "none" }}
      >
        <span
          style={{
            color: accentColor,
            fontSize: "7.5px",
            fontFamily: '"JetBrains Mono", monospace',
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            whiteSpace: "nowrap",
            textShadow: `0 0 10px ${accentColor}`,
            background: "rgba(2,4,10,0.55)",
            padding: "2px 6px",
            borderRadius: "3px",
            border: `1px solid ${accentColor}25`,
          }}
        >
          {label}
        </span>
      </Html>
    </group>
  );
}
