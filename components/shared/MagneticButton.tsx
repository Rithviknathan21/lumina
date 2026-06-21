"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Magnetic Button
// Spring-physics cursor attraction effect
// ─────────────────────────────────────────────────────────────────────────────

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  asAnchor?: boolean;
  "aria-label"?: string;
}

export function MagneticButton({
  children, className = "", strength = 0.35, disabled = false,
  onClick, href, asAnchor = false, "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const ix = useMotionValue(0); const iy = useMotionValue(0);

  const cfg = { stiffness: 200, damping: 18, mass: 0.6 };
  const sx = useSpring(x, cfg); const sy = useSpring(y, cfg);
  const isx = useSpring(ix, { stiffness: 300, damping: 20, mass: 0.4 });
  const isy = useSpring(iy, { stiffness: 300, damping: 20, mass: 0.4 });

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || disabled) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - r.left - r.width / 2;
    const dy = e.clientY - r.top - r.height / 2;
    x.set(dx * strength); y.set(dy * strength);
    ix.set(dx * strength * 0.4); iy.set(dy * strength * 0.4);
  }, [disabled, strength, x, y, ix, iy]);

  const onLeave = useCallback(() => {
    x.set(0); y.set(0); ix.set(0); iy.set(0);
  }, [x, y, ix, iy]);

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block">
      {asAnchor && href ? (
        <a href={href} aria-label={ariaLabel} className={className}>
          <motion.span className="block" style={{ x: isx, y: isy }}>{children}</motion.span>
        </a>
      ) : (
        <button onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={className}>
          <motion.span className="block" style={{ x: isx, y: isy }}>{children}</motion.span>
        </button>
      )}
    </motion.div>
  );
}
