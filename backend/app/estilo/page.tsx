"use client"

import { Calendar, Heart, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Estilo() {
  const lifestyleNews = [
    {
      title: "Tendencias de moda 2025: El retorno de los estilos vintage",
      excerpt:
        "Diseñadores ecuatorianos presentan colecciones inspiradas en las décadas pasadas con un toque contemporáneo.",
      image: "/generic-movie-poster.png?height=300&width=400&query=fashion+runway+vintage+style",
      category: "MODA",
      date: "16 Oct 2025",
    },
    {
      title: "Gastronomía ecuatoriana conquista premios internacionales",
      excerpt: "Restaurantes de Quito y Guayaquil reciben reconocimientos en la lista de los mejores de Latinoamérica.",
      image: "/generic-movie-poster.png?height=300&width=400&query=ecuadorian+cuisine+gourmet+food",
      category: "GASTRONOMÍA",
      date: "16 Oct 2025",
    },
    {
      title: "Bienestar: Los beneficios del yoga para la salud mental",
      excerpt: "Expertos recomiendan la práctica diaria de yoga para reducir el estrés y mejorar la calidad de vida.",
      image: "/generic-movie-poster.png?height=300&width=400&query=yoga+meditation+wellness",
      category: "BIENESTAR",
      date: "15 Oct 2025",
    },
    {
      title: "Decoración: Ideas para transformar tu hogar con estilo minimalista",
      excerpt: "El minimalismo se consolida como la tendencia favorita para espacios modernos y funcionales.",
      image: "/generic-movie-poster.png?height=300&width=400&query=minimalist+home+interior+design",
      category: "DECORACIÓN",
      date: "15 Oct 2025",
    },
    {
      title: "Belleza natural: Productos ecuatorianos que cuidan tu piel",
      excerpt: "Marcas locales apuestan por ingredientes orgánicos y sostenibles en sus líneas de cosméticos.",
      image: "/generic-movie-poster.png?height=300&width=400&query=natural+beauty+products+skincare",
      category: "BELLEZA",
      date: "14 Oct 2025",
    },
    {
      title: "Viajes: Los destinos más románticos de Ecuador para parejas",
      excerpt: "Desde playas paradisíacas hasta montañas andinas, descubre los lugares perfectos para el amor.",
      image: "/generic-movie-poster.png?height=300&width=400&query=romantic+beach+sunset+couple",
      category: "VIAJES",
      date: "14 Oct 2025",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-gray-50 text-gray-900">
      <SiteHeader activeSection="estilo" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-pink-600" />
            <h1 className="text-4xl font-bold text-gray-900">Estilo</h1>
          </div>
          <p className="text-gray-600 text-lg">Moda, belleza, gastronomía y tendencias de vida</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lifestyleNews.map((article, idx) => (
            <article
              key={idx}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block bg-pink-600 text-white px-3 py-1 text-xs font-bold uppercase rounded-full mb-2">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-pink-600 transition-colors leading-tight text-balance">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{article.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{article.date}</span>
                    </div>
                    <button className="flex items-center gap-1 bg-pink-600 text-white px-3 py-1.5 rounded-lg hover:bg-pink-700 transition-colors font-semibold text-xs">
                      Leer más <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
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
