"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Audio Manager Hook
// ─────────────────────────────────────────────────────────────────────────────

interface AudioTrack {
  id: string;
  src: string;
  loop?: boolean;
  volume?: number;
}

interface AudioInstance {
  audio: HTMLAudioElement;
  gainNode: GainNode;
}

export function useAudio() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [masterVolume, setMasterVolumeState] = useState(0.6);
  const contextRef = useRef<AudioContext | null>(null);
  const tracksRef = useRef<Map<string, AudioInstance>>(new Map());
  const masterGainRef = useRef<GainNode | null>(null);

  // Load preference
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIO_ENABLED);
    setIsEnabled(saved === "true");
  }, []);

  const initContext = useCallback(() => {
    if (contextRef.current) return contextRef.current;
    const ctx = new AudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.value = masterVolume;
    masterGain.connect(ctx.destination);
    contextRef.current = ctx;
    masterGainRef.current = masterGain;
    return ctx;
  }, [masterVolume]);

  const load = useCallback(
    async (track: AudioTrack): Promise<void> => {
      if (tracksRef.current.has(track.id)) return;

      const ctx = initContext();
      const audio = new Audio(track.src);
      audio.loop = track.loop ?? false;
      audio.crossOrigin = "anonymous";

      const source = ctx.createMediaElementSource(audio);
      const gainNode = ctx.createGain();
      gainNode.gain.value = track.volume ?? 1;
      source.connect(gainNode);
      gainNode.connect(masterGainRef.current!);

      tracksRef.current.set(track.id, { audio, gainNode });
    },
    [initContext]
  );

  const play = useCallback(
    async (id: string): Promise<void> => {
      if (!isEnabled) return;
      const track = tracksRef.current.get(id);
      if (!track) return;

      if (contextRef.current?.state === "suspended") {
        await contextRef.current.resume();
      }

      track.audio.currentTime = 0;
      await track.audio.play().catch(() => {
        // Auto-play blocked — user interaction needed
      });
    },
    [isEnabled]
  );

  const stop = useCallback((id: string, fadeOut = true): void => {
    const track = tracksRef.current.get(id);
    if (!track || !contextRef.current) return;

    if (fadeOut) {
      const now = contextRef.current.currentTime;
      track.gainNode.gain.setValueAtTime(track.gainNode.gain.value, now);
      track.gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
      setTimeout(() => track.audio.pause(), 500);
    } else {
      track.audio.pause();
    }
  }, []);

  const setVolume = useCallback(
    (id: string, volume: number, rampTime = 0.3): void => {
      const track = tracksRef.current.get(id);
      if (!track || !contextRef.current) return;
      const now = contextRef.current.currentTime;
      track.gainNode.gain.linearRampToValueAtTime(volume, now + rampTime);
    },
    []
  );

  const setMasterVolume = useCallback(
    (volume: number, rampTime = 0.3): void => {
      setMasterVolumeState(volume);
      if (!masterGainRef.current || !contextRef.current) return;
      const now = contextRef.current.currentTime;
      masterGainRef.current.gain.linearRampToValueAtTime(volume, now + rampTime);
    },
    []
  );

  const toggle = useCallback(() => {
    setIsEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.AUDIO_ENABLED, String(next));

      if (!next) {
        // Pause all
        tracksRef.current.forEach(({ audio }) => audio.pause());
      }

      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      tracksRef.current.forEach(({ audio }) => {
        audio.pause();
        audio.src = "";
      });
      contextRef.current?.close();
    };
  }, []);

  return {
    isEnabled,
    masterVolume,
    load,
    play,
    stop,
    setVolume,
    setMasterVolume,
    toggle,
  };
}
