'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useMouse } from '@/hooks/use-mouse'
import { SCENE } from '@/lib/constants'

// ─── Types ───────────────────────────────────────────────────────────────────

interface CameraRigProps {
  /** Mouse parallax intensity (0 = disabled, 1 = full) */
  parallaxIntensity?: number
  /** Vertical range limit in radians */
  verticalRange?: number
  /** Horizontal range limit in radians */
  horizontalRange?: number
  /** Lerp factor for smooth movement */
  lerpFactor?: number
  /** Fixed camera position */
  position?: [number, number, number]
  /** Camera look-at target */
  target?: [number, number, number]
}

// ─── Camera Rig ──────────────────────────────────────────────────────────────

export function CameraRig({
  parallaxIntensity = 0.15,
  verticalRange = 0.08,
  horizontalRange = 0.12,
  lerpFactor = 0.04,
  position = SCENE.CAMERA_DEFAULT_POSITION as [number, number, number],
  target = SCENE.CAMERA_TARGET as [number, number, number],
}: CameraRigProps) {
  const { camera } = useThree()
  const { normalized } = useMouse()

  const targetPosition = useRef(new THREE.Vector3(...position))
  const currentPosition = useRef(new THREE.Vector3(...position))
  const targetLookAt = useRef(new THREE.Vector3(...target))
  const currentLookAt = useRef(new THREE.Vector3(...target))

  // Set initial camera state
  useEffect(() => {
    camera.position.set(...position)
    camera.lookAt(...target)
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = SCENE.FOV
      camera.near = SCENE.NEAR
      camera.far = SCENE.FAR
    }
    camera.updateProjectionMatrix()
  }, [camera, position, target])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05) // cap delta to avoid jumps
    const smooth = 1 - Math.pow(1 - lerpFactor, dt * 60)

    // Compute parallax offsets from mouse
    const offsetX = normalized.x * horizontalRange * parallaxIntensity
    const offsetY = -normalized.y * verticalRange * parallaxIntensity

    // Update target
    targetPosition.current.set(
      position[0] + offsetX,
      position[1] + offsetY,
      position[2]
    )

    targetLookAt.current.set(
      target[0] + offsetX * 0.5,
      target[1] + offsetY * 0.5,
      target[2]
    )

    // Lerp current toward target
    currentPosition.current.lerp(targetPosition.current, smooth)
    currentLookAt.current.lerp(targetLookAt.current, smooth)

    // Apply to camera
    camera.position.copy(currentPosition.current)
    camera.lookAt(currentLookAt.current)
  })

  return null
}

// ─── Cinematic Camera Shake ──────────────────────────────────────────────────

interface CameraShakeProps {
  intensity?: number
  speed?: number
  enabled?: boolean
}

export function CameraShake({
  intensity = 0.002,
  speed = 0.4,
  enabled = true,
}: CameraShakeProps) {
  const { camera } = useThree()
  const timeRef = useRef(0)
  const originRef = useRef(camera.position.clone())

  useFrame((_, delta) => {
    if (!enabled) return
    timeRef.current += delta * speed

    const t = timeRef.current
    const nx = (Math.sin(t * 1.3) + Math.sin(t * 2.1) * 0.4) * intensity
    const ny = (Math.cos(t * 0.9) + Math.cos(t * 1.7) * 0.3) * intensity

    camera.position.x = originRef.current.x + nx
    camera.position.y = originRef.current.y + ny
  })

  return null
}

// ─── Orbital Drift ────────────────────────────────────────────────────────────
// Slowly drifts the camera along a circular path — great for ambient loops.

interface OrbitalDriftProps {
  radius?: number
  speed?: number
  height?: number
}

export function OrbitalDrift({
  radius = 2,
  speed = 0.025,
  height = 0.5,
}: OrbitalDriftProps) {
  const { camera } = useThree()
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    timeRef.current += delta * speed
    const t = timeRef.current

    camera.position.x = Math.sin(t) * radius
    camera.position.z = Math.cos(t) * radius
    camera.position.y = Math.sin(t * 0.5) * height
    camera.lookAt(0, 0, 0)
  })

  return null
}
