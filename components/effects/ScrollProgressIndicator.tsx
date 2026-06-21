"use client";

import { useScroll, useTransform, motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Scroll Progress Indicator
// Thin glowing line anchored to top-right corner, fills as user scrolls.
// ─────────────────────────────────────────────────────────────────────────────

export function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll();
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      className="fixed top-0 right-0 w-[2px] h-full z-50 pointer-events-none"
      aria-hidden
    >
      {/* Track */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(168,200,255,0.05)" }}
      />

      {/* Fill */}
      <motion.div
        className="absolute top-0 left-0 right-0 origin-top"
        style={{
          height,
          background:
            "linear-gradient(to bottom, rgba(168,200,255,0.0) 0%, #A8C8FF 30%, #C9A8FF 80%, rgba(201,168,255,0.4) 100%)",
        }}
      />

      {/* Travelling glow dot */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full -translate-x-px"
        style={{
          top: height,
          background: "#A8C8FF",
          boxShadow: "0 0 8px 3px rgba(168,200,255,0.7)",
          translateY: "-50%",
        }}
      />
    </div>
  );
}
