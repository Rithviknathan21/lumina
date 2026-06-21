"use client";

import { useEffect } from "react";
import { AuthProvider } from "@/components/auth";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { useLenis } from "@/hooks/use-lenis";
import { registerGSAP } from "@/animations/gsap";
import { scrollStore } from "@/lib/scroll-store";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Client Providers
// ─────────────────────────────────────────────────────────────────────────────

function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useLenis({ duration: 1.2, wheelMultiplier: 1, touchMultiplier: 2 });

  // Bridge Lenis scroll → scrollStore so Three.js camera reads smoothed values
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    const onScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
      const prev = scrollStore.progress;
      scrollStore.scrollY = scroll;
      scrollStore.progress = limit > 0 ? Math.min(1, scroll / limit) : 0;
      scrollStore.velocity = scrollStore.progress - prev;
    };

    lenis.on('scroll', onScroll);
    return () => lenis.off('scroll', onScroll);
  }, [lenisRef]);

  return <>{children}</>;
}

function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => { registerGSAP(); }, []);
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <TooltipProvider delayDuration={300}>
        <AuthProvider>
          <GSAPProvider>
            <LenisProvider>
              {children}
            </LenisProvider>
          </GSAPProvider>
        </AuthProvider>
        <ToastViewport />
      </TooltipProvider>
    </ToastProvider>
  );
}
