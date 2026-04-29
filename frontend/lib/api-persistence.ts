/**
 * API Persistence Service
 * Maneja la persistencia de datos de usuario y preferencias mediante API
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api"

export interface UserPreferences {
  userRole?: string | null
  language?: "es" | "en"
  pinnedFeatured?: boolean
  commentsCollapsed?: boolean
  tvLiveTermsAccepted?: boolean
}

class ApiPersistence {
  private cache: Map<string, any> = new Map()

  async fetchPreferences(): Promise<UserPreferences> {
    try {
      const response = await fetch(`${API_BASE}/user/preferences`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        console.error("Error fetching preferences:", response.status)
        return {}
      }

      const data = await response.json()
      return data.preferences || {}
    } catch (error) {
      console.error("Error fetching preferences:", error)
      return {}
    }
  }

  async updatePreferences(preferences: Partial<UserPreferences>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/user/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        console.error("Error updating preferences:", response.status)
        return false
      }

      return true
    } catch (error) {
      console.error("Error updating preferences:", error)
      return false
    }
  }

  async getSinglePreference(key: keyof UserPreferences): Promise<any> {
    // Primero verificar en caché
    if (this.cache.has(key)) {
      return this.cache.get(key)
    }

    const prefs = await this.fetchPreferences()
    const value = prefs[key]
    
    if (value !== undefined) {
      this.cache.set(key, value)
    }

    return value
  }

  async setSinglePreference(key: keyof UserPreferences, value: any): Promise<boolean> {
    this.cache.set(key, value)
    return this.updatePreferences({ [key]: value })
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const apiPersistence = new ApiPersistence()

/**
 * Utility para fallback a localStorage si la API no está disponible
 */
export function getValueWithFallback(
  key: string,
  initialValue: any,
  fromAPI: any
): any {
  if (fromAPI !== undefined) {
    return fromAPI
  }

  // Fallback a localStorage si existe
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {
      // Ignorar errores de parsing
    }
  }

  return initialValue
}

/**
 * Limpia localStorage antiguo después de migrar a API
 */
export function clearLegacyStorage(): void {
  if (typeof window !== "undefined") {
    const keysToRemove = [
      "userRole",
      "language",
      "pinnedFeatured",
      "commentsCollapsed",
      "tvLiveTermsAccepted",
    ]

    keysToRemove.forEach((key) => {
      try {
        localStorage.removeItem(key)
      } catch {
        // Ignorar errores
      }
    })
  }
}
