"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MOON_VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const MOON_FRAGMENT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  uniform vec3 uSunDirection;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p) {
    float v=0.0,a=0.5;
    for(int i=0;i<5;i++){v+=a*noise(p);p*=2.0;a*=0.5;}
    return v;
  }

  void main() {
    // Lunar surface — grey with subtle color variation
    float surface = fbm(vUv * 6.0);
    float craters = fbm(vUv * 14.0 + vec2(3.4, 1.2));

    vec3 lunarBase = vec3(0.30, 0.28, 0.26);
    vec3 lunarDark = vec3(0.10, 0.09, 0.09);
    vec3 lunarBright = vec3(0.55, 0.52, 0.48);

    vec3 moonColor = mix(lunarDark, lunarBase, surface);
    // Crater highlights
    float craterRim = smoothstep(0.6, 0.72, craters);
    moonColor = mix(moonColor, lunarBright, craterRim * 0.4);

    // Lighting
    vec3 lightDir = normalize(uSunDirection);
    float diff = max(dot(vNormal, lightDir), 0.0);
    float ambient = 0.03;

    vec3 lit = moonColor * (ambient + diff * 0.97);

    gl_FragColor = vec4(lit, 1.0);
  }
`;

interface Moon3DProps {
  earthPosition?: [number, number, number];
  orbitRadius?: number;
  orbitSpeed?: number;
  moonRadius?: number;
}

export function Moon3D({
  earthPosition = [3.5, -0.5, -6],
  orbitRadius = 3.8,
  orbitSpeed = 0.08,
  moonRadius = 0.58,
}: Moon3DProps) {
  const moonRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const sunDir = useMemo(() => new THREE.Vector3(5, 2, 3).normalize(), []);
  const uniforms = useMemo(() => ({ uSunDirection: { value: sunDir } }), [sunDir]);

  const geo = useMemo(() => new THREE.SphereGeometry(moonRadius, 64, 32), [moonRadius]);
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: MOON_VERTEX,
    fragmentShader: MOON_FRAGMENT,
    uniforms,
  }), [uniforms]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * orbitSpeed;
    if (groupRef.current) {
      groupRef.current.position.set(
        earthPosition[0] + Math.cos(t) * orbitRadius,
        earthPosition[1] + Math.sin(t * 0.3) * 0.6,
        earthPosition[2] + Math.sin(t) * orbitRadius
      );
    }
    if (moonRef.current) {
      moonRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={moonRef} geometry={geo} material={mat} />
    </group>
  );
}
