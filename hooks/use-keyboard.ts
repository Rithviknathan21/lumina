'use client'

import { useEffect, useCallback } from 'react'

type ModifierKey = 'ctrl' | 'shift' | 'alt' | 'meta'

interface KeyBinding {
  key: string
  modifiers?: ModifierKey[]
  handler: (e: KeyboardEvent) => void
  /** Don't fire when an input/textarea is focused */
  ignoreInputs?: boolean
}

export function useKeyboard(bindings: KeyBinding[]) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      for (const binding of bindings) {
        const { key, modifiers = [], handler, ignoreInputs = true } = binding

        // Skip if focus is on an input
        if (ignoreInputs) {
          const tag = (e.target as HTMLElement)?.tagName
          if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') continue
        }

        // Check key match (case-insensitive)
        if (e.key.toLowerCase() !== key.toLowerCase()) continue

        // Check modifiers
        const ctrl = modifiers.includes('ctrl') === e.ctrlKey
        const shift = modifiers.includes('shift') === e.shiftKey
        const alt = modifiers.includes('alt') === e.altKey
        const meta = modifiers.includes('meta') === e.metaKey

        if (ctrl && shift && alt && meta) {
          e.preventDefault()
          handler(e)
        }
      }
    },
    [bindings]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

// ─── Single-key convenience ───────────────────────────────────────────────────

export function useHotkey(key: string, handler: (e: KeyboardEvent) => void, modifiers?: ModifierKey[]) {
  useKeyboard([{ key, handler, modifiers }])
}
