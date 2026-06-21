"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Home, Settings, Volume2, VolumeX, Gauge, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { HUDLabel, HUDDataRow, HUDSeparator } from "@/components/shared/HUDLabel";
import { hudVariants, hudItemVariants } from "@/animations/framer-variants";
import { useAudio } from "@/hooks/use-audio";
import { usePerformance } from "@/hooks/use-performance";
import type { GraphicsQuality } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Experience HUD (self-contained, no required props)
// ─────────────────────────────────────────────────────────────────────────────

const QUALITY_OPTIONS: GraphicsQuality[] = ["low", "medium", "high", "ultra"];

// Live FPS meter using rAF
function useFPS() {
  const [fps, setFps] = useState(60);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const loop = (now: number) => {
      frameCountRef.current++;
      if (now - lastTimeRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return fps;
}

function TopBar() {
  return (
    <motion.div
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4"
      variants={hudItemVariants}
    >
      <Link href={ROUTES.HOME}
        className="flex items-center gap-2 text-lumina-star/50 hover:text-lumina-star transition-colors duration-300 group"
        aria-label="Back to home">
        <Home size={13} aria-hidden />
        <span className="font-mono text-2xs uppercase tracking-[0.15em]">LUMINA</span>
      </Link>

      <div className="flex items-center gap-3">
        <span className="relative flex h-1.5 w-1.5" aria-hidden>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lumina-star opacity-50" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-lumina-star" />
        </span>
        <HUDLabel dim>Live Rendering</HUDLabel>
      </div>

      <div className="w-24" aria-hidden />
    </motion.div>
  );
}

function BottomBar() {
  const fps = useFPS();
  const { isEnabled, toggle } = useAudio();
  const { quality, setQuality } = usePerformance();
  const [showQuality, setShowQuality] = useState(false);

  const fpsColor = fps >= 55 ? "text-emerald-400" : fps >= 30 ? "text-lumina-solar" : "text-red-400";

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-20 flex items-end justify-between px-6 py-5 gap-4"
      variants={hudItemVariants}
    >
      {/* Left: metrics */}
      <GlassPanel className="px-4 py-2.5 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Gauge size={10} className="text-lumina-star/30" aria-hidden />
          <span className={cn("font-mono text-2xs tabular-nums", fpsColor)}>{fps} FPS</span>
        </div>
        <HUDSeparator className="w-px h-4" />
        <HUDDataRow label="Quality" value={quality.toUpperCase()} />
        <HUDSeparator className="w-px h-4" />
        <div className="flex items-center gap-1.5">
          <Zap size={10} className="text-lumina-star/30" />
          <span className="font-mono text-2xs text-lumina-star/50">WebGL 2</span>
        </div>
      </GlassPanel>

      {/* Right: controls */}
      <div className="flex items-center gap-2">
        {/* Audio toggle */}
        <button
          onClick={toggle}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-full",
            "bg-lumina-glass border border-lumina-glass-border backdrop-blur-xl",
            "text-lumina-star/50 hover:text-lumina-star hover:bg-lumina-glass-light",
            "transition-all duration-300 shadow-glass"
          )}
          aria-label={isEnabled ? "Mute audio" : "Enable audio"}
          aria-pressed={isEnabled}
        >
          {isEnabled ? <Volume2 size={13} aria-hidden /> : <VolumeX size={13} aria-hidden />}
        </button>

        {/* Quality selector */}
        <div className="relative">
          <button
            onClick={() => setShowQuality((v) => !v)}
            className={cn(
              "flex items-center gap-2 px-4 h-10 rounded-full",
              "bg-lumina-glass border border-lumina-glass-border backdrop-blur-xl",
              "font-mono text-2xs uppercase tracking-[0.12em]",
              "text-lumina-star/50 hover:text-lumina-star hover:bg-lumina-glass-light",
              "transition-all duration-300 shadow-glass"
            )}
            aria-label="Change graphics quality"
            aria-expanded={showQuality}
          >
            <Settings size={12} aria-hidden />
            Quality
          </button>
          {showQuality && (
            <motion.div className="absolute bottom-full right-0 mb-2"
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}>
              <GlassPanel className="p-2 flex flex-col gap-1 min-w-[110px]">
                {QUALITY_OPTIONS.map((q) => (
                  <button key={q}
                    onClick={() => { setQuality(q); setShowQuality(false); }}
                    className={cn(
                      "px-3 py-2 rounded-xl text-left font-mono text-2xs uppercase tracking-[0.12em] transition-all duration-200",
                      quality === q ? "bg-lumina-star/10 text-lumina-star" : "text-lumina-star/40 hover:text-lumina-star hover:bg-lumina-glass-light"
                    )}
                    aria-pressed={quality === q}
                  >{q}</button>
                ))}
              </GlassPanel>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Exported with NO required props — fully self-contained
export function ExperienceHUD() {
  return (
    <motion.div
      className="fixed inset-0 z-20 pointer-events-none"
      variants={hudVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="pointer-events-auto">
        <TopBar />
      </div>
      {/* Separator lines */}
      <div className="absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lumina-star/6 to-transparent pointer-events-none" />
      <div className="absolute bottom-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lumina-star/6 to-transparent pointer-events-none" />
      <div className="pointer-events-auto">
        <BottomBar />
      </div>
    </motion.div>
  );
}
