import { useEffect, useRef, useState } from 'react'
import { apiPersistence, UserPreferences, getValueWithFallback } from '@/lib/api-persistence'

type Options = {
  debounceMs?: number
  apiKey?: keyof UserPreferences
  fallbackToLocalStorage?: boolean
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function usePersistedState<T>(
  key: string,
  initial: T,
  options: Options = {}
) {
  const { debounceMs = 200, apiKey, fallbackToLocalStorage = true } = options
  const [state, setState] = useState<T>(initial)
  const [isLoading, setIsLoading] = useState(true)
  const timer = useRef<number | null>(null)
  const hasInitialized = useRef(false)

  // Cargar valor inicial desde API
  useEffect(() => {
    let isMounted = true

    async function loadInitialValue() {
      try {
        if (apiKey) {
          const apiValue = await apiPersistence.getSinglePreference(apiKey)
          if (isMounted) {
            setState(
              getValueWithFallback(key, initial, apiValue) as T
            )
          }
        } else {
          // Fallback a localStorage si no hay apiKey
          if (fallbackToLocalStorage && typeof window !== 'undefined') {
            const stored = localStorage.getItem(key)
            if (isMounted) {
              setState(safeParse(stored, initial) as T)
            }
          }
        }
      } catch (error) {
        console.error(`Error loading persisted state for key: ${key}`, error)
        if (isMounted) {
          setState(initial)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
          hasInitialized.current = true
        }
      }
    }

    loadInitialValue()

    return () => {
      isMounted = false
    }
  }, [key, initial, apiKey, fallbackToLocalStorage])

  // Guardar cambios en API o localStorage
  useEffect(() => {
    if (!hasInitialized.current) return

    if (timer.current) window.clearTimeout(timer.current)

    timer.current = window.setTimeout(async () => {
      try {
        if (apiKey) {
          // Guardar en API
          await apiPersistence.setSinglePreference(apiKey, state)
        } else if (fallbackToLocalStorage && typeof window !== 'undefined') {
          // Guardar en localStorage como fallback
          localStorage.setItem(key, JSON.stringify(state))
        }
      } catch (error) {
        console.error(`Error saving persisted state for key: ${key}`, error)
      }
    }, debounceMs) as unknown as number

    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [key, state, debounceMs, apiKey, fallbackToLocalStorage])

  // Listener para cambios en otras pestañas/ventanas
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== key) return
      try {
        const next = e.newValue ? (safeParse(e.newValue, initial) as T) : initial
        setState(next)
      } catch {
        // ignore parse errors
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key, initial])

  return [state, setState, isLoading] as const
}
