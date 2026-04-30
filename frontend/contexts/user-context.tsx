"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiPersistence } from "@/lib/api-persistence"

type UserRole = "usuario" | "superadmin" | null

interface UserContextType {
  userRole: UserRole
  userId: number | null
  token: string | null
  setUserRole: (role: UserRole) => void
  login: (token: string, role: UserRole, userId: number) => void
  isLoggedIn: boolean
  logout: () => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar sesión al montar
  useEffect(() => {
    async function loadUserRole() {
      try {
        // Restaurar token y userId desde localStorage
        const savedToken = localStorage.getItem("auth_token")
        const savedUserId = localStorage.getItem("user_id")
        if (savedToken) {
          setToken(savedToken)
          setUserId(savedUserId ? Number(savedUserId) : null)
        }

        const savedRole = await apiPersistence.getSinglePreference("userRole")
        if (savedRole) {
          setUserRoleState(savedRole as UserRole)
        }
      } catch (error) {
        console.error("Error reading from API:", error)
        try {
          const storedRole = localStorage.getItem("userRole") as UserRole
          if (storedRole) setUserRoleState(storedRole)
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
    apiPersistence.setSinglePreference("userRole", role).catch((error) => {
      console.error("Error writing to API:", error)
      try {
        if (role) localStorage.setItem("userRole", role)
        else localStorage.removeItem("userRole")
      } catch (fallbackError) {
        console.error("Error writing to localStorage:", fallbackError)
      }
    })
  }

  const login = (newToken: string, role: UserRole, id: number) => {
    setToken(newToken)
    setUserId(id)
    setUserRole(role)
    localStorage.setItem("auth_token", newToken)
    localStorage.setItem("user_id", String(id))
  }

  const logout = () => {
    setToken(null)
    setUserId(null)
    setUserRole(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_id")
  }

  return (
    <UserContext.Provider
      value={{
        userRole,
        userId,
        token,
        setUserRole,
        login,
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
