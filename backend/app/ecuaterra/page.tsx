"use client"

import { Calendar, Leaf, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Ecuaterra() {
  const ecoNews = [
    {
      title: "Ecuador lidera iniciativa de reforestación en la Amazonía",
      excerpt:
        "Proyecto ambicioso busca plantar 10 millones de árboles nativos en los próximos cinco años para combatir la deforestación.",
      image: "/generic-movie-poster.png?height=300&width=400&query=amazon+rainforest+reforestation",
      category: "MEDIO AMBIENTE",
      date: "16 Oct 2025",
    },
    {
      title: "Galápagos: Descubren nueva especie de tortuga gigante",
      excerpt:
        "Científicos confirman la existencia de una nueva especie endémica en la isla Santa Cruz, aumentando la biodiversidad del archipiélago.",
      image: "/generic-movie-poster.png?height=300&width=400&query=galapagos+giant+tortoise",
      category: "BIODIVERSIDAD",
      date: "16 Oct 2025",
    },
    {
      title: "Energía renovable: Ecuador alcanza 60% de generación limpia",
      excerpt: "El país avanza hacia la sostenibilidad con inversiones en hidroeléctricas, solar y eólica.",
      image: "/generic-movie-poster.png?height=300&width=400&query=renewable+energy+solar+panels",
      category: "ENERGÍA",
      date: "15 Oct 2025",
    },
    {
      title: "Proyecto de limpieza de océanos retira 50 toneladas de plástico",
      excerpt:
        "Voluntarios y organizaciones ambientales trabajan en las costas ecuatorianas para proteger la vida marina.",
      image: "/generic-movie-poster.png?height=300&width=400&query=ocean+cleanup+plastic+pollution",
      category: "OCÉANOS",
      date: "15 Oct 2025",
    },
    {
      title: "Comunidades indígenas protegen 2 millones de hectáreas de bosque",
      excerpt: "El reconocimiento de territorios ancestrales se convierte en la mejor estrategia de conservación.",
      image: "/generic-movie-poster.png?height=300&width=400&query=indigenous+community+forest+protection",
      category: "CONSERVACIÓN",
      date: "14 Oct 2025",
    },
    {
      title: "Agricultura sostenible: Crece producción orgánica en Ecuador",
      excerpt: "Agricultores ecuatorianos adoptan prácticas ecológicas que benefician al medio ambiente y la salud.",
      image: "/generic-movie-poster.png?height=300&width=400&query=organic+farming+sustainable+agriculture",
      category: "AGRICULTURA",
      date: "14 Oct 2025",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-gray-50 text-gray-900">
      <SiteHeader activeSection="ecuaterra" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-8 h-8 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900">Ecuaterra</h1>
          </div>
          <p className="text-gray-600 text-lg">Medio ambiente, sostenibilidad y conservación en Ecuador y el mundo</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecoNews.map((article, idx) => (
            <article
              key={idx}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 bg-emerald-600 text-white px-3 py-1 text-xs font-bold uppercase rounded">
                  {article.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight text-balance">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{article.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{article.date}</span>
                    </div>
                    <button className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-xs">
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
