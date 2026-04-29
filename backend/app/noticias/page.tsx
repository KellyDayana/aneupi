"use client"
import { Calendar, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Noticias() {
  const featuredArticle = {
    title: "Gobierno anuncia nuevas medidas económicas para impulsar el crecimiento",
    excerpt:
      "El Ministerio de Economía presenta un paquete de reformas destinadas a fortalecer la inversión y el empleo en el país.",
    image: "/generic-movie-poster.png?height=500&width=800&query=government+building+ecuador",
    category: "POLÍTICA",
    date: "16 Oct 2025",
  }

  const newsArticles = [
    {
      title: "Educación: Inicia programa de becas para estudiantes de bajos recursos",
      excerpt:
        "Miles de jóvenes ecuatorianos podrán acceder a educación superior gracias al nuevo programa gubernamental.",
      image: "/generic-movie-poster.png?height=300&width=400&query=students+university+graduation",
      category: "EDUCACIÓN",
      date: "16 Oct 2025",
    },
    {
      title: "Sector turístico reporta crecimiento del 15% en el último trimestre",
      excerpt:
        "Las Islas Galápagos y la región amazónica lideran el incremento de visitantes nacionales e internacionales.",
      image: "/generic-movie-poster.png?height=300&width=400&query=galapagos+islands+tourism",
      category: "TURISMO",
      date: "15 Oct 2025",
    },
    {
      title: "Nuevo sistema de transporte público comenzará operaciones en Quito",
      excerpt: "La capital estrena líneas de buses eléctricos como parte del plan de movilidad sostenible.",
      image: "/generic-movie-poster.png?height=300&width=400&query=electric+bus+city",
      category: "TRANSPORTE",
      date: "15 Oct 2025",
    },
    {
      title: "Exportaciones de camarón ecuatoriano alcanzan cifras récord",
      excerpt: "El sector camaronero celebra un año histórico con ventas superiores a los $5 mil millones.",
      image: "/generic-movie-poster.png?height=300&width=400&query=shrimp+farming+ecuador",
      category: "ECONOMÍA",
      date: "14 Oct 2025",
    },
    {
      title: "Campaña de vacunación alcanza el 80% de cobertura nacional",
      excerpt: "El Ministerio de Salud destaca el éxito de la jornada de inmunización en todo el territorio.",
      image: "/generic-movie-poster.png?height=300&width=400&query=vaccination+healthcare",
      category: "SALUD",
      date: "14 Oct 2025",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <SiteHeader activeSection="noticias" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <article className="bg-white rounded-lg overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-[400px] md:h-auto">
                <img
                  src={featuredArticle.image || "/placeholder.svg"}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 text-xs font-bold uppercase">
                  {featuredArticle.category}
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="text-blue-600 font-bold text-sm mb-2">DESTACADO</span>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight text-balance">
                  {featuredArticle.title}
                </h1>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">{featuredArticle.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredArticle.date}</span>
                  </div>
                  <a
                    href="https://agale.ec"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
                  >
                    Leer más <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Más Noticias Nacionales</h2>
          {newsArticles.map((article, idx) => (
            <article
              key={idx}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex flex-col md:flex-row gap-6 p-6">
                <div className="relative w-full md:w-64 h-48 md:h-40 flex-shrink-0">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-block bg-blue-600 text-white px-3 py-1 text-xs font-bold uppercase mb-3 rounded">
                      {article.category}
                    </span>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 hover:text-blue-600 transition-colors text-balance">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{article.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{article.date}</span>
                      </div>
                      <a
                        href="https://agale.ec"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                      >
                        Leer más <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
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
