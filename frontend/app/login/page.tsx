"use client"

import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useUser } from "@/contexts/user-context"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

// Credenciales de acceso al panel admin
const MOCK_ADMINS = [
  { email: "admin@aneupi.local", password: "123" },
  { email: "admin2@aneupi.local", password: "Admin123!" },
]

export default function LoginPage() {
  const router = useRouter()
  const { setUserRole, login, isLoggedIn } = useUser()

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/administrador/inicio")
    }
  }, [isLoggedIn, router])

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    // Primero intentar con credenciales mock (acceso rápido al panel)
    const isMock = MOCK_ADMINS.some(
      (a) => a.email === formData.email && a.password === formData.password
    )

    if (isMock) {
      setMessage("✓ Autenticación exitosa. Redirigiendo al panel de administración...")
      setUserRole("superadmin")
      setIsLoading(false)
      setTimeout(() => router.push("/administrador/inicio"), 600)
      return
    }

    // Si no es mock, intentar con la API real
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      })
      const json = await res.json()

      if (!res.ok) {
        setError("❌ Credenciales incorrectas. Verifica tu correo y contraseña.")
        return
      }

      const { user, token } = json.data
      const rolFrontend = user.rol === "admin" ? "superadmin" : "usuario"
      login(token, rolFrontend, user.usuarioId)

      setMessage("✓ Autenticación exitosa. Redirigiendo...")
      setTimeout(() => router.push("/administrador/inicio"), 600)
    } catch (err) {
      setError("❌ No se pudo conectar con el servidor.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // 1. Fondo de color #003952
    <div className="min-h-screen bg-[#003952] flex items-center justify-center p-4 font-['Arial',_sans-serif]">
      {/* Tarjeta de login con dos columnas */}
      <div className="w-full max-w-[900px] grid grid-cols-1 md:grid-cols-2 rounded-[32px] border border-slate-200 bg-white/95 shadow-2xl shadow-slate-300/20 backdrop-blur-sm overflow-hidden">
        

        <div className="hidden md:block bg-white flex items-center justify-center p-12">
         <img
            src="/images/design-mode/AneupiTV-BupbLIMM_edited_edited.png"
            alt="Inicio de Sesión ANEUPI"
            className="w-full h-auto max-h-[400px] object-contain"
          />

        </div>

        {/* Columna Derecha: El formulario de inicio de sesión */}
        <div className="p-8 md:p-12 border-l border-slate-200">
          <Link href="/" className="mb-6 inline-flex items-center text-[14px] font-medium text-slate-600 hover:text-slate-900">
            ← Volver al inicio
          </Link>

          <div className="mb-8">
            {/* Título de 25px */}
            <h1 className="text-[25px] font-semibold text-slate-900">Iniciar Sesión</h1>
            {/* Párrafo de 14px */}
            <p className="mt-2 text-[14px] text-slate-500">Accede a tu cuenta con tu correo electrónico y contraseña.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[14px] font-medium text-slate-700 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-[14px] text-slate-900 outline-none ring-1 ring-transparent transition focus:border-transparent focus:ring-2 focus:ring-[#003952]"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[14px] font-medium text-slate-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-[14px] text-slate-900 outline-none ring-1 ring-transparent transition focus:border-transparent focus:ring-2 focus:ring-[#003952]"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-3 text-[14px] text-slate-600">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-[#003952] focus:ring-[#003952]"
                />
                Recuérdame
              </label>
              <Link href="/" className="font-medium text-[#003952] hover:text-[#005f73]">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-[#003952] px-4 py-3 text-white text-[14px] font-semibold transition hover:bg-[#005f73] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verificando..." : "Iniciar Sesión"}
            </button>
          </form>

          {error && (
            <p className="mt-5 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-[14px] text-red-700">{error}</p>
          )}

          {message ? (
            <p className="mt-5 rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-[14px] text-green-700">{message}</p>
          ) : null}

          <div className="mt-6 border-t border-slate-200 pt-5 text-center text-[14px] text-slate-600">
            ¿No tienes cuenta?{' '}
            <Link href="/signup" className="font-medium text-[#003952] hover:text-[#005f73]">
              Crea una ahora
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}