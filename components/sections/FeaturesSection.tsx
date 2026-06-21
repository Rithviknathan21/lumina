"use client";

import { useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  Sparkles, Globe, Orbit, MousePointer2, Cpu, Zap,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Features Section
// Awwwards-quality glassmorphism cards with 3D mouse-reactive tilt,
// per-card spotlight glow, and scroll-triggered stagger entrance.
// ─────────────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Sparkles,
    chapter: "01",
    tag: "Rendering",
    title: "GPU Star Field",
    desc: "18,000 procedural stars built entirely on the GPU. Each carries its own brightness curve, color temperature, and depth-driven parallax via custom GLSL vertex shaders.",
    stat: "18K",
    statLabel: "live GPU particles",
    color: "#A8C8FF",
    accent: "rgba(168,200,255,0.18)",
  },
  {
    icon: Globe,
    chapter: "02",
    tag: "Simulation",
    title: "Living Earth",
    desc: "Photorealistic Earth with zero textures. GLSL fragment shaders procedurally generate continents, oceans, polar ice, city lights, and a Rayleigh-scattering atmosphere.",
    stat: "0",
    statLabel: "textures · 100% GLSL",
    color: "#7BDDFF",
    accent: "rgba(123,221,255,0.18)",
  },
  {
    icon: Orbit,
    chapter: "03",
    tag: "Camera",
    title: "Scroll Flythrough",
    desc: "9 cinematic keyframes map your scroll to a camera path that arcs from Earth across the asteroid belt to Saturn's rings. Spring-damped lerp keeps it buttery smooth.",
    stat: "9",
    statLabel: "cinematic waypoints",
    color: "#C9A8FF",
    accent: "rgba(201,168,255,0.18)",
  },
  {
    icon: Zap,
    chapter: "04",
    tag: "Atmosphere",
    title: "Volumetric Nebulae",
    desc: "Sprite-based gas clouds rendered in additive blending layers. Each sprite rotates per-particle in the fragment shader, creating depth you can feel even at rest.",
    stat: "4",
    statLabel: "layered gas clouds",
    color: "#D4A8FF",
    accent: "rgba(212,168,255,0.18)",
  },
  {
    icon: Cpu,
    chapter: "05",
    tag: "Performance",
    title: "Adaptive Quality",
    desc: "Auto-scales from 3K stars on mobile to 28K on desktop. DPR is capped at 1.5×, DoF disabled in real time, and particle counts tier gracefully across hardware.",
    stat: "60",
    statLabel: "FPS target",
    color: "#80FFC0",
    accent: "rgba(128,255,192,0.16)",
  },
  {
    icon: MousePointer2,
    chapter: "06",
    tag: "Post-Processing",
    title: "Film Pipeline",
    desc: "ACESFilmic tone mapping, mipmap-blurred bloom, and cinematic vignette on every frame. The same pipeline used in AAA film and game production — running in your browser.",
    stat: "ACES",
    statLabel: "tone mapping",
    color: "#FFD080",
    accent: "rgba(255,208,128,0.16)",
  },
] as const;

