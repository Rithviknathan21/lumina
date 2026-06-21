"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SCENE } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — GPU Star Field
// ─────────────────────────────────────────────────────────────────────────────

interface StarFieldProps {
  count?: number;
  radius?: number;
  speed?: number;
  size?: number;
  sizeVariation?: number;
  color?: string;
  drift?: boolean;
}

const vertexShader = /* glsl */ `
  attribute float size;
  attribute float brightness;
  attribute vec3 aColor;

  varying float vBrightness;
  varying vec3 vColor;

  uniform float uTime;
  uniform float uSpeed;
  uniform float uDrift;

  void main() {
    vBrightness = brightness;
    vColor = aColor;

    vec3 pos = position;

    // Subtle parallax drift
    float drift = uDrift * brightness;
    pos.x += sin(uTime * uSpeed * 0.1 + position.z * 0.01) * drift;
    pos.y += cos(uTime * uSpeed * 0.08 + position.x * 0.01) * drift;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vBrightness;
  varying vec3 vColor;

  uniform float uTime;

  void main() {
    // Circular point
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;

    // Soft glow falloff
    float alpha = smoothstep(0.5, 0.0, dist);

    // Nearly invisible twinkle — no perceivable blink
    float twinkle = 1.0 + 0.04 * sin(uTime * 1.0 + vBrightness * 10.0);

    gl_FragColor = vec4(vColor * vBrightness * twinkle, alpha * vBrightness);
  }
`;

export function StarField({
  count = SCENE.STAR_FIELD_COUNT,
  radius = SCENE.STAR_FIELD_RADIUS,
  speed = 0.02,
  size = 1.5,
  sizeVariation = 2.0,
  color = "#A8C8FF",
  drift = true,
}: StarFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  const startColor = useMemo(() => new THREE.Color(color), [color]);

  const { positions, sizes, brightnesses, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const brightnesses = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    // Color palette for stars
    const starColors = [
      new THREE.Color("#E8F0FF"), // blue-white
      new THREE.Color("#C8DCFF"), // blue
      new THREE.Color("#A8C8FF"), // cool blue
      new THREE.Color("#FFE8C0"), // warm yellow
      new THREE.Color("#FFD0A0"), // orange
      new THREE.Color("#C9A8FF"), // violet
    ];

    for (let i = 0; i < count; i++) {
      // Distribute in a sphere using rejection sampling for uniform distribution
      let x, y, z;
      do {
        x = (Math.random() - 0.5) * 2;
        y = (Math.random() - 0.5) * 2;
        z = (Math.random() - 0.5) * 2;
      } while (x * x + y * y + z * z > 1);

      const r = radius * (0.3 + 0.7 * Math.random());
      positions[i * 3] = x * r;
      positions[i * 3 + 1] = y * r;
      positions[i * 3 + 2] = z * r;

      // Size: most small, some larger
      const rand = Math.random();
      sizes[i] = rand < 0.9
        ? size * (0.3 + Math.random() * 0.7)
        : size * sizeVariation * (0.8 + Math.random() * 0.6);

      // Brightness variation
      brightnesses[i] = 0.2 + Math.random() * 0.8;

      // Pick a color
      const starColor = rand < 0.7
        ? startColor
        : starColors[Math.floor(Math.random() * starColors.length)];

      colors[i * 3] = starColor.r;
      colors[i * 3 + 1] = starColor.g;
      colors[i * 3 + 2] = starColor.b;
    }

    return { positions, sizes, brightnesses, colors };
  }, [count, radius, size, sizeVariation, startColor]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uDrift: { value: drift ? 0.8 : 0 },
    }),
    [speed, drift]
  );

  const frameCount = useRef(0);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    uniforms.uTime.value = clock.elapsedTime;
    // Update rotation every other frame — imperceptible at 60fps, saves a JS tick
    if (++frameCount.current % 2 === 0) {
      meshRef.current.rotation.y = clock.elapsedTime * speed * 0.05;
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime * speed * 0.03) * 0.05;
    }
  });

  return (
    <points ref={meshRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-brightness" args={[brightnesses, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
