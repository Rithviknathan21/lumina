"use client";

import { useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { Compass, Thermometer, Gauge, Clock } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Destinations Section
// Three mini-world cards: Mars, Europa, Titan.
// Each card has a live Three.js planet, 3D mouse tilt, floating animation,
// glassmorphism, and expands into a full immersive experience.
// ─────────────────────────────────────────────────────────────────────────────

// Dynamic imports — Three.js only in browser
const MiniPlanetCanvas = dynamic(
  () => import("@/components/destinations/MiniPlanetCanvas").then((m) => m.MiniPlanetCanvas),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full h-full"
        style={{ background: "radial-gradient(circle at 40% 40%, rgba(40,50,80,0.4), rgba(2,4,8,0.8))" }}
      />
    ),
  }
);

const PlanetExperience = dynamic(
  () => import("@/components/destinations/PlanetExperience").then((m) => m.PlanetExperience),
  { ssr: false }
);

// ── Destination data ──────────────────────────────────────────────────────────

const DESTINATIONS = [
  {
    key: "mars",
    name: "Mars",
    subtitle: "The Red Planet",
    type: "Terrestrial",
    tagline: "First human destination. Ancient riverbeds. The summit of Olympus Mons reaches beyond the clouds.",
    accentColor: "#FF6040",
    glowColor: "rgba(255,96,64,0.22)",
    borderColor: "rgba(255,96,64,0.18)",
    stats: [
      { icon: Compass, label: "Distance", value: "225M km" },
      { icon: Gauge, label: "Gravity", value: "3.72 m/s²" },
      { icon: Thermometer, label: "Temp", value: "−60 °C" },
      { icon: Clock, label: "Sol", value: "24h 37m" },
    ],
    moons: ["Phobos", "Deimos"],
  },
  {
    key: "europa",
    name: "Europa",
    subtitle: "Jupiter's Icy Moon",
    type: "Ocean World",
    tagline: "A cracked ice shell conceals 100km of liquid ocean — the solar system's most likely harbor for life.",
    accentColor: "#60AAFF",
    glowColor: "rgba(96,170,255,0.20)",
    borderColor: "rgba(96,170,255,0.18)",
    stats: [
      { icon: Compass, label: "Distance", value: "628M km" },
      { icon: Gauge, label: "Gravity", value: "1.31 m/s²" },
      { icon: Thermometer, label: "Temp", value: "−160 °C" },
      { icon: Clock, label: "Day", value: "3.5 Earth d" },
    ],
    moons: [],
  },
  {
    key: "titan",
    name: "Titan",
    subtitle: "Saturn's Largest Moon",
    type: "Hazy Moon",
    tagline: "Wrapped in an orange nitrogen fog, its shores lap with seas of liquid methane under a dim sun.",
    accentColor: "#E88030",
    glowColor: "rgba(232,128,48,0.20)",
    borderColor: "rgba(232,128,48,0.18)",
    stats: [
      { icon: Compass, label: "Distance", value: "1.44B km" },
      { icon: Gauge, label: "Gravity", value: "1.35 m/s²" },
      { icon: Thermometer, label: "Temp", value: "−179 °C" },
      { icon: Clock, label: "Day", value: "16 Earth d" },
    ],
    moons: [],
  },
] as const;

type DestinationKey = (typeof DESTINATIONS)[number]["key"];

// ── Card component ────────────────────────────────────────────────────────────

