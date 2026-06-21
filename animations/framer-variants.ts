import type { Variants, Transition } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Framer Motion Variants
// ─────────────────────────────────────────────────────────────────────────────

// ── Transitions ───────────────────────────────────────────────────────────────
export const transitions = {
  default: { type: "tween", ease: [0.4, 0, 0.2, 1], duration: 0.5 } satisfies Transition,
  fast: { type: "tween", ease: [0.4, 0, 0.2, 1], duration: 0.25 } satisfies Transition,
  slow: { type: "tween", ease: [0.19, 1, 0.22, 1], duration: 1.0 } satisfies Transition,
  cinematic: { type: "tween", ease: [0.77, 0, 0.175, 1], duration: 1.4 } satisfies Transition,
  spring: { type: "spring", stiffness: 280, damping: 24 } satisfies Transition,
  springGentle: { type: "spring", stiffness: 140, damping: 20 } satisfies Transition,
  expo: { type: "tween", ease: [0.19, 1, 0.22, 1], duration: 0.9 } satisfies Transition,
} as const;

// ── Page transitions ──────────────────────────────────────────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

export const pageSlideFadeVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.4, ease: [0.4, 0, 0.6, 1] },
  },
};

// ── Reveal variants ───────────────────────────────────────────────────────────
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] },
  },
};

export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] },
  },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.175, 0.885, 0.32, 1.275] },
  },
};

export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] },
  },
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] },
  },
};

// ── Stagger containers ────────────────────────────────────────────────────────
export const staggerContainerVariants = (stagger = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: 0.1,
    },
  },
});

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] },
  },
};

// ── Glass panel ───────────────────────────────────────────────────────────────
export const glassPanelVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    backdropFilter: "blur(0px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    backdropFilter: "blur(20px)",
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.3, ease: [0.4, 0, 0.6, 1] },
  },
};

// ── Modal ─────────────────────────────────────────────────────────────────────
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25, delay: 0.05 } },
};

export const modalContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.25, ease: [0.4, 0, 0.6, 1] },
  },
};

// ── Navigation ────────────────────────────────────────────────────────────────
export const navVariants: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.2 },
  },
};

export const mobileMenuVariants: Variants = {
  closed: {
    opacity: 0,
    x: "100%",
    transition: { duration: 0.4, ease: [0.4, 0, 0.6, 1] },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
  },
};

// ── Loading ───────────────────────────────────────────────────────────────────
export const loadingExitVariants: Variants = {
  visible: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: {
      duration: 1.2,
      ease: [0.77, 0, 0.175, 1],
    },
  },
};

// ── HUD Elements ──────────────────────────────────────────────────────────────
export const hudVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.19, 1, 0.22, 1],
      staggerChildren: 0.06,
    },
  },
};

export const hudItemVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.19, 1, 0.22, 1] },
  },
};

// ── Tooltip ───────────────────────────────────────────────────────────────────
export const tooltipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 4,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};
