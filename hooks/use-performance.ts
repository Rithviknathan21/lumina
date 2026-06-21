"use client";

import { useState, useEffect, useCallback } from "react";
import type { GraphicsQuality } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Performance Monitor & Quality Manager
// ─────────────────────────────────────────────────────────────────────────────

export function usePerformance() {
  const [quality, setQualityState] = useState<GraphicsQuality>("high");

  // Load saved quality — runs only on client
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GRAPHICS_QUALITY) as GraphicsQuality | null;
    if (saved && ["low", "medium", "high", "ultra"].includes(saved)) {
      setQualityState(saved);
      return;
    }
    // Auto-detect
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency ?? 4;
    if (isMobile)        setQualityState("medium");
    else if (cores >= 8) setQualityState("high");
    else                 setQualityState("medium");
  }, []);

  const setQuality = useCallback((q: GraphicsQuality) => {
    setQualityState(q);
    localStorage.setItem(STORAGE_KEYS.GRAPHICS_QUALITY, q);
  }, []);

  return { quality, setQuality };
}