function DestinationCard({
  dest,
  index,
  onExplore,
}: {
  dest: (typeof DESTINATIONS)[number];
  index: number;
  onExplore: (key: DestinationKey) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  // 3D tilt — direct DOM mutation, no React state, no re-renders
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
      el.style.transition = "transform 0.06s linear";
      el.style.transform = `perspective(1000px) rotateX(${py * -8}deg) rotateY(${px * 8}deg)`;
      sp.style.opacity = "1";
      sp.style.background = `radial-gradient(circle at ${x}px ${y}px, ${dest.glowColor} 0%, transparent 65%)`;
    },
    [dest.glowColor]
  );

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    const sp = spotRef.current;
    if (!el || !sp) return;
    el.style.transition = "transform 0.6s cubic-bezier(0.19,1,0.22,1)";
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    sp.style.opacity = "0";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1], delay: index * 0.12 }}
      // Floating bob — outer wrapper, Y axis only
      animate={{ y: [0, -10, 0] }}
      style={{ willChange: "transform" }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 4 + index * 0.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.6,
        }}
        style={{ willChange: "transform" }}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative rounded-3xl overflow-hidden cursor-default"
          style={{
            background: "rgba(4,8,18,0.65)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 24px 80px rgba(0,0,0,0.7)",
            willChange: "transform",
          }}
        >
          {/* Mouse-follow spotlight */}
          <div
            ref={spotRef}
            className="absolute inset-0 pointer-events-none opacity-0"
            style={{ transition: "opacity 0.3s ease" }}
          />

          {/* Hover border glow */}
          <div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 pointer-events-none"
            style={{
              border: `1px solid ${dest.borderColor}`,
              transition: "opacity 0.5s ease",
            }}
          />

          {/* ── Planet canvas area ─────────────────────────────────── */}
          <div className="relative" style={{ height: "220px" }}>
            {/* Canvas */}
            <div className="absolute inset-0">
              <MiniPlanetCanvas planetKey={dest.key} />
            </div>

            {/* Gradient fade to card body */}
            <div
              className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, transparent 0%, rgba(4,8,18,0.85) 80%, rgba(4,8,18,0.95) 100%)",
              }}
            />

            {/* Type badge */}
            <div className="absolute top-4 left-4 z-10">
              <span
                className="font-mono text-[9px] uppercase tracking-[0.3em] px-3 py-1.5 rounded-full"
                style={{
                  background: `${dest.glowColor}`,
                  border: `1px solid ${dest.borderColor}`,
                  color: dest.accentColor,
                }}
              >
                {dest.type}
              </span>
            </div>

            {/* Moon labels */}
            {dest.moons.length > 0 && (
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 items-end">
                {dest.moons.map((moon) => (
                  <span
                    key={moon}
                    className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/28"
                  >
                    {moon}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Card body ──────────────────────────────────────────── */}
          <div className="relative z-10 px-7 pb-7">
            {/* Name */}
            <div className="mb-1">
              <h3
                className="font-display font-black text-[2.2rem] tracking-[-0.05em] leading-none text-white"
                style={{ textShadow: `0 0 40px ${dest.glowColor}` }}
              >
                {dest.name}
              </h3>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] mt-1.5" style={{ color: dest.accentColor, opacity: 0.7 }}>
                {dest.subtitle}
              </p>
            </div>

            {/* Tagline */}
            <p className="text-[0.78rem] leading-[1.75] text-white/35 mt-4 mb-6">
              {dest.tagline}
            </p>

            {/* Stats 2×2 grid */}
            <div
              className="grid grid-cols-2 gap-3 mb-7"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.25rem" }}
            >
              {dest.stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2">
                  <Icon size={11} className="mt-0.5 flex-shrink-0" style={{ color: dest.accentColor, opacity: 0.55 }} />
                  <div>
                    <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25 leading-none mb-1">
                      {label}
                    </div>
                    <div className="font-mono text-[11px] font-bold text-white/65">
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Explore button */}
            <button
              onClick={() => onExplore(dest.key)}
              className="w-full rounded-xl py-3.5 font-mono text-[11px] uppercase tracking-[0.3em] font-bold group/btn relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${dest.glowColor}, rgba(4,8,18,0.4))`,
                border: `1px solid ${dest.borderColor}`,
                color: dest.accentColor,
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore Planet
                <span className="inline-block translate-x-0 group-hover/btn:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </span>
              {/* Button hover fill */}
              <div
                className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-400"
                style={{ background: `linear-gradient(135deg, ${dest.accentColor}18, ${dest.accentColor}08)` }}
              />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function DestinationsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [expanded, setExpanded] = useState<DestinationKey | null>(null);

  const handleExplore = useCallback((key: DestinationKey) => setExpanded(key), []);
  const handleClose = useCallback(() => setExpanded(null), []);

  return (
    <>
      <section
        id="destinations"
        ref={ref}
        className="relative py-40 overflow-hidden"
      >
        {/* Section overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(2,4,8,0) 0%, rgba(2,4,8,0.90) 10%, rgba(2,4,8,0.90) 90%, rgba(2,4,8,0) 100%)",
          }}
        />

        {/* Top glow */}
        <div
          className="absolute top-0 inset-x-0 h-80 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(60,80,167,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

          {/* ── Section header ──────────────────────────────────────── */}
          <div className="mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="relative h-px w-12 bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
                  className="absolute inset-y-0 left-0 right-0 bg-white/40 origin-left"
                />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/35">
                02 — Destinations
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
              className="font-display font-black leading-[1.02] tracking-[-0.04em] text-white mb-6"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)" }}
            >
              Choose your
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(115deg, #FF8060 0%, #FF6040 30%, #60AAFF 60%, #E88030 100%)",
                }}
              >
                destination.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
              className="max-w-lg text-[0.95rem] leading-relaxed text-white/38"
            >
              Three worlds. Each a living universe built entirely in WebGL.
              Explore the surface, watch the moons orbit, feel the atmosphere.
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
              className="mt-12 h-px bg-white/6 origin-left"
            />
          </div>

          {/* ── Cards grid ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {DESTINATIONS.map((dest, i) => (
              <DestinationCard
                key={dest.key}
                dest={dest}
                index={i}
                onExplore={handleExplore}
              />
            ))}
          </div>

          {/* ── Bottom note ────────────────────────────────────────── */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.0, delay: 0.5 }}
            className="mt-16 text-center font-mono text-[9px] uppercase tracking-[0.35em] text-white/18"
          >
            All worlds rendered live · WebGL · No downloads required
          </motion.p>
        </div>
      </section>

      {/* ── Full-screen experience (portal outside section) ─── */}
      <PlanetExperience planetKey={expanded} onClose={handleClose} />
    </>
  );
}
