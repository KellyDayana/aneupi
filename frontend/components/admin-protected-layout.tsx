"use client"

import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { useEffect, ReactNode } from "react"
import Link from "next/link"
import { LayoutDashboard, Newspaper, Tv, LogOut, Settings, Bot, Hammer } from "lucide-react"

interface AdminProtectedLayoutProps {
  children: ReactNode
}

export function AdminProtectedLayout({ children }: AdminProtectedLayoutProps) {
  const { isLoggedIn, logout, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#003952]">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
          <p className="text-white mt-4">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SIDEBAR LATERAL */}
      <aside className="w-64 bg-[#003952] text-white flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 border-b border-white/10">
            <h1 className="text-white tracking-wider font-bold">
              TV ANEUPI <span className="font-light text-gray-300">| ADMIN</span>
            </h1>
          </div>

          <nav className="p-4 space-y-2">
            <Link
              href="/administrador/inicio"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LayoutDashboard size={20} />
              <span>Inicio</span>
            </Link>

            <Link
              href="/administrador/articulos"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Newspaper size={20} />
              <span>Artículos</span>
            </Link>

            <Link
              href="/administrador/tv-vivo"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Tv size={20} />
              <span>TV en Vivo</span>
            </Link>

            <Link
              href="/administrador/asistente-virtual"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Bot size={20} />
              <span>Asistente Virtual</span>
            </Link>

            <Link
              href="/administrador/en-desarrollo"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Hammer size={20} />
              <span>En Desarrollo</span>
            </Link>

            <Link
              href="/administrador/configuracion"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Settings size={20} />
              <span>Configuración</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-white/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ÁREA DE TRABAJO */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
