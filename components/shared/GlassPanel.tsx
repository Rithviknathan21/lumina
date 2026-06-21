"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Glass Panel Component
// ─────────────────────────────────────────────────────────────────────────────

type GlassVariant = "default" | "light" | "heavy" | "bordered";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  glow?: boolean;
  animated?: boolean;
  as?: React.ElementType;
}

const variants: Record<GlassVariant, string> = {
  default: "bg-lumina-glass border border-lumina-glass-border backdrop-blur-xl",
  light: "bg-lumina-glass-light border border-lumina-glass-border backdrop-blur-2xl",
  heavy: "bg-lumina-glass-heavy border border-lumina-glass-border-bright backdrop-blur-3xl",
  bordered: "bg-lumina-glass border border-lumina-star/10 backdrop-blur-xl",
};

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      variant = "default",
      glow = false,
      animated = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "rounded-2xl",
      variants[variant],
      glow && "shadow-glow-star animate-glow-pulse",
      "shadow-glass",
      className
    );

    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={classes}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = "GlassPanel";
