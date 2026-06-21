"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Generic Planet Shader Mesh
// Handles Mars, Venus, Jupiter, Saturn (without rings), Neptune, Uranus
// ─────────────────────────────────────────────────────────────────────────────

const PLANET_VERT = /* glsl */`
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

const PLANET_FRAG = /* glsl */`
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

  float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p) {
    vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.0;a*=0.5;}return v;}

  void main() {
    vec2 animUv = vUv + vec2(uTime * 0.008, 0.0);

    // Atmospheric bands
    float band = sin(vUv.y * uBandFreq) * 0.5 + 0.5;
    float detail = fbm(animUv * 3.0) * uRoughness;
    float t = band + detail * 0.4;

    vec3 col = mix(uColor1, uColor2, smoothstep(0.2, 0.7, t));
    col = mix(col, uColor3, smoothstep(0.65, 1.0, t));

    // Lighting
    float diff = max(dot(vNormal, normalize(uSunDir)), 0.0);
    float ambient = 0.05;
    vec3 lit = col * (ambient + diff * 0.95);

    // Night limb darkening
    float limb = pow(1.0 - max(dot(vNormal, normalize(-vWorldPos)), 0.0), 2.0) * 0.15;
    lit -= limb;

    gl_FragColor = vec4(lit, 1.0);
  }
`;

const ATMO_FRAG = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  uniform vec3 uAtmoColor;
  uniform vec3 uSunDir;
  void main() {
    vec3 view = normalize(-vWorldPos);
    float fresnel = pow(1.0 - max(dot(vNormal, view), 0.0), 3.5);
    float sun = max(dot(vNormal, normalize(uSunDir)), 0.0) * 0.5 + 0.5;
    gl_FragColor = vec4(uAtmoColor, fresnel * sun * 0.7);
  }
`;

const ATMO_VERT = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export interface PlanetConfig {
  color1: string;
  color2: string;
  color3: string;
  atmoColor: string;
  bandFreq: number;
  roughness: number;
  radius: number;
  rotationSpeed: number;
  hasAtmo?: boolean;
}

export const PLANET_CONFIGS: Record<string, PlanetConfig> = {
  mars: {
    color1: "#C1440E", color2: "#8B2500", color3: "#E8603C",
    atmoColor: "#FF8060", bandFreq: 6, roughness: 0.9, radius: 1.5,
    rotationSpeed: 0.035, hasAtmo: true,
  },
  venus: {
    color1: "#E8C97D", color2: "#C4A44A", color3: "#F0D890",
    atmoColor: "#FFE066", bandFreq: 12, roughness: 0.5, radius: 1.8,
    rotationSpeed: 0.008, hasAtmo: true,
  },
  jupiter: {
    color1: "#C88B3A", color2: "#8B6340", color3: "#E8C49C",
    atmoColor: "#D4A06A", bandFreq: 18, roughness: 0.6, radius: 4.5,
    rotationSpeed: 0.12, hasAtmo: false,
  },
  saturn: {
    color1: "#C4A962", color2: "#9E8040", color3: "#E8D094",
    atmoColor: "#D4BC70", bandFreq: 14, roughness: 0.5, radius: 3.8,
    rotationSpeed: 0.1, hasAtmo: false,
  },
  uranus: {
    color1: "#7FC4C4", color2: "#5BA8A8", color3: "#A0D8D8",
    atmoColor: "#80CCCC", bandFreq: 6, roughness: 0.2, radius: 2.8,
    rotationSpeed: 0.06, hasAtmo: true,
  },
  neptune: {
    color1: "#2050D0", color2: "#1030A0", color3: "#4070E8",
    atmoColor: "#3060C8", bandFreq: 10, roughness: 0.7, radius: 2.5,
    rotationSpeed: 0.065, hasAtmo: true,
  },
  europa: {
    color1: "#D0D8EC", color2: "#6080A8", color3: "#EDF2FF",
    atmoColor: "#4880FF", bandFreq: 4, roughness: 0.12, radius: 1.4,
    rotationSpeed: 0.028, hasAtmo: true,
  },
  titan: {
    color1: "#C87828", color2: "#9A5018", color3: "#E09840",
    atmoColor: "#D07020", bandFreq: 7, roughness: 0.85, radius: 2.0,
    rotationSpeed: 0.022, hasAtmo: true,
  },
};

interface PlanetMeshProps {
  config: PlanetConfig;
  position?: [number, number, number];
  sunDirection?: [number, number, number];
}

export function PlanetMesh({
  config,
  position = [0, 0, 0],
  sunDirection = [5, 3, 2],
}: PlanetMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const sunDir = useMemo(() => new THREE.Vector3(...sunDirection).normalize(), [sunDirection]);

  const uniforms = useMemo(() => ({
    uColor1: { value: new THREE.Color(config.color1) },
    uColor2: { value: new THREE.Color(config.color2) },
    uColor3: { value: new THREE.Color(config.color3) },
    uSunDir: { value: sunDir },
    uTime: { value: 0 },
    uBandFreq: { value: config.bandFreq },
    uRoughness: { value: config.roughness },
  }), [config, sunDir]);

  const atmoUniforms = useMemo(() => ({
    uAtmoColor: { value: new THREE.Color(config.atmoColor) },
    uSunDir: { value: sunDir },
  }), [config.atmoColor, sunDir]);

  const geo = useMemo(() => new THREE.SphereGeometry(config.radius, 64, 32), [config.radius]);
  const atmoGeo = useMemo(() => new THREE.SphereGeometry(config.radius * 1.06, 32, 16), [config.radius]);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: PLANET_VERT,
    fragmentShader: PLANET_FRAG,
    uniforms,
  }), [uniforms]);

  const atmoMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: ATMO_VERT,
    fragmentShader: ATMO_FRAG,
    uniforms: atmoUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  }), [atmoUniforms]);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
    if (meshRef.current) meshRef.current.rotation.y = clock.elapsedTime * config.rotationSpeed;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} geometry={geo} material={mat} />
      {config.hasAtmo && <mesh geometry={atmoGeo} material={atmoMat} />}
    </group>
  );
}
