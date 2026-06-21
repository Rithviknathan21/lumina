'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Asteroid Belt (instanced)
// Uses THREE.InstancedMesh so each asteroid is a real separate draw instance.
// ─────────────────────────────────────────────────────────────────────────────

interface AsteroidBeltProps {
  count?: number
  innerRadius?: number
  outerRadius?: number
  height?: number
  rotationSpeed?: number
}

export function AsteroidBelt({
  count = 400,
  innerRadius = 18,
  outerRadius = 28,
  height = 2.5,
  rotationSpeed = 0.006,
}: AsteroidBeltProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const { geometry, material, initialMatrices } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.12, 0)
    const mat = new THREE.MeshStandardMaterial({
      color: '#403830',
      roughness: 0.9,
      metalness: 0.15,
    })

    const dummy = new THREE.Object3D()
    const matrices: THREE.Matrix4[] = []

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = innerRadius + Math.random() * (outerRadius - innerRadius)
      dummy.position.set(
        Math.cos(angle) * r,
        (Math.random() - 0.5) * height,
        Math.sin(angle) * r
      )
      dummy.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      )
      const s = 0.3 + Math.random() * 1.4
      dummy.scale.set(s, s * (0.7 + Math.random() * 0.6), s * (0.7 + Math.random() * 0.6))
      dummy.updateMatrix()
      matrices.push(dummy.matrix.clone())
    }

    return { geometry: geo, material: mat, initialMatrices: matrices }
  }, [count, innerRadius, outerRadius, height])

  // Apply initial matrices once mesh is mounted
  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    initialMatrices.forEach((m, i) => mesh.setMatrixAt(i, m))
    mesh.instanceMatrix.needsUpdate = true
  }, [initialMatrices])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed * Math.min(delta, 0.05)
    }
  })

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[geometry, material, count]} />
    </group>
  )
}
