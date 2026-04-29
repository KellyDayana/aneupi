"use client"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Mundo() {
  const worldNews = [
    {
      title: "Cumbre del G20 aborda crisis climática y economía global",
      excerpt:
        "Líderes mundiales se reúnen para discutir soluciones a los desafíos más urgentes que enfrenta el planeta.",
      image: "/generic-movie-poster.png?height=300&width=400&query=g20+summit+world+leaders",
      category: "INTERNACIONAL",
      date: "16 Oct 2025",
      region: "GLOBAL",
    },
    {
      title: "Elecciones en Estados Unidos: Análisis de las últimas encuestas",
      excerpt: "Los candidatos intensifican sus campañas a pocas semanas de los comicios presidenciales.",
      image: "/generic-movie-poster.png?height=300&width=400&query=usa+election+campaign",
      category: "EE.UU.",
      date: "16 Oct 2025",
      region: "AMÉRICA",
    },
    {
      title: "Unión Europea aprueba nuevas regulaciones sobre inteligencia artificial",
      excerpt: "El parlamento europeo establece marcos legales para el desarrollo responsable de la IA.",
      image: "/generic-movie-poster.png?height=300&width=400&query=european+parliament+technology",
      category: "EUROPA",
      date: "15 Oct 2025",
      region: "EUROPA",
    },
    {
      title: "Tensiones en Medio Oriente: Llamado internacional a la paz",
      excerpt: "La ONU convoca a reunión de emergencia para abordar el conflicto en la región.",
      image: "/generic-movie-poster.png?height=300&width=400&query=united+nations+meeting",
      category: "MEDIO ORIENTE",
      date: "15 Oct 2025",
      region: "MEDIO ORIENTE",
    },
    {
      title: "China lanza nueva misión espacial hacia la Luna",
      excerpt: "La agencia espacial china anuncia ambiciosos planes de exploración lunar para la próxima década.",
      image: "/generic-movie-poster.png?height=300&width=400&query=space+rocket+launch+moon",
      category: "ASIA",
      date: "14 Oct 2025",
      region: "ASIA",
    },
    {
      title: "Brasil y Argentina fortalecen alianza comercial en Sudamérica",
      excerpt: "Los presidentes de ambos países firman acuerdos para impulsar el comercio regional.",
      image: "/generic-movie-poster.png?height=300&width=400&query=south+america+flags+handshake",
      category: "LATINOAMÉRICA",
      date: "14 Oct 2025",
      region: "AMÉRICA",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <SiteHeader activeSection="mundo" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mundo</h1>
          <p className="text-gray-600 text-lg">Noticias internacionales y acontecimientos globales</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {worldNews.map((article, idx) => (
            <article
              key={idx}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 text-xs font-bold uppercase rounded">
                  {article.category}
                </div>
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 text-xs rounded flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {article.region}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-600 transition-colors leading-tight text-balance">
                  {article.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">{article.excerpt}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{article.date}</span>
                    </div>
                    <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm">
                      Leer más <ArrowRight className="w-4 h-4" />
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
