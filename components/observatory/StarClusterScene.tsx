"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Star Cluster Scene
// Dense globular cluster: ~12,000 stars, multicolour, twinkling, slow drift.
// ─────────────────────────────────────────────────────────────────────────────

const CLUSTER_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aBright;
  attribute vec3  aColor;
  attribute float aPhase;

  varying float vBright;
  varying vec3  vColor;

  uniform float uTime;
  uniform float uSpeed;

  void main() {
    vBright = aBright;
    vColor  = aColor;

    // Subtle individual star drift
    vec3 pos = position;
    float drift = sin(uTime * uSpeed * 0.2 + aPhase) * 0.012;
    pos += normalize(pos) * drift;

    // Twinkle — tiny size modulation
    float twinkle = 1.0 + 0.12 * sin(uTime * uSpeed * 2.0 + aPhase * 6.28);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * twinkle * (260.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;
  }
`;

const CLUSTER_FRAG = /* glsl */ `
  varying float vBright;
  varying vec3  vColor;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * vBright;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function ClusterParticles({ speed }: { speed: number }) {
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const groupRef = useRef<THREE.Group>(null);
  const uTime = useRef(0);

  const { positions, colors, sizes, brightnesses, phases } = useMemo(() => {
    const N = 11_000;

    const PALETTES = [
      new THREE.Color("#E8F2FF"), // blue-white main sequence
      new THREE.Color("#C4D8FF"), // blue
      new THREE.Color("#FFFFFF"), // white
      new THREE.Color("#FFE8C0"), // yellow-white subgiant
      new THREE.Color("#FFB070"), // orange giant
      new THREE.Color("#FF7050"), // red giant
      new THREE.Color("#FF5030"), // red supergiant (rare)
      new THREE.Color("#A0C8FF"), // cooler blue main sequence
    ];

    const positions   = new Float32Array(N * 3);
    const colors      = new Float32Array(N * 3);
    const sizes       = new Float32Array(N);
    const brightnesses= new Float32Array(N);
    const phases      = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      // King-profile-like: denser at center, falls off at edge
      const u = Math.random();
      const r = Math.pow(u, 0.4) * 6.0; // concentrated center
      const φ = Math.random() * Math.PI * 2;
      const θ = Math.acos(2 * Math.random() - 1);

      positions[i * 3]     = r * Math.sin(θ) * Math.cos(φ);
      positions[i * 3 + 1] = r * Math.sin(θ) * Math.sin(φ);
      positions[i * 3 + 2] = r * Math.cos(θ);

      // Color: mostly blue-white, some orange/red giants (rare)
      const roll = Math.random();
      let col: THREE.Color;
      if (roll < 0.45) col = PALETTES[0];
      else if (roll < 0.65) col = PALETTES[1];
      else if (roll < 0.75) col = PALETTES[2];
      else if (roll < 0.85) col = PALETTES[3];
      else if (roll < 0.92) col = PALETTES[4];
      else if (roll < 0.97) col = PALETTES[5];
      else col = PALETTES[6];

      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      // Giant stars are bigger but rarer
      const giant = roll > 0.90;
      sizes[i] = giant
        ? 1.2 + Math.random() * 1.8
        : 0.35 + Math.random() * 0.7;

      brightnesses[i] = giant
        ? 0.65 + Math.random() * 0.35
        : 0.2 + Math.random() * 0.6;

      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, colors, sizes, brightnesses, phases };
  }, []);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uSpeed: { value: 1 } }),
    []
  );

  useFrame((_, delta) => {
    uTime.current += delta * speedRef.current;
    uniforms.uTime.value = uTime.current;
    uniforms.uSpeed.value = speedRef.current;
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.018 * delta * speedRef.current;
      groupRef.current.rotation.x  = Math.sin(uTime.current * 0.04) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"    args={[positions,    3]} />
          <bufferAttribute attach="attributes-aColor"      args={[colors,        3]} />
          <bufferAttribute attach="attributes-aSize"       args={[sizes,         1]} />
          <bufferAttribute attach="attributes-aBright"     args={[brightnesses,  1]} />
          <bufferAttribute attach="attributes-aPhase"      args={[phases,        1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={CLUSTER_VERT}
          fragmentShader={CLUSTER_FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {/* Core glow */}
      <pointLight color="#C0D8FF" intensity={0.8} distance={3} decay={2} />
    </group>
  );
}

export function StarClusterScene({ speed = 1 }: { speed?: number }) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 4, 14], fov: 55, near: 0.1, far: 300 }}
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        style={{ background: "radial-gradient(ellipse at 50% 45%, #04080E 0%, #010204 100%)" }}
      >
        <ClusterParticles speed={speed} />
        <EffectComposer>
          <Bloom
            kernelSize={KernelSize.MEDIUM}
            intensity={0.9}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.88}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
