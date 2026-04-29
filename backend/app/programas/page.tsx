"use client"

import { Heart, Users, Leaf, GraduationCap, Smile, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"

export default function Programas() {
  const programs = [
    {
      title: "Inclusión para Todos",
      description:
        "Programa dedicado a promover la inclusión social y los derechos de personas con discapacidad en Ecuador.",
      image: "/inclusion-diversity-people-together.jpg",
      icon: Users,
      color: "from-blue-500 to-blue-700",
      category: "INCLUSIÓN SOCIAL",
    },
    {
      title: "Bienestar Integral",
      description: "Consejos de salud, nutrición y bienestar emocional para mejorar tu calidad de vida.",
      image: "/wellness-health-yoga-meditation.jpg",
      icon: Heart,
      color: "from-pink-500 to-pink-700",
      category: "SALUD Y BIENESTAR",
    },
    {
      title: "Planeta Verde",
      description: "Iniciativas ambientales y proyectos de sostenibilidad que están transformando Ecuador.",
      image: "/environment-green-nature-sustainability.jpg",
      icon: Leaf,
      color: "from-green-500 to-green-700",
      category: "MEDIO AMBIENTE",
    },
    {
      title: "Educación sin Fronteras",
      description: "Historias inspiradoras de educación y oportunidades para comunidades rurales.",
      image: "/education-school-children-learning.jpg",
      icon: GraduationCap,
      color: "from-purple-500 to-purple-700",
      category: "EDUCACIÓN",
    },
    {
      title: "Sonrisas que Transforman",
      description: "Proyectos comunitarios que generan impacto positivo en la sociedad ecuatoriana.",
      image: "/community-volunteers-helping-smiling.jpg",
      icon: Smile,
      color: "from-yellow-500 to-yellow-700",
      category: "IMPACTO SOCIAL",
    },
    {
      title: "Voces de la Comunidad",
      description: "Plataforma para que las comunidades compartan sus historias y necesidades.",
      image: "/community-voices-people-speaking.jpg",
      icon: Users,
      color: "from-indigo-500 to-indigo-700",
      category: "PARTICIPACIÓN CIUDADANA",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <SiteHeader activeSection="programas" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Programas Especiales
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Contenido que inspira, educa y transforma. Descubre nuestros programas de inclusión, bienestar y desarrollo
            social.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, idx) => {
            const Icon = program.icon
            return (
              <Link href="/tv-en-vivo" key={idx}>
                <article className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl hover:shadow-yellow-500/20 transition-all hover:scale-105 cursor-pointer group h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={program.image || "/placeholder.svg"}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${program.color} opacity-60`} />
                    <div className="absolute top-4 left-4 bg-white/90 text-gray-900 px-4 py-2 text-xs font-bold uppercase rounded-full">
                      {program.category}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-full">
                      <Icon className="w-6 h-6 text-gray-900" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-yellow-400 transition-colors leading-tight">
                      {program.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">{program.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <span className="text-sm text-gray-400">Ver en vivo</span>
                      <div className="bg-yellow-500 text-gray-900 p-2 rounded-full group-hover:bg-yellow-400 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
