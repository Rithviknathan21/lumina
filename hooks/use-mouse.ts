"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Vector2 } from "@/types";
import { mapRange } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Mouse / Pointer Tracking Hook
// ─────────────────────────────────────────────────────────────────────────────

interface MouseState {
  /** Raw pixel coords */
  position: Vector2;
  /** Normalized [-1, 1] for Three.js */
  normalized: Vector2;
  /** [0, 1] for UI */
  ratio: Vector2;
  /** Velocity in px/frame */
  velocity: Vector2;
  isHovering: boolean;
}

export function useMouse(): MouseState {
  const [state, setState] = useState<MouseState>({
    position: { x: 0, y: 0 },
    normalized: { x: 0, y: 0 },
    ratio: { x: 0.5, y: 0.5 },
    velocity: { x: 0, y: 0 },
    isHovering: false,
  });

  const prevPosition = useRef<Vector2>({ x: 0, y: 0 });

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    const point =
      "touches" in e
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : { x: e.clientX, y: e.clientY };

    const velocity = {
      x: point.x - prevPosition.current.x,
      y: point.y - prevPosition.current.y,
    };

    prevPosition.current = point;

    setState({
      position: point,
      normalized: {
        x: mapRange(point.x, 0, window.innerWidth, -1, 1),
        y: mapRange(point.y, 0, window.innerHeight, 1, -1),
      },
      ratio: {
        x: point.x / window.innerWidth,
        y: point.y / window.innerHeight,
      },
      velocity,
      isHovering: true,
    });
  }, []);

  const handleLeave = useCallback(() => {
    setState((prev) => ({ ...prev, isHovering: false, velocity: { x: 0, y: 0 } }));
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, [handleMove, handleLeave]);

  return state;
}
