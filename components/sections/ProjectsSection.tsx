"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Projects / Missions Section
// ─────────────────────────────────────────────────────────────────────────────

const MISSIONS = [
  {
    id: "earth-moon",
    num: "M-001",
    title: "Earth–Moon System",
    subtitle: "Orbital Mechanics",
    desc: "A photorealistic simulation of the Earth-Moon system at 1:1 orbital scale. Procedural continents, polar ice, city lights, Rayleigh atmosphere, and accurate lunar phase driven by GLSL.",
    tags: ["GLSL", "Atmosphere", "Procedural"],
    stat1: { val: "2.2", lbl: "Earth radius (units)" },
    stat2: { val: "3.8", lbl: "Orbital distance" },
    gradient: "linear-gradient(135deg, rgba(32,80,200,0.18) 0%, rgba(80,140,255,0.08) 50%, rgba(123,94,167,0.12) 100%)",
    accentColor: "#A8C8FF",
    borderColor: "rgba(168,200,255,0.12)",
    glowColor: "rgba(168,200,255,0.15)",
  },
  {
    id: "nebula-field",
    num: "M-002",
    title: "Nebula Field",
    subtitle: "Deep Space Gas Clouds",
    desc: "Three layered nebula clouds — violet, indigo-blue, and deep magenta — rendered as 600 additive-blended sprites per cloud. Each particle breathes and rotates in real time.",
    tags: ["Particles", "Additive Blend", "GLSL"],
    stat1: { val: "600+", lbl: "Sprites per cloud" },
    stat2: { val: "3", lbl: "Overlapping layers" },
    gradient: "linear-gradient(135deg, rgba(91,42,135,0.2) 0%, rgba(123,94,167,0.12) 50%, rgba(168,200,255,0.06) 100%)",
    accentColor: "#C9A8FF",
    borderColor: "rgba(201,168,255,0.12)",
    glowColor: "rgba(201,168,255,0.14)",
  },
  {
    id: "asteroid-belt",
    num: "M-003",
    title: "Asteroid Belt",
    subtitle: "Instanced Geometry",
    desc: "400 individual asteroids rendered via custom instanced shader. Each rock has unique scale, rotation speed, and orbital offset. GPU-computed — zero CPU overhead per frame.",
    tags: ["Instancing", "GPU", "Performance"],
    stat1: { val: "400", lbl: "Unique asteroids" },
    stat2: { val: "0", lbl: "CPU overhead" },
    gradient: "linear-gradient(135deg, rgba(80,60,20,0.18) 0%, rgba(140,100,40,0.08) 50%, rgba(100,80,20,0.12) 100%)",
    accentColor: "#FFD080",
    borderColor: "rgba(255,208,128,0.12)",
    glowColor: "rgba(255,208,128,0.12)",
  },
] as const;

