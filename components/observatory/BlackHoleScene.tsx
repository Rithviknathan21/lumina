"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Black Hole Scene
// Event horizon, accretion disk, photon ring, fake lensing rings,
// relativistic jets, orbiting particles. Inspired by Gargantua.
// ─────────────────────────────────────────────────────────────────────────────

// Accretion disk shader — hot gas gradient, additive
const DISK_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const DISK_FRAG = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  uniform float uTime;
  uniform float uSpeed;

  void main() {
    float r = length(vPos.xz);
    // Radial heat gradient: inner = white-yellow, mid = orange, outer = red → dark
    float t = clamp((r - 0.85) / 2.8, 0.0, 1.0);

    vec3 inner  = vec3(1.0, 0.95, 0.75);   // near-white
    vec3 mid    = vec3(1.0, 0.55, 0.10);   // orange
    vec3 outer  = vec3(0.5, 0.08, 0.12);   // dark red

    vec3 col = mix(inner, mid, smoothstep(0.0, 0.45, t));
    col = mix(col, outer, smoothstep(0.45, 1.0, t));

    // Turbulence
    float angle = atan(vPos.z, vPos.x);
    float turbulence = sin(angle * 8.0 + uTime * uSpeed * 2.5) * 0.08
                     + sin(r * 4.0 - uTime * uSpeed * 1.8) * 0.06;
    col *= 1.0 + turbulence;

    // Opacity: fade at outer edge
    float opacity = smoothstep(1.0, 0.0, t) * (1.0 - t * 0.5) * 0.9;
    opacity += (1.0 - t) * 0.15; // glow boost

    gl_FragColor = vec4(col, opacity);
  }
`;

function AccretionDisk({ speed }: { speed: number }) {
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const diskRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const uTime = useRef(0);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uSpeed: { value: 1 } }),
    []
  );

  useFrame((_, delta) => {
    uTime.current += delta * speedRef.current;
    uniforms.uTime.value = uTime.current;
    uniforms.uSpeed.value = speedRef.current;

    if (diskRef.current) diskRef.current.rotation.y += 0.18 * delta * speedRef.current;
    if (innerRef.current) innerRef.current.rotation.y += 0.32 * delta * speedRef.current;
  });

  return (
    <>
      {/* Outer disk */}
      <mesh ref={diskRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 3.6, 128, 4]} />
        <shaderMaterial
          vertexShader={DISK_VERT}
          fragmentShader={DISK_FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner hot ring — brighter, faster */}
      <mesh ref={innerRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.82, 1.15, 128, 2]} />
        <meshBasicMaterial
          color="#FFF0C0"
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

// Photon ring — thin bright ring of bent light
function PhotonRing() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <ringGeometry args={[0.78, 0.84, 128]} />
        <meshBasicMaterial
          color="#E8F4FF"
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Ghost lensing rings — fake "bent" image of accretion disk
function LensingRings() {
  const configs = [
    { tilt: 0.28, radius: 1.65, color: "#FF7020", opacity: 0.18 },
    { tilt: -0.22, radius: 2.10, color: "#FF5010", opacity: 0.10 },
    { tilt: 0.35, radius: 1.42, color: "#FFD080", opacity: 0.14 },
  ];

  return (
    <>
      {configs.map((c, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + c.tilt, 0, 0]}>
          <ringGeometry args={[c.radius - 0.03, c.radius + 0.03, 80]} />
          <meshBasicMaterial
            color={c.color}
            transparent
            opacity={c.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}

// Relativistic jets — bright particle streams from poles
function Jets({ speed }: { speed: number }) {
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const topRef = useRef<THREE.Points>(null);
  const botRef = useRef<THREE.Points>(null);

  const { topPos, botPos } = useMemo(() => {
    const N = 160;
    const topPos = new Float32Array(N * 3);
    const botPos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const t = Math.random();
      const angle = Math.random() * Math.PI * 2;
      const scatter = (1 - t) * 0.08;
      topPos[i * 3]     = Math.cos(angle) * scatter;
      topPos[i * 3 + 1] = 0.5 + t * 4.5;
      topPos[i * 3 + 2] = Math.sin(angle) * scatter;
      botPos[i * 3]     = Math.cos(angle) * scatter;
      botPos[i * 3 + 1] = -(0.5 + t * 4.5);
      botPos[i * 3 + 2] = Math.sin(angle) * scatter;
    }
    return { topPos, botPos };
  }, []);

  const t = useRef(0);
  useFrame((_, delta) => {
    t.current += delta * speedRef.current;
    if (topRef.current) (topRef.current.material as THREE.PointsMaterial).opacity = 0.35 + Math.sin(t.current * 1.2) * 0.1;
    if (botRef.current) (botRef.current.material as THREE.PointsMaterial).opacity = 0.35 + Math.sin(t.current * 1.2 + 1) * 0.1;
  });

  return (
    <>
      <points ref={topRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[topPos, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#80C8FF" size={0.04} transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
      <points ref={botRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[botPos, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#80C8FF" size={0.04} transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
    </>
  );
}

// Orbiting particles — dust and gas swirling in at various distances
function OrbitingParticles({ speed }: { speed: number }) {
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const groupRef = useRef<THREE.Group>(null);
  const t = useRef(0);

  const positions = useMemo(() => {
    const N = 400;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 1.8 + Math.random() * 4.0;
      const angle = Math.random() * Math.PI * 2;
      arr[i * 3]     = r * Math.cos(angle);
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      arr[i * 3 + 2] = r * Math.sin(angle);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    t.current += delta * speedRef.current;
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.055 * delta * speedRef.current;
    }
  });

  return (
    <group ref={groupRef}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#FF8040" size={0.025} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
    </group>
  );
}

// Event horizon — pitch black sphere
function EventHorizon() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[0.75, 32, 24]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Outer corona / Schwarzschild glow */}
      <mesh>
        <sphereGeometry args={[0.90, 32, 24]} />
        <meshBasicMaterial
          color="#FF6020"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}

function BlackHoleSceneInner({ speed }: { speed: number }) {
  return (
    <>
      {/* Background stars */}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[(() => {
              const N = 1200;
              const arr = new Float32Array(N * 3);
              for (let i = 0; i < N; i++) {
                const φ = Math.random() * Math.PI * 2;
                const θ = Math.acos(2 * Math.random() - 1);
                const r = 50 + Math.random() * 50;
                arr[i * 3]     = r * Math.sin(θ) * Math.cos(φ);
                arr[i * 3 + 1] = r * Math.sin(θ) * Math.sin(φ);
                arr[i * 3 + 2] = r * Math.cos(θ);
              }
              return arr;
            })(), 3]}
          />
        </bufferGeometry>
        <pointsMaterial color="#A8C8FF" size={0.18} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>

      <EventHorizon />
      <PhotonRing />
      <LensingRings />
      <AccretionDisk speed={speed} />
      <Jets speed={speed} />
      <OrbitingParticles speed={speed} />

      {/* Warm glow from disk */}
      <pointLight color="#FF8020" intensity={1.5} distance={8} decay={2} position={[0, 0, 0]} />

      <EffectComposer>
        <Bloom
          kernelSize={KernelSize.LARGE}
          intensity={1.6}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.92}
        />
      </EffectComposer>
    </>
  );
}

export function BlackHoleScene({ speed = 1 }: { speed?: number }) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 3.5, 9], fov: 50, near: 0.1, far: 300 }}
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        style={{ background: "radial-gradient(ellipse at 50% 50%, #060208 0%, #010104 100%)" }}
      >
        <BlackHoleSceneInner speed={speed} />
      </Canvas>
    </div>
  );
}
