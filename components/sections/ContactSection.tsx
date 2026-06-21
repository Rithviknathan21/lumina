"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Send, ArrowUpRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Contact Section
// ─────────────────────────────────────────────────────────────────────────────

const COORDINATES = [
  { label: "Signal", value: "hello@lumina.space" },
  { label: "Frequency", value: "Open for missions" },
  { label: "Orbit", value: "Earth, Sol System" },
  { label: "Response", value: "< 24 standard hours" },
] as const;

const SOCIAL_LINKS = [
  { label: "X", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Dribbble", href: "#" },
  { label: "LinkedIn", href: "#" },
] as const;

type FormStatus = "idle" | "sending" | "sent" | "error";

function GlowInput({
  label,
  type = "text",
  placeholder,
  multiline = false,
  accent = "#A8C8FF",
}: {
  label: string;
  type?: string;
  placeholder: string;
  multiline?: boolean;
  accent?: string;
}) {
  const [focused, setFocused] = useState(false);
  const baseStyle = {
    background: "rgba(255,255,255,0.025)",
    border: `1px solid ${focused ? `${accent}35` : "rgba(255,255,255,0.07)"}`,
    boxShadow: focused ? `0 0 0 3px ${accent}10, 0 0 20px ${accent}0A` : "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
    outline: "none",
    color: "#E8F0FF",
    caretColor: accent,
    fontSize: "14px",
    resize: "none" as const,
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        className="font-mono text-[10px] uppercase tracking-[0.25em]"
        style={{ color: focused ? `${accent}80` : "rgba(168,200,255,0.35)" }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={5}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-4 py-3 rounded-xl placeholder:text-lumina-star/20"
          style={baseStyle}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-4 py-3 rounded-xl placeholder:text-lumina-star/20"
          style={baseStyle}
        />
      )}
    </div>
  );
}

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1600);
  };

  return (
    <section id="contact" ref={ref} className="relative py-36 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,4,8,0.0) 0%, rgba(2,4,14,0.95) 12%, rgba(2,4,14,0.95) 88%, rgba(2,4,8,0.0) 100%)",
        }}
      />

      {/* Blue nebula top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(168,200,255,0.055) 0%, transparent 65%)",
        }}
      />

      {/* Violet bottom */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 100%, rgba(123,94,167,0.06) 0%, transparent 60%)",
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
              07 / Contact
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
            Open a{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #A8C8FF 0%, #C9A8FF 60%, #A8C8FF 100%)",
              }}
            >
              channel.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
            className="text-lumina-star/38 text-[15px] leading-relaxed"
          >
            Have a mission that demands the impossible? We&apos;re ready to transmit.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1], delay: 0.15 }}
          >
            {status === "sent" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }}
                className="flex flex-col items-center justify-center gap-6 py-24 text-center rounded-3xl"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(168,200,255,0.15)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    background: "rgba(168,200,255,0.12)",
                    border: "1px solid rgba(168,200,255,0.25)",
                    boxShadow: "0 0 40px rgba(168,200,255,0.15)",
                  }}
                >
                  ✦
                </div>
                <h3 className="font-display font-bold text-2xl text-lumina-star-core">
                  Signal received.
                </h3>
                <p className="text-lumina-star/45 text-sm max-w-xs">
                  We&apos;ll respond within 24 standard hours. Stand by for transmission.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <GlowInput label="Name" placeholder="Commander Shepard" />
                  <GlowInput label="Email" type="email" placeholder="your@orbit.space" />
                </div>
                <GlowInput label="Mission" placeholder="We need a solar system for our launch event..." />
                <GlowInput
                  label="Message"
                  placeholder="Tell us about your mission parameters, timeline, and any special requirements..."
                  multiline
                />

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  className="relative overflow-hidden flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-lumina-void transition-all duration-300 disabled:opacity-60"
                  style={{
                    background: status === "sending"
                      ? "rgba(168,200,255,0.6)"
                      : "#A8C8FF",
                    boxShadow:
                      "0 0 40px rgba(168,200,255,0.25), 0 0 80px rgba(168,200,255,0.1), inset 0 1px 0 rgba(255,255,255,0.3)",
                  }}
                >
                  {/* Shine sweep */}
                  <span
                    className="absolute inset-0 opacity-0 hover:opacity-100 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.25) 50%,transparent 70%)",
                      animation: "shine 2s ease-in-out infinite",
                    }}
                  />
                  {status === "sending" ? (
                    <>
                      <motion.div
                        className="w-4 h-4 rounded-full border-2 border-lumina-void/40 border-t-lumina-void"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
                      />
                      Transmitting...
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      Transmit Message
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Right: Info panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1], delay: 0.25 }}
            className="flex flex-col gap-6"
          >
            {/* Coordinates panel */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
              }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-lumina-star/35 mb-5">
                Transmission Parameters
              </div>

              <div className="space-y-4">
                {COORDINATES.map((coord, i) => (
                  <motion.div
                    key={coord.label}
                    initial={{ opacity: 0, x: 12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1], delay: 0.3 + i * 0.07 }}
                    className="flex items-center justify-between gap-4 py-3 border-b border-white/[0.04] last:border-b-0"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-lumina-star/30">
                      {coord.label}
                    </span>
                    <span className="text-[13px] text-lumina-star-core/70">
                      {coord.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.022)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-lumina-star/35 mb-5">
                Alternative Channels
              </div>

              <div className="grid grid-cols-2 gap-3">
                {SOCIAL_LINKS.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.45 + i * 0.06 }}
                    whileHover={{ y: -2 }}
                    className="group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <span className="text-sm text-lumina-star/55 group-hover:text-lumina-star transition-colors duration-300">
                      {link.label}
                    </span>
                    <ArrowUpRight
                      size={12}
                      className="text-lumina-star/25 group-hover:text-lumina-star/60 transition-colors duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Coordinate art */}
            <div
              className="rounded-2xl p-6 hidden lg:block"
              style={{
                background: "rgba(255,255,255,0.018)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-lumina-star/25 mb-4">
                Current Position
              </div>
              <div className="font-mono text-[11px] text-lumina-star/18 leading-relaxed space-y-1">
                <div>RA  10h 44m 57.3s</div>
                <div>Dec +41° 16′ 09.4″</div>
                <div>Dist 778.5 Gly</div>
                <div className="mt-2 text-lumina-star/12">{'// Sol–Earth L2 Lagrange'}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
