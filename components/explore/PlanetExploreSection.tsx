"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Planet Exploration Section
// Three-tab cinematic planet explorer. Three.js components load client-only
// via dynamic import to avoid SSR issues.
// ─────────────────────────────────────────────────────────────────────────────

const MarsExplorer = dynamic(
  () => import("./MarsExplorer").then((m) => ({ default: m.MarsExplorer })),
  { ssr: false, loading: () => <ExplorerSkeleton /> }
);
const EuropaExplorer = dynamic(
  () => import("./EuropaExplorer").then((m) => ({ default: m.EuropaExplorer })),
  { ssr: false, loading: () => <ExplorerSkeleton /> }
);
const TitanExplorer = dynamic(
  () => import("./TitanExplorer").then((m) => ({ default: m.TitanExplorer })),
  { ssr: false, loading: () => <ExplorerSkeleton /> }
);

function ExplorerSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/18 animate-pulse">
        Loading world...
      </div>
    </div>
  );
}

const PLANETS = [
  {
    id: "mars",
    label: "Mars",
    year: "2026",
    accent: "#FF6040",
    desc: "First Human Footprints",
  },
  {
    id: "europa",
    label: "Europa",
    year: "2028",
    accent: "#60AAFF",
    desc: "Ocean World",
  },
  {
    id: "titan",
    label: "Titan",
    year: "2031",
    accent: "#E88030",
    desc: "Hydrocarbon Seas",
  },
] as const;

type PlanetId = (typeof PLANETS)[number]["id"];

export function PlanetExploreSection() {
  const [active, setActive] = useState<PlanetId>("mars");
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const planet = PLANETS.find((p) => p.id === active) ?? PLANETS[0];

  return (
    <section
      id="explore"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Section background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,4,8,0.0) 0%, rgba(4,4,12,0.96) 8%, rgba(4,4,12,0.96) 92%, rgba(2,4,8,0.0) 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="h-px w-8 bg-white/20" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/35">
              03 / Explore
            </span>
            <div className="h-px w-8 bg-white/20" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.08 }}
            className="font-display font-black leading-[1.05] tracking-[-0.03em] text-white mb-3"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
          >
            Enter the{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(120deg, ${planet.accent} 0%, ${planet.accent}99 100%)`,
              }}
            >
              worlds.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.16 }}
            className="text-white/32 text-[14px]"
          >
            Drag to orbit. Click hotspots to explore surface features.
          </motion.p>
        </div>

        {/* Planet tab selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.22 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          {PLANETS.map((p) => {
            const isActive = active === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className="relative group flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-400"
                style={{
                  background: isActive
                    ? `${p.accent}18`
                    : "rgba(255,255,255,0.03)",
                  border: isActive
                    ? `1px solid ${p.accent}40`
                    : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: isActive
                    ? `0 0 28px ${p.accent}18`
                    : "none",
                }}
              >
                {/* Active dot */}
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300"
                  style={{
                    background: p.accent,
                    boxShadow: isActive ? `0 0 8px ${p.accent}` : "none",
                    opacity: isActive ? 1 : 0.3,
                  }}
                />

                <span
                  className="font-display font-bold text-sm transition-colors duration-300"
                  style={{ color: isActive ? p.accent : "rgba(255,255,255,0.38)" }}
                >
                  {p.label}
                </span>

                <span
                  className="font-mono text-[9px] tracking-[0.18em] transition-colors duration-300"
                  style={{ color: isActive ? `${p.accent}80` : "rgba(255,255,255,0.18)" }}
                >
                  {p.year}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Explorer canvas — full cinematic viewport */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            height: "72vh",
            minHeight: "480px",
            maxHeight: "820px",
            border: `1px solid ${planet.accent}18`,
            boxShadow: [
              "0 32px 120px rgba(0,0,0,0.8)",
              `0 0 0 1px ${planet.accent}08`,
              `0 0 120px ${planet.accent}0A`,
            ].join(", "),
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
            >
              {active === "mars" && <MarsExplorer />}
              {active === "europa" && <EuropaExplorer />}
              {active === "titan" && <TitanExplorer />}
            </motion.div>
          </AnimatePresence>

          {/* Corner decorations */}
          <div
            className="absolute top-0 left-0 w-16 h-16 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${planet.accent}12 0%, transparent 60%)`,
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none"
            style={{
              background: `linear-gradient(315deg, ${planet.accent}10 0%, transparent 60%)`,
            }}
          />

          {/* Bottom planet info bar */}
          <div
            className="absolute bottom-0 left-0 right-0 h-12 flex items-center px-6 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(4,4,12,0.85) 0%, transparent 100%)",
            }}
          >
            <span
              className="font-mono text-[8px] uppercase tracking-[0.3em]"
              style={{ color: `${planet.accent}70` }}
            >
              {planet.label} · Mission {planet.year} · {planet.desc}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
