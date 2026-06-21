"use client";

import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Observatory Time Control Panel
// Floating glass card to control animation speed of Observatory scenes.
// ─────────────────────────────────────────────────────────────────────────────

interface TimeControlPanelProps {
  speed: number;
  onChange: (v: number) => void;
}

const SPEEDS = [
  { label: "Pause", value: 0,   icon: "⏸" },
  { label: "Slow",  value: 0.3, icon: "◂◂" },
  { label: "Normal",value: 1,   icon: "▶" },
  { label: "Fast",  value: 3,   icon: "▶▶" },
] as const;

export function TimeControlPanel({ speed, onChange }: TimeControlPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1], delay: 0.4 }}
      className="absolute top-5 right-5 z-20 rounded-2xl overflow-hidden"
      style={{
        background: "rgba(3,6,16,0.82)",
        border: "1px solid rgba(168,200,255,0.10)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Sheen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)",
        }}
      />

      <div className="relative p-3">
        {/* Header */}
        <div className="font-mono text-[7px] uppercase tracking-[0.35em] text-white/28 text-center mb-2.5 pb-2 border-b border-white/06">
          Time
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-1">
          {SPEEDS.map((s) => {
            const active = speed === s.value;
            return (
              <button
                key={s.label}
                onClick={() => onChange(s.value)}
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 group"
                style={{
                  background: active
                    ? "rgba(168,200,255,0.12)"
                    : "transparent",
                  border: active
                    ? "1px solid rgba(168,200,255,0.28)"
                    : "1px solid transparent",
                }}
              >
                <span
                  className="font-mono text-[9px] w-4 text-center"
                  style={{ color: active ? "#A8C8FF" : "rgba(255,255,255,0.25)" }}
                >
                  {s.icon}
                </span>
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.18em] transition-colors duration-200"
                  style={{ color: active ? "#A8C8FF" : "rgba(255,255,255,0.32)" }}
                >
                  {s.label}
                </span>
                {active && (
                  <motion.div
                    layoutId="speed-indicator"
                    className="absolute right-2 w-1 h-1 rounded-full"
                    style={{ background: "#A8C8FF", boxShadow: "0 0 6px #A8C8FF" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
