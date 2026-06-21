"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import type { LoadingPhase } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Cinematic Loading Screen
// Props: accepts both the flat (phase/progress) API from experience page
// ─────────────────────────────────────────────────────────────────────────────

interface LoadingScreenProps {
  phase: LoadingPhase;
  progress: number;
  className?: string;
}

// Seeded deterministic star positions — identical on server and client
function lcg(seed: number): () => number {
  let s = seed;
  return () => {
    s = Math.imul(s, 1664525) + 1013904223 | 0;
    return (s >>> 0) / 0xffffffff;
  };
}

const rng = lcg(42);
const STAR_DATA = Array.from({ length: 60 }, () => ({
  x: rng() * 100,
  y: rng() * 100,
  size: 1 + rng() * 2.5,
  opacity: 0.1 + rng() * 0.5,
  delay: rng() * 3,
  duration: 2 + rng() * 4,
}));

function BackgroundStars() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {mounted && STAR_DATA.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-lumina-star"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity }}
          animate={{ opacity: [s.opacity * 0.3, s.opacity, s.opacity * 0.3] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (progress / 100) * circ;
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      {/* Outer decorative ring */}
      <svg className="absolute inset-0 w-full h-full animate-spin-slow opacity-20" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r="47" fill="none" stroke="#A8C8FF" strokeWidth="0.75" strokeDasharray="3 9" />
      </svg>
      {/* Track */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(168,200,255,0.06)" strokeWidth="2" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke="#A8C8FF" strokeWidth="2" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.19,1,0.22,1)", filter: "drop-shadow(0 0 8px rgba(168,200,255,0.7))" }}
        />
      </svg>
      {/* Percentage */}
      <span className="relative font-mono text-sm font-semibold text-lumina-star tabular-nums z-10" aria-live="polite">
        {Math.round(progress)}
      </span>
    </div>
  );
}

function GridOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{
      backgroundImage: "linear-gradient(rgba(168,200,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,200,255,1) 1px, transparent 1px)",
      backgroundSize: "64px 64px",
    }} aria-hidden />
  );
}

function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-lumina-star/15 to-transparent"
        style={{ animation: "scan-line 4s linear infinite" }} />
    </div>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const cls = { tl: "top-5 left-5", tr: "top-5 right-5 scale-x-[-1]", bl: "bottom-5 left-5 scale-y-[-1]", br: "bottom-5 right-5 scale-x-[-1] scale-y-[-1]" };
  return (
    <div className={cn("absolute w-8 h-8", cls[pos])} aria-hidden>
      <div className="absolute top-0 left-0 w-full h-px bg-lumina-star/30" />
      <div className="absolute top-0 left-0 h-full w-px bg-lumina-star/30" />
    </div>
  );
}

const PHASE_MESSAGES: Record<LoadingPhase, string> = {
  booting:  "Initializing systems...",
  assets:   "Loading universe assets...",
  scene:    "Generating scene geometry...",
  shaders:  "Compiling GLSL shaders...",
  ready:    "Preparing experience...",
  done:     "Entering LUMINA",
};

export function LoadingScreen({ phase, progress, className }: LoadingScreenProps) {
  const [display, setDisplay] = useState(0);
  const current = useRef(0);
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame>>(0);

  useEffect(() => {
    const target = progress;
    const animate = () => {
      const diff = target - current.current;
      if (Math.abs(diff) < 0.1) { current.current = target; setDisplay(target); return; }
      current.current += diff * 0.1;
      setDisplay(current.current);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [progress]);

  return (
    <div
      className={cn("fixed inset-0 z-[100] flex flex-col items-center justify-center bg-lumina-void select-none overflow-hidden", className)}
      role="status"
      aria-label={`Loading LUMINA: ${Math.round(display)}%`}
    >
      <GridOverlay />
      <ScanLine />
      <BackgroundStars />
      <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(168,200,255,0.04) 0%, transparent 70%)" }} aria-hidden />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Logo */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
        >
          {/* Orbital SVG mark */}
          <div className="relative w-16 h-16 mb-2">
            <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden>
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(168,200,255,0.1)" strokeWidth="1" />
              <motion.circle cx="32" cy="32" r="28" fill="none" stroke="rgba(168,200,255,0.4)" strokeWidth="1"
                strokeDasharray="10 175" animate={{ rotate: 360 }} style={{ transformOrigin: "center" }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }} />
              <circle cx="32" cy="32" r="12" fill="none" stroke="rgba(168,200,255,0.25)" strokeWidth="1" />
              <circle cx="32" cy="32" r="4" fill="#A8C8FF" style={{ filter: "drop-shadow(0 0 6px rgba(168,200,255,0.9))" }} />
            </svg>
          </div>

          <h1
            className="font-display font-bold tracking-[0.22em] text-lumina-star-core uppercase"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", textShadow: "0 0 40px rgba(168,200,255,0.4), 0 0 80px rgba(168,200,255,0.15)" }}
          >
            {APP_NAME}
          </h1>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-lumina-star/50 to-transparent" />
          <p className="font-mono text-[10px] tracking-[0.3em] text-lumina-star/40 uppercase">{APP_TAGLINE}</p>
        </motion.div>

        {/* Progress ring */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}>
          <ProgressRing progress={display} />
        </motion.div>

        {/* Phase message */}
        <AnimatePresence mode="wait">
          <motion.div key={phase} className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}>
            <p className="font-mono text-[10px] text-lumina-star/50 tracking-[0.2em] uppercase">
              {PHASE_MESSAGES[phase]}
            </p>
            {/* Bar */}
            <div className="w-52 h-px bg-lumina-star/8 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-lumina-star/50 to-lumina-star transition-all duration-700 ease-expo-out"
                style={{ width: `${display}%` }} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom HUD */}
      <motion.div className="absolute bottom-6 left-0 right-0 flex justify-between px-8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <span className="font-mono text-[9px] text-lumina-star/20 tracking-[0.15em] uppercase">v1.0.0</span>
        <span className="font-mono text-[9px] text-lumina-star/20 tracking-[0.15em] uppercase">WebGL 2.0</span>
      </motion.div>
    </div>
  );
}
