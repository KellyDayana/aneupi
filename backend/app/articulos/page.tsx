"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card } from "@/components/ui/card"
import { Calendar, User, Eye, Heart, MessageCircle, BookOpen } from "lucide-react"

export default function ArticulosPage() {
  const [articles] = useState([
    {
      id: 1,
      title: "El Futuro de la Inteligencia Artificial en América Latina",
      excerpt:
        "Un análisis profundo sobre cómo la IA está transformando los sectores productivos en la región y las oportunidades que presenta para el desarrollo tecnológico.",
      author: "María González",
      date: "15 Oct 2025",
      readTime: "8 min",
      views: 1234,
      likes: 89,
      comments: 23,
      image: "/artificial-intelligence-technology.png",
      category: "Tecnología",
    },
    {
      id: 2,
      title: "Sostenibilidad: El Desafío Ambiental del Siglo XXI",
      excerpt:
        "Exploramos las iniciativas más innovadoras en sostenibilidad ambiental y cómo las empresas están adaptándose a los nuevos estándares ecológicos.",
      author: "Carlos Mendoza",
      date: "14 Oct 2025",
      readTime: "12 min",
      views: 2156,
      likes: 145,
      comments: 34,
      image: "/sustainability-environment-green.jpg",
      category: "Medio Ambiente",
    },
    {
      id: 3,
      title: "La Revolución de la Educación Digital",
      excerpt:
        "Cómo las plataformas educativas en línea están democratizando el acceso al conocimiento y transformando la manera en que aprendemos.",
      author: "Ana Rodríguez",
      date: "13 Oct 2025",
      readTime: "10 min",
      views: 1876,
      likes: 112,
      comments: 45,
      image: "/online-education-digital-learning.jpg",
      category: "Educación",
    },
    {
      id: 4,
      title: "Gastronomía Ecuatoriana: Tradición e Innovación",
      excerpt:
        "Un recorrido por los sabores tradicionales del Ecuador y cómo los chefs modernos están reinventando la cocina nacional.",
      author: "Luis Pérez",
      date: "12 Oct 2025",
      readTime: "6 min",
      views: 987,
      likes: 76,
      comments: 18,
      image: "/ecuadorian-food-traditional-cuisine.jpg",
      category: "Gastronomía",
    },
    {
      id: 5,
      title: "El Auge del Emprendimiento Social en Ecuador",
      excerpt:
        "Historias inspiradoras de emprendedores que están generando impacto social positivo mientras construyen negocios sostenibles.",
      author: "Patricia Silva",
      date: "11 Oct 2025",
      readTime: "9 min",
      views: 1543,
      likes: 98,
      comments: 29,
      image: "/social-entrepreneurship-business.jpg",
      category: "Negocios",
    },
    {
      id: 6,
      title: "Arte Contemporáneo Latinoamericano: Nuevas Voces",
      excerpt:
        "Descubre a los artistas emergentes que están redefiniendo el panorama del arte contemporáneo en América Latina.",
      author: "Roberto Vargas",
      date: "10 Oct 2025",
      readTime: "7 min",
      views: 765,
      likes: 54,
      comments: 12,
      image: "/contemporary-latin-american-art.jpg",
      category: "Arte y Cultura",
    },
  ])

  const [sidebarItems] = useState([
    {
      id: 1,
      title: "Congreso Internacional de Tecnología 2025",
      image: "/technology-conference.png",
      link: "https://agale.ec",
    },
    {
      id: 2,
      title: "Foro de Innovación y Emprendimiento",
      image: "/business-innovation-forum.jpg",
      link: "https://agale.ec",
    },
    {
      id: 3,
      title: "Cumbre de Sostenibilidad Ambiental",
      image: "/environmental-sustainability-summit.jpg",
      link: "https://agale.ec",
    },
    {
      id: 4,
      title: "Encuentro de Educación Digital",
      image: "/digital-education-conference.jpg",
      link: "https://agale.ec",
    },
  ])

  const partnerLogos = [
    {
      id: 1,
      name: "ANEUPI",
      url: "https://aneupi.com/assets/brand-B_L3wkGX.png",
    },
    {
      id: 2,
      name: "Institución Financiera ANEUPI",
      url: "https://institucionfinancieraaneupi.com/Logos/logoBank.jpg",
    },
    {
      id: 3,
      name: "ANEUPI Gatito",
      url: "https://aneupi.com/assets/gatitoPlis-CLhW9kLN.png",
    },
    {
      id: 4,
      name: "LECENI",
      url: "https://constructoraeinmobiliarialeceni.com/Logos/Leceni.png",
    },
    {
      id: 5,
      name: "Universidad LECENI",
      url: "https://universidadleceni.com/_next/image?url=%2Fimagenes%2Flogos%2Flogo%20universidad%20leceni.png&w=1200&q=75",
    },
  ]

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
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Card
                  key={article.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer bg-white group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-[#003952] text-white px-3 py-1 text-xs font-bold uppercase rounded">
                      {article.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#003952] transition-colors leading-tight text-balance">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {article.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {article.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {article.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {article.comments}
                        </span>
                      </div>
                      <a
                        href="https://agale.ec"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#003952] hover:text-[#002a3a] text-sm font-medium hover:underline"
                      >
                        Leer más →
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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
                {/* First set of logos */}
                {partnerLogos.map((logo) => (
                  <div
                    key={`first-${logo.id}`}
                    className="flex-shrink-0 w-40 h-24 flex items-center justify-center bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={logo.url || "/placeholder.svg"}
                      alt={logo.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ))}
                {/* Duplicate set for infinite scroll effect */}
                {partnerLogos.map((logo) => (
                  <div
                    key={`second-${logo.id}`}
                    className="flex-shrink-0 w-40 h-24 flex items-center justify-center bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={logo.url || "/placeholder.svg"}
                      alt={logo.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ))}
                {/* Third set for seamless loop */}
                {partnerLogos.map((logo) => (
                  <div
                    key={`third-${logo.id}`}
                    className="flex-shrink-0 w-40 h-24 flex items-center justify-center bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={logo.url || "/placeholder.svg"}
                      alt={logo.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-208px * 5));
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
