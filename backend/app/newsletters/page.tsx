"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Send, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Newsletters() {
  const [email, setEmail] = useState("")

  const newsletters = [
    {
      title: "Resumen Diario",
      description: "Las noticias más importantes del día en tu bandeja de entrada cada mañana.",
      frequency: "Diario - 7:00 AM",
      icon: "📰",
      subscribers: "15,234",
      color: "bg-blue-600",
    },
    {
      title: "Mundo en Contexto",
      description: "Análisis profundo de los acontecimientos internacionales más relevantes.",
      frequency: "Semanal - Lunes",
      icon: "🌍",
      subscribers: "8,921",
      color: "bg-green-600",
    },
    {
      title: "Ecuaterra Verde",
      description: "Noticias sobre medio ambiente, sostenibilidad y conservación.",
      frequency: "Quincenal",
      icon: "🌿",
      subscribers: "6,543",
      color: "bg-emerald-600",
    },
    {
      title: "Estilo de Vida",
      description: "Tendencias de moda, gastronomía, bienestar y cultura.",
      frequency: "Semanal - Viernes",
      icon: "✨",
      subscribers: "12,876",
      color: "bg-pink-600",
    },
    {
      title: "Deportes al Día",
      description: "Resultados, análisis y noticias del mundo deportivo nacional e internacional.",
      frequency: "Diario - 6:00 PM",
      icon: "⚽",
      subscribers: "18,432",
      color: "bg-orange-600",
    },
    {
      title: "Cultura y Entretenimiento",
      description: "Lo mejor del cine, música, arte y espectáculos.",
      frequency: "Semanal - Jueves",
      icon: "🎬",
      subscribers: "9,765",
      color: "bg-purple-600",
    },
  ]

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Newsletter subscription:", email)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 text-gray-900">
      <SiteHeader activeSection="newsletters" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Newsletters</h1>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            Suscríbete a nuestros boletines y recibe las noticias más importantes directamente en tu correo
          </p>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-12 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Suscríbete a todos nuestros newsletters</h2>
            <p className="mb-6 text-blue-100">
              Mantente informado con las últimas noticias y análisis de ANEUPI TV Internacional
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-2xl">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsletters.map((newsletter, idx) => (
            <article
              key={idx}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 p-6 border border-gray-100"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-4 ${newsletter.color} rounded-xl text-3xl`}>{newsletter.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1 text-gray-900">{newsletter.title}</h3>
                  <p className="text-sm text-gray-500">{newsletter.frequency}</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">{newsletter.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">{newsletter.subscribers} suscriptores</span>
                <button
                  className={`${newsletter.color} text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-1`}
                >
                  Leer más <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
