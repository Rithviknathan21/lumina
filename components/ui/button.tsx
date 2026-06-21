import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-mono text-xs tracking-[0.1em] uppercase",
    "rounded-full transition-all duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumina-star/50 focus-visible:ring-offset-2 focus-visible:ring-offset-lumina-void",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-lumina-star text-lumina-void font-semibold",
          "hover:bg-lumina-star-bright",
          "shadow-glow-star hover:shadow-glow-star-lg"
        ),
        destructive: "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20",
        outline: cn(
          "border border-lumina-glass-border-bright bg-transparent",
          "text-lumina-star/80 hover:bg-lumina-glass-light hover:text-lumina-star"
        ),
        secondary: cn(
          "bg-lumina-glass-light border border-lumina-glass-border",
          "text-lumina-star-bright hover:bg-lumina-glass-mid"
        ),
        ghost: "text-lumina-star/60 hover:text-lumina-star hover:bg-lumina-glass",
        link: "text-lumina-star underline-offset-4 hover:underline h-auto p-0",
      },
      size: {
        default: "h-10 px-6",
        sm: "h-8 px-4 text-2xs",
        lg: "h-12 px-8 text-sm",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
