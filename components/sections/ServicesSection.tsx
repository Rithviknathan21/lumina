"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Telescope, Orbit, Radio, FlaskConical } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Services Section
// ─────────────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    num: "01",
    icon: Telescope,
    title: "Space Visualization",
    desc: "Navigate a real-time 3D solar system. Zoom from orbit down to planetary surfaces. Every object rendered with custom physically-based shaders.",
    tags: ["WebGL 2", "GLSL", "Three.js"],
    accent: "#A8C8FF",
  },
  {
    num: "02",
    icon: Orbit,
    title: "Orbital Mechanics",
    desc: "Accurate celestial motion. Planets, moons, and asteroids follow real orbital paths. Watch the cosmos move as it does in the real universe.",
    tags: ["Physics", "Kepler", "Real-time"],
    accent: "#C9A8FF",
  },
  {
    num: "03",
    icon: Radio,
    title: "Live Data Feeds",
    desc: "Integrate live celestial data streams. Satellite positions, solar events, asteroid proximity alerts — your universe stays current.",
    tags: ["NASA API", "WebSockets", "Supabase"],
    accent: "#FFD080",
  },
  {
    num: "04",
    icon: FlaskConical,
    title: "Custom Experiences",
    desc: "Commission a bespoke space experience. From educational simulations to award-level brand activations — we build what you imagine.",
    tags: ["R3F", "Framer Motion", "GSAP"],
    accent: "#80FFC0",
  },
] as const;

function ServiceCard({
  service,
  index,
}: {
  service: (typeof SERVICES)[number];
  index: number;
}) {
  const Icon = service.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1], delay: index * 0.08 }}
      className="group relative flex gap-6 md:gap-10 items-start py-10 border-b border-white/[0.05] last:border-b-0"
    >
      {/* Number + Icon column */}
      <div className="flex-shrink-0 w-16 md:w-20 flex flex-col items-center gap-3 pt-1">
        <span
          className="font-mono text-4xl md:text-5xl font-black leading-none select-none"
          style={{ color: `${service.accent}18`, WebkitTextStroke: `1px ${service.accent}30` }}
        >
          {service.num}
        </span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
          style={{
            background: `${service.accent}12`,
            border: `1px solid ${service.accent}25`,
            boxShadow: `0 0 0 0 ${service.accent}00`,
          }}
        >
          <Icon size={16} style={{ color: service.accent }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3
            className="font-display font-bold text-2xl md:text-3xl text-white leading-tight group-hover:text-lumina-star-core transition-colors duration-400"
            style={{ letterSpacing: "-0.02em" }}
          >
            {service.title}
          </h3>
          {/* Arrow that appears on hover */}
          <motion.div
            className="hidden md:flex w-9 h-9 rounded-full items-center justify-center flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-400"
            style={{
              background: `${service.accent}10`,
              border: `1px solid ${service.accent}25`,
              color: service.accent,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 7H11M11 7L8 4M11 7L8 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>

        <p className="text-lumina-star/40 text-[15px] leading-relaxed mb-5 group-hover:text-lumina-star/65 transition-colors duration-400">
          {service.desc}
        </p>

        <div className="flex flex-wrap gap-2">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full transition-all duration-300"
              style={{
                background: `${service.accent}0A`,
                border: `1px solid ${service.accent}20`,
                color: `${service.accent}80`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section
      id="services"
      ref={ref}
      className="relative py-36 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,4,8,0.0) 0%, rgba(4,8,20,0.92) 15%, rgba(4,8,20,0.92) 85%, rgba(2,4,8,0.0) 100%)",
        }}
      />

      {/* Violet nebula accent right */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 50%, rgba(123,94,167,0.08) 0%, transparent 65%)",
        }}
      />

      {/* Blue accent left */}
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 100%, rgba(32,64,160,0.07) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-16 lg:gap-24">
          {/* Left: Sticky header */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-8 bg-lumina-star/30" />
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-lumina-star/40">
                02 / Services
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
              className="font-display font-black leading-[1.05] tracking-[-0.03em] text-white mb-6"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              What we
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, #C9A8FF 0%, #A8C8FF 50%, #C9A8FF 100%)",
                }}
              >
                build.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
              className="text-lumina-star/38 text-sm leading-relaxed"
            >
              From orbital simulations to real-time brand activations — we engineer
              the impossible in WebGL.
            </motion.p>

            {/* Decorative orbital SVG */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
              className="mt-10 hidden lg:block"
            >
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden>
                <circle cx="60" cy="60" r="54" stroke="rgba(168,200,255,0.06)" strokeWidth="1" />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="rgba(168,200,255,0.18)"
                  strokeWidth="1"
                  strokeDasharray="15 200"
                  strokeLinecap="round"
                  animate={{ rotate: 360 }}
                  style={{ transformOrigin: "60px 60px" }}
                  transition={{ duration: 12, ease: "linear", repeat: Infinity }}
                />
                <circle cx="60" cy="60" r="32" stroke="rgba(123,94,167,0.08)" strokeWidth="1" />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="32"
                  stroke="rgba(201,168,255,0.18)"
                  strokeWidth="1"
                  strokeDasharray="10 120"
                  strokeLinecap="round"
                  animate={{ rotate: -360 }}
                  style={{ transformOrigin: "60px 60px" }}
                  transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                />
                <circle cx="60" cy="60" r="5" fill="rgba(168,200,255,0.4)" />
                <circle cx="60" cy="60" r="2.5" fill="#A8C8FF" style={{ filter: "drop-shadow(0 0 4px rgba(168,200,255,0.8))" }} />
              </svg>
            </motion.div>
          </div>

          {/* Right: Services list */}
          <div>
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.num} service={service} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
