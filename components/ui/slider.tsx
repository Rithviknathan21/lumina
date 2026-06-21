'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center group',
      className
    )}
    {...props}
  >
    {/* Track */}
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-white/10">
      {/* Range (filled portion) */}
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-lumina-star/60 to-lumina-star rounded-full" />
    </SliderPrimitive.Track>

    {/* Thumb */}
    <SliderPrimitive.Thumb
      className={cn(
        'block h-4 w-4 rounded-full',
        'border-2 border-lumina-star bg-lumina-deep',
        'shadow-[0_0_8px_rgba(168,200,255,0.5)]',
        'transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumina-star/40 focus-visible:ring-offset-2 focus-visible:ring-offset-lumina-void',
        'hover:scale-110 hover:shadow-[0_0_14px_rgba(168,200,255,0.7)]',
        'disabled:pointer-events-none disabled:opacity-50'
      )}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
