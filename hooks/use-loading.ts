"use client";

import { useState, useCallback, useRef } from "react";
import type { LoadingState, LoadingPhase } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Loading State Manager
// Exposes both flat (phase/progress) and composite (state) API
// so callers can use whichever pattern they prefer.
// ─────────────────────────────────────────────────────────────────────────────

const PHASE_MESSAGES: Record<LoadingPhase, string> = {
  booting:  "Initializing systems...",
  assets:   "Loading universe assets...",
  scene:    "Generating scene geometry...",
  shaders:  "Compiling GLSL shaders...",
  ready:    "Preparing experience...",
  done:     "Entering LUMINA",
};

const PHASE_PROGRESS: Record<LoadingPhase, number> = {
  booting:  8,
  assets:   30,
  scene:    60,
  shaders:  82,
  ready:    96,
  done:     100,
};

export function useLoading() {
  const [state, setState] = useState<LoadingState>({
    phase:      "booting",
    progress:   0,
    message:    PHASE_MESSAGES.booting,
    isComplete: false,
  });
  const progressRef = useRef(0);

  const setPhase = useCallback((phase: LoadingPhase) => {
    const progress = PHASE_PROGRESS[phase];
    progressRef.current = progress;
    setState({
      phase,
      progress,
      message:    PHASE_MESSAGES[phase],
      isComplete: phase === "done",
    });
  }, []);

  const setProgress = useCallback((progress: number) => {
    const clamped = Math.min(100, Math.max(0, progress));
    progressRef.current = clamped;
    setState((prev) => ({ ...prev, progress: clamped }));
  }, []);

  const complete = useCallback(() => setPhase("done"), [setPhase]);

  const reset = useCallback(() => {
    progressRef.current = 0;
    setState({
      phase:      "booting",
      progress:   0,
      message:    PHASE_MESSAGES.booting,
      isComplete: false,
    });
  }, []);

  return {
    // Composite
    state,
    // Flat conveniences — used by experience page
    phase:    state.phase,
    progress: state.progress,
    message:  state.message,
    // Actions
    setPhase,
    setProgress,
    complete,
    reset,
  };
}
