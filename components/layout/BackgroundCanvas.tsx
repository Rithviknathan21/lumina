"use client";

import dynamic from "next/dynamic";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Background Canvas (layout-level)
// Renders the persistent 3D space scene.
//
// This is intentionally placed in layout.tsx (outside the page React tree) so
// no page-level state changes, re-renders, or Suspense transitions can ever
// unmount or remount the WebGL canvas. It mounts once and lives forever.
// ─────────────────────────────────────────────────────────────────────────────

const SceneCanvas = dynamic(
  () => import("@/components/three/SceneCanvas").then((m) => m.SceneCanvas),
  { ssr: false }
);

export function BackgroundCanvas() {
  return <SceneCanvas quality="high" />;
}
