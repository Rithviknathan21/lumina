"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Technology Section
// ─────────────────────────────────────────────────────────────────────────────

const TECH_CATEGORIES = [
  {
    label: "3D Engine",
    accent: "#A8C8FF",
    items: [
      { name: "Three.js", desc: "WebGL renderer" },
      { name: "React Three Fiber", desc: "React bindings" },
      { name: "Drei", desc: "Abstraction layer" },
      { name: "Postprocessing", desc: "VFX pipeline" },
    ],
  },
  {
    label: "Shaders",
    accent: "#C9A8FF",
    items: [
      { name: "GLSL ES 3.0", desc: "Fragment & vertex" },
      { name: "Custom FBM", desc: "Fractal noise" },
      { name: "Rayleigh Scatter", desc: "Atmosphere" },
      { name: "ACES Filmic", desc: "Tone mapping" },
    ],
  },
  {
    label: "Framework",
    accent: "#FFD080",
    items: [
      { name: "Next.js 15", desc: "App Router" },
      { name: "React 18", desc: "Concurrent mode" },
      { name: "TypeScript", desc: "Type safety" },
      { name: "Tailwind CSS", desc: "Styling" },
    ],
  },
  {
    label: "Animation",
    accent: "#80FFC0",
    items: [
      { name: "Framer Motion", desc: "UI animation" },
      { name: "GSAP", desc: "Scroll & timelines" },
      { name: "Lenis", desc: "Smooth scroll" },
      { name: "Spring physics", desc: "Micro interactions" },
    ],
  },
] as const;

// Animated counter for a metric
function Metric({ value, label, accent, delay }: {
  value: string; label: string; accent: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay }}
      className="flex flex-col items-center text-center"
    >
      <span
        className="font-display font-black leading-none mb-2"
        style={{
          fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
          color: accent,
          textShadow: `0 0 40px ${accent}60`,
          letterSpacing: "-0.04em",
        }}
      >
        {value}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-lumina-star/35">
        {label}
      </span>
    </motion.div>
  );
}

function TechCategory({
  category,
  index,
}: {
  category: (typeof TECH_CATEGORIES)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: index * 0.1 }}
      className="group"
    >
      {/* Category header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="h-px flex-1"
          style={{ background: `linear-gradient(to right, ${category.accent}40, transparent)` }}
        />
        <span
          className="font-mono text-[9px] uppercase tracking-[0.3em]"
          style={{ color: `${category.accent}80` }}
        >
          {category.label}
        </span>
      </div>

      {/* Tech items */}
      <div className="space-y-2">
        {category.items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              ease: [0.19, 1, 0.22, 1],
              delay: index * 0.08 + i * 0.05,
            }}
            whileHover={{ x: 6 }}
            className="flex items-center justify-between px-4 py-3 rounded-xl cursor-default transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div className="flex items-center gap-3">
              {/* Dot */}
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: category.accent,
                  boxShadow: `0 0 6px ${category.accent}`,
                }}
              />
              <span className="text-sm font-medium text-lumina-star-core/80">
                {item.name}
              </span>
            </div>
            <span className="font-mono text-[10px] text-lumina-star/25 tracking-[0.1em]">
              {item.desc}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function TechSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section
      id="technology"
      ref={ref}
      className="relative py-36 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,4,8,0.0) 0%, rgba(6,10,24,0.94) 12%, rgba(6,10,24,0.94) 88%, rgba(2,4,8,0.0) 100%)",
        }}
      />

      {/* Glow accents */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(123,94,167,0.055) 0%, rgba(32,50,160,0.04) 40%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-20">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="h-px w-8 bg-lumina-star/30" />
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-lumina-star/40">
                03 / Technology
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
              className="font-display font-black leading-[1.05] tracking-[-0.03em] text-white"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              The stack that
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, #FFD080 0%, #FFA040 60%, #FFD080 100%)",
                }}
              >
                powers it.
              </span>
            </motion.h2>
          </div>

          {/* Metrics bar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
            className="flex gap-10 md:gap-14"
          >
            <Metric value="60k" label="GPU Stars" accent="#A8C8FF" delay={0.3} />
            <Metric value="128" label="Sphere Segs" accent="#C9A8FF" delay={0.4} />
            <Metric value="60" label="Target FPS" accent="#80FFC0" delay={0.5} />
          </motion.div>
        </div>

        {/* Tech grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TECH_CATEGORIES.map((cat, i) => (
            <TechCategory key={cat.label} category={cat} index={i} />
          ))}
        </div>

        {/* Bottom marquee strip */}
        <div className="mt-20 overflow-hidden">
          <motion.div
            className="flex items-center gap-12 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          >
            {[
              "WebGL 2.0", "GLSL ES 3.0", "React 18", "Next.js 15",
              "Three.js", "R3F", "Framer Motion", "GSAP", "Lenis",
              "Tailwind", "TypeScript", "Supabase",
              "WebGL 2.0", "GLSL ES 3.0", "React 18", "Next.js 15",
              "Three.js", "R3F", "Framer Motion", "GSAP", "Lenis",
              "Tailwind", "TypeScript", "Supabase",
            ].map((tech, i) => (
              <span
                key={i}
                className="font-mono text-[11px] uppercase tracking-[0.3em] text-lumina-star/18 flex-shrink-0"
              >
                {tech}
                <span className="ml-12 text-lumina-star/10">◆</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
