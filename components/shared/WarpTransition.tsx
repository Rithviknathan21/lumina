"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Warp Speed Page Transition
// All Math.random() calls are inside useEffect (client-only, never SSR)
// ─────────────────────────────────────────────────────────────────────────────

function WarpCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // All Math.random() here — inside useEffect, never runs on server
    const lines = Array.from({ length: 150 }, () => ({
      angle: Math.random() * Math.PI * 2,
      len: 60 + Math.random() * 180,
      speed: 0.015 + Math.random() * 0.04,
      offset: Math.random(),
      width: 0.4 + Math.random() * 1.4,
      hue: 200 + Math.random() * 55,
    }));

    let progress = 0;
    const draw = () => {
      progress = Math.min(progress + 0.022, 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const line of lines) {
        const t = (progress + line.offset) % 1;
        const dist = 70 + t * 550 * progress;
        const x0 = cx + Math.cos(line.angle) * dist;
        const y0 = cy + Math.sin(line.angle) * dist;
        const x1 = cx + Math.cos(line.angle) * (dist + line.len * t * progress * 3);
        const y1 = cy + Math.sin(line.angle) * (dist + line.len * t * progress * 3);
        const alpha = Math.sin(t * Math.PI) * progress;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
        ctx.strokeStyle = `hsla(${line.hue},80%,80%,${alpha * 0.65})`;
        ctx.lineWidth = line.width * progress;
        ctx.stroke();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" aria-hidden />;
}

export function WarpTransition({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div className="fixed inset-0 z-[500] overflow-hidden"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: "radial-gradient(ellipse at center, #020816 0%, #000408 100%)" }}>
          <WarpCanvas />
          <motion.div className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1, 3] }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}>
            <div className="w-px h-px rounded-full"
              style={{ boxShadow: "0 0 100px 80px rgba(168,200,255,0.3),0 0 200px 160px rgba(168,200,255,0.1)" }} />
          </motion.div>
          <motion.div className="absolute inset-0 flex items-center justify-center font-display font-black uppercase"
            style={{ fontSize: "10vw", color: "transparent", WebkitTextStroke: "1px rgba(168,200,255,0.12)" }}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 1.2] }}
            transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}>
            LUMINA
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const prev = useRef(pathname);

  useEffect(() => {
    if (pathname !== prev.current) {
      setActive(true);
      const t = setTimeout(() => setActive(false), 1200);
      prev.current = pathname;
      return () => clearTimeout(t);
    }
  }, [pathname]);

  return (
    <>
      {children}
      <WarpTransition active={active} />
    </>
  );
}
