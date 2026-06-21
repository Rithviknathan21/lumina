"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLANET_CONFIGS } from "@/components/three/PlanetMesh";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Mini Planet Canvas
// Small Three.js canvas embedded in destination cards.
// Accepts an isHoveredRef so the card can speed up planet rotation on hover
// without any React state / re-renders.
// ─────────────────────────────────────────────────────────────────────────────

const VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uSunDir;
  uniform float uTime;
  uniform float uBandFreq;
  uniform float uRoughness;

  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.0;a*=0.5;}return v;}

  void main() {
    vec2 animUv = vUv + vec2(uTime * 0.006, 0.0);
    float band = sin(vUv.y * uBandFreq) * 0.5 + 0.5;
    float detail = fbm(animUv * 3.0) * uRoughness;
    float t = band + detail * 0.4;
    vec3 col = mix(uColor1, uColor2, smoothstep(0.2, 0.7, t));
    col = mix(col, uColor3, smoothstep(0.65, 1.0, t));
    float diff = max(dot(vNormal, normalize(uSunDir)), 0.0);
    vec3 lit = col * (0.06 + diff * 0.94);
    float limb = pow(1.0 - max(dot(vNormal, normalize(-vWorldPos)), 0.0), 2.0) * 0.14;
    lit -= limb;
    gl_FragColor = vec4(lit, 1.0);
  }
`;

const ATMO_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATMO_FRAG = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  uniform vec3 uAtmoColor;
  uniform vec3 uSunDir;
  void main() {
    vec3 view = normalize(-vWorldPos);
    float fresnel = pow(1.0 - max(dot(vNormal, view), 0.0), 3.5);
    float sun = max(dot(vNormal, normalize(uSunDir)), 0.0) * 0.5 + 0.5;
    gl_FragColor = vec4(uAtmoColor, fresnel * sun * 0.75);
  }
`;

const SUN_DIR = new THREE.Vector3(5, 3, 2).normalize();

// ── Inner planet mesh ─────────────────────────────────────────────────────────

function MiniPlanet({
  planetKey,
  isHoveredRef,
}: {
  planetKey: string;
  isHoveredRef?: React.MutableRefObject<boolean>;
}) {
  const config = PLANET_CONFIGS[planetKey];
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uColor1: { value: new THREE.Color(config.color1) },
      uColor2: { value: new THREE.Color(config.color2) },
      uColor3: { value: new THREE.Color(config.color3) },
      uSunDir: { value: SUN_DIR },
      uTime: { value: 0 },
      uBandFreq: { value: config.bandFreq },
      uRoughness: { value: config.roughness },
    }),
    [config]
  );

  const atmoUniforms = useMemo(
    () => ({
      uAtmoColor: { value: new THREE.Color(config.atmoColor) },
      uSunDir: { value: SUN_DIR },
    }),
    [config]
  );

  const geo = useMemo(
    () => new THREE.SphereGeometry(config.radius, 36, 18),
    [config.radius]
  );
  const atmoGeo = useMemo(
    () => new THREE.SphereGeometry(config.radius * 1.07, 20, 12),
    [config.radius]
  );

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
      }),
    [uniforms]
  );

  const atmoMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ATMO_VERT,
        fragmentShader: ATMO_FRAG,
        uniforms: atmoUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      }),
    [atmoUniforms]
  );

  useFrame(({ clock }, delta) => {
    uniforms.uTime.value = clock.elapsedTime;
    if (meshRef.current) {
      // Speed up smoothly on hover — read ref directly, no re-render
      const hovered = isHoveredRef?.current ?? false;
      const speed = hovered ? 0.55 : 0.18;
      meshRef.current.rotation.y += speed * delta;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geo} material={mat} />
      {config.hasAtmo && <mesh geometry={atmoGeo} material={atmoMat} />}
    </group>
  );
}

// ── Orbiting moon ─────────────────────────────────────────────────────────────

function MiniMoon({
  orbitRadius,
  orbitSpeed,
  size,
  color,
  tilt = 0,
}: {
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  color: string;
  tilt?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.92 }),
    [color]
  );
  const geo = useMemo(() => new THREE.SphereGeometry(size, 8, 6), [size]);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += orbitSpeed * delta;
  });
  return (
    <group rotation={[tilt, 0, 0]}>
      <group ref={ref}>
        <mesh position={[orbitRadius, 0, 0]} geometry={geo} material={mat} />
      </group>
    </group>
  );
}

// ── Exported canvas ───────────────────────────────────────────────────────────

interface MiniPlanetCanvasProps {
  planetKey: string;
  isHoveredRef?: React.MutableRefObject<boolean>;
}

export function MiniPlanetCanvas({ planetKey, isHoveredRef }: MiniPlanetCanvasProps) {
  if (!PLANET_CONFIGS[planetKey]) return null;

  return (
    <Canvas
      dpr={1}
      camera={{ position: [0, 0.4, 4.8], fov: 40 }}
      gl={{ antialias: false, alpha: true }}
    >
      <ambientLight intensity={0.07} color="#1030A0" />
      <directionalLight position={[5, 3, 2]} intensity={3.0} color="#FFF8E8" />

      {planetKey === "europa" && (
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#3060FF" distance={4} />
      )}
      {planetKey === "titan" && (
        <pointLight position={[0, 1, 1]} intensity={0.35} color="#E07020" distance={6} />
      )}

      <MiniPlanet planetKey={planetKey} isHoveredRef={isHoveredRef} />

      {planetKey === "mars" && (
        <>
          <MiniMoon orbitRadius={2.3} orbitSpeed={1.8} size={0.07} color="#908070" tilt={0.06} />
          <MiniMoon orbitRadius={3.4} orbitSpeed={0.55} size={0.04} color="#807868" tilt={-0.04} />
        </>
      )}
    </Canvas>
  );
}
