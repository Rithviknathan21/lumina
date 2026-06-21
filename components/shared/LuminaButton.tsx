"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Custom Button with cinematic hover effects
// ─────────────────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost" | "glass" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface LuminaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  glow?: boolean;
  animated?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-lumina-star text-lumina-void font-semibold",
    "hover:bg-lumina-star-bright",
    "shadow-glow-star hover:shadow-glow-star-lg"
  ),
  secondary: cn(
    "bg-lumina-glass-light border border-lumina-glass-border-bright",
    "text-lumina-star-bright hover:bg-lumina-glass-mid",
    "hover:border-lumina-star/30"
  ),
  ghost: cn(
    "bg-transparent text-lumina-star/70",
    "hover:text-lumina-star hover:bg-lumina-glass"
  ),
  glass: cn(
    "bg-lumina-glass border border-lumina-glass-border backdrop-blur-xl",
    "text-lumina-star/80 hover:text-lumina-star",
    "hover:bg-lumina-glass-light hover:border-lumina-glass-border-bright",
    "shadow-glass"
  ),
  danger: cn(
    "bg-red-500/10 border border-red-500/20 text-red-400",
    "hover:bg-red-500/20 hover:border-red-500/40"
  ),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-xs gap-1.5 rounded-full",
  md: "h-10 px-6 text-xs gap-2 rounded-full",
  lg: "h-12 px-8 text-sm gap-2.5 rounded-full",
  xl: "h-14 px-10 text-base gap-3 rounded-full",
};

export const LuminaButton = forwardRef<HTMLButtonElement, LuminaButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      glow = false,
      animated = true,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const classes = cn(
      "relative inline-flex items-center justify-center",
      "font-mono tracking-[0.1em] uppercase",
      "select-none cursor-pointer",
      "transition-all duration-300",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumina-star/50 focus-visible:ring-offset-2 focus-visible:ring-offset-lumina-void",
      "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && "w-full",
      glow && "animate-glow-pulse",
      className
    );

    const content = (
      <>
        {/* Shine overlay */}
        <span
          className="absolute inset-0 rounded-[inherit] bg-glass-shine opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          aria-hidden
        />

        {isLoading ? (
          <Loader2
            size={size === "sm" ? 12 : size === "md" ? 14 : 16}
            className="animate-spin"
            aria-hidden
          />
        ) : (
          leftIcon && (
            <span className="flex-shrink-0" aria-hidden>
              {leftIcon}
            </span>
          )
        )}

        <span>{children}</span>

        {!isLoading && rightIcon && (
          <span className="flex-shrink-0" aria-hidden>
            {rightIcon}
          </span>
        )}
      </>
    );

    if (animated) {
      return (
        <motion.button
          ref={ref}
          className={cn(classes, "group")}
          disabled={isDisabled}
          whileHover={{ scale: isDisabled ? 1 : 1.02 }}
          whileTap={{ scale: isDisabled ? 1 : 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
          {...(props as React.ComponentProps<typeof motion.button>)}
        >
          {content}
        </motion.button>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(classes, "group")}
        disabled={isDisabled}
        {...props}
      >
        {content}
      </button>
    );
  }
);

LuminaButton.displayName = "LuminaButton";
