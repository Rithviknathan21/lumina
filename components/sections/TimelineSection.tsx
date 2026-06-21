"use client";

import { useRef, useCallback } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Journey Timeline
// Awwwards-quality space mission timeline.
// Milestones: Mars → Europa → Titan → Beyond
// Features: scroll-driven progress spine, 3D tilt, glassmorphism, parallax depth
// ─────────────────────────────────────────────────────────────────────────────

const MISSIONS = [
  {
    id: "mars",
    year: "2026",
    quarter: "Q2",
    title: "Mars",
    subtitle: "First Human Footprints",
    desc: "After a 7-month transit through the void, humanity descends on Chryse Planitia. Olympus Mons towers 22km against a butterscotch horizon — the first mountain any human has seen on another world.",
    tags: ["Crewed Descent", "Surface EVA", "Hab Deploy"],
    accent: "#FF6040",
    glow: "rgba(255,96,64,0.22)",
    border: "rgba(255,96,64,0.18)",
    icon: "◉",
    metric: { label: "Transit time", value: "7 months" },
    index: 0,
  },
  {
    id: "europa",
    year: "2028",
    quarter: "Q4",
    title: "Europa",
    subtitle: "Into the Ice Ocean",
    desc: "A cryobot drills through 10km of fractured ice and releases a submersible into darkness — an ocean 100km deep that has not seen light in four billion years.",
    tags: ["Ice Drilling", "Ocean Survey", "Biosignature Hunt"],
    accent: "#60AAFF",
    glow: "rgba(96,170,255,0.20)",
    border: "rgba(96,170,255,0.18)",
    icon: "◎",
    metric: { label: "Ocean depth", value: "100+ km" },
    index: 1,
  },
  {
    id: "titan",
    year: "2031",
    quarter: "Q1",
    title: "Titan",
    subtitle: "Seas of Methane",
    desc: "A drone-submarine descends through orange nitrogen smog and skims across Ligeia Mare — a sea of liquid methane shimmering under the pale light of distant Saturn.",
    tags: ["Drone Flight", "Methane Sea", "Huygens-2"],
    accent: "#E88030",
    glow: "rgba(232,128,48,0.20)",
    border: "rgba(232,128,48,0.18)",
    icon: "⬡",
    metric: { label: "Atmosphere", value: "1.5× Earth" },
    index: 2,
  },
  {
    id: "beyond",
    year: "2038",
    quarter: "∞",
    title: "Beyond",
    subtitle: "The Outer Darkness",
    desc: "Humanity's probe crosses the heliopause — entering interstellar space for only the second time in history. A golden record is sealed inside for whoever finds it next.",
    tags: ["Interstellar", "Heliopause", "Legacy"],
    accent: "#C9A8FF",
    glow: "rgba(201,168,255,0.16)",
    border: "rgba(201,168,255,0.16)",
    icon: "✦",
    metric: { label: "Boundary", value: "122 AU" },
    index: 3,
  },
] as const;

type Mission = (typeof MISSIONS)[number];

// ── Glass mission card ─────────────────────────────────────────────────────────