function MissionCard({
  mission,
  index,
}: {
  mission: (typeof MISSIONS)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1], delay: index * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-3xl overflow-hidden cursor-default"
      style={{
        background: "rgba(255,255,255,0.022)",
        border: `1px solid ${mission.borderColor}`,
        boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Gradient fill on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ background: mission.gradient }}
      />

      {/* Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          boxShadow: `0 0 80px ${mission.glowColor}, 0 0 160px ${mission.glowColor}50`,
        }}
      />

      {/* Visual area — abstract space visualization placeholder */}
      <div
        className="relative h-56 overflow-hidden"
        style={{
          background: `linear-gradient(160deg, rgba(2,4,8,0.0) 0%, rgba(2,4,8,0.4) 100%), ${mission.gradient}`,
        }}
      >
        {/* Decorative orbital rings specific to each mission */}
        <div className="absolute inset-0 flex items-center justify-center">
          {index === 0 && (
            <svg width="220" height="220" viewBox="0 0 220 220" fill="none" aria-hidden className="opacity-30">
              <circle cx="110" cy="110" r="100" stroke={mission.accentColor} strokeWidth="0.5" strokeDasharray="4 8" />
              <motion.circle cx="110" cy="110" r="100" stroke={mission.accentColor} strokeWidth="1" strokeDasharray="12 180" strokeLinecap="round"
                animate={{ rotate: 360 }} style={{ transformOrigin: "110px 110px" }}
                transition={{ duration: 14, ease: "linear", repeat: Infinity }} />
              <circle cx="110" cy="110" r="40" fill={`${mission.accentColor}18`} />
              <circle cx="110" cy="110" r="40" stroke={mission.accentColor} strokeWidth="0.5" />
              <circle cx="110" cy="110" r="18" fill={`${mission.accentColor}30`} />
              <motion.circle cx="210" cy="110" r="8" fill={`${mission.accentColor}50`}
                animate={{ rotate: 360 }} style={{ transformOrigin: "110px 110px" }}
                transition={{ duration: 14, ease: "linear", repeat: Infinity }} />
            </svg>
          )}
          {index === 1 && (
            <div className="relative w-48 h-48">
              {[1, 0.7, 0.45, 0.28, 0.15].map((scale, i) => (
                <motion.div key={i}
                  className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(ellipse at center, ${mission.accentColor}${Math.round(scale * 20).toString(16).padStart(2, "0")} 0%, transparent 70%)`, transform: `scale(${scale})` }}
                  animate={{ scale: [scale, scale * 1.08, scale], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3 + i, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }} />
              ))}
            </div>
          )}
          {index === 2 && (
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" aria-hidden className="opacity-25">
              <ellipse cx="100" cy="100" rx="90" ry="28" stroke={mission.accentColor} strokeWidth="0.5" />
              <motion.ellipse cx="100" cy="100" rx="90" ry="28" stroke={mission.accentColor} strokeWidth="1.5" strokeDasharray="8 60" strokeLinecap="round"
                animate={{ rotate: 360 }} style={{ transformOrigin: "100px 100px" }}
                transition={{ duration: 10, ease: "linear", repeat: Infinity }} />
              {[0, 40, 80, 130, 175, 210, 260, 310, 355].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const x = 100 + 88 * Math.cos(rad);
                const y = 100 + 27 * Math.sin(rad);
                return <circle key={i} cx={x} cy={y} r={1 + (i % 3)} fill={mission.accentColor} opacity={0.6} />;
              })}
            </svg>
          )}
        </div>

        {/* Mission number badge */}
        <div
          className="absolute top-5 left-5 font-mono text-[10px] tracking-[0.2em] px-3 py-1.5 rounded-full"
          style={{
            background: `${mission.accentColor}12`,
            border: `1px solid ${mission.accentColor}25`,
            color: `${mission.accentColor}80`,
          }}
        >
          {mission.num}
        </div>

        {/* Arrow button */}
        <motion.div
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center"
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
          style={{
            background: `${mission.accentColor}18`,
            border: `1px solid ${mission.accentColor}30`,
            color: mission.accentColor,
          }}
        >
          <ArrowUpRight size={14} />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative p-7">
        <p
          className="font-mono text-[9px] uppercase tracking-[0.25em] mb-2"
          style={{ color: `${mission.accentColor}60` }}
        >
          {mission.subtitle}
        </p>

        <h3
          className="font-display font-bold text-2xl text-white mb-3 leading-tight transition-colors duration-300 group-hover:text-lumina-star-core"
          style={{ letterSpacing: "-0.02em" }}
        >
          {mission.title}
        </h3>

        <p className="text-lumina-star/38 text-[13px] leading-relaxed mb-6 group-hover:text-lumina-star/60 transition-colors duration-400">
          {mission.desc}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[mission.stat1, mission.stat2].map((stat) => (
            <div
              key={stat.lbl}
              className="px-4 py-3 rounded-xl"
              style={{
                background: `${mission.accentColor}08`,
                border: `1px solid ${mission.accentColor}15`,
              }}
            >
              <div
                className="font-mono font-bold text-lg leading-none mb-1"
                style={{ color: mission.accentColor }}
              >
                {stat.val}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-lumina-star/28">
                {stat.lbl}
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {mission.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
              style={{
                background: `${mission.accentColor}08`,
                border: `1px solid ${mission.accentColor}18`,
                color: `${mission.accentColor}60`,
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

export function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section id="missions" ref={ref} className="relative py-36 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,4,8,0.0) 0%, rgba(2,4,12,0.93) 12%, rgba(2,4,12,0.93) 88%, rgba(2,4,8,0.0) 100%)",
        }}
      />

      {/* Star glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 50%, rgba(168,200,255,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="h-px w-8 bg-lumina-star/30" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-lumina-star/40">
              04 / Missions
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
            className="font-display font-black leading-[1.05] tracking-[-0.03em] text-white mb-5"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
          >
            What we&apos;ve
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #80FFC0 0%, #40E0A0 60%, #80FFC0 100%)",
              }}
            >
              launched.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
            className="text-lumina-star/38 text-[15px] leading-relaxed"
          >
            Every shader, every particle system, every orbital path — hand-crafted from
            first principles.
          </motion.p>
        </div>

        {/* Mission cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MISSIONS.map((mission, i) => (
            <MissionCard key={mission.id} mission={mission} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
