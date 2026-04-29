"use client"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  image: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const allNews: NewsArticle[] = [
  {
    id: "economia-medidas",
    title: "Gobierno anuncia nuevas medidas económicas para impulsar el crecimiento",
    excerpt:
      "El Ministerio de Economía presenta un paquete de reformas destinadas a fortalecer la inversión y el empleo en el país.",
    image: "/generic-movie-poster.png?height=500&width=800&query=government+building+ecuador",
    category: "POLÍTICA",
    date: "16 Oct 2025",
  },
  {
    id: "educacion-becas",
    title: "Educación: Inicia programa de becas para estudiantes de bajos recursos",
    excerpt:
      "Miles de jóvenes ecuatorianos podrán acceder a educación superior gracias al nuevo programa gubernamental.",
    image: "/generic-movie-poster.png?height=300&width=400&query=students+university+graduation",
    category: "EDUCACIÓN",
    date: "16 Oct 2025",
  },
  {
    id: "turismo-galapagos",
    title: "Sector turístico reporta crecimiento del 15% en el último trimestre",
    excerpt:
      "Las Islas Galápagos y la región amazónica lideran el incremento de visitantes nacionales e internacionales.",
    image: "/generic-movie-poster.png?height=300&width=400&query=galapagos+islands+tourism",
    category: "TURISMO",
    date: "15 Oct 2025",
  },
  {
    id: "transporte-quito",
    title: "Nuevo sistema de transporte público comenzará operaciones en Quito",
    excerpt: "La capital estrena líneas de buses eléctricos como parte del plan de movilidad sostenible.",
    image: "/generic-movie-poster.png?height=300&width=400&query=electric+bus+city",
    category: "TRANSPORTE",
    date: "15 Oct 2025",
  },
  {
    id: "camarones-export",
    title: "Exportaciones de camarón ecuatoriano alcanzan cifras récord",
    excerpt: "El sector camaronero celebra un año histórico con ventas superiores a los $5 mil millones.",
    image: "/generic-movie-poster.png?height=300&width=400&query=shrimp+farming+ecuador",
    category: "ECONOMÍA",
    date: "14 Oct 2025",
  },
  {
    id: "vacunacion-salud",
    title: "Campaña de vacunación alcanza el 80% de cobertura nacional",
    excerpt: "El Ministerio de Salud destaca el éxito de la jornada de inmunización en todo el territorio.",
    image: "/generic-movie-poster.png?height=300&width=400&query=vaccination+healthcare",
    category: "SALUD",
    date: "14 Oct 2025",
  },
]

const texts = {
  es: {
    title: "Buscar contenidos",
    placeholder: "Buscar noticias relevantes...",
    empty: "Escribe para buscar noticias...",
    notFound: (q: string) => `No se encontraron noticias para "${q}"`,
    category: "Categoría",
  },
  en: {
    title: "Search content",
    placeholder: "Search relevant news...",
    empty: "Type to search news...",
    notFound: (q: string) => `No news found for "${q}"`,
    category: "Category",
  },
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { language } = useLanguage()
  const t = texts[language]

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return allNews.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const handleArticleClick = (articleId: string) => {
    router.push(`/noticias/${articleId}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-2xl max-h-[95vh] overflow-hidden rounded-xl bg-white shadow-2xl border-2 border-yellow-400 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-xl bg-[#003952] p-3 border-b border-yellow-400/30">
          <h2 className="text-lg md:text-xl font-bold text-white">
            {t.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-white/5 transition-colors text-white"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-5 flex-1 overflow-y-auto">
          {/* Search bar */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg bg-gray-50 px-3 py-2 mb-4">
            <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <Input
              placeholder={t.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 text-gray-900 placeholder:text-gray-500 focus:ring-0 text-base md:text-lg"
              autoFocus
            />
          </div>

          {/* Results */}
          {searchQuery.trim() === "" ? (
            <div className="text-center py-6 md:py-8 text-gray-500">
              <p className="text-sm md:text-base">{t.empty}</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-6 md:py-8 text-gray-500">
              <p className="text-sm md:text-base">{t.notFound(searchQuery)}</p>
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {searchResults.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleArticleClick(article.id)}
                  className="p-3 md:p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-gray-200 overflow-hidden"
                >
                  <div className="flex gap-2 md:gap-4">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-16 md:w-20 h-16 md:h-20 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <span className="inline-block bg-blue-600 text-white px-2 py-0.5 text-xs font-bold uppercase rounded">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500 flex-shrink-0">{article.date}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-xs md:text-sm line-clamp-2 mb-1">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-xs line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
