"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type UserRole = "usuario" | "superadmin" | null

interface UserContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  isLoggedIn: boolean
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null)

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
