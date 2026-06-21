"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { ExperienceHUD } from "@/components/layout/ExperienceHUD";
import { CursorTrail } from "@/components/shared/CursorTrail";
import { useLoading } from "@/hooks/use-loading";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Immersive Experience Page
// ─────────────────────────────────────────────────────────────────────────────

const SceneCanvas = dynamic(
  () => import("@/components/three/SceneCanvas").then((m) => m.SceneCanvas),
  { ssr: false }
);

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function ExperiencePage() {
  const { phase, progress, setPhase } = useLoading();
  const [hudVisible, setHudVisible] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      setPhase("booting");  await sleep(300);
      setPhase("assets");   await sleep(800);
      setPhase("scene");    await sleep(700);
      setPhase("shaders");  await sleep(600);
      setPhase("ready");    await sleep(400);
      setPhase("done");
      setTimeout(() => setHudVisible(true), 900);
    })();
  }, [setPhase]);

  const isDone = phase === "done";

  return (
    <div className="fixed inset-0 overflow-hidden bg-lumina-void">
      {/* Three.js Scene */}
      <SceneCanvas quality="high" className="absolute inset-0 z-0" />

      {/* Cursor energy trail */}
      <CursorTrail />

      {/* Loading screen — exits with AnimatePresence */}
      <AnimatePresence>
        {!isDone && (
          <motion.div
            key="loading"
            className="absolute inset-0 z-50"
            exit={{ opacity: 0, transition: { duration: 1.4, ease: [0.77, 0, 0.175, 1] } }}
          >
            <LoadingScreen phase={phase} progress={progress} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD — fades in after loading exits */}
      <AnimatePresence>
        {isDone && hudVisible && (
          <motion.div
            key="hud"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <ExperienceHUD />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(2,4,8,0.55) 0%, transparent 60%)",
            "radial-gradient(ellipse 50% 40% at 0% 50%, rgba(123,94,167,0.04) 0%, transparent 50%)",
          ].join(", "),
        }}
        aria-hidden
      />
    </div>
  );
}
