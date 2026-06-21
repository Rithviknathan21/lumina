"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { NebulaCloud } from "@/components/three/NebulaCloud";
import { StarField } from "@/components/three/StarField";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Nebula Scene
// Three overlapping volumetric nebula clouds in purple, blue, orange.
// Camera drifts slowly through the gas clouds.
// ─────────────────────────────────────────────────────────────────────────────

function DriftCamera({ speed }: { speed: number }) {
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  const t = useRef(0);

  useFrame(({ camera }, delta) => {
    t.current += delta * speedRef.current;
    // Slow, hypnotic camera drift
    camera.position.x = Math.sin(t.current * 0.065) * 18;
    camera.position.y = Math.sin(t.current * 0.04) * 6;
    camera.position.z = 40 + Math.cos(t.current * 0.05) * 12;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function NebulaScene({ speed = 1 }: { speed?: number }) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 40], fov: 60, near: 0.1, far: 800 }}
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{ antialias: false, alpha: false }}
        style={{ background: "radial-gradient(ellipse at 50% 50%, #0A0218 0%, #020108 100%)" }}
      >
        <DriftCamera speed={speed} />

        {/* Background stars */}
        <StarField count={2200} radius={500} speed={0.005} size={1.0} drift={false} />

        {/* Purple main nebula — center */}
        <NebulaCloud
          position={[0, 0, 0]}
          count={320}
          spread={60}
          color="#7B3FAF"
          secondaryColor="#A860FF"
          opacity={0.085}
          size={90}
          speed={0.04 * speed}
        />

        {/* Blue nebula — shifted left and back */}
        <NebulaCloud
          position={[-30, -8, -30]}
          count={260}
          spread={55}
          color="#2050C0"
          secondaryColor="#60AAFF"
          opacity={0.07}
          size={100}
          speed={0.03 * speed}
        />

        {/* Orange nebula — shifted right */}
        <NebulaCloud
          position={[28, 6, -20]}
          count={240}
          spread={50}
          color="#C05018"
          secondaryColor="#FF9040"
          opacity={0.065}
          size={85}
          speed={0.05 * speed}
        />

        {/* Accent: small brighter purple cloud at center */}
        <NebulaCloud
          position={[5, 2, 10]}
          count={180}
          spread={25}
          color="#9040FF"
          secondaryColor="#C080FF"
          opacity={0.095}
          size={55}
          speed={0.06 * speed}
        />

        <ambientLight intensity={0.05} />

        <EffectComposer>
          <Bloom
            kernelSize={KernelSize.LARGE}
            intensity={1.4}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.95}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
