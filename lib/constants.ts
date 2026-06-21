import type { GraphicsQuality } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Global Constants
// ─────────────────────────────────────────────────────────────────────────────

export const APP_NAME = "LUMINA" as const;
export const APP_TAGLINE = "Experience Space Like Never Before." as const;
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ── Performance ───────────────────────────────────────────────────────────────
export const PERF = {
  TARGET_FPS: 60,
  FRAME_BUDGET_MS: 1000 / 60,
  MAX_STARS: 80_000,
  LOD_NEAR: 50,
  LOD_FAR: 200,
  SHADOW_MAP_SIZE: 2048,
} as const;

// ── Animation Durations (ms) ───────────────────────────────────────────────────
export const DURATION = {
  INSTANT: 100,
  FAST: 200,
  NORMAL: 400,
  SLOW: 700,
  ENTER: 1000,
  CINEMATIC: 2000,
} as const;

// ── Easing Presets ────────────────────────────────────────────────────────────
export const EASE = {
  DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
  SPRING: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  EXPO_OUT: "cubic-bezier(0.19, 1, 0.22, 1)",
  EXPO_IN: "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
  BACK_OUT: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  GSAP: {
    DEFAULT: "power2.inOut",
    ENTER: "power3.out",
    EXIT: "power3.in",
    SPRING: "elastic.out(1, 0.75)",
    EXPO: "expo.out",
  },
} as const;

// ── Three.js / Scene ─────────────────────────────────────────────────────────
export const SCENE = {
  FOV: 60,
  NEAR: 0.1,
  FAR: 10_000,
  BACKGROUND: 0x020408,
  AMBIENT_INTENSITY: 0.15,
  STAR_FIELD_RADIUS: 2000,
  STAR_FIELD_COUNT: 60_000,
  CAMERA_DEFAULT_POSITION: [0, 0, 5] as [number, number, number],
  CAMERA_TARGET: [0, 0, 0] as [number, number, number],
} as const;

// ── Breakpoints (px) ──────────────────────────────────────────────────────────
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

// ── Z-Index Scale ─────────────────────────────────────────────────────────────
export const Z = {
  CANVAS: 0,
  SCENE_OVERLAY: 10,
  HUD: 20,
  NAVIGATION: 30,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  TOOLTIP: 60,
  TOAST: 70,
  LOADING: 100,
} as const;

// ── Routes ────────────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: "/",
  EXPERIENCE: "/experience",
  PROFILE: "/profile",
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    CALLBACK: "/auth/callback",
    RESET: "/auth/reset",
  },
} as const;

// ── Local Storage Keys ────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  AUDIO_ENABLED: "lumina:audio",
  GRAPHICS_QUALITY: "lumina:quality",
  HAS_SEEN_INTRO: "lumina:intro-seen",
  CAMERA_SENSITIVITY: "lumina:camera-sensitivity",
} as const;

// ── Graphics Quality Presets ──────────────────────────────────────────────────

export const QUALITY_PRESETS: Record<
  GraphicsQuality,
  {
    pixelRatio: number;
    shadowMapSize: number;
    starCount: number;
    bloomStrength: number;
    antialias: boolean;
  }
> = {
  low: {
    pixelRatio: 1,
    shadowMapSize: 512,
    starCount: 3_000,
    bloomStrength: 0.25,
    antialias: false,
  },
  medium: {
    pixelRatio: 1,
    shadowMapSize: 1024,
    starCount: 10_000,
    bloomStrength: 0.55,
    antialias: false,
  },
  high: {
    pixelRatio: 1.5,
    shadowMapSize: 2048,
    starCount: 18_000,
    bloomStrength: 0.90,
    antialias: true,
  },
  ultra: {
    pixelRatio: 2,
    shadowMapSize: 4096,
    starCount: 28_000,
    bloomStrength: 1.3,
    antialias: true,
  },
};
