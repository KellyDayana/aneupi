"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setMessage("Las contraseñas no coinciden.")
      return
    }
    if (!formData.acceptTerms) {
      setMessage("Debes aceptar los términos y condiciones.")
      return
    }
    setMessage("Creando cuenta...")
    console.log("Signup page submit:", formData)
    window.setTimeout(() => setMessage("Cuenta creada correctamente."), 600)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-300/20 backdrop-blur-sm">
        <Link href="/" className="mb-6 inline-flex items-center text-[14px] font-medium text-slate-600 hover:text-slate-900">
          ← Volver al inicio
        </Link>

        <div className="mb-8">
          <h1 className="text-[25px] font-semibold text-slate-900">Crear Cuenta</h1>
          <p className="mt-2 text-[14px] text-slate-500">Regístrate para acceder a todas las funciones.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-[14px] font-medium text-slate-700 mb-2">
              Nombre Completo
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-[14px] text-slate-900 outline-none ring-1 ring-transparent transition focus:border-transparent focus:ring-2 focus:ring-[#003952]"
              placeholder="Tu nombre completo"
              required
            />
          </div>

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

          <div>
            <label htmlFor="confirmPassword" className="block text-[14px] font-medium text-slate-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-[14px] text-slate-900 outline-none ring-1 ring-transparent transition focus:border-transparent focus:ring-2 focus:ring-[#003952]"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-start gap-3 text-[14px] text-slate-600">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#003952] focus:ring-[#003952]"
              required
            />
            <label htmlFor="acceptTerms" className="leading-5">
              Acepto los{' '}
              <Link href="/" className="font-medium text-[#003952] hover:text-[#005f73]">
                términos y condiciones
              </Link>{' '}
              y la{' '}
              <Link href="/" className="font-medium text-[#003952] hover:text-[#005f73]">
                política de privacidad
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#003952] px-4 py-3 text-white text-[14px] font-semibold transition hover:bg-[#005f73]"
          >
            Crear Cuenta
          </button>
        </form>

        {message ? (
          <p className="mt-5 rounded-2xl bg-slate-100 px-4 py-3 text-[14px] text-slate-700">{message}</p>
        ) : null}

        <div className="mt-6 border-t border-slate-200 pt-5 text-center text-[14px] text-slate-600">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-medium text-[#003952] hover:text-[#005f73]">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
