"use client";

import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — useReducedMotion
// Returns true when the user has requested reduced motion (OS setting).
// Use to skip or simplify animations that could cause discomfort.
// Safe for SSR — defaults to false (no motion reduction) until hydration.
// ─────────────────────────────────────────────────────────────────────────────

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
