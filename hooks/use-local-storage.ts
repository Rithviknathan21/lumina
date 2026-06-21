'use client'

import { useCallback, useEffect, useState } from 'react'

type SetValue<T> = (value: T | ((prev: T) => T)) => void

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>, () => void] {
  // Lazy init — read from localStorage on first render
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  }, [initialValue, key])

  const [storedValue, setStoredValue] = useState<T>(readValue)

  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        const newValue = value instanceof Function ? value(storedValue) : value
        window.localStorage.setItem(key, JSON.stringify(newValue))
        setStoredValue(newValue)
        window.dispatchEvent(new StorageEvent('storage', { key }))
      } catch {
        console.warn(`useLocalStorage: failed to set "${key}"`)
      }
    },
    [key, storedValue]
  )

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch {
      console.warn(`useLocalStorage: failed to remove "${key}"`)
    }
  }, [initialValue, key])

  // Listen for cross-tab changes
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) setStoredValue(readValue())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key, readValue])

  return [storedValue, setValue, removeValue]
}
