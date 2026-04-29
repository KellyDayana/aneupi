"use client"

import { Calendar, Award, Star, Play, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Especiales() {
  const specialReports = [
    {
      title: "Ecuador 2025: Un año de transformación",
      description:
        "Análisis exhaustivo de los cambios políticos, económicos y sociales que marcaron el año en el país.",
      image: "/generic-movie-poster.png?height=400&width=600&query=ecuador+transformation+future",
      category: "ESPECIAL ANUAL",
      date: "Diciembre 2025",
      duration: "Serie de 5 partes",
    },
    {
      title: "Galápagos: El laboratorio viviente del planeta",
      description: "Documental especial sobre la biodiversidad única del archipiélago y los esfuerzos de conservación.",
      image: "/generic-movie-poster.png?height=400&width=600&query=galapagos+islands+wildlife+documentary",
      category: "DOCUMENTAL",
      date: "Noviembre 2025",
      duration: "90 minutos",
    },
    {
      title: "La ruta del cacao ecuatoriano",
      description: "Investigación sobre la industria del cacao fino de aroma y su impacto en la economía nacional.",
      image: "/generic-movie-poster.png?height=400&width=600&query=cacao+chocolate+ecuador+plantation",
      category: "INVESTIGACIÓN",
      date: "Octubre 2025",
      duration: "Serie de 3 partes",
    },
    {
      title: "Voces de la Amazonía",
      description: "Historias de las comunidades indígenas que protegen la selva amazónica ecuatoriana.",
      image: "/generic-movie-poster.png?height=400&width=600&query=amazon+rainforest+indigenous+people",
      category: "REPORTAJE",
      date: "Septiembre 2025",
      duration: "60 minutos",
    },
    {
      title: "Innovación tecnológica en Ecuador",
      description: "Perfil de las startups y emprendedores que están revolucionando la tecnología en el país.",
      image: "/generic-movie-poster.png?height=400&width=600&query=technology+innovation+startup",
      category: "ESPECIAL TECH",
      date: "Agosto 2025",
      duration: "Serie de 4 partes",
    },
    {
      title: "El futuro de la energía renovable",
      description: "Análisis de los proyectos de energía limpia que transformarán la matriz energética ecuatoriana.",
      image: "/generic-movie-poster.png?height=400&width=600&query=renewable+energy+solar+wind",
      category: "MEDIO AMBIENTE",
      date: "Julio 2025",
      duration: "45 minutos",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SiteHeader activeSection="especiales" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold">Especiales</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Reportajes en profundidad, documentales y series especiales de investigación
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {specialReports.map((report, idx) => (
            <article
              key={idx}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer group"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={report.image || "/placeholder.svg"}
                  alt={report.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                <div className="absolute top-4 left-4 bg-yellow-500 text-gray-900 px-4 py-2 text-xs font-bold uppercase rounded">
                  {report.category}
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 text-xs rounded flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {report.duration}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-gray-900 ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-yellow-400 transition-colors leading-tight text-balance">
                  {report.title}
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">{report.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{report.date}</span>
                  </div>
                  <button className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors flex items-center gap-2">
                    Leer más <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
