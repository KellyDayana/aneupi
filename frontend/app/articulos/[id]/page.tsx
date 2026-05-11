"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ArticuloReaccion } from "@/components/articulo-reaccion"
import { ArticuloComentarios } from "@/components/articulo-comentarios"
import { ChevronLeft, User, Calendar, BookOpen, Eye, Loader2 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export default function ArticuloDetallePage() {
  const params = useParams()
  const router = useRouter()
  const [articulo, setArticulo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params?.id) return
    const fetchArticulo = async () => {
      try {
        const res = await fetch(`${API_URL}/api/articulos/${params.id}`)
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error("Artículo no encontrado")
        setArticulo(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar el artículo")
      } finally {
        setLoading(false)
      }
    }
    fetchArticulo()
  }, [params?.id])

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader activeSection="articulos" />
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#003952]" />
      </div>
      <SiteFooter />
    </div>
  )

  if (error || !articulo) return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader activeSection="articulos" />
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">{error || "Artículo no encontrado"}</p>
        <button onClick={() => router.push("/articulos")} className="text-[#003952] hover:underline">
          ← Volver a artículos
        </button>
      </div>
      <SiteFooter />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader activeSection="articulos" />
      <main className="mx-auto max-w-full px-0 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 pl-3">
            <button
              onClick={() => router.push("/articulos")}
              className="inline-flex items-center gap-2 text-sm text-[#003952] hover:underline mb-6"
            >
              <ChevronLeft className="w-4 h-4" /> Volver a artículos
            </button>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <span className="inline-block bg-[#003952] text-white px-3 py-1 text-xs font-bold uppercase rounded mb-4">
                {articulo.categoria?.nombre}
              </span>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{articulo.titulo}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1"><User className="w-4 h-4" />{articulo.nombre_autor || articulo.autor?.nombre_completo}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(articulo.fechaPublicacion).toLocaleDateString("es-EC", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{articulo.tiempo_lectura} min</span>
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{articulo.vistas} vistas</span>
              </div>

              {articulo.url_imagen && (
                <img src={articulo.url_imagen} alt={articulo.titulo} className="w-full rounded-lg mb-6 max-h-96 object-cover" />
              )}

              {/* Resumen destacado */}
              <div className="border-l-4 border-[#003952] pl-4 py-1 mb-6 bg-gray-50 rounded-r-lg">
                <p className="text-gray-600 italic">{articulo.descripcion}</p>
              </div>

              {/* Contenido completo */}
              {articulo.contenido && articulo.contenido !== articulo.descripcion && (
                <div className="text-gray-700 leading-relaxed mb-6">
                  <p>{articulo.contenido}</p>
                </div>
              )}

              {/* Reacción */}
              <div className="flex items-center gap-3 py-4 border-t border-gray-100">
                <ArticuloReaccion articuloId={articulo.articuloId} initialCount={articulo.reacciones?.total || 0} />
                <span className="text-sm text-gray-500">Me encanta</span>
              </div>

              {/* Comentarios */}
              <ArticuloComentarios articuloId={articulo.articuloId} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
