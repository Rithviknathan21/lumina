import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { CustomEase } from "gsap/CustomEase";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — GSAP Configuration & Animation Presets
// ─────────────────────────────────────────────────────────────────────────────

let isRegistered = false;

export function registerGSAP(): void {
  if (isRegistered || typeof window === "undefined") return;
  isRegistered = true;
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase);
  CustomEase.create("lumina.expo", "0.19, 1, 0.22, 1");
  CustomEase.create("lumina.spring", "0.175, 0.885, 0.32, 1.275");
  CustomEase.create("lumina.cinematic", "0.77, 0, 0.175, 1");
}

// ── Fade ──────────────────────────────────────────────────────────────────────

export const fadeIn = (
  target: gsap.TweenTarget,
  vars?: gsap.TweenVars
): gsap.core.Tween =>
  gsap.fromTo(target, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power2.out", ...vars });

export const fadeOut = (
  target: gsap.TweenTarget,
  vars?: gsap.TweenVars
): gsap.core.Tween =>
  gsap.to(target, { opacity: 0, duration: 0.5, ease: "power2.in", ...vars });

// ── Reveal ────────────────────────────────────────────────────────────────────

export const revealUp = (
  target: gsap.TweenTarget,
  vars?: gsap.TweenVars
): gsap.core.Tween =>
  gsap.fromTo(
    target,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1, ease: "lumina.expo", ...vars }
  );

export const revealDown = (
  target: gsap.TweenTarget,
  vars?: gsap.TweenVars
): gsap.core.Tween =>
  gsap.fromTo(
    target,
    { opacity: 0, y: -30 },
    { opacity: 1, y: 0, duration: 1, ease: "lumina.expo", ...vars }
  );

export const revealScale = (
  target: gsap.TweenTarget,
  vars?: gsap.TweenVars
): gsap.core.Tween =>
  gsap.fromTo(
    target,
    { opacity: 0, scale: 0.88 },
    { opacity: 1, scale: 1, duration: 0.9, ease: "lumina.spring", ...vars }
  );

// ── Stagger ───────────────────────────────────────────────────────────────────

export const staggerReveal = (
  target: gsap.TweenTarget,
  vars?: gsap.TweenVars & { stagger?: number }
): gsap.core.Tween => {
  const { stagger = 0.08, ...rest } = vars ?? {};
  return gsap.fromTo(
    target,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.8, ease: "lumina.expo", stagger, ...rest }
  );
};

// ── Text reveal (no SplitText dependency) ────────────────────────────────────

export const textReveal = (
  target: gsap.TweenTarget,
  vars?: gsap.TweenVars
): gsap.core.Tween =>
  gsap.fromTo(
    target,
    { opacity: 0, y: 16, clipPath: "inset(0 0 100% 0)" },
    { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "lumina.expo", ...vars }
  );

// ── Counter ───────────────────────────────────────────────────────────────────

export const countTo = (
  target: gsap.TweenTarget,
  endValue: number,
  vars?: gsap.TweenVars & { prefix?: string; suffix?: string; decimals?: number }
): gsap.core.Tween => {
  const { prefix = "", suffix = "", decimals = 0, ...rest } = vars ?? {};
  return gsap.to({ value: 0 }, {
    value: endValue,
    duration: 2,
    ease: "power2.out",
    onUpdate() {
      const el = typeof target === "string" ? document.querySelector(target) : target as Element;
      if (el) el.textContent = `${prefix}${(this.targets()[0] as { value: number }).value.toFixed(decimals)}${suffix}`;
    },
    ...rest,
  });
};

// ── Scroll reveal ─────────────────────────────────────────────────────────────

export const scrollReveal = (
  target: gsap.TweenTarget,
  vars?: gsap.TweenVars
): ScrollTrigger | undefined => {
  if (typeof window === "undefined") return;
  return ScrollTrigger.create({
    trigger: target as Element,
    start: "top 85%",
    onEnter: () => revealUp(target, vars),
    once: true,
  });
};

// ── Progress bar ──────────────────────────────────────────────────────────────

export const animateProgress = (
  target: gsap.TweenTarget,
  progress: number,
  vars?: gsap.TweenVars
): gsap.core.Tween =>
  gsap.to(target, { width: `${progress}%`, duration: 0.8, ease: "power2.out", ...vars });

// ── Camera tween helper ───────────────────────────────────────────────────────

export const tweenCamera = (
  camera: { position: { x: number; y: number; z: number } },
  to: { x?: number; y?: number; z?: number },
  vars?: gsap.TweenVars
): gsap.core.Tween =>
  gsap.to(camera.position, { ...to, duration: 2, ease: "lumina.cinematic", ...vars });

export { gsap, ScrollTrigger };
