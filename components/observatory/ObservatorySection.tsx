"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { TimeControlPanel } from "./TimeControlPanel";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Observatory Section
// Four cosmic phenomena: Galaxy Cluster, Nebula, Black Hole, Star Cluster.
// Dynamic imports (ssr:false) for all Three.js scene components.
// ─────────────────────────────────────────────────────────────────────────────

function SceneSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#020108]">
      <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/16 animate-pulse">
        Loading scene...
      </div>
    </div>
  );
}

const GalaxyCluster = dynamic(
  () => import("./GalaxyCluster").then((m) => ({ default: m.GalaxyCluster })),
  { ssr: false, loading: () => <SceneSkeleton /> }
);
const NebulaScene = dynamic(
  () => import("./NebulaScene").then((m) => ({ default: m.NebulaScene })),
  { ssr: false, loading: () => <SceneSkeleton /> }
);
const BlackHoleScene = dynamic(
  () => import("./BlackHoleScene").then((m) => ({ default: m.BlackHoleScene })),
  { ssr: false, loading: () => <SceneSkeleton /> }
);
const StarClusterScene = dynamic(
  () => import("./StarClusterScene").then((m) => ({ default: m.StarClusterScene })),
  { ssr: false, loading: () => <SceneSkeleton /> }
);

const TABS = [
  {
    id: "galaxy",
    label: "Galaxy Cluster",
    accent: "#A8C8FF",
    tag: "M87 · Virgo Supercluster",
    desc: "Spiral formation with 7,500 simulated stars",
  },
  {
    id: "nebula",
    label: "Nebula",
    accent: "#C9A8FF",
    tag: "IC 4628 · Prawn Nebula",
    desc: "Volumetric gas clouds in purple, blue and orange",
  },
  {
    id: "blackhole",
    label: "Black Hole",
    accent: "#FF8040",
    tag: "M87* · Event Horizon",
    desc: "Accretion disk, photon ring and relativistic jets",
  },
  {
    id: "starcluster",
    label: "Star Cluster",
    accent: "#80FFC0",
    tag: "NGC 3603 · Globular",
    desc: "11,000-star globular cluster with giant branch stars",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ObservatorySection() {
  const [active, setActive] = useState<TabId>("galaxy");
  const [speed, setSpeed] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const tab = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <section
      id="observatory"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Section background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,4,8,0.0) 0%, rgba(2,2,10,0.96) 7%, rgba(2,2,10,0.96) 93%, rgba(2,4,8,0.0) 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* ── Header ── */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="h-px w-8 bg-white/18" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/32">
              05 / Observatory
            </span>
            <div className="h-px w-8 bg-white/18" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.08 }}
            className="font-display font-black leading-[1.05] tracking-[-0.03em] text-white mb-3"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
          >
            Explore the{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(120deg, ${tab.accent} 0%, ${tab.accent}99 100%)`,
              }}
            >
              universe.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.16 }}
            className="text-white/30 text-[14px]"
          >
            Observe galaxies, nebulae and extreme spacetime phenomena.
          </motion.p>
        </div>

        {/* ── Tab selector ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.22 }}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-8"
        >
          {TABS.map((t) => {
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-350"
                style={{
                  background: isActive ? `${t.accent}16` : "rgba(255,255,255,0.03)",
                  border: isActive
                    ? `1px solid ${t.accent}38`
                    : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: isActive ? `0 0 22px ${t.accent}14` : "none",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300"
                  style={{
                    background: t.accent,
                    boxShadow: isActive ? `0 0 7px ${t.accent}` : "none",
                    opacity: isActive ? 1 : 0.28,
                  }}
                />
                <span
                  className="font-display font-bold text-[13px] transition-colors duration-250"
                  style={{ color: isActive ? t.accent : "rgba(255,255,255,0.35)" }}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* ── Main canvas area ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.975 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            height: "68vh",
            minHeight: "460px",
            maxHeight: "780px",
            border: `1px solid ${tab.accent}16`,
            boxShadow: [
              "0 32px 120px rgba(0,0,0,0.85)",
              `0 0 0 1px ${tab.accent}06`,
            ].join(", "),
          }}
        >
          {/* Scene */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {active === "galaxy"      && <GalaxyCluster speed={speed} />}
              {active === "nebula"      && <NebulaScene   speed={speed} />}
              {active === "blackhole"   && <BlackHoleScene speed={speed} />}
              {active === "starcluster" && <StarClusterScene speed={speed} />}
            </motion.div>
          </AnimatePresence>

          {/* Time control panel — DOM overlay */}
          <TimeControlPanel speed={speed} onChange={setSpeed} />

          {/* Bottom info bar */}
          <div
            className="absolute bottom-0 left-0 right-0 h-14 flex items-center px-6 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(2,2,10,0.88) 0%, transparent 100%)",
            }}
          >
            <div className="flex items-center gap-4">
              <span
                className="font-mono text-[7.5px] uppercase tracking-[0.35em]"
                style={{ color: `${tab.accent}70` }}
              >
                {tab.tag}
              </span>
              <span className="w-px h-3 bg-white/12" />
              <span className="font-mono text-[7.5px] text-white/22 tracking-[0.12em]">
                {tab.desc}
              </span>
            </div>
          </div>

          {/* Corner gradients */}
          <div
            className="absolute top-0 left-0 w-20 h-20 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${tab.accent}10 0%, transparent 60%)`,
            }}
          />
          <div
            className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
            style={{
              background: `linear-gradient(225deg, ${tab.accent}08 0%, transparent 60%)`,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
