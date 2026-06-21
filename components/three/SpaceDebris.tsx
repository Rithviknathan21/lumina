'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Shaders ─────────────────────────────────────────────────────────────────

const DEBRIS_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  attribute vec3 aVelocity;

  varying float vAlpha;
  varying vec3 vColor;

  uniform float uTime;

  void main() {
    // Gentle oscillation — never teleports, never fades in/out
    float t = uTime * 0.22 + aSeed * 6.2832;
    vec3 pos = position;
    pos.x += sin(t)           * aVelocity.x * 5.0;
    pos.y += cos(t * 0.71)    * aVelocity.y * 3.5;
    pos.z += sin(t * 0.53)    * aVelocity.z * 5.0;

    // Constant, seed-driven alpha — no pulsing, no blink
    vAlpha = 0.16 + aSeed * 0.20;

    vColor = mix(vec3(0.6, 0.76, 1.0), vec3(1.0, 0.85, 0.6), aSeed);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (180.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const DEBRIS_FRAGMENT = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    // Circular point sprite
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    if (r > 0.5) discard;

    float alpha = (0.5 - r) * 2.0 * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`

// ─── Component ───────────────────────────────────────────────────────────────

interface SpaceDebrisProps {
  count?: number
  spread?: number
}

export function SpaceDebris({ count = 200, spread = 50 }: SpaceDebrisProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const seeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Random sphere distribution
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const r = Math.random() * spread

      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      // Slow drift direction
      const vTheta = Math.random() * Math.PI * 2
      const speed = 0.2 + Math.random() * 0.5
      velocities[i * 3 + 0] = Math.cos(vTheta) * speed
      velocities[i * 3 + 1] = (Math.random() - 0.5) * speed * 0.3
      velocities[i * 3 + 2] = Math.sin(vTheta) * speed

      sizes[i] = 0.5 + Math.random() * 1.5
      seeds[i] = Math.random()
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

    const mat = new THREE.ShaderMaterial({
      vertexShader: DEBRIS_VERTEX,
      fragmentShader: DEBRIS_FRAGMENT,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry: geo, material: mat }
  }, [count, spread])

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}
