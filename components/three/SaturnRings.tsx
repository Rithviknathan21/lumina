"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Saturn Ring System
// ─────────────────────────────────────────────────────────────────────────────

const RING_VERT = /* glsl */`
  varying vec2 vUv;
  varying float vRadius;
  void main() {
    vUv = uv;
    vRadius = length(position.xz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const RING_FRAG = /* glsl */`
  varying vec2 vUv;
  varying float vRadius;
  uniform float uInner;
  uniform float uOuter;
  uniform float uTime;

  float hash(float p){ return fract(sin(p*127.1)*43758.5453); }
  float noise(float p){ float i=floor(p); float f=fract(p); return mix(hash(i),hash(i+1.0),f*f*(3.0-2.0*f)); }

  void main() {
    float t = (vRadius - uInner) / (uOuter - uInner);
    if(t < 0.0 || t > 1.0) discard;

    // Ring bands
    float band = noise(t * 28.0) * 0.5 + noise(t * 60.0) * 0.3 + noise(t * 120.0) * 0.2;
    float gap1 = smoothstep(0.45, 0.48, t) * smoothstep(0.52, 0.49, t); // Cassini division
    float alpha = band * (1.0 - gap1) * 0.75;

    vec3 col = mix(vec3(0.85,0.78,0.55), vec3(0.65,0.55,0.35), band);
    col = mix(col, vec3(0.95,0.90,0.70), noise(t * 200.0) * 0.2);

    // Edge fade
    alpha *= smoothstep(0.0, 0.05, t) * smoothstep(1.0, 0.95, t);

    gl_FragColor = vec4(col, alpha);
  }
`;

interface SaturnRingsProps {
  position?: [number, number, number];
  innerRadius?: number;
  outerRadius?: number;
  tilt?: number;
}

export function SaturnRings({
  position = [0, 0, 0],
  innerRadius = 5.5,
  outerRadius = 9.5,
  tilt = 0.46,
}: SaturnRingsProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geo = useMemo(() => {
    return new THREE.RingGeometry(innerRadius, outerRadius, 128, 8);
  }, [innerRadius, outerRadius]);

  const uniforms = useMemo(() => ({
    uInner: { value: innerRadius },
    uOuter: { value: outerRadius },
    uTime: { value: 0 },
  }), [innerRadius, outerRadius]);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: RING_VERT,
    fragmentShader: RING_FRAG,
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  }), [uniforms]);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
    if (meshRef.current) meshRef.current.rotation.z += 0.0001;
  });

  return (
    <group position={position} rotation={[tilt, 0, 0]}>
      <mesh ref={meshRef} geometry={geo} material={mat} />
    </group>
  );
}
