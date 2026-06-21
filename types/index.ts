// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Core Type Definitions (canonical, single source of truth)
// ─────────────────────────────────────────────────────────────────────────────

export type { Database, Tables, InsertTables, UpdateTables } from "./database";

// ── Utility ───────────────────────────────────────────────────────────────────
export type Maybe<T> = T | null | undefined;
export type Nullable<T> = T | null;

// ── Geometry ──────────────────────────────────────────────────────────────────
export interface Vector2 { x: number; y: number }
export interface Vector3 { x: number; y: number; z: number }
export interface Size { width: number; height: number }

// ── Graphics ──────────────────────────────────────────────────────────────────
export type GraphicsQuality = "low" | "medium" | "high" | "ultra";

export interface PerformanceMetrics {
  fps: number;
  drawCalls: number;
  triangles: number;
  memory: number;
}

// ── Loading ───────────────────────────────────────────────────────────────────
export type LoadingPhase =
  | "booting"
  | "assets"
  | "scene"
  | "shaders"
  | "ready"
  | "done";

export interface LoadingState {
  phase: LoadingPhase;
  progress: number;
  message: string;
  isComplete: boolean;
}

// ── Scene / Camera ────────────────────────────────────────────────────────────
export interface CameraState {
  position: Vector3;
  target: Vector3;
  fov: number;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export type AuthView = "sign-in" | "sign-up" | "forgot-password";
