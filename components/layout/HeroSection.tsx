"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown, Zap, Globe, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { scrollTo } from "@/hooks/use-lenis";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Cinematic Hero Section
// ALL random values generated deterministically (seeded LCG) and only rendered
// after mount — zero SSR/client mismatch.
// ─────────────────────────────────────────────────────────────────────────────

function lcg(seed: number): () => number {
  let s = seed;
  return () => { s = Math.imul(s, 1664525) + 1013904223 | 0; return (s >>> 0) / 0xffffffff; };
}

// Pre-computed at module load — same sequence every time
const PARTICLE_DATA = (() => {
  const rng = lcg(7);
  return Array.from({ length: 22 }, (_, id) => ({
    id, x: rng() * 100, y: rng() * 100,
    size: 1 + rng() * 2.2, opacity: 0.08 + rng() * 0.28,
    duration: 9 + rng() * 11, delay: rng() * 7,
  }));
})();

// ── Cycling word ──────────────────────────────────────────────────────────────

const WORDS = ["cosmos", "galaxy", "universe", "void", "beyond"] as const;

function WordCycle() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % WORDS.length), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-block overflow-hidden" style={{ minWidth: "14ch" }}>
      <motion.span key={idx} className="block text-transparent bg-clip-text"
        initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }}
        exit={{ y: "-100%", opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        style={{ backgroundImage: "linear-gradient(135deg,#C8DCFF 0%,#A8C8FF 40%,#C9A8FF 75%,#A8C8FF 100%)", filter: "drop-shadow(0 0 30px rgba(168,200,255,0.5))" }}>
        {WORDS[idx]}
      </motion.span>
    </span>
  );
}

// ── Ambient particles (mount-gated, no SSR render) ────────────────────────────

