"use client";

import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — OrbitCameraController
// Rotates the PLANET GROUP (not camera) on drag, so hotspots co-rotate
// with the surface. Camera stays fixed with breathing + mouse parallax.
// Exposes flyTo / returnToOrbit imperatively via controllerRef.
// ─────────────────────────────────────────────────────────────────────────────

export interface OrbitControllerHandle {
  flyTo: (worldPos: THREE.Vector3) => void;
  returnToOrbit: () => void;
}

interface OrbitCameraControllerProps {
  planetGroupRef: React.RefObject<THREE.Group | null>;
  isDraggingRef: React.MutableRefObject<boolean>;
  controllerRef: React.MutableRefObject<OrbitControllerHandle | null>;
  orbitDistance?: number;
  autoRotateSpeed?: number;
}

export function OrbitCameraController({
  planetGroupRef,
  isDraggingRef,
  controllerRef,
  orbitDistance = 6.0,
  autoRotateSpeed = 0.04,
}: OrbitCameraControllerProps) {
  const { gl, camera } = useThree();

  // Camera state — all in refs to avoid re-renders
  const targetPos = useRef(new THREE.Vector3(0, 0, orbitDistance));
  const breathT = useRef(0);
  const mouseParallax = useRef(new THREE.Vector2(0, 0));
  const mouseTarget = useRef(new THREE.Vector2(0, 0));
  const inOrbit = useRef(true);

  // Drag state
  const pointerDown = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 }); // inertia
  const rotY = useRef(0);
  const rotX = useRef(0);

  // Set up imperative handle
  useEffect(() => {
    controllerRef.current = {
      flyTo: (worldPos: THREE.Vector3) => {
        inOrbit.current = false;
        const dir = worldPos.clone().normalize();
        // Move camera toward surface from planet center
        targetPos.current.copy(dir.multiplyScalar(orbitDistance * 0.68));
      },
      returnToOrbit: () => {
        inOrbit.current = true;
        targetPos.current.set(0, 0, orbitDistance);
      },
    };
  }, [controllerRef, orbitDistance]);

  // Pointer event handlers attached to canvas DOM element
  useEffect(() => {
    const el = gl.domElement;

    const onMove = (e: MouseEvent) => {
      // Update mouse parallax target
      const nx = (e.clientX / el.clientWidth) * 2 - 1;
      const ny = -((e.clientY / el.clientHeight) * 2 - 1);
      mouseTarget.current.set(nx * 0.28, ny * 0.18);

      if (!pointerDown.current) return;

      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };

      // Mark as dragging after 3px movement
      const totalDx = e.clientX - dragStart.current.x;
      const totalDy = e.clientY - dragStart.current.y;
      if (Math.hypot(totalDx, totalDy) > 3) {
        isDraggingRef.current = true;
      }

      velocity.current.x = dx * 0.0055;
      velocity.current.y = dy * 0.0028;
      rotY.current += dx * 0.0055;
      rotX.current += dy * 0.0028;
      // Clamp vertical rotation
      rotX.current = Math.max(-0.6, Math.min(0.6, rotX.current));

      if (planetGroupRef.current) {
        planetGroupRef.current.rotation.y = rotY.current;
        planetGroupRef.current.rotation.x = rotX.current;
      }
    };

    const onDown = (e: MouseEvent) => {
      pointerDown.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      dragStart.current = { x: e.clientX, y: e.clientY };
      velocity.current = { x: 0, y: 0 };
    };

    const onUp = () => {
      pointerDown.current = false;
      // Let R3F process the click event before clearing drag flag
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 0);
    };

    const onLeave = () => {
      pointerDown.current = false;
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mouseup", onUp);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [gl.domElement, isDraggingRef, planetGroupRef]);

  useFrame((_, delta) => {
    breathT.current += delta;

    // Apply inertia when not dragging
    if (!pointerDown.current) {
      if (inOrbit.current) {
        // Auto-rotate planet group
        rotY.current += autoRotateSpeed * delta;
      }
      // Dampen velocity
      velocity.current.x *= 0.88;
      velocity.current.y *= 0.88;
      rotY.current += velocity.current.x;
      rotX.current += velocity.current.y;
      rotX.current = Math.max(-0.6, Math.min(0.6, rotX.current));

      if (planetGroupRef.current) {
        planetGroupRef.current.rotation.y = rotY.current;
        planetGroupRef.current.rotation.x = rotX.current;
      }
    }

    // Smooth mouse parallax
    mouseParallax.current.lerp(mouseTarget.current, 0.06);

    // Breathing motion (subtle oscillation)
    const breathX = Math.sin(breathT.current * 0.38) * 0.03;
    const breathY = Math.sin(breathT.current * 0.22) * 0.015;

    // Smooth camera toward target
    camera.position.lerp(targetPos.current, 0.05);

    // Overlay breathing + parallax (additive, not replacing lerp)
    camera.position.x += breathX + mouseParallax.current.x;
    camera.position.y += breathY + mouseParallax.current.y;

    camera.lookAt(0, 0, 0);
  });

  return null;
}
