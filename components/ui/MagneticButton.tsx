"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Magnetic Button wrapper
// Wraps any element with a magnetic pull effect on hover.
// The content "attracts" toward the cursor within the bounding box.
// ─────────────────────────────────────────────────────────────────────────────

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  /** How strongly the element pulls toward the cursor (0–1, default 0.35) */
  strength?: number;
}

export function MagneticButton({
  children,
  className,
  strength = 0.35,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 180, damping: 14, mass: 0.08 });
  const y = useSpring(rawY, { stiffness: 180, damping: 14, mass: 0.08 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width * 0.5);
    const dy = e.clientY - (rect.top + rect.height * 0.5);
    rawX.set(dx * strength);
    rawY.set(dy * strength);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}
