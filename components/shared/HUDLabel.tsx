"use client";

import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — HUD Label (monospace, uppercase, subtle)
// ─────────────────────────────────────────────────────────────────────────────

interface HUDLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  dim?: boolean;
  bright?: boolean;
  glow?: boolean;
}

export function HUDLabel({
  children,
  dim = false,
  bright = false,
  glow = false,
  className,
  ...props
}: HUDLabelProps) {
  return (
    <span
      className={cn(
        "font-mono text-2xs uppercase tracking-[0.2em]",
        dim ? "text-lumina-star/30" : bright ? "text-lumina-star" : "text-lumina-star/50",
        glow && "text-glow-star",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ── Separator line used in HUD panels ────────────────────────────────────────
export function HUDSeparator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-px bg-gradient-to-r from-transparent via-lumina-star/20 to-transparent",
        className
      )}
      role="separator"
    />
  );
}

// ── Data row: label + value ───────────────────────────────────────────────────
export function HUDDataRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <HUDLabel dim>{label}</HUDLabel>
      <span className="font-mono text-xs text-lumina-star tabular-nums">
        {value}
      </span>
    </div>
  );
}
