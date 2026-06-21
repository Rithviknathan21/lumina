"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Testimonials Section
// ─────────────────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote:
      "I've never seen anything like this in a browser. The moment Earth appeared and I saw the atmosphere glow, I stopped breathing for a second. Insane work.",
    name: "Aria Chen",
    role: "Creative Director",
    company: "Stellar Studio",
    accent: "#A8C8FF",
    initial: "AC",
  },
  {
    quote:
      "We commissioned LUMINA for our product launch and the reaction from attendees was unanimous: WTF. Our conversion rate doubled. Real-time 3D in the browser is no longer a novelty — it's competitive advantage.",
    name: "Marcus Webb",
    role: "Head of Product",
    company: "Orbit Ventures",
    accent: "#C9A8FF",
    initial: "MW",
  },
  {
    quote:
      "As a WebGL developer myself, I know how hard this is to pull off at 60fps. The procedural Earth shader alone would take most teams months. The attention to detail is surgical.",
    name: "Yuki Tanaka",
    role: "Senior Graphics Engineer",
    company: "Deep Space Labs",
    accent: "#80FFC0",
    initial: "YT",
  },
] as const;

function StarRating({ accent }: { accent: string }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M6 1L7.35 4.3L11 4.57L8.3 6.87L9.18 10.5L6 8.55L2.82 10.5L3.7 6.87L1 4.57L4.65 4.3L6 1Z"
            fill={accent}
            style={{ filter: `drop-shadow(0 0 3px ${accent})` }}
          />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof TESTIMONIALS)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: index * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-3xl overflow-hidden flex flex-col"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow:
          "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: `radial-gradient(ellipse 80% 60% at 30% 20%, ${testimonial.accent}12 0%, transparent 70%)`,
        }}
      />

      <div className="relative p-7 flex flex-col gap-5 flex-1">
        {/* Quote mark */}
        <div
          className="font-display font-black text-6xl leading-none select-none -mt-2"
          style={{
            color: `${testimonial.accent}25`,
            fontStyle: "italic",
          }}
          aria-hidden
        >
          &ldquo;
        </div>

        {/* Stars */}
        <StarRating accent={testimonial.accent} />

        {/* Quote */}
        <blockquote className="flex-1 text-[14px] text-lumina-star/55 leading-relaxed italic group-hover:text-lumina-star/75 transition-colors duration-400">
          {testimonial.quote}
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-4 pt-2 border-t border-white/[0.05]">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-[11px] font-bold tracking-wide"
            style={{
              background: `${testimonial.accent}18`,
              border: `1px solid ${testimonial.accent}30`,
              color: testimonial.accent,
            }}
          >
            {testimonial.initial}
          </div>

          <div className="min-w-0">
            <div className="text-sm font-semibold text-lumina-star-core leading-tight">
              {testimonial.name}
            </div>
            <div className="font-mono text-[10px] text-lumina-star/35 tracking-[0.1em] mt-0.5">
              {testimonial.role} · {testimonial.company}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section id="testimonials" ref={ref} className="relative py-36 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,4,8,0.0) 0%, rgba(6,8,20,0.93) 12%, rgba(6,8,20,0.93) 88%, rgba(2,4,8,0.0) 100%)",
        }}
      />

      {/* Aurora accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(123,94,167,0.055) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="h-px w-8 bg-lumina-star/30" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-lumina-star/40">
              06 / Testimonials
            </span>
            <div className="h-px w-8 bg-lumina-star/30" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
            className="font-display font-black leading-[1.05] tracking-[-0.03em] text-white mb-5"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
          >
            They said{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #C9A8FF 0%, #A8C8FF 60%, #C9A8FF 100%)",
              }}
            >
              WTF.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
            className="text-lumina-star/38 text-[15px] leading-relaxed"
          >
            That&apos;s the reaction we engineer for. Every time.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
