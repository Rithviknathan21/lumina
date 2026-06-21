// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Global Scroll Store
// Plain mutable object — no React state, no re-renders.
// Updated by the Lenis scroll callback and read every frame in useFrame().
// ─────────────────────────────────────────────────────────────────────────────

export const scrollStore = {
  /** Normalized scroll progress [0, 1] */
  progress: 0,
  /** Raw scrollY in pixels */
  scrollY: 0,
  /** Frame-to-frame delta of progress (positive = scrolling down) */
  velocity: 0,
};
