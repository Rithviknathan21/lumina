"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Explore InfoPanel
// Glass overlay that appears when a surface hotspot is clicked.
// ─────────────────────────────────────────────────────────────────────────────

export interface HotspotInfo {
  title: string;
  subtitle: string;
  description: string;
  stats: { label: string; value: string }[];
  accentColor: string;
}

interface InfoPanelProps {
  info: HotspotInfo | null;
  onClose: () => void;
}

export function InfoPanel({ info, onClose }: InfoPanelProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {info && (
        <motion.div
          key={info.title}
          initial={{ opacity: 0, x: 56 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 56 }}
          transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
          className="absolute top-0 right-0 bottom-0 w-72 z-20 flex items-center pointer-events-none"
          style={{ padding: "2rem 1.25rem" }}
        >
          <div
            className="w-full rounded-2xl p-6 pointer-events-auto relative"
            style={{
              background: "rgba(3,6,16,0.88)",
              border: `1px solid ${info.accentColor}28`,
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              boxShadow: [
                "inset 0 1px 0 rgba(255,255,255,0.07)",
                `0 0 70px ${info.accentColor}12`,
                "0 24px 70px rgba(0,0,0,0.75)",
              ].join(", "),
            }}
          >
            {/* Top gradient line */}
            <div
              className="absolute top-0 left-5 right-5 h-px pointer-events-none"
              style={{
                background: `linear-gradient(to right, transparent, ${info.accentColor}55, transparent)`,
              }}
            />

            {/* Glass sheen */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 30%, transparent 55%)",
              }}
            />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full flex items-center justify-center z-10"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <X size={12} className="text-white/55" />
            </button>

            {/* Header */}
            <div className="relative z-10 mb-4 pr-7">
              <div
                className="font-mono text-[7.5px] uppercase tracking-[0.4em] mb-1.5"
                style={{ color: `${info.accentColor}90` }}
              >
                {info.subtitle}
              </div>
              <h3
                className="font-display font-black text-[1.45rem] tracking-[-0.04em] text-white leading-none"
                style={{ textShadow: `0 0 24px ${info.accentColor}50` }}
              >
                {info.title}
              </h3>
            </div>

            {/* Divider */}
            <div
              className="relative z-10 mb-4 h-px"
              style={{
                background: `linear-gradient(to right, ${info.accentColor}35, ${info.accentColor}08, transparent)`,
              }}
            />

            {/* Description */}
            <p className="relative z-10 text-[0.74rem] leading-[1.8] text-white/36 mb-5">
              {info.description}
            </p>

            {/* Stats grid */}
            <div className="relative z-10 grid grid-cols-2 gap-2">
              {info.stats.map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl p-2.5"
                  style={{
                    background: `${info.accentColor}0A`,
                    border: `1px solid ${info.accentColor}18`,
                  }}
                >
                  <div className="font-mono text-[7px] uppercase tracking-[0.22em] text-white/22 mb-1">
                    {label}
                  </div>
                  <div
                    className="font-mono text-[11px] font-bold"
                    style={{ color: `${info.accentColor}CC` }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <p className="relative z-10 mt-4 font-mono text-[7px] uppercase tracking-[0.22em] text-white/14 text-center">
              Press Esc or click ✕ to return to orbit
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
