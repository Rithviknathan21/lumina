"use client";

import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Scroll Progress Hook
// Returns normalized [0,1] progress + section index for space journey
// ─────────────────────────────────────────────────────────────────────────────

export interface ScrollProgress {
  /** Normalized scroll [0,1] */
  progress: number;
  /** Current section index */
  section: number;
  /** Pixel scroll position */
  scrollY: number;
  /** Velocity (px/frame) */
  velocity: number;
}

export function useScrollProgress(sectionCount = 10): ScrollProgress {
  const [state, setState] = useState<ScrollProgress>({
    progress: 0,
    section: 0,
    scrollY: 0,
    velocity: 0,
  });
  const prevScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      const section = Math.min(
        Math.floor(progress * sectionCount),
        sectionCount - 1
      );
      const velocity = scrollY - prevScrollY.current;
      prevScrollY.current = scrollY;

      setState({ progress, section, scrollY, velocity });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionCount]);

  return state;
}
