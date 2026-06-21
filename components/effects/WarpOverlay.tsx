"use client";

import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Warp Overlay
// Full-screen flash when the user scrolls into a new section.
//
// Architecture: the outer wrapper is ALWAYS MOUNTED with will-change: opacity.
// This gives it a permanent GPU compositor layer so it never needs to be
// added/removed from the layer stack — preventing the WebGL canvas underneath
// from flickering during compositor reordering (the prior AnimatePresence on
// the outer div was the root cause of the blinking background bug).
// ─────────────────────────────────────────────────────────────────────────────

// 16 deterministic star-stretch rays, evenly spaced
const RAYS = Array.from({ length: 16 }, (_, i) => ({
  angle: i * 22.5,
  length: 28 + ((i * 17 + 11) % 42),
  delay: (i % 4) * 0.04,
}));

interface WarpOverlayProps {
  active: boolean;
  label?: string;
}

export function WarpOverlay({ active, label }: WarpOverlayProps) {
  return (
    // Outer wrapper is ALWAYS mounted — permanent compositor layer.
    // will-change: opacity keeps it as a dedicated GPU layer forever.
    // Visibility controlled by CSS only (no mount/unmount = no layer reorder).
    <div
      className="fixed inset-0 z-[200] pointer-events-none overflow-hidden flex items-center justify-center"
      style={{ willChange: "opacity" }}
      aria-hidden
    >
      <AnimatePresence>
        {active && (
          <motion.div
            key="warp-content"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 0] }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 1.05, ease: [0.19, 1, 0.22, 1], times: [0, 0.12, 0.7, 1] }}
          >
            {/* Central blue-white flash */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.18, 0] }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              style={{
                background:
                  "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(200,224,255,0.22) 0%, rgba(168,200,255,0.08) 50%, transparent 80%)",
              }}
            />

            {/* Star-stretch rays radiating from center */}
            {RAYS.map((ray, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 origin-left"
                style={{
                  rotate: ray.angle,
                  translateX: 0,
                  translateY: "-50%",
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: [0, 1, 0], opacity: [0, 0.55, 0] }}
                transition={{
                  duration: 0.85,
                  ease: [0.19, 1, 0.22, 1],
                  delay: ray.delay,
                  times: [0, 0.35, 1],
                }}
              >
                <div
                  style={{
                    width: `${ray.length}vw`,
                    height: "1px",
                    background:
                      "linear-gradient(to right, rgba(168,200,255,0.7), rgba(201,168,255,0.4), transparent)",
                    boxShadow: "0 0 4px 1px rgba(168,200,255,0.3)",
                  }}
                />
              </motion.div>
            ))}

            {/* Section label */}
            {label && (
              <motion.div
                className="relative font-display font-black uppercase tracking-[0.5em] select-none"
                style={{
                  fontSize: "clamp(1.2rem, 4vw, 3.5rem)",
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(168,200,255,0.28)",
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: [0, 1, 0], scale: [0.85, 1, 1.06] }}
                transition={{
                  duration: 0.95,
                  ease: [0.19, 1, 0.22, 1],
                  times: [0, 0.3, 1],
                  delay: 0.05,
                }}
              >
                {label}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
