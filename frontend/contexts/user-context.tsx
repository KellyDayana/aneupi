"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiPersistence } from "@/lib/api-persistence"

type UserRole = "usuario" | "superadmin" | null

interface UserContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  isLoggedIn: boolean
  logout: () => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar el rol del usuario desde API al montar
  useEffect(() => {
    async function loadUserRole() {
      try {
        const savedRole = await apiPersistence.getSinglePreference("userRole")
        if (savedRole) {
          setUserRoleState(savedRole as UserRole)
        }
      } catch (error) {
        console.error("Error reading from API:", error)
        // Fallback a localStorage
        try {
          const storedRole = localStorage.getItem("userRole") as UserRole
          if (storedRole) {
            setUserRoleState(storedRole)
          }
        } catch (fallbackError) {
          console.error("Error reading from localStorage:", fallbackError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadUserRole()
  }, [])

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role)
    // Guardar en API
    apiPersistence.setSinglePreference("userRole", role).catch((error) => {
      console.error("Error writing to API:", error)
      // Fallback a localStorage
      try {
        if (role) {
          localStorage.setItem("userRole", role)
        } else {
          localStorage.removeItem("userRole")
        }
      } catch (fallbackError) {
        console.error("Error writing to localStorage:", fallbackError)
      }
    })
  }

  const logout = () => {
    setUserRole(null)
  }

  return (
    <UserContext.Provider
      value={{
        userRole,
        setUserRole,
        isLoggedIn: userRole !== null,
        logout,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
