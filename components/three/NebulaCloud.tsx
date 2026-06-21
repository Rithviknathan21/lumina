"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Volumetric Nebula Cloud (sprite-based)
// ─────────────────────────────────────────────────────────────────────────────

interface NebulaCloudProps {
  position?: [number, number, number];
  count?: number;
  spread?: number;
  color?: string;
  secondaryColor?: string;
  opacity?: number;
  size?: number;
  speed?: number;
}

const nebulaVertex = /* glsl */ `
  attribute float aSize;
  attribute float aOpacity;
  attribute float aRotation;
  attribute vec3 aColor;

  varying float vOpacity;
  varying float vRotation;
  varying vec3 vColor;

  uniform float uTime;
  uniform float uSpeed;

  void main() {
    vOpacity = aOpacity;
    vRotation = aRotation + uTime * uSpeed * 0.05;
    vColor = aColor;

    vec3 pos = position;
    pos.x += sin(uTime * uSpeed * 0.3 + position.y * 0.1) * 0.5;
    pos.y += cos(uTime * uSpeed * 0.2 + position.x * 0.1) * 0.3;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (400.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const nebulaFragment = /* glsl */ `
  varying float vOpacity;
  varying float vRotation;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);

    // Rotate UV
    float s = sin(vRotation);
    float c = cos(vRotation);
    uv = mat2(c, -s, s, c) * uv;

    float dist = length(uv);
    if (dist > 0.5) discard;

    // Soft cloud-like falloff
    float alpha = smoothstep(0.5, 0.05, dist);
    alpha *= alpha; // Squared for softer edge

    gl_FragColor = vec4(vColor, alpha * vOpacity);
  }
`;

export function NebulaCloud({
  position = [0, 0, -200],
  count = 300,
  spread = 120,
  color = "#7B5EA7",
  secondaryColor = "#A8C8FF",
  opacity = 0.06,
  size = 80,
  speed = 0.05,
}: NebulaCloudProps) {
  const meshRef = useRef<THREE.Points>(null);
  const primaryColor = useMemo(() => new THREE.Color(color), [color]);
  const secColor = useMemo(() => new THREE.Color(secondaryColor), [secondaryColor]);

  const { positions, sizes, opacities, rotations, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const opacities = new Float32Array(count);
    const rotations = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Gaussian-like distribution
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.5) * spread;

      positions[i * 3] = Math.cos(angle1) * Math.cos(angle2) * r;
      positions[i * 3 + 1] = Math.sin(angle1) * r * 0.4; // Flatten Y
      positions[i * 3 + 2] = Math.cos(angle1) * Math.sin(angle2) * r;

      sizes[i] = size * (0.4 + Math.random() * 1.2);
      opacities[i] = opacity * (0.3 + Math.random() * 0.7);
      rotations[i] = Math.random() * Math.PI * 2;

      // Mix primary and secondary colors
      const mix = Math.random();
      const c = new THREE.Color().lerpColors(primaryColor, secColor, mix);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return { positions, sizes, opacities, rotations, colors };
  }, [count, spread, opacity, size, primaryColor, secColor]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: speed },
    }),
    [speed]
  );

  const frameCount = useRef(0);
  useFrame(({ clock }) => {
    // Nebula drifts very slowly — update uniform every 3rd frame, imperceptible
    if (++frameCount.current % 3 === 0) {
      uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <points ref={meshRef} position={position} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aOpacity" args={[opacities, 1]} />
        <bufferAttribute attach="attributes-aRotation" args={[rotations, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={nebulaVertex}
        fragmentShader={nebulaFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </points>
  );
}
