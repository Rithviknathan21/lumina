"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Photorealistic Earth
// ─────────────────────────────────────────────────────────────────────────────

// Earth surface shader — procedural continents & oceans
const EARTH_VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const EARTH_FRAGMENT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPos;

  uniform float uTime;
  uniform vec3 uSunDirection;

  // Hash / noise functions
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Spherical UV to avoid polar distortion
    vec2 uv = vUv;

    // Generate land mass
    float landNoise = fbm(uv * 3.5 + vec2(1.3, 0.7));
    float detailNoise = fbm(uv * 9.0 + vec2(0.5, 1.2));
    float continents = smoothstep(0.45, 0.58, landNoise + detailNoise * 0.15);

    // Ocean color — deep teal-blue
    vec3 deepOcean = vec3(0.02, 0.06, 0.18);
    vec3 shallowOcean = vec3(0.05, 0.15, 0.35);
    float shallowFactor = smoothstep(0.40, 0.48, landNoise);
    vec3 ocean = mix(deepOcean, shallowOcean, shallowFactor);

    // Land color — greens, deserts, mountains
    float heightMap = fbm(uv * 6.0 + vec2(2.1, 3.4));
    vec3 lowland = vec3(0.08, 0.18, 0.06);      // forest green
    vec3 highland = vec3(0.22, 0.18, 0.12);      // brown
    vec3 desert = vec3(0.35, 0.28, 0.12);        // tan
    vec3 snow = vec3(0.85, 0.88, 0.92);          // polar ice
    float desertMix = fbm(uv * 4.0 + vec2(5.0, 1.0));

    vec3 land = mix(lowland, highland, smoothstep(0.4, 0.65, heightMap));
    land = mix(land, desert, smoothstep(0.5, 0.7, desertMix) * smoothstep(0.2, 0.4, abs(uv.y - 0.5)));

    // Polar ice caps
    float polar = smoothstep(0.38, 0.28, abs(uv.y - 0.5));
    land = mix(land, snow, polar * 0.9);
    ocean = mix(ocean, snow * 0.8, polar * 0.5);

    // Base color
    vec3 surfaceColor = mix(ocean, land, continents);

    // Specular on water
    vec3 lightDir = normalize(uSunDirection);
    float diff = max(dot(vNormal, lightDir), 0.0);
    vec3 viewDir = normalize(-vWorldPos);
    vec3 reflectDir = reflect(-lightDir, vNormal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 48.0);
    float oceanSpec = (1.0 - continents) * spec * 1.8;

    // City lights on night side (subtle)
    float nightSide = smoothstep(0.1, -0.2, diff);
    float cityLights = fbm(uv * 12.0 + vec2(3.0)) * continents * nightSide * 0.6;
    vec3 lightColor = vec3(1.0, 0.85, 0.5) * cityLights;

    // Diffuse lighting
    float ambientLight = 0.04;
    vec3 lit = surfaceColor * (ambientLight + diff * 0.96);

    // Specular + city lights
    lit += vec3(0.7, 0.85, 1.0) * oceanSpec;
    lit += lightColor;

    gl_FragColor = vec4(lit, 1.0);
  }
`;

// Atmosphere shader
const ATMO_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATMO_FRAGMENT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;

  uniform vec3 uSunDirection;
  uniform float uTime;

  void main() {
    vec3 lightDir = normalize(uSunDirection);

    // Fresnel — atmosphere visible at edges
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = 1.0 - max(dot(vNormal, viewDir), 0.0);
    fresnel = pow(fresnel, 3.5);

    // Atmosphere brighter on sun-side
    float sunDot = dot(vNormal, lightDir) * 0.5 + 0.5;
    float atmoIntensity = fresnel * sunDot;

    // Atmospheric scattering colors — Rayleigh
    vec3 dayAtmo = vec3(0.3, 0.55, 1.0);
    vec3 horizonAtmo = vec3(0.6, 0.75, 1.0);
    vec3 atmoColor = mix(dayAtmo, horizonAtmo, fresnel);

    // Night-side aurora tint
    float nightSide = smoothstep(0.0, -0.4, dot(vNormal, lightDir));
    atmoColor = mix(atmoColor, vec3(0.2, 0.4, 0.8), nightSide * 0.4);

    gl_FragColor = vec4(atmoColor, atmoIntensity * 0.8);
  }
`;