function AmbientParticles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {mounted && PARTICLE_DATA.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-lumina-star"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
          animate={{ y: [-18, 18, -18], x: [-7, 7, -7], opacity: [p.opacity, p.opacity * 0.25, p.opacity] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </div>
  );
}

// ── Orbital rings (fully deterministic) ───────────────────────────────────────

function OrbitalRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden>
      {[560, 860, 1160].map((size, i) => (
        <motion.div key={size} className="absolute rounded-full border border-lumina-star/[0.022]"
          style={{ width: size, height: size }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 45 + i * 20, ease: "linear", repeat: Infinity }}>
          <div className="absolute w-1.5 h-1.5 rounded-full bg-lumina-star/25 -translate-x-1/2 -translate-y-1/2" style={{ top: "0%", left: "50%" }} />
        </motion.div>
      ))}
      <div className="absolute w-px h-36 bg-gradient-to-b from-transparent via-lumina-star/[0.05] to-transparent" />
      <div className="absolute h-px w-36 bg-gradient-to-r from-transparent via-lumina-star/[0.05] to-transparent" />
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ value, label, icon: Icon, delay }: {
  value: string; label: string; icon: React.ComponentType<{ className?: string }>; delay: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay }}
      className="group relative px-5 py-4 rounded-2xl overflow-hidden cursor-default select-none bg-white/[0.035] border border-white/[0.07] backdrop-blur-xl hover:bg-white/[0.06] hover:border-lumina-star/15 transition-all duration-500 hover:-translate-y-1 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "linear-gradient(135deg,rgba(168,200,255,0.04) 0%,transparent 60%)" }} />
      <div className="relative flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-lumina-star/8 flex items-center justify-center group-hover:bg-lumina-star/14 transition-colors duration-300">
          <Icon className="w-4 h-4 text-lumina-star/55 group-hover:text-lumina-star transition-colors duration-300" />
        </div>
        <div>
          <div className="font-mono text-lg font-semibold text-lumina-star tabular-nums leading-none">{value}</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/28 mt-0.5">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 22 });
  const contentX = useTransform(springX, [-1, 1], [-10, 10]);
  const contentY = useTransform(springY, [-1, 1], [-7, 7]);

  const onMouseMove = (e: React.MouseEvent) => {
    const r = sectionRef.current?.getBoundingClientRect(); if (!r) return;
    mouseX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    mouseY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  return (
    <section ref={sectionRef} onMouseMove={onMouseMove}
      className="relative min-h-screen flex flex-col items-start justify-center px-6 md:px-16 pt-24 pb-20 overflow-hidden"
      aria-label="Hero">
      {/* Background glows */}
      <div className="absolute top-0 left-1/3 right-0 h-[70vh] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 70% 0%, rgba(168,200,255,0.055) 0%, transparent 65%)" }} aria-hidden />
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 30% 100%, rgba(123,94,167,0.055) 0%, transparent 60%)" }} aria-hidden />

      <OrbitalRings />
      <AmbientParticles />

      {/* Horizontal scan line */}
      <motion.div className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ top: "45%", background: "linear-gradient(90deg,transparent,rgba(168,200,255,0.04),transparent)" }}
        animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 7 }} aria-hidden />

      {/* Content */}
      <motion.div className="relative z-10 max-w-3xl" style={{ x: contentX, y: contentY }}>
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-mono text-[10px] uppercase tracking-[0.4em] text-lumina-star/35 mb-6 flex items-center gap-3">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lumina-star opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-lumina-star" />
          </span>
          Now in Early Access
          <span className="h-px w-16 bg-gradient-to-r from-lumina-star/20 to-transparent" />
        </motion.div>

        {/* Headlines */}
        {[
          { text: <span>Explore the</span>, delay: 0.4, cls: "text-white" },
          { text: <WordCycle />, delay: 0.55, cls: "" },
          { text: <span>in real time.</span>, delay: 0.7, cls: "text-white/18" },
        ].map((line, i) => (
          <motion.h1 key={i}
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1], delay: line.delay }}
            className={cn("font-display font-black leading-[1.0] tracking-[-0.04em] mb-2", line.cls)}
            style={{ fontSize: "clamp(3rem, 8.5vw, 7rem)" }}>
            {line.text}
          </motion.h1>
        ))}

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.85 }}
          className="text-base text-white/35 mt-7 mb-9 max-w-lg leading-relaxed">
          LUMINA is an immersive real-time 3D space experience — custom GLSL shaders, GPU particle systems, and cinematic post-processing. All in your browser.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 1.0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link href={ROUTES.EXPERIENCE} className="group">
            <div className={cn(
              "relative inline-flex items-center gap-3 px-8 py-4 rounded-full overflow-hidden",
              "font-mono text-[11px] tracking-[0.18em] uppercase font-semibold text-lumina-void bg-lumina-star",
              "transition-all duration-400 hover:scale-[1.03] active:scale-[0.98]"
            )}
              style={{ boxShadow: "0 0 40px rgba(168,200,255,0.25),0 0 80px rgba(168,200,255,0.1),inset 0 1px 0 rgba(255,255,255,0.3)" }}>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.22) 50%,transparent 70%)", animation: "shine 2s ease-in-out infinite" }} />
              <span className="relative">Launch Experience</span>
              <ArrowRight size={13} className="relative group-hover:translate-x-1 transition-transform duration-300" aria-hidden />
            </div>
          </Link>
          <button onClick={() => scrollTo("#features")}
            className={cn(
              "group inline-flex items-center gap-2 px-8 py-4 rounded-full",
              "font-mono text-[11px] tracking-[0.18em] uppercase",
              "text-white/45 hover:text-lumina-star border border-white/[0.07] hover:border-lumina-star/22",
              "backdrop-blur-xl bg-white/[0.02] hover:bg-lumina-star/[0.04] transition-all duration-400"
            )}>
            Explore Features
            <ChevronDown size={11} className="group-hover:translate-y-0.5 transition-transform duration-300" aria-hidden />
          </button>
        </motion.div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap gap-3">
          <StatCard value="60fps" label="Rendering" icon={Zap} delay={1.2} />
          <StatCard value="25K+" label="Stars" icon={Globe} delay={1.35} />
          <StatCard value="WebGL 2" label="API" icon={Cpu} delay={1.5} />
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.button className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-lumina-star/22 hover:text-lumina-star/55 transition-colors duration-300"
        onClick={() => scrollTo("#features")}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3, duration: 0.8 }}
        aria-label="Scroll to features">
        <span className="font-mono text-[9px] uppercase tracking-[0.28em]" style={{ writingMode: "vertical-rl" }}>Scroll to explore</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-lumina-star/28 to-transparent" />
      </motion.button>

      {/* Coordinate HUD */}
      <motion.div className="absolute bottom-8 left-8 hidden md:block font-mono text-[9px] text-white/13 leading-relaxed"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }} aria-hidden>
        <div>LAT 51.5074° N</div>
        <div>LON 0.1278° W</div>
        <div>ALT 384,400 KM</div>
      </motion.div>
    </section>
  );
}
