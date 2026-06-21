"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { registerGSAP } from "@/animations/gsap";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — GSAP Integration Hooks
// ─────────────────────────────────────────────────────────────────────────────

// Safe layout effect (no SSR warning)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Runs a GSAP context and cleans up on unmount.
 * Pass a factory that returns a cleanup function.
 */
export function useGSAP(
  factory: (context: gsap.Context) => gsap.core.Timeline | gsap.core.Tween | void,
  deps: React.DependencyList = []
) {
  const scopeRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      factory(ctx);
    }, scopeRef.current ?? document.body);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}

/**
 * Animate an element on mount with a fromTo.
 */
export function useRevealOnMount(
  options: gsap.TweenVars & {
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
  } = {}
) {
  const ref = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    registerGSAP();

    const { from = { opacity: 0, y: 24 }, to = { opacity: 1, y: 0 }, ...rest } = options;

    const tween = gsap.fromTo(ref.current, from, {
      duration: 0.9,
      ease: "power3.out",
      ...to,
      ...rest,
    });

    return () => { tween.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/**
 * Stagger children on mount.
 */
export function useStaggerReveal(
  selector = ".stagger-item",
  options: gsap.TweenVars = {}
) {
  const ref = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    registerGSAP();

    const items = ref.current.querySelectorAll(selector);
    if (!items.length) return;

    const tween = gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.1,
        ...options,
      }
    );

    return () => { tween.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector]);

  return ref;
}
