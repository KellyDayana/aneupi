"use client"

import { useState } from "react"
import Link from "next/link"
import { useUser } from "@/contexts/user-context"
import { AuthModal } from "./auth-modal"

import { Menu } from "lucide-react"
import { X } from "lucide-react"
import { Home } from "lucide-react"
import { Film } from "lucide-react"
import { Tv } from "lucide-react"
import { ChevronDown } from "lucide-react"
import { Music } from "lucide-react"
import { Newspaper } from "lucide-react"
import { Globe } from "lucide-react"
import { Leaf } from "lucide-react"
import { Sparkles } from "lucide-react"
import { Mail } from "lucide-react"
import { Star } from "lucide-react"
import { LogIn } from "lucide-react"

interface SiteHeaderProps {
  activeSection?: string
}

export function SiteHeader({ activeSection }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [entertainmentOpen, setEntertainmentOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const { userRole, setUserRole } = useUser()

  return (
    <>
      {/* Sidebar Menu */}
      {/* <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#003952] text-white transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={() => setMenuOpen(false)} className="hover:opacity-70">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 overflow-y-auto max-h-[calc(100vh-88px)]">
          <div className="mb-6">
            <button
              onClick={() => {
                setAuthModalOpen(true)
                setMenuOpen(false)
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold transition-colors shadow-md"
            >
              <LogIn className="w-5 h-5" />
              <span>Iniciar Sesión</span>
            </button>
          </div>

          <div className="border-t border-white/10 mb-4"></div>

          <div className="border-t border-white/10 my-4"></div>

        </nav>
      </div> */}

      {/* Overlay */}
      {menuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMenuOpen(false)} />}

      <header className="bg-white w-full shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10" />

            <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
              <img
                src="/images/design-mode/AneupiTV-BupbLIMM_edited_edited.png"
                alt="ANEUPI TV Internacional"
                className="h-24 md:h-32 cursor-pointer"
              />
            </Link>

            <div className="w-12"></div>
          </div>
        </div>
      </header>

      <nav className="bg-[#003952] sticky top-0 z-30 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className={`flex items-center gap-2 text-sm hover:opacity-70 text-white ${
                  activeSection === "home" ? "border-b-2 border-yellow-400 pb-1" : ""
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Inicio</span>
              </Link>
              <Link
                href="/articulos"
                className={`flex items-center gap-2 text-sm hover:opacity-70 text-white ${
                  activeSection === "articulos" ? "border-b-2 border-yellow-400 pb-1" : ""
                }`}
              >
                <Newspaper className="w-4 h-4" />
                <span>Articulos</span>
              </Link>
              <Link
                href="/tv-en-vivo"
                className={`flex items-center gap-2 text-sm hover:opacity-70 text-white ${
                  activeSection === "tv-en-vivo" ? "border-b-2 border-yellow-400 pb-1" : ""
                }`}
              >
                <Tv className="w-4 h-4 live-pulse" />
                <span>TV en Vivo</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  )
}