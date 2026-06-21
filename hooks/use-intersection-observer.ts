'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Trigger once and stop observing */
  triggerOnce?: boolean
  /** Delay before marking as intersected (ms) */
  delay?: number
}

interface UseIntersectionObserverReturn {
  ref: RefObject<Element | null>
  isIntersecting: boolean
  hasIntersected: boolean
  entry: IntersectionObserverEntry | null
}

export function useIntersectionObserver({
  threshold = 0.1,
  root = null,
  rootMargin = '0px 0px -10% 0px',
  triggerOnce = true,
  delay = 0,
}: UseIntersectionObserverOptions = {}): UseIntersectionObserverReturn {
  const ref = useRef<Element>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([e]) => {
        setEntry(e)

        if (e.isIntersecting) {
          if (delay > 0) {
            timeoutRef.current = setTimeout(() => {
              setIsIntersecting(true)
              setHasIntersected(true)
            }, delay)
          } else {
            setIsIntersecting(true)
            setHasIntersected(true)
          }

          if (triggerOnce) observer.unobserve(el)
        } else if (!triggerOnce) {
          setIsIntersecting(false)
        }
      },
      { threshold, root, rootMargin }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [threshold, root, rootMargin, triggerOnce, delay])

  return { ref, isIntersecting, hasIntersected, entry }
}
