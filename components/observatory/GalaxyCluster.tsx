"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Galaxy Cluster Scene
// Spiral galaxy with 7500 stars, 2 arms, glowing core, bloom.
// ─────────────────────────────────────────────────────────────────────────────

const GALAXY_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aBrightness;
  attribute vec3  aColor;
  varying   float vBrightness;
  varying   vec3  vColor;
  uniform   float uTime;
  uniform   float uSpeed;

  void main() {
    vBrightness = aBrightness;
    vColor = aColor;

    // Subtle differential rotation (inner stars faster)
    float dist = length(position.xz);
    float drift = uTime * uSpeed * (0.12 / (dist + 0.5));
    float s = sin(drift);
    float c = cos(drift);
    vec3 pos = position;
    pos.x = position.x * c - position.z * s;
    pos.z = position.x * s + position.z * c;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (280.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const GALAXY_FRAG = /* glsl */ `
  varying float vBrightness;
  varying vec3  vColor;
  uniform float uTime;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * vBrightness;
    // Very subtle twinkle
    float twinkle = 1.0 + 0.03 * sin(uTime * 1.5 + vBrightness * 15.0);
    gl_FragColor = vec4(vColor * twinkle, alpha);
  }
`;

function GalaxyParticles({ speed }: { speed: number }) {
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const groupRef = useRef<THREE.Group>(null);
  const uTime = useRef(0);

  const { positions, colors, sizes, brightnesses } = useMemo(() => {
    const TOTAL = 7500;
    const ARM_COUNT = 7000; // spiral arms stars
    const CORE_COUNT = TOTAL - ARM_COUNT; // central bulge

    const positions = new Float32Array(TOTAL * 3);
    const colors = new Float32Array(TOTAL * 3);
    const sizes = new Float32Array(TOTAL);
    const brightnesses = new Float32Array(TOTAL);

    // Color palettes
    const BLUE_WHITE = new THREE.Color("#C8E4FF");
    const BLUE = new THREE.Color("#88BBFF");
    const ORANGE = new THREE.Color("#FFB060");
    const YELLOW = new THREE.Color("#FFE090");
    const RED_DWARF = new THREE.Color("#FF6040");
    const CORE_COLOR = new THREE.Color("#FFD0A0");

    let idx = 0;

    // Spiral arm stars
    for (let i = 0; i < ARM_COUNT; i++) {
      const arm = i % 2;
      const armOffset = arm * Math.PI;
      const t = Math.random();
      const spiralAngle = armOffset + t * Math.PI * 3.5;
      const r = 0.4 + t * 5.2;
      const scatter = (Math.random() - 0.5) * (0.6 + (1 - t) * 0.8);
      const scatterY = (Math.random() - 0.5) * 0.25 * (1 - t * 0.6);

      positions[idx * 3]     = r * Math.cos(spiralAngle) + scatter * Math.cos(spiralAngle + Math.PI / 2);
      positions[idx * 3 + 1] = scatterY;
      positions[idx * 3 + 2] = r * Math.sin(spiralAngle) + scatter * Math.sin(spiralAngle + Math.PI / 2);

      // Color: inner = warm (orange/yellow), outer = cool (blue/white), edge = red dwarfs
      let col: THREE.Color;
      if (t < 0.15) {
        col = CORE_COLOR.clone().lerp(ORANGE, Math.random());
      } else if (t < 0.55) {
        col = BLUE_WHITE.clone().lerp(BLUE, Math.random());
      } else if (t < 0.80) {
        col = BLUE.clone().lerp(YELLOW, Math.random() * 0.5);
      } else {
        col = RED_DWARF.clone().lerp(BLUE, Math.random());
      }
      colors[idx * 3]     = col.r;
      colors[idx * 3 + 1] = col.g;
      colors[idx * 3 + 2] = col.b;

      const isLarge = Math.random() < 0.08;
      sizes[idx] = isLarge ? 1.8 + Math.random() * 1.2 : 0.5 + Math.random() * 1.0;
      brightnesses[idx] = 0.4 + Math.random() * 0.6;
      idx++;
    }

    // Core bulge
    for (let i = 0; i < CORE_COUNT; i++) {
      const φ = Math.random() * Math.PI * 2;
      const θ = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 1.5) * 1.2;
      positions[idx * 3]     = r * Math.sin(θ) * Math.cos(φ);
      positions[idx * 3 + 1] = r * Math.sin(θ) * Math.sin(φ) * 0.4;
      positions[idx * 3 + 2] = r * Math.cos(θ);

      const mix = Math.random();
      const col = CORE_COLOR.clone().lerp(ORANGE, mix);
      colors[idx * 3]     = col.r;
      colors[idx * 3 + 1] = col.g;
      colors[idx * 3 + 2] = col.b;

      sizes[idx] = 0.8 + Math.random() * 1.4;
      brightnesses[idx] = 0.5 + Math.random() * 0.5;
      idx++;
    }

    return { positions, colors, sizes, brightnesses };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: 1 },
    }),
    []
  );

  useFrame((_, delta) => {
    uTime.current += delta * speedRef.current;
    uniforms.uTime.value = uTime.current;
    uniforms.uSpeed.value = speedRef.current;
    // Slow tilt of the whole galaxy
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.012 * delta * speedRef.current;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0]}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"    args={[positions,   3]} />
          <bufferAttribute attach="attributes-aColor"      args={[colors,       3]} />
          <bufferAttribute attach="attributes-aSize"       args={[sizes,        1]} />
          <bufferAttribute attach="attributes-aBrightness" args={[brightnesses, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={GALAXY_VERT}
          fragmentShader={GALAXY_FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors={false}
        />
      </points>

      {/* Core glow — warm point light */}
      <pointLight color="#FFD0A0" intensity={1.2} distance={4} decay={2} />
    </group>
  );
}

export function GalaxyCluster({ speed = 1 }: { speed?: number }) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 7, 16], fov: 55, near: 0.1, far: 300 }}
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        style={{ background: "radial-gradient(ellipse at 45% 40%, #070212 0%, #020108 100%)" }}
      >
        <GalaxyParticles speed={speed} />
        <ambientLight intensity={0.02} />
        <EffectComposer>
          <Bloom
            kernelSize={KernelSize.LARGE}
            intensity={1.1}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
