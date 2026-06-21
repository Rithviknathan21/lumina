import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  [
    'inline-flex items-center gap-1.5',
    'rounded-full px-2.5 py-0.5',
    'text-xs font-mono uppercase tracking-widest',
    'border transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-lumina-star/30',
  ],
  {
    variants: {
      variant: {
        default:
          'bg-lumina-star/10 border-lumina-star/30 text-lumina-star',
        secondary:
          'bg-white/5 border-white/15 text-white/60',
        violet:
          'bg-lumina-violet/20 border-lumina-violet/40 text-lumina-violet',
        solar:
          'bg-lumina-solar/10 border-lumina-solar/30 text-lumina-solar',
        destructive:
          'bg-red-500/10 border-red-500/30 text-red-400',
        outline:
          'border-white/20 text-white/50 bg-transparent',
        live:
          'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Animated pulse dot */
  pulse?: boolean
}

function Badge({ className, variant, pulse, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-60" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