// Cloud layer shader
const CLOUD_VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CLOUD_FRAGMENT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;

  uniform float uTime;
  uniform vec3 uSunDirection;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    // Clouds drift over time
    vec2 cloudUv = vUv + vec2(uTime * 0.002, 0.0);
    float clouds = fbm(cloudUv * 4.0);
    float cloudMask = smoothstep(0.5, 0.7, clouds);

    if (cloudMask < 0.01) discard;

    // Lighting
    float diff = max(dot(vNormal, normalize(uSunDirection)), 0.0) * 0.7 + 0.3;
    vec3 cloudColor = vec3(0.9, 0.93, 1.0) * diff;

    gl_FragColor = vec4(cloudColor, cloudMask * 0.7);
  }
`;

// ─── Component ───────────────────────────────────────────────────────────────

interface Earth3DProps {
  position?: [number, number, number];
  radius?: number;
  rotationSpeed?: number;
  sunDirection?: [number, number, number];
}

export function Earth3D({
  position = [3.5, -0.5, -6],
  radius = 2.2,
  rotationSpeed = 0.04,
  sunDirection = [5, 2, 3],
}: Earth3DProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmoRef = useRef<THREE.Mesh>(null);

  const sunDir = useMemo(() => new THREE.Vector3(...sunDirection).normalize(), [sunDirection]);

  const earthUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSunDirection: { value: sunDir },
  }), [sunDir]);

  const cloudUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSunDirection: { value: sunDir },
  }), [sunDir]);

  const atmoUniforms = useMemo(() => ({
    uSunDirection: { value: sunDir },
    uTime: { value: 0 },
  }), [sunDir]);

  const earthGeo = useMemo(() => new THREE.SphereGeometry(radius, 128, 64), [radius]);
  const cloudGeo = useMemo(() => new THREE.SphereGeometry(radius * 1.008, 64, 32), [radius]);
  const atmoGeo = useMemo(() => new THREE.SphereGeometry(radius * 1.06, 64, 32), [radius]);

  const earthMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: EARTH_VERTEX,
    fragmentShader: EARTH_FRAGMENT,
    uniforms: earthUniforms,
  }), [earthUniforms]);

  const cloudMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: CLOUD_VERTEX,
    fragmentShader: CLOUD_FRAGMENT,
    uniforms: cloudUniforms,
    transparent: true,
    depthWrite: false,
  }), [cloudUniforms]);

  const atmoMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: ATMO_VERTEX,
    fragmentShader: ATMO_FRAGMENT,
    uniforms: atmoUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  }), [atmoUniforms]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    earthUniforms.uTime.value = t;
    cloudUniforms.uTime.value = t;
    atmoUniforms.uTime.value = t;

    if (earthRef.current) {
      earthRef.current.rotation.y = t * rotationSpeed;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = t * rotationSpeed * 1.08; // clouds rotate slightly faster
    }
  });

  return (
    <group position={position}>
      {/* Earth surface */}
      <mesh ref={earthRef} geometry={earthGeo} material={earthMat} />

      {/* Cloud layer */}
      <mesh ref={cloudsRef} geometry={cloudGeo} material={cloudMat} />

      {/* Atmosphere (backside for glow) */}
      <mesh ref={atmoRef} geometry={atmoGeo} material={atmoMat} />

      {/* Atmosphere front glow */}
      <mesh geometry={atmoGeo}>
        <shaderMaterial
          vertexShader={ATMO_VERTEX}
          fragmentShader={ATMO_FRAGMENT}
          uniforms={atmoUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  );
}
