"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Lenis Smooth Scroll Hook
// ─────────────────────────────────────────────────────────────────────────────

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

interface UseLenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  infinite?: boolean;
  disabled?: boolean;
}

export function useLenis(options: UseLenisOptions = {}) {
  const rafRef = useRef<number>(0);
  const lenisRef = useRef<Lenis | null>(null);

  const {
    duration = 1.2,
    easing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier = 1,
    touchMultiplier = 2,
    infinite = false,
    disabled = false,
  } = options;

  useEffect(() => {
    if (disabled) return;

    const lenis = new Lenis({
      duration,
      easing,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier,
      touchMultiplier,
      infinite,
    });

    lenisRef.current = lenis;
    lenisInstance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
      lenisInstance = null;
    };
  }, [duration, easing, wheelMultiplier, touchMultiplier, infinite, disabled]);

  return lenisRef;
}

export function scrollTo(
  target: number | string | HTMLElement,
  options?: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
  }
) {
  if (!lenisInstance) return;
  lenisInstance.scrollTo(target, options);
}
