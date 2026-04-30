"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AddNewsButton } from "@/components/add-news-button"
import { Card } from "@/components/ui/card"
import { Calendar, User, Eye, Heart, MessageCircle, BookOpen, Loader2 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

interface Articulo {
  articuloId: number
  titulo: string
  descripcion: string
  contenido: string
  url_imagen: string
  url_preview_imagen: string
  tiempo_lectura: number
  estado: string
  vistas: number
  fechaPublicacion: string
  autor: { usuarioId: number; nombre_completo: string; email: string }
  categoria: { categoriaId: number; nombre: string }
  reacciones?: { LIKE?: number; CORAZON?: number; APLAUSO?: number; total: number }
  _count?: { comentarios: number }
}

const sidebarItems = [
  { id: 1, title: "Congreso Internacional de Tecnología 2025", image: "/technology-conference.png", link: "https://agale.ec" },
  { id: 2, title: "Foro de Innovación y Emprendimiento", image: "/business-innovation-forum.jpg", link: "https://agale.ec" },
  { id: 3, title: "Cumbre de Sostenibilidad Ambiental", image: "/environmental-sustainability-summit.jpg", link: "https://agale.ec" },
  { id: 4, title: "Encuentro de Educación Digital", image: "/digital-education-conference.jpg", link: "https://agale.ec" },
]

const partnerLogos = [
  { id: 1, name: "ANEUPI", url: "https://aneupi.com/assets/brand-B_L3wkGX.png" },
  { id: 2, name: "Institución Financiera ANEUPI", url: "https://institucionfinancieraaneupi.com/Logos/logoBank.jpg" },
  { id: 3, name: "ANEUPI Gatito", url: "https://aneupi.com/assets/gatitoPlis-CLhW9kLN.png" },
  { id: 4, name: "LECENI", url: "https://constructoraeinmobiliarialeceni.com/Logos/Leceni.png" },
  { id: 5, name: "Universidad LECENI", url: "https://universidadleceni.com/_next/image?url=%2Fimagenes%2Flogos%2Flogo%20universidad%20leceni.png&w=1200&q=75" },
]

export default function ArticulosPage() {
  const [articles, setArticles] = useState<Articulo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        setLoading(true)
        // Sin token → el backend devuelve solo los PUBLICADOS
        const res = await fetch(`${API_URL}/api/articulos?take=20&orderBy=desc`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Error al cargar artículos")
        setArticles(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchArticulos()
  }, [])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-EC", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader activeSection="articulos" />

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Artículos</h1>
            <p className="text-gray-600 text-lg">
              Lee y comparte artículos de opinión, análisis y reportajes en profundidad
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Articles Grid */}
          <div className="flex-1">
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#003952]" />
                <span className="ml-3 text-gray-600">Cargando artículos...</span>
              </div>
            )}

            {error && (
              <div className="py-10 text-center text-red-600 bg-red-50 rounded-lg">
                <p className="font-medium">No se pudieron cargar los artículos</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            {!loading && !error && articles.length === 0 && (
              <div className="py-20 text-center text-gray-500">
                <p className="text-lg font-medium">No hay artículos publicados aún</p>
                <p className="text-sm mt-1">¡Sé el primero en enviar uno!</p>
              </div>
            )}

            {!loading && !error && articles.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <Card
                    key={article.articuloId}
                    className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer bg-white group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.url_imagen || "/placeholder.svg"}
                        alt={article.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-[#003952] text-white px-3 py-1 text-xs font-bold uppercase rounded">
                        {article.categoria?.nombre || "General"}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#003952] transition-colors leading-tight text-balance">
                        {article.titulo}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">{article.descripcion}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {article.autor?.nombre_completo || "Anónimo"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(article.fechaPublicacion)}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {article.tiempo_lectura} min
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {article.vistas}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {article.reacciones?.total ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {article._count?.comentarios ?? 0}
                          </span>
                        </div>
                        <button className="text-[#003952] hover:text-[#002a3a] text-sm font-medium hover:underline">
                          Leer más →
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Te puede interesar</h2>
              <div className="space-y-4">
                {sidebarItems.map((item) => (
                  <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#003952] transition-colors leading-tight text-balance">
                          {item.title}
                        </h3>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-16 mb-8">
          <div className="bg-gradient-to-r from-[#003952] to-[#004a66] rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-[#FDB913] text-center mb-8">Nuestros Aliados</h2>
            <div className="relative overflow-hidden">
              <div className="flex gap-12 animate-scroll hover:[animation-play-state:paused]">
                {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, idx) => (
                  <div
                    key={`${logo.id}-${idx}`}
                    className="flex-shrink-0 w-40 h-24 flex items-center justify-center bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow"
                  >
                    <img src={logo.url || "/placeholder.svg"} alt={logo.name} className="max-w-full max-h-full object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* Botón flotante para enviar artículos (solo visible si está autenticado) */}
      <AddNewsButton section="articulos" categoriaId={1} />

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-208px * 5)); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
