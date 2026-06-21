"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { WarpOverlay } from "./WarpOverlay";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Warp Transition (section divider)
// Replaces the plain SectionDivider in page.tsx.
// On scroll-into-view: plays WarpOverlay flash + floating label.
// Includes ambient floating particles.
// ─────────────────────────────────────────────────────────────────────────────

// 12 deterministic ambient particles — no Math.random() to avoid hydration mismatch
const AMBIENT_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  x:    ((i * 41 + 17) % 100),        // 0-100%
  y:    ((i * 29 + 7)  % 100),        // 0-100%
  size: 1 + (i % 3),                   // 1, 2, or 3 px
  dur:  3.5 + (i % 5) * 0.8,          // 3.5 – 7.3s
  del:  (i % 6) * 0.35,               // 0 – 1.75s delay
  amp:  4 + (i % 4) * 2,              // float amplitude px
}));

interface WarpTransitionProps {
  /** Section name to flash as the user crosses this divider. */
  label?: string;
}

export function WarpTransition({ label }: WarpTransitionProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const inView = useInView(divRef, { once: true, margin: "0px 0px -20% 0px" });
  const [warpActive, setWarpActive] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    if (inView && !triggered.current) {
      triggered.current = true;
      setWarpActive(true);
      const t = setTimeout(() => setWarpActive(false), 1100);
      return () => clearTimeout(t);
    }
  }, [inView]);

  return (
    <>
      {/* The warp flash overlay (portal — renders at body level via fixed positioning) */}
      <WarpOverlay active={warpActive} label={label} />

      {/* Physical divider element — same visual as original SectionDivider */}
      <div
        ref={divRef}
        className="relative h-24 pointer-events-none overflow-hidden"
        aria-hidden
      >
        {/* Ambient floating particles */}
        {AMBIENT_PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top:  `${p.y}%`,
              width:  p.size,
              height: p.size,
              background: i % 3 === 0
                ? "rgba(168,200,255,0.55)"
                : i % 3 === 1
                  ? "rgba(201,168,255,0.45)"
                  : "rgba(128,255,192,0.35)",
              boxShadow: `0 0 ${p.size * 3}px ${p.size}px ${
                i % 3 === 0
                  ? "rgba(168,200,255,0.3)"
                  : i % 3 === 1
                    ? "rgba(201,168,255,0.25)"
                    : "rgba(128,255,192,0.2)"
              }`,
            }}
            animate={{
              y: [-p.amp, p.amp, -p.amp],
              opacity: [0.15, 0.7, 0.15],
            }}
            transition={{
              duration: p.dur,
              delay:    p.del,
              repeat:   Infinity,
              ease:     "easeInOut",
            }}
          />
        ))}

        {/* Horizontal star-line */}
        <div
          className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, rgba(168,200,255,0.05) 20%, rgba(168,200,255,0.11) 50%, rgba(168,200,255,0.05) 80%, transparent 100%)",
          }}
        />

        {/* Center glow dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{
            background: "#A8C8FF",
            boxShadow:
              "0 0 12px rgba(168,200,255,0.8), 0 0 30px rgba(168,200,255,0.3)",
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Label echo (subtle, lingers after flash) */}
        {label && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[7px] uppercase tracking-[0.5em] pointer-events-none select-none whitespace-nowrap"
            style={{ color: "rgba(168,200,255,0.0)", marginTop: "18px" }}
            animate={
              inView
                ? {
                    color: ["rgba(168,200,255,0.0)", "rgba(168,200,255,0.22)", "rgba(168,200,255,0.0)"],
                  }
                : {}
            }
            transition={{ duration: 2.5, delay: 0.4, ease: "easeInOut" }}
          >
            {label}
          </motion.div>
        )}
      </div>
    </>
  );
}
