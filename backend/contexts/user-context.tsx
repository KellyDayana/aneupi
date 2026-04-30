"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "usuario" | "admin" | null

interface UserContextType {
  userRole: UserRole
  userId: number | null
  token: string | null
  setUserRole: (role: UserRole) => void
  login: (token: string, role: UserRole, userId: number) => void
  isLoggedIn: boolean
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Restaurar sesión desde localStorage al montar
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token")
    const savedRole = localStorage.getItem("user_role") as UserRole
    const savedUserId = localStorage.getItem("user_id")
    if (savedToken && savedRole) {
      setToken(savedToken)
      setUserRole(savedRole)
      setUserId(savedUserId ? Number(savedUserId) : null)
    }
  }, [])

  const login = (newToken: string, role: UserRole, id: number) => {
    setToken(newToken)
    setUserRole(role)
    setUserId(id)
    localStorage.setItem("auth_token", newToken)
    localStorage.setItem("user_role", role ?? "")
    localStorage.setItem("user_id", String(id))
  }

  const logout = () => {
    setToken(null)
    setUserRole(null)
    setUserId(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_role")
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
