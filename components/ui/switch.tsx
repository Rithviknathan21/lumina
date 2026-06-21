'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full',
      'border-2 border-transparent',
      'transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumina-star/40 focus-visible:ring-offset-2 focus-visible:ring-offset-lumina-void',
      'disabled:cursor-not-allowed disabled:opacity-50',
      // Off state
      'bg-white/10',
      // On state
      'data-[state=checked]:bg-lumina-star/30 data-[state=checked]:border-lumina-star/50',
      'data-[state=checked]:shadow-[0_0_10px_rgba(168,200,255,0.3)]',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'pointer-events-none block h-3.5 w-3.5 rounded-full',
        'shadow-lg ring-0',
        'transition-all duration-200',
        // Off state
        'translate-x-0 bg-white/40',
        // On state
        'data-[state=checked]:translate-x-4 data-[state=checked]:bg-lumina-star',
        'data-[state=checked]:shadow-[0_0_8px_rgba(168,200,255,0.8)]'
      )}
    />
  </SwitchPrimitive.Root>
))
Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }
