import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional leading icon */
  icon?: React.ReactNode
  /** Show a glowing border on focus */
  glow?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, glow = true, ...props }, ref) => {
    return (
      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-lumina-star/70 transition-colors duration-200 pointer-events-none">
            {icon}
          </div>
        )}

        <input
          type={type}
          className={cn(
            // Base
            'flex w-full rounded-lg bg-white/5 border border-white/10',
            'px-4 py-3 text-sm text-white',
            'placeholder:text-white/25',
            // Transitions
            'transition-all duration-200',
            // Focus
            'focus:outline-none focus:ring-0',
            glow
              ? 'focus:border-lumina-star/60 focus:bg-white/8 focus:shadow-[0_0_12px_rgba(168,200,255,0.12)]'
              : 'focus:border-white/25',
            // Disabled
            'disabled:opacity-40 disabled:cursor-not-allowed',
            // Icon padding
            icon ? 'pl-10' : undefined,
            className
          )}
          ref={ref}
          {...props}
        />

        {/* Bottom glow line */}
        {glow && (
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-lumina-star/0 to-transparent group-focus-within:via-lumina-star/40 transition-all duration-300 pointer-events-none" />
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