// ── Card ─────────────────────────────────────────────────────────────────────

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const Icon = feature.icon;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      const sp = spotRef.current;
      if (!el || !sp) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const px = x / r.width - 0.5;
      const py = y / r.height - 0.5;
      // Tight tracking during hover
      el.style.transition = "transform 0.08s linear";
      el.style.transform = `perspective(900px) rotateX(${py * -10}deg) rotateY(${px * 10}deg)`;
      // Spotlight follows cursor
      sp.style.opacity = "1";
      sp.style.background = `radial-gradient(circle at ${x}px ${y}px, ${feature.accent} 0%, transparent 68%)`;
    },
    [feature.accent]
  );

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    const sp = spotRef.current;
    if (!el || !sp) return;
    // Spring back with expo easing
    el.style.transition = "transform 0.55s cubic-bezier(0.19,1,0.22,1)";
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    sp.style.opacity = "0";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 1.0,
        ease: [0.19, 1, 0.22, 1],
        delay: index * 0.07,
      }}
      style={{ willChange: "transform" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative h-full rounded-2xl overflow-hidden cursor-default"
        style={{
          background: "rgba(6,10,20,0.62)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.07), 0 16px 56px rgba(0,0,0,0.55)",
          willChange: "transform",
        }}
      >
        {/* Mouse-follow spotlight — updated directly on mousemove, no re-render */}
        <div
          ref={spotRef}
          className="absolute inset-0 pointer-events-none opacity-0"
          style={{ transition: "opacity 0.3s ease", borderRadius: "inherit" }}
        />

        {/* Static hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 65% at 20% 10%, ${feature.accent} 0%, transparent 68%)`,
            transition: "opacity 0.6s ease",
          }}
        />

        {/* Hover border highlight */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            border: `1px solid ${feature.color}28`,
            transition: "opacity 0.5s ease",
          }}
        />

        {/* Bottom accent sweep */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none origin-left scale-x-0 group-hover:scale-x-100"
          style={{
            background: `linear-gradient(90deg, ${feature.color}70 0%, ${feature.color}20 60%, transparent 100%)`,
            transition: "transform 0.65s cubic-bezier(0.19,1,0.22,1)",
          }}
        />

        <div className="relative z-10 p-8 h-full flex flex-col">
          {/* Header row */}
          <div className="flex items-start justify-between mb-7">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110"
              style={{
                background: feature.accent,
                border: `1px solid ${feature.color}25`,
                boxShadow: `0 0 24px ${feature.accent}`,
                transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease",
              }}
            >
              <Icon size={17} style={{ color: feature.color }} />
            </div>

            <div className="text-right">
              <div
                className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-20 group-hover:opacity-45"
                style={{ color: feature.color, transition: "opacity 0.3s ease" }}
              >
                {feature.tag}
              </div>
              <div
                className="font-mono text-[11px] tracking-[0.2em] opacity-15 group-hover:opacity-35 mt-0.5"
                style={{ color: feature.color, transition: "opacity 0.3s ease" }}
              >
                {feature.chapter}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3
            className="font-display font-bold text-[1.15rem] tracking-[-0.02em] leading-tight mb-3.5 text-white/88 group-hover:text-white"
            style={{ transition: "color 0.3s ease" }}
          >
            {feature.title}
          </h3>

          {/* Description */}
          <p
            className="text-[0.82rem] leading-[1.7] text-white/34 group-hover:text-white/55 flex-1"
            style={{ transition: "color 0.45s ease" }}
          >
            {feature.desc}
          </p>

          {/* Stat row */}
          <div
            className="mt-6 pt-5 flex items-baseline gap-2.5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span
              className="font-mono text-[1.35rem] font-bold leading-none tracking-tight"
              style={{ color: feature.color }}
            >
              {feature.stat}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/28">
              {feature.statLabel}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="features"
      ref={ref}
      className="relative py-40 overflow-hidden"
    >
      {/* Semi-transparent overlay — lets space breathe through */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,4,8,0) 0%, rgba(2,4,8,0.88) 10%, rgba(2,4,8,0.88) 90%, rgba(2,4,8,0) 100%)",
        }}
      />

      {/* Top nebula glow */}
      <div
        className="absolute top-0 inset-x-0 h-96 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(123,94,167,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Bottom nebula glow */}
      <div
        className="absolute bottom-0 inset-x-0 h-96 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(168,200,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

        {/* ── Section header ─────────────────────────────────────────── */}
        <div className="mb-24">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="flex items-center gap-4 mb-6"
          >
            {/* Animated scan line */}
            <div className="relative h-px w-12 bg-white/10 overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
                className="absolute inset-y-0 left-0 right-0 bg-white/40 origin-left"
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/35">
              01 — Capabilities
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
            className="font-display font-black leading-[1.02] tracking-[-0.04em] text-white mb-6"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)" }}
          >
            A universe
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(115deg, #C8DCFF 0%, #A8C8FF 35%, #C9A8FF 65%, #FFD080 100%)",
              }}
            >
              built in code.
            </span>
          </motion.h2>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
            className="max-w-xl text-[0.95rem] leading-relaxed text-white/38"
          >
            Every star, shader, and animation runs live in your browser.
            No plugins. No canvas fallbacks. Pure WebGL and GLSL from the ground up.
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
            className="mt-12 h-px bg-white/6 origin-left"
          />
        </div>

        {/* ── Card grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>

        {/* ── Bottom detail bar ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.4 }}
          className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem" }}
        >
          <div className="flex items-center gap-8">
            {[
              { val: "React 19", label: "runtime" },
              { val: "Three.js", label: "renderer" },
              { val: "GLSL", label: "shaders" },
            ].map(({ val, label }) => (
              <div key={val} className="flex flex-col gap-0.5">
                <span className="font-mono text-[11px] font-bold text-white/55 tracking-tight">
                  {val}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/22">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div
            className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 flex items-center gap-3"
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#80FFC0", boxShadow: "0 0 8px #80FFC0" }}
            />
            All rendering client-side
          </div>
        </motion.div>
      </div>
    </section>
  );
}