function MissionCard({
  mission,
  align,
  globalProgress,
}: {
  mission: Mission;
  align: "left" | "right";
  globalProgress: MotionValue<number>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-50px" });

  // Alternating parallax: left cards float up, right cards float down — creates depth
  const sign = align === "left" ? 1 : -1;
  const mag = 12 + mission.index * 6;
  const yParallax = useTransform(globalProgress, [0, 1], [sign * mag * 0.5, -sign * mag * 0.5]);

  // 3D tilt via direct DOM — no React state, no re-renders
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      const sp = spotRef.current;
      if (!el || !sp) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transition = "transform 0.08s linear";
      el.style.transform = `perspective(1100px) rotateX(${py * -7}deg) rotateY(${px * 7}deg)`;
      el.style.boxShadow = [
        "inset 0 1px 0 rgba(255,255,255,0.10)",
        "0 8px 20px rgba(0,0,0,0.55)",
        `0 30px 80px rgba(0,0,0,0.75)`,
        `0 60px 120px ${mission.glow}`,
      ].join(", ");
      sp.style.opacity = "1";
      sp.style.background = `radial-gradient(circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, ${mission.glow} 0%, transparent 62%)`;
    },
    [mission.glow]
  );

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    const sp = spotRef.current;
    if (!el || !sp) return;
    el.style.transition = "transform 0.65s cubic-bezier(0.19,1,0.22,1), box-shadow 0.65s ease";
    el.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg)";
    el.style.boxShadow = [
      "inset 0 1px 0 rgba(255,255,255,0.06)",
      "0 4px 8px rgba(0,0,0,0.35)",
      "0 20px 60px rgba(0,0,0,0.6)",
    ].join(", ");
    sp.style.opacity = "0";
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`flex ${align === "left" ? "justify-end" : "justify-start"}`}
    >
      {/* Scroll-driven parallax */}
      <motion.div
        style={{ y: yParallax }}
        initial={{ opacity: 0, x: align === "left" ? 48 : -48 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1], delay: 0.05 }}
      >
        {/* Floating bob — separate axis so it doesn't fight with parallax */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 4.5 + mission.index * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: mission.index * 0.55,
          }}
        >
          {/* Card */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-2xl overflow-hidden cursor-default"
            style={{
              width: "min(330px, 88vw)",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 50%, rgba(0,0,0,0.12) 100%)",
              border: `1px solid ${mission.border}`,
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              boxShadow: [
                "inset 0 1px 0 rgba(255,255,255,0.06)",
                "0 4px 8px rgba(0,0,0,0.35)",
                "0 20px 60px rgba(0,0,0,0.6)",
              ].join(", "),
              willChange: "transform",
            }}
          >
            {/* Mouse spotlight */}
            <div
              ref={spotRef}
              className="absolute inset-0 pointer-events-none opacity-0"
              style={{ transition: "opacity 0.3s ease" }}
            />

            {/* Top diagonal glass sheen */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 28%, transparent 55%)",
              }}
            />

            {/* Top accent line */}
            <div
              className="absolute top-0 left-5 right-5 h-px pointer-events-none"
              style={{
                background: `linear-gradient(to right, transparent, ${mission.accent}50, transparent)`,
              }}
            />

            {/* Content */}
            <div className="relative z-10 p-6 pt-7">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div
                    className="font-mono text-[8px] uppercase tracking-[0.38em] mb-1.5"
                    style={{ color: `${mission.accent}80` }}
                  >
                    {mission.quarter} {mission.year}
                  </div>
                  <h3
                    className="font-display font-black text-[1.6rem] tracking-[-0.04em] text-white leading-none"
                    style={{ textShadow: `0 0 30px ${mission.glow}` }}
                  >
                    {mission.title}
                  </h3>
                  <p
                    className="font-mono text-[8.5px] uppercase tracking-[0.22em] mt-1.5"
                    style={{ color: `${mission.accent}70` }}
                  >
                    {mission.subtitle}
                  </p>
                </div>

                {/* Metric */}
                <div className="text-right pl-4 flex-shrink-0">
                  <div
                    className="font-mono font-bold text-[0.85rem]"
                    style={{ color: mission.accent }}
                  >
                    {mission.metric.value}
                  </div>
                  <div className="font-mono text-[7.5px] uppercase tracking-[0.2em] text-white/22 mt-0.5">
                    {mission.metric.label}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div
                className="mb-4 h-px"
                style={{
                  background: `linear-gradient(to right, ${mission.accent}30, ${mission.accent}08, transparent)`,
                }}
              />

              {/* Description */}
              <p className="text-[0.77rem] leading-[1.78] text-white/36 mb-5">
                {mission.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {mission.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[7.5px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
                    style={{
                      background: `${mission.accent}0C`,
                      border: `1px solid ${mission.border}`,
                      color: `${mission.accent}60`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom depth wash */}
            <div
              className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none"
              style={{
                background: `linear-gradient(to top, rgba(0,0,0,0.15), transparent)`,
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Glowing orbital node ───────────────────────────────────────────────────────

function OrbitalNode({ mission, isVisible }: { mission: Mission; isVisible: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={isVisible ? { scale: 1, opacity: 1 } : {}}
      transition={{
        duration: 0.75,
        ease: [0.175, 0.885, 0.32, 1.275],
        delay: 0.1,
      }}
      className="relative flex items-center justify-center flex-shrink-0"
      style={{
        width: 50,
        height: 50,
        borderRadius: "50%",
        background: `radial-gradient(circle at 38% 38%, ${mission.accent}22 0%, rgba(2,4,8,0.96) 68%)`,
        border: `1px solid ${mission.accent}55`,
        boxShadow: [
          `0 0 0 7px rgba(2,4,8,0.65)`,
          `0 0 22px ${mission.accent}45`,
          `0 0 55px ${mission.accent}18`,
        ].join(", "),
        zIndex: 10,
      }}
    >
      {/* Inner glow disc */}
      <div
        className="absolute inset-3 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${mission.accent}20, transparent)`,
        }}
      />

      {/* Pulse ring 1 */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ border: `1px solid ${mission.accent}38` }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeOut",
          delay: mission.index * 0.65,
        }}
      />

      {/* Pulse ring 2 */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ border: `1px solid ${mission.accent}20` }}
        animate={{ scale: [1, 2.4, 1], opacity: [0.4, 0, 0.4] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeOut",
          delay: mission.index * 0.65 + 1.1,
        }}
      />

      {/* Icon */}
      <span
        className="relative z-10 select-none"
        style={{
          fontSize: "1rem",
          color: mission.accent,
          filter: `drop-shadow(0 0 5px ${mission.accent})`,
        }}
      >
        {mission.icon}
      </span>
    </motion.div>
  );
}

// ── Single timeline row ────────────────────────────────────────────────────────

function MilestoneRow({
  mission,
  globalProgress,
}: {
  mission: Mission;
  globalProgress: MotionValue<number>;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rowRef, { once: true, margin: "-55px" });
  const isLeft = mission.index % 2 === 0;

  return (
    <div
      ref={rowRef}
      className="grid items-center"
      style={{
        gridTemplateColumns: "1fr 60px 1fr",
        paddingTop: "2.5rem",
        paddingBottom: "2.5rem",
      }}
    >
      {/* Left */}
      <div className="pr-6 md:pr-10">
        {isLeft && (
          <MissionCard mission={mission} align="left" globalProgress={globalProgress} />
        )}
      </div>

      {/* Center node — sits on the spine */}
      <div className="flex justify-center relative">
        <OrbitalNode mission={mission} isVisible={inView} />
      </div>

      {/* Right */}
      <div className="pl-6 md:pl-10">
        {!isLeft && (
          <MissionCard mission={mission} align="right" globalProgress={globalProgress} />
        )}
      </div>
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────────

export function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-80px" });

  // Scroll progress within the section drives the animated progress spine
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 25%"],
  });

  // Progress line height
  const progressH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="timeline" ref={sectionRef} className="relative py-36 overflow-hidden">
      {/* Dark overlay — space shows through at edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,4,8,0) 0%, rgba(3,5,12,0.93) 8%, rgba(3,5,12,0.93) 92%, rgba(2,4,8,0) 100%)",
        }}
      />

      {/* Nebula accent left */}
      <div
        className="absolute left-0 top-1/3 w-[45vw] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 50%, rgba(80,100,200,0.045) 0%, transparent 65%)",
        }}
      />
      {/* Nebula accent right */}
      <div
        className="absolute right-0 bottom-1/3 w-[45vw] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 50%, rgba(200,140,80,0.04) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">

        {/* ── Section header ── */}
        <div ref={headerRef} className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="h-px w-10" style={{ background: "rgba(255,255,255,0.10)" }} />
            <span className="font-mono text-[9px] uppercase tracking-[0.42em] text-white/28">
              03 — Mission Timeline
            </span>
            <div className="h-px w-10" style={{ background: "rgba(255,255,255,0.10)" }} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.05, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
            className="font-display font-black leading-[1.04] tracking-[-0.04em] text-white mb-6"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            The journey
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(115deg, #FF6040 0%, #E88030 30%, #60AAFF 65%, #C9A8FF 100%)",
              }}
            >
              outward.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
            className="max-w-lg mx-auto text-[0.9rem] leading-relaxed text-white/34"
          >
            Four destinations. Each farther than the last. Each a harder question about what it means to be alive.
          </motion.p>

          {/* Decorative scan line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
            className="mt-12 h-px origin-left"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)",
            }}
          />
        </div>

        {/* ── Timeline body ── */}
        <div className="relative">
          {/* Background spine (always visible, dim) */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: "calc(50% - 0.5px)",
              top: "3.5rem",
              bottom: "3.5rem",
              width: "1px",
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.07) 12%, rgba(255,255,255,0.07) 88%, transparent)",
            }}
          />

          {/* Scroll-driven progress line */}
          <div
            className="absolute pointer-events-none overflow-hidden"
            style={{
              left: "calc(50% - 0.5px)",
              top: "3.5rem",
              bottom: "3.5rem",
              width: "1px",
            }}
          >
            <motion.div
              className="w-full origin-top"
              style={{
                height: progressH,
                background:
                  "linear-gradient(to bottom, #FF6040 0%, #E88030 30%, #60AAFF 65%, #C9A8FF 100%)",
                boxShadow: "0 0 8px rgba(168,200,255,0.35)",
              }}
            />
          </div>

          {/* Travelling orbital dot 1 */}
          <div
            className="absolute pointer-events-none overflow-hidden"
            style={{
              left: "calc(50% - 3px)",
              top: "3.5rem",
              bottom: "3.5rem",
              width: "6px",
            }}
          >
            <motion.div
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: 0,
                background: "#A8C8FF",
                boxShadow: "0 0 8px #A8C8FF, 0 0 18px rgba(168,200,255,0.4)",
                top: 0,
              }}
              animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "linear", delay: 1.0 }}
            />
            {/* Second dot with offset */}
            <motion.div
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: "1px",
                background: "#FF8050",
                boxShadow: "0 0 6px #FF8050",
                top: 0,
              }}
              animate={{ top: ["0%", "100%"], opacity: [0, 0.8, 0.8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "linear", delay: 3.75 }}
            />
          </div>

          {/* Milestone rows */}
          <div>
            {MISSIONS.map((mission) => (
              <MilestoneRow
                key={mission.id}
                mission={mission}
                globalProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.0, delay: 0.3 }}
          className="text-center mt-20 font-mono text-[8.5px] uppercase tracking-[0.35em] text-white/14"
        >
          Projected timeline · Subject to launch windows · All dates approximate
        </motion.p>
      </div>
    </section>
  );
}
