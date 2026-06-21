'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollStore } from '@/lib/scroll-store'

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Scroll Camera Controller
// Reads scrollStore.progress each frame and lerps the camera through a
// cinematic path across the solar system.
// ─────────────────────────────────────────────────────────────────────────────

// Reference positions (documentation — actual values inlined in KEYFRAMES below)
// Earth:  [3.5, -0.5, -6]   Saturn: [30, 0, -22]

// Keyframes: { at: [0–1], pos: camera position, tar: camera look-at target }
const KEYFRAMES: Array<{
  at: number
  pos: [number, number, number]
  tar: [number, number, number]
}> = [
  // Hero — Earth close-up from slightly above-left
  { at: 0.00, pos: [0, 1.5, 9],    tar: [3.5, -0.5, -6] },
  // Features — pull back, earth still dominant
  { at: 0.14, pos: [-1, 2, 13],   tar: [2, -0.3, -4]   },
  // Services — wider cosmic view, drift right
  { at: 0.27, pos: [4, 2.5, 17],  tar: [3, -0.5, -6]   },
  // Tech — begin moving toward Saturn
  { at: 0.40, pos: [10, 2, 15],   tar: [18, 1, -14]    },
  // Missions — Saturn approach, it fills the right frame
  { at: 0.52, pos: [18, 3, 10],   tar: [28, 0, -18]    },
  // Timeline — Saturn flyby, rings are dramatic
  { at: 0.64, pos: [28, 5, 2],    tar: [30, 0, -22]    },
  // Testimonials — grand pullback, see the whole system
  { at: 0.76, pos: [10, 12, 26],  tar: [4, -0.5, -6]   },
  // Contact — return toward Earth
  { at: 0.88, pos: [2, 2, 11],    tar: [3.5, -0.5, -6] },
  // Footer — majestic overview from altitude
  { at: 1.00, pos: [0, 18, 34],   tar: [2, -2, -10]    },
]

function lerpV3(
  out: THREE.Vector3,
  a: [number, number, number],
  b: [number, number, number],
  t: number
) {
  out.x = a[0] + (b[0] - a[0]) * t
  out.y = a[1] + (b[1] - a[1]) * t
  out.z = a[2] + (b[2] - a[2]) * t
}

// Cubic ease-in-out for intra-keyframe interpolation
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

export function ScrollCameraController() {
  const { camera } = useThree()
  const posTarget  = useRef(new THREE.Vector3(0, 1.5, 9))
  const tarTarget  = useRef(new THREE.Vector3(...KEYFRAMES[0].tar))
  const posCurrent = useRef(new THREE.Vector3(0, 1.5, 9))
  const tarCurrent = useRef(new THREE.Vector3(...KEYFRAMES[0].tar))

  const mouseRef       = useRef({ x: 0, y: 0 })
  const reducedMotion  = useRef(false)

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    // Respect OS-level reduced-motion preference — skip lerp, snap to keyframe
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.current = mq.matches
    const onMQ = (e: MediaQueryListEvent) => { reducedMotion.current = e.matches }
    mq.addEventListener('change', onMQ)

    return () => {
      window.removeEventListener('mousemove', onMouse)
      mq.removeEventListener('change', onMQ)
    }
  }, [])

  useFrame((_, delta) => {
    const p = scrollStore.progress
    const dt = Math.min(delta, 0.05)

    // Find the two keyframes surrounding current progress
    let kfA = KEYFRAMES[0]
    let kfB = KEYFRAMES[1]
    for (let i = 0; i < KEYFRAMES.length - 1; i++) {
      if (p >= KEYFRAMES[i].at && p <= KEYFRAMES[i + 1].at) {
        kfA = KEYFRAMES[i]
        kfB = KEYFRAMES[i + 1]
        break
      }
    }

    // Local t within this keyframe segment
    const range  = kfB.at - kfA.at
    const localT = range > 0 ? easeInOut((p - kfA.at) / range) : 0

    lerpV3(posTarget.current, kfA.pos, kfB.pos, localT)
    lerpV3(tarTarget.current, kfA.tar, kfB.tar, localT)

    if (reducedMotion.current) {
      // Snap directly — no cinematic inertia (motion-sickness safety)
      posCurrent.current.copy(posTarget.current)
      tarCurrent.current.copy(tarTarget.current)
    } else {
      const smooth = 1 - Math.pow(0.012, dt * 60)
      posCurrent.current.lerp(posTarget.current, smooth)
      tarCurrent.current.lerp(tarTarget.current, smooth)
    }

    // Suppress mouse parallax when reduced motion is active
    const px = reducedMotion.current ? 0 : mouseRef.current.x * 0.18
    const py = reducedMotion.current ? 0 : -mouseRef.current.y * 0.10

    camera.position.set(
      posCurrent.current.x + px,
      posCurrent.current.y + py,
      posCurrent.current.z
    )
    camera.lookAt(tarCurrent.current)
  })

  return null
}
